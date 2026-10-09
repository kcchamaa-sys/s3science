// Run: node tests/lab_ui.test.js   (needs Playwright: npm i -g playwright, with Chromium installed)
// Walks all 45 Light Lab challenge questions on a phone and a laptop:
// the 🎯 step can be done, each question starts NOT done (so students really use the simulator), answers stay locked
// until it is, a 🎯 zone and checklist show, and after the right answer "Next" is on screen without scrolling.
const { chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright");
const path = require("path"), url = "file://" + (process.env.INDEX_HTML || path.join(__dirname, "..", "index.html"));
(async () => {
  const browser = await chromium.launch(), problems = []; let n = 0;
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    page.on("pageerror", e => problems.push(`${w}px script: ${e.message}`));
    await page.goto(url); await page.fill("#nm", "Tester"); await page.click("#go"); await page.waitForTimeout(250);
    await page.evaluate(() => { closeModal(); streakPop = null; renderMap("lab"); });
    const order = await page.evaluate(() => [...document.querySelectorAll("[data-labtab]")].map(b => b.dataset.labtab).join(","));
    if (order !== "mirror,tir,lens") problems.push(`${w}px tabs not in textbook order: ${order}`);
    for (const tab of ["mirror", "tir", "lens"]) for (let i = 0; i < 15; i++) {
      const r = await page.evaluate(([tab, i]) => {
        LAB.tab = tab; const run = LCH.runs[tab] = { i, right: 0, coins: 0 }; lchStartQ(run); lchRender(true);
        const q = LAB_CHALLENGE[tab][i], out = [];
        if (q.need) {
          if (!lchPass(tab, q).length) return ["step can never be done"];
          if (q.need[2]()) out.push("starts already done");
          if (!document.getElementById("lchCh").classList.contains("locked")) out.push("answers not locked");
          if (!document.querySelectorAll("#lchSteps li").length) out.push("no checklist");
          if (lchSteps(tab, q).some(s => s.ranges) && !document.querySelector("#labSvg .zone")) out.push("no 🎯 zone on the diagram");
          setLab(lchPass(tab, q)[0]); labUpdate();
          if (!q.need[2]() || document.getElementById("lchCh").classList.contains("locked")) out.push("doing the step does not unlock the answers");
          if (document.getElementById("lchNow").hidden) out.push("no 'done' cue");
        } else if (!document.querySelector(".lchsnap svg")) out.push("picture missing");
        const right = document.querySelector('#lchCh .choice[data-k="0"]'); right.scrollIntoView({ block: "center" }); right.click();   // like a student: the answer is on screen when tapped
        const nx = document.getElementById("lchNext"); if (!nx) out.push("no Next button"); else { const b = nx.getBoundingClientRect(); if (b.top < 0 || b.bottom > innerHeight) out.push("Next is off-screen"); }
        return out;
      }, [tab, i]);
      r.forEach(x => problems.push(`${w}px ${tab} Q${i + 1}: ${x}`)); n++;
    }
    await page.context().close();
  }
  await browser.close();
  if (problems.length) { console.log(problems.join("\n")); console.log(`\n${problems.length} lab problem(s)`); process.exit(1); }
  console.log(`lab ui ok: ${n} challenge questions checked`);
})();
