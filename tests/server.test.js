// Run: node tests/server.test.js   (no dependencies)
// Runs server/Code.gs against an in-memory fake of Google Sheets/Apps Script services.
// Covers: token check, class-list lookup, login, cloud save (stale protection), records, teacher-only stats.
const fs = require("fs"), vm = require("vm"), assert = require("assert"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "server", "Code.gs"), "utf8");

/* ---- fakes ---- */
function makeSheet(rows) {
  const sh = {
    rows,
    getLastRow: () => sh.rows.length,
    getDataRange: () => ({ getValues: () => sh.rows.map(r => r.slice()) }),
    getRange: (r, c, nr = 1, nc = 1) => ({
      getValues: () => { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] === undefined ? "" : row[c - 1 + j]); out.push(o); } return out; },
      getValue: () => (sh.rows[r - 1] || [])[c - 1] === undefined ? "" : sh.rows[r - 1][c - 1],
      setValues: v => { v.forEach((vr, i) => { sh.rows[r - 1 + i] = sh.rows[r - 1 + i] || []; vr.forEach((x, j) => { sh.rows[r - 1 + i][c - 1 + j] = x; }); }); },
      setNumberFormat: () => ({}), setFontWeight: () => ({ setBackground: () => ({}) })
    }),
    appendRow: r => sh.rows.push(r), setFrozenRows: () => {}
  };
  return sh;
}
const book = {};
const store = {}, cacheStore = {};
const ctx = {
  console, Date, JSON, Math, Number, String, Object, Array, isFinite, encodeURIComponent, parseInt,
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => ({ SHEET_ID: "sheet", CLIENT_ID: "client", TEACHER_EMAILS: "" })[k] || null }) },
  CacheService: { getScriptCache: () => ({ get: k => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; } }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: { createTextOutput: s => ({ text: s, setMimeType() { return this; } }), MimeType: { JSON: "json" } },
  Session: { getScriptTimeZone: () => "UTC" },
  Utilities: {
    base64EncodeWebSafe: b => Buffer.from(b).toString("base64url"), computeDigest: (a, t) => Buffer.from(t), DigestAlgorithm: { SHA_256: 1 },
    formatDate: (d, tz, f) => d.toISOString().slice(0, 10)
  },
  SpreadsheetApp: { openById: () => ({ getSheetByName: n => book[n] || null, insertSheet: n => (book[n] = makeSheet([])) }) },
  UrlFetchApp: { fetch: url => { const t = decodeURIComponent(url.split("id_token=")[1]); const p = tokens[t]; return { getResponseCode: () => p ? 200 : 400, getContentText: () => JSON.stringify(p || {}) }; } }
};
const exp = String(Math.floor(Date.now() / 1000) + 3000);
const tokens = {
  teacher: { aud: "client", email: "Teach@School.edu.hk", email_verified: "true", exp },
  s1: { aud: "client", email: "s1@school.edu.hk", email_verified: "true", exp },
  s2: { aud: "client", email: "s2@school.edu.hk", email_verified: "true", exp },
  stranger: { aud: "client", email: "x@gmail.com", email_verified: "true", exp },
  wrongclient: { aud: "other", email: "s1@school.edu.hk", email_verified: "true", exp }
};
vm.createContext(ctx); vm.runInContext(src, ctx);

book["使用者 Users"] = makeSheet([
  ["Email", "Role", "Chinese Name", "English Name", "Class", "Class No."],
  ["teach@school.edu.hk", "教職員", "陳老師", "Ms Chan", "", ""],
  ["s1@school.edu.hk", "學生", "王小明", "Ming", "3A", 5],
  ["s2@school.edu.hk", "學生", "李小花", "Fa", "3B", 12],
  ["s3@school.edu.hk", "學生", "張大文", "Man", "3A", 6]
]);
const call = (token, action, extra) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(Object.assign({ action, token }, extra || {})) } }).text);
let n = 0; const test = (name, fn) => { fn(); n++; console.log("ok -", name); };

test("health check answers", () => assert.strictEqual(JSON.parse(ctx.doGet().text).ok, true));
test("a stranger's Google account is refused", () => assert.strictEqual(call("stranger", "login").error, "not_listed"));
test("a token for a different client ID is refused", () => assert.strictEqual(call("wrongclient", "login").error, "bad_client"));
test("unknown token is refused", () => assert.strictEqual(call("nope", "login").ok, false));
test("a listed student can log in", () => { const r = call("s1", "login"); assert(r.ok); assert.strictEqual(r.user.cls, "3A"); assert.strictEqual(r.user.teacher, false); });
test("a staff row is a teacher", () => assert.strictEqual(call("teacher", "login").user.teacher, true));

const state = (day, days, correct) => JSON.stringify({ last_login_date: day, stats: { days, correct } });
test("progress saves, and an older copy never wins", () => {
  assert(call("s1", "save", { state: state("2026-10-05", 5, 50), summary: { streak: 4, best: 6, stars: 7, rooms: 3, coins: 40, mistakes: 9, trophies: 2, days: 5, lastDay: "2026-10-05", score: 120 } }).ok);
  const stale = call("s1", "save", { state: state("2026-10-01", 2, 10), summary: {} });
  assert.strictEqual(stale.error, "stale"); assert(stale.progress);
  assert(call("s2", "save", { state: state("2026-10-07", 3, 20), summary: { streak: 1, best: 1, stars: 1, rooms: 1, coins: 5, mistakes: 2, trophies: 0, days: 3, lastDay: "2026-10-07", score: 30 } }).ok);
});
test("records are stored; formulas cannot be injected", () => {
  const recs = [
    { mode: "escape", room: "room1", ans: 15, cor: 12, stars: 3, secs: 400, status: "done", session: "a", lang: "English", end: new Date().toISOString() },
    { mode: "escape", room: "room2", ans: 15, cor: 4, stars: 0, secs: 900, status: "gameover", session: "a", lang: "English", end: new Date().toISOString() },
    { mode: "study", room: "room2", ans: 15, cor: 6, status: "done", session: "b", lang: "中文", end: new Date().toISOString() },
    { mode: "rush", ans: 20, cor: 15, score: 150, status: "done", session: "b", lang: "English", end: new Date().toISOString() }
  ];
  assert.strictEqual(call("s1", "record", { records: recs }).saved, 4);
  call("s2", "record", { records: [{ mode: "escape", room: "room1", ans: 15, cor: 14, stars: 3, status: "done", session: "c", end: new Date().toISOString() }, { mode: "=HYPERLINK(1)", room: "=cmd", ans: 3, cor: 3, status: "done" }] });
  const rows = book["物理記錄 Physics Records"].rows;
  assert(rows.length === 7); assert(!/^[=+\-@]/.test(String(rows[6][8])) && !/^[=+\-@]/.test(String(rows[6][9])));
});
test("a student cannot read class statistics", () => assert.strictEqual(call("s1", "stats", { days: 30 }).error, "not_teacher"));
let stats;
test("a teacher gets class statistics", () => {
  stats = call("teacher", "stats", { days: 30, fresh: 1 });
  assert(stats.ok); assert.strictEqual(stats.listed, 3); assert.strictEqual(stats.students.length, 3);
  const ming = stats.students.find(x => x.en === "Ming");
  assert.strictEqual(ming.ans, 65); assert.strictEqual(ming.cor, 37); assert.strictEqual(ming.gameovers, 1); assert.strictEqual(ming.escapes, 1); assert.strictEqual(ming.studies, 1);
  assert.strictEqual(ming.streak, 4); assert.strictEqual(ming.roomsDone, 3); assert.strictEqual(ming.mistakes, 9);
  assert.deepStrictEqual(ming.weak && ming.weak.room, "room2");     // 10/30 correct in room2
  const man = stats.students.find(x => x.en === "Man"); assert.strictEqual(man.signedIn, false); assert.strictEqual(man.ans, 0);
  assert(stats.students.every(x => !("email" in x)), "no emails leave the server");
  assert.strictEqual(stats.topics.room2.gameovers, 1); assert.strictEqual(stats.topics.room1.students, 2);
});
test("the period filter drops old records", () => {
  book["物理記錄 Physics Records"].rows.push([new Date(Date.now() - 60 * 86400000), "old", "s1@school.edu.hk", "學生", "3A", 5, "王小明", "Ming", "溫習 Study", "room3", 15, 15, 100, 0, 0, 60, "完成 Done", "English", new Date()]);
  Object.keys(cacheStore).forEach(k => delete cacheStore[k]);
  assert.strictEqual(call("teacher", "stats", { days: 30, fresh: 1 }).topics.room3, undefined);
  assert.strictEqual(call("teacher", "stats", { days: 0, fresh: 1 }).topics.room3.ans, 15);
});
if (process.env.STATS_OUT) fs.writeFileSync(process.env.STATS_OUT, JSON.stringify(stats));
console.log(`\n${n} server tests passed`);
