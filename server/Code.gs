/**
 * S3 Science Study Pals – class server (Google Apps Script web app)
 * ----------------------------------------------------------------
 * - Checks each Google sign-in (ID token) and looks the email up in the Users sheet.
 * - Saves each student's game progress and a record of every room / study / rush / practice round.
 *
 * Script Properties (Project Settings → Script properties):
 *   SHEET_ID        ID of the Google Sheet that holds the Users tab   (required)
 *   CLIENT_ID       Google OAuth Web client ID used by the game       (required)
 *   TEACHER_EMAILS  optional, comma-separated. If set, ONLY these emails count as teachers.
 *                   If empty, every "教職員" user does.
 *   USERS_SHEET     optional, name of the users tab (default: 使用者 Users)
 *
 * Users tab columns: Email · Role · Chinese Name · English Name · Class · Class No.
 */
var PROPS = PropertiesService.getScriptProperties();
var USERS_DEFAULT = '使用者 Users';
var REC = '物理記錄 Physics Records';
var PROG = '物理進度 Physics Progress';
var REC_HEAD = ['記錄時間 Timestamp', '練習編號 Session ID', '電郵 Email', '身分 Role', '班別 Class', '班號 Class No.',
  '中文姓名 Chinese Name', '英文姓名 English Name', '模式 Mode', '房間 Room', '已答題數 Answered', '答對題數 Correct',
  '準確率 Accuracy %', '星星 Stars', '分數 Score', '用時(秒) Seconds', '狀態 Status', '語言 Language', '結束時間 End'];
var PROG_HEAD = ['電郵 Email', '更新時間 Updated', '連續日數 Streak', '最佳連續 Best streak', '星星 Stars', '逃出房間 Rooms escaped',
  '栗子 Chestnuts', '待清除錯題 Mistakes', '獎盃 Trophies', '遊玩日數 Days played', '最後登入日 Last day', '努力分 Dedication',
  '進度資料 Data (do not edit)'];
var DATA_COL = 13; // column M holds the saved game data
var MODES = { escape: '密室逃脫 Escape room', study: '溫習 Study', rush: '光速挑戰 Light Rush', practice: '錯題練習 Practice' };
var STATUS = { done: '完成 Done', gameover: '遊戲結束 Game over' };

function doGet() {
  return out({ ok: true, app: "S3 Science Study Pals", time: new Date().toISOString() });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var v = verifyToken(body.token);
    if (!v.ok) return out(v);
    var user = findUser(v.email);
    if (!user) return out({ ok: false, error: 'not_listed' });
    switch (body.action) {
      case 'login': return out({ ok: true, user: user, progress: getProgress(user.email) });
      case 'save': return out(saveResp(user, body));
      case 'record': return out({ ok: true, saved: appendRecords(user, body.records || []) });
      case 'stats': return out(statsReport(user, body));
      default: return out({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    return out({ ok: false, error: 'server: ' + err });
  }
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function book() { return SpreadsheetApp.openById(PROPS.getProperty('SHEET_ID')); }
function sheet(name, head) {
  var ss = book(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(head);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#FFF1C5');
  }
  return sh;
}
// text cells can't start with = + - @ (stops spreadsheet formula injection)
function clean(s, n) { return String(s == null ? '' : s).slice(0, n || 200).replace(/^[=+\-@\t\r]+/, ''); }
function num(x) { var n = Number(x); return isFinite(n) ? Math.max(0, Math.min(n, 1000000)) : 0; }
function when(s) { var d = new Date(s); return isNaN(d) ? '' : d; }

/** Verifies a Google ID token with Google and caches the result until it expires. */
function verifyToken(token) {
  if (!token) return { ok: false, error: 'no_token' };
  var cache = CacheService.getScriptCache();
  var key = 'tk_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token)).slice(0, 43);
  var hit = cache.get(key);
  if (hit) return JSON.parse(hit);
  var r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return { ok: false, error: 'expired' };
  var p = JSON.parse(r.getContentText());
  if (p.aud !== PROPS.getProperty('CLIENT_ID')) return { ok: false, error: 'bad_client' };
  if (String(p.email_verified) !== 'true') return { ok: false, error: 'unverified' };
  var left = Number(p.exp) - Math.floor(Date.now() / 1000);
  if (left <= 0) return { ok: false, error: 'expired' };
  var res = { ok: true, email: String(p.email).trim().toLowerCase() };
  cache.put(key, JSON.stringify(res), Math.max(1, Math.min(left, 3000)));
  return res;
}

/* ---------------- Teacher statistics (teachers only) ---------------- */
var STAT_ROWS = 6000; // newest record rows that are read
function ymd(d) { return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function statsReport(user, body) {
  if (!user.teacher) return { ok: false, error: 'not_teacher' };
  var days = Math.max(0, Math.min(Number(body.days) || 0, 365));
  var cache = CacheService.getScriptCache(), ck = 'stats_' + days, hit = cache.get(ck);
  if (hit && !body.fresh) return JSON.parse(hit);
  var ss = book();
  // 1) the class list: students only (staff rows are skipped)
  var ush = ss.getSheetByName(PROPS.getProperty('USERS_SHEET') || USERS_DEFAULT), uv = ush ? ush.getDataRange().getValues() : [], list = {}, order = [];
  for (var i = 1; i < uv.length; i++) {
    var em = String(uv[i][0]).trim().toLowerCase();
    if (!em || isStaffRole(String(uv[i][1] || ''))) continue;
    list[em] = { zh: String(uv[i][2] || ''), en: String(uv[i][3] || ''), cls: String(uv[i][4] || ''), no: uv[i][5] === '' || uv[i][5] == null ? '' : String(uv[i][5]) };
    order.push(em);
  }
  // 2) saved progress summary (columns A-L)
  var psh = ss.getSheetByName(PROG), pmap = {};
  if (psh && psh.getLastRow() > 1) {
    var pv = psh.getRange(2, 1, psh.getLastRow() - 1, DATA_COL - 1).getValues();
    pv.forEach(function (r) { pmap[String(r[0]).toLowerCase()] = { streak: num(r[2]), best: num(r[3]), stars: num(r[4]), rooms: num(r[5]), coins: num(r[6]), mistakes: num(r[7]), trophies: num(r[8]), days: num(r[9]), lastDay: String(r[10] || ''), score: num(r[11]) }; });
  }
  // 3) records in the chosen period
  var rsh = ss.getSheetByName(REC), agg = {}, topics = {}, daily = {}, cutoff = days ? new Date(Date.now() - days * 86400000) : null;
  if (rsh && rsh.getLastRow() > 1) {
    var last = rsh.getLastRow(), n = Math.min(STAT_ROWS, last - 1);
    var rv = rsh.getRange(last - n + 1, 1, n, REC_HEAD.length).getValues();
    rv.forEach(function (r) {
      var ts = r[0] instanceof Date ? r[0] : new Date(r[0]);
      if (cutoff && ts < cutoff) return;
      var em = String(r[2]).toLowerCase(); if (!list[em]) return;
      var mode = String(r[8]), room = String(r[9] || ''), ans = num(r[10]), cor = num(r[11]);
      var a = agg[em] || (agg[em] = { ans: 0, cor: 0, sessions: 0, escapes: 0, gameovers: 0, studies: 0, last: 0, rooms: {} });
      a.ans += ans; a.cor += cor; a.sessions++; if (ts.getTime() > a.last) a.last = ts.getTime();
      if (/Escape/i.test(mode)) { if (/Game over/i.test(String(r[16]))) a.gameovers++; else a.escapes++; }
      if (/Study/i.test(mode)) a.studies++;
      if (room) {
        var x = a.rooms[room] || (a.rooms[room] = { ans: 0, cor: 0 }); x.ans += ans; x.cor += cor;
        var t = topics[room] || (topics[room] = { sessions: 0, ans: 0, cor: 0, gameovers: 0, who: {} });
        t.sessions++; t.ans += ans; t.cor += cor; t.who[em] = 1; if (/Game over/i.test(String(r[16]))) t.gameovers++;
      }
      var d = ymd(ts); daily[d] = (daily[d] || 0) + ans;
    });
  }
  var students = order.map(function (em) {
    var p = pmap[em] || {}, a = agg[em] || { ans: 0, cor: 0, sessions: 0, escapes: 0, gameovers: 0, studies: 0, last: 0, rooms: {} }, weak = null;
    Object.keys(a.rooms).forEach(function (k) { var x = a.rooms[k]; if (x.ans >= 10) { var acc = Math.round(x.cor / x.ans * 100); if (!weak || acc < weak.acc) weak = { room: k, acc: acc, ans: x.ans }; } });
    return { zh: list[em].zh, en: list[em].en, cls: list[em].cls, no: list[em].no, signedIn: !!pmap[em],
      streak: p.streak || 0, best: p.best || 0, stars: p.stars || 0, roomsDone: p.rooms || 0, coins: p.coins || 0, mistakes: p.mistakes || 0, trophies: p.trophies || 0,
      daysPlayed: p.days || 0, lastDay: p.lastDay || '', score: p.score || 0,
      ans: a.ans, cor: a.cor, sessions: a.sessions, escapes: a.escapes, gameovers: a.gameovers, studies: a.studies, lastActive: a.last ? ymd(new Date(a.last)) : '', weak: weak };
  });
  var tout = {}; Object.keys(topics).forEach(function (k) { var t = topics[k]; tout[k] = { sessions: t.sessions, ans: t.ans, cor: t.cor, students: Object.keys(t.who).length, gameovers: t.gameovers }; });
  var res = { ok: true, generated: new Date().toISOString(), days: days, listed: order.length, students: students, topics: tout, daily: daily };
  try { var js = JSON.stringify(res); if (js.length < 95000) cache.put(ck, js, 90); } catch (e) {}
  return res;
}

function isStaffRole(role) { return /教職員|staff|teacher|老師/i.test(role); }
function findUser(email) {
  var cache = CacheService.getScriptCache(), c = cache.get('u_' + email);
  if (c) return JSON.parse(c);
  var sh = book().getSheetByName(PROPS.getProperty('USERS_SHEET') || USERS_DEFAULT);
  if (!sh) throw 'Users sheet not found';
  var v = sh.getDataRange().getValues();
  var teachers = (PROPS.getProperty('TEACHER_EMAILS') || '').toLowerCase().split(/[,\s]+/).filter(String);
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][0]).trim().toLowerCase() !== email) continue;
    var role = String(v[i][1] || '');
    var u = {
      email: email, role: role, zh: String(v[i][2] || ''), en: String(v[i][3] || ''),
      cls: String(v[i][4] || ''), no: v[i][5] === '' || v[i][5] == null ? '' : String(v[i][5]),
      teacher: teachers.length ? teachers.indexOf(email) >= 0 : isStaffRole(role)
    };
    cache.put('u_' + email, JSON.stringify(u), 300);
    return u;
  }
  return null;
}

function appendRecords(u, recs) {
  if (!recs.length) return 0;
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = sheet(REC, REC_HEAD);
    var rows = recs.slice(0, 300).map(function (r) {
      var ans = num(r.ans), cor = Math.min(num(r.cor), ans || num(r.cor));
      return [new Date(), clean(r.session, 40), u.email, u.role, u.cls, u.no, u.zh, u.en,
        MODES[r.mode] || clean(r.mode, 30), clean(r.room, 20), ans, cor, ans ? Math.round(cor / ans * 100) : '',
        num(r.stars), num(r.score), num(r.secs), STATUS[r.status] || clean(r.status, 20), clean(r.lang, 12), when(r.end)];
    });
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, REC_HEAD.length).setValues(rows);
    return rows.length;
  } finally { lock.releaseLock(); }
}

function findRow(sh, email) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var col = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]).toLowerCase() === email) return i + 2;
  return -1;
}
function getProgress(email) {
  var sh = book().getSheetByName(PROG);
  if (!sh) return null;
  var r = findRow(sh, email);
  return r < 0 ? null : String(sh.getRange(r, DATA_COL).getValue() || '') || null;
}
/* "Newer" progress = later last day played, then more days played, then more correct answers.
   An older copy (e.g. a tab left open on another device) never overwrites newer progress. */
function rank(s) {
  try { var o = JSON.parse(s), st = o.stats || {}; return [String(o.last_login_date || ''), Number(st.days) || 0, Number(st.correct) || 0]; }
  catch (e) { return null; }
}
function older(a, b) { for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) return a[i] < b[i]; } return false; }
function saveResp(user, body) {
  var state = String(body.state || '');
  if (!state || state.length > 49000) return { ok: false, error: 'too_large' };
  var cur = getProgress(user.email);
  if (cur && !body.force) {
    var a = rank(cur), b = rank(state);
    if (a && b && older(b, a)) return { ok: false, error: 'stale', progress: cur };
  }
  var s = body.summary || {};
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = sheet(PROG, PROG_HEAD);
    var row = [user.email, new Date(), num(s.streak), num(s.best), num(s.stars), num(s.rooms), num(s.coins), num(s.mistakes),
      num(s.trophies), num(s.days), clean(s.lastDay, 12), num(s.score), state];
    var r = findRow(sh, user.email);
    if (r < 0) r = sh.getLastRow() + 1;
    sh.getRange(r, 11).setNumberFormat('@'); // keep the date as text
    sh.getRange(r, 1, 1, row.length).setValues([row]);
  } finally { lock.releaseLock(); }
  return { ok: true };
}
