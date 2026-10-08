// Run: node tests/flow.test.js   (needs Playwright + Chromium)
// Plays through the main modes and checks that nothing throws and the state changes as expected.
const { chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright");
const assert = require("assert"), path = require("path");
const url = "file://" + (process.env.INDEX_HTML || path.join(__dirname, "..", "index.html"));
let n = 0; const ok = m => { n++; console.log("ok -", m); };
(async () => {
  const browser = await chromium.launch(), page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; page.on("pageerror", e => errs.push(e.message));
  await page.goto(url); await page.fill("#nm", "Tester"); await page.click("#go"); await page.waitForSelector("#mcStudy"); ok("welcome → mode chooser");
  await page.click("#mcStudy"); await page.waitForSelector(".bnav");
  // ---- study: notes then answer every question correctly
  await page.evaluate(() => { closeModal(); startStudy(ROOMS[0].id); }); await page.click("#stGo");
  const total = await page.evaluate(() => ST.qids.length);
  for (let k = 0; k < total; k++) {
    await page.evaluate(() => { const p = ST.room.pool.find(x => x.id === ST.qids[ST.i]); window.__p = p; });
    const q = await page.evaluate(() => ({ t: __p.type, a: __p.answer, d: __p.dials }));
    if (q.t === "mc") await page.click(`#stBody .choice[data-i="${q.a}"]`);
    else { for (let d = 0; d < q.d.length; d++) for (let j = 0; j < q.a[d]; j++) await page.click(`#stBody .arr[data-d="${d}"][data-dir="1"]`); await page.click("#stBody #dok"); }
    await page.click("#stNext");
  }
  assert.strictEqual(await page.evaluate(() => S.study[ROOMS[0].id]), total); ok(`study: ${total}/${total} correct, result saved`);
  // ---- escape: enter, lose by hearts, retry
  await page.evaluate(() => { document.querySelectorAll("#ov").forEach(e => e.remove()); renderMap("rooms"); enterRoom(ROOMS[0].id); });
  await page.waitForSelector(".hs"); ok("escape room opens");
  await page.evaluate(() => gameOver("hearts")); await page.waitForSelector("#goRetry");
  assert.strictEqual(await page.evaluate(() => S.stats.gameOvers), 1); ok("game over screen + counter");
  await page.click("#goRetry"); await page.waitForSelector(".hs"); await page.evaluate(() => { stopTimer(); renderMap("home"); }); ok("retry after game over");
  // ---- mistakes notebook
  await page.evaluate(() => { addMistake("room1:b3"); addMistake("room1:b6"); renderMap("mist"); });
  assert.strictEqual(await page.evaluate(() => document.querySelectorAll(".mcard").length), 2); ok("notebook lists mistakes");
  await page.click("[data-retry]"); const pid = await page.evaluate(() => mistakeItems()[0].pid);
  const q = await page.evaluate(id => { const p = pidQ(id); return { t: p.type, a: p.answer, d: p.dials }; }, pid);
  if (q.t === "mc") await page.click(`#rmBody .choice[data-i="${q.a}"]`); else { for (let d = 0; d < q.d.length; d++) for (let j = 0; j < q.a[d]; j++) await page.click(`#rmBody .arr[data-d="${d}"][data-dir="1"]`); await page.click("#rmBody #dok"); }
  await page.click("#rmDone"); assert.strictEqual(await page.evaluate(() => S.mistakes.length), 1); ok("retrying a mistake correctly clears it");
  // ---- practice and rush start and stop
  await page.evaluate(() => { renderMap("home"); practiceIntro(); }); await page.click("#prGo"); await page.waitForSelector("#prQuit"); await page.click("#prQuit"); ok("practice starts and stops");
  await page.evaluate(() => { rushIntro(); }); await page.click("#rushGo"); await page.waitForSelector("#rQuit"); await page.click("#rQuit"); await page.waitForSelector("#rMap"); await page.click("#rMap"); ok("rush starts and ends");
  // ---- shop: buy, wear, music
  await page.evaluate(() => { S.coins = 5000; DRESS_SLOT = "hair"; renderMap("dress"); });
  await page.click("[data-buy]"); assert(await page.evaluate(() => S.owned.length) > 0); ok("buying a wardrobe item");
  await page.evaluate(() => { DRESS_SLOT = "music"; renderMap("dress"); }); await page.click("[data-tbuy]"); assert(await page.evaluate(() => S.tracks.length) > 1); ok("buying a music track");
  // ---- language switch while on a tab
  await page.evaluate(() => { setLang("zh"); renderMap("rooms"); setLang("en"); }); ok("language switch");
  assert.deepStrictEqual(errs, []); ok("no script errors");
  await browser.close(); console.log(`\n${n} flow checks passed`);
})().catch(e => { console.error("FAIL:", e.message); process.exit(1); });
