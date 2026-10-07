/**
 * Puff's Physics Escape – class server (Google Apps Script web app)
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
  return out({ ok: true, app: "Puff's Physics Escape", time: new Date().toISOString() });
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
