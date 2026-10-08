// Run: node tests/lab_challenge.test.js : checks the data of the 15-question lab challenges
const fs = require("fs"), vm = require("vm"), assert = require("assert");
const html = fs.readFileSync(require("path").join(__dirname, "..", "index.html"), "utf8");
const m = html.match(/const CVX = [\s\S]*?\nconst LCH = /);
assert(m, "LAB_CHALLENGE not found");
const ctx = { LAB: {}, tirSolve: () => ({}) }; vm.createContext(ctx);
vm.runInContext(m[0].replace(/\nconst LCH = $/, "") + "\nthis.C = LAB_CHALLENGE;", ctx);
const C = ctx.C;
for (const tab of ["lens", "mirror", "tir"]) {
  assert.strictEqual(C[tab].length, 15, `${tab} has 15 questions`);
  let doing = 0;
  C[tab].forEach((q, i) => {
    const w = `${tab} Q${i + 1}`;
    assert(q.need || q.snap, `${w} needs a task or a picture`);
    if (q.need) { doing++; assert.strictEqual(q.need.length, 3, w); assert(q.need[0] && q.need[1], w + " need bilingual"); assert.strictEqual(typeof q.need[2], "function", w); }
    assert(q.q[0] && q.q[1], w + " question bilingual"); assert(q.why[0] && q.why[1], w + " explanation bilingual");
    assert(q.ch.length >= 3 && q.ch.length <= 4, w + " choices 3-4");
    q.ch.forEach(c => assert(c[0] && c[1], w + " choice bilingual"));
  });
  assert(doing >= 8, `${tab}: most questions should ask the student to use the simulator (${doing})`);
  console.log(`ok - ${tab}: 15 questions, ${doing} hands-on, ${15 - doing} with a picture`);
}
