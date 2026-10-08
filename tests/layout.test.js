// Run: node tests/layout.test.js   (needs Playwright: npm i -g playwright, with Chromium installed)
// Sweeps every hub tab, every dress-up category and both languages at phone, iPad and desktop widths.
// Fails on: script errors, sideways page scroll, content sticking out of its card, "undefined" text,
// trophy cards with no room for their picture.
const { chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright");
const path = require("path"), url = "file://" + (process.env.INDEX_HTML || path.join(__dirname, "..", "index.html"));
const WIDTHS = [[360, 740], [390, 844], [820, 1180], [1280, 800], [1600, 900]];
const problems = [];
const bad = (w, lang, where, what) => problems.push(`${w}px ${lang} · ${where}: ${what}`);

(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of WIDTHS) for (const lang of ["en", "zh"]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    page.on("pageerror", e => bad(w, lang, "script", e.message));
    await page.goto(url); await page.fill("#nm", "Tester"); await page.click("#go"); await page.waitForTimeout(250);
    await page.evaluate(l => { closeModal(); setLang(l); closeModal(); streakPop = null; S.play_mode = "escape"; S.coins = 3000; S.owned = WARDROBE.map(x => x.id); S.stats.days = 15; S.stats.correct = 60; save(); }, lang);
    const check = async where => {
      await page.waitForTimeout(120);
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth, out = [];
        if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways (${document.documentElement.scrollWidth} > ${vw})`);
        const scrolls = e => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden") return true; } return false; };
        document.querySelectorAll("#app *").forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > vw + 1 && !scrolls(e) && getComputedStyle(e).position !== "fixed") out.push(`sticks out: ${(e.className && e.className.baseVal === undefined ? e.className : e.tagName).toString().slice(0, 30)}`); });
        const t = document.getElementById("app").innerText; if (/undefined|NaN|\[object/.test(t)) out.push("shows undefined/NaN text");
        document.querySelectorAll(".tcard .tw").forEach(e => { if (e.getBoundingClientRect().height < 70) out.push("trophy card picture too small"); });
        document.querySelectorAll(".nest").forEach(n => { const nr = n.getBoundingClientRect(); n.querySelectorAll("*").forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > nr.right + 1 && getComputedStyle(e).position !== "absolute") out.push("dress/home preview card clips: " + e.className); }); });
        return [...new Set(out)].slice(0, 4);
      });
      r.forEach(x => bad(w, lang, where, x));
    };
    for (const tab of ["home", "rooms", "lab", "mist", "dress", "collect"]) { await page.evaluate(t => renderMap(t), tab); await check(tab); }
    for (const mode of ["study", "escape"]) for (const subj of ["bio", "chem", "phy"]) { await page.evaluate(([m, s]) => { S.play_mode = m; S.subject = s; try { setSubj && setSubj(s); } catch (e) {} renderMap("rooms"); }, [mode, subj]); await check(`rooms ${mode}/${subj}`); }
    for (const slot of await page.evaluate(() => Object.keys(SLOT_NAMES).concat(["power", "music"]))) { await page.evaluate(s => { DRESS_SLOT = s; renderMap("dress"); }, slot); await check("dress/" + slot); }
    for (const t of ["lens", "mirror", "tir"]) { await page.evaluate(x => { LAB.tab = x; renderMap("lab"); }, t); await check("lab/" + t); }
    await page.evaluate(() => { startStudy(ROOMS[0].id); }); await check("study notes");
    await page.evaluate(() => { renderMap("home"); enterRoom(ROOMS[0].id); }); await page.waitForTimeout(400); await check("escape room");
    // names must exist in this language for every wardrobe item
    const names = await page.evaluate(() => WARDROBE.filter(x => !x.name || /undefined/.test(x.name)).map(x => x.id));
    if (names.length) bad(w, lang, "wardrobe", "missing name for " + names.join(","));
    await page.context().close();
  }
  await browser.close();
  if (problems.length) { console.log(problems.join("\n")); console.log(`\n${problems.length} layout problem(s)`); process.exit(1); }
  console.log(`layout ok: ${WIDTHS.length} widths × 2 languages × all tabs`);
})();
