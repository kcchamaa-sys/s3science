// Run: node tests/mechanics.test.js   (no dependencies)
// Loads the DOM-free block between @@MECH-START and @@MECH-END in index.html.
const fs = require("fs"), vm = require("vm"), assert = require("assert");
const html = fs.readFileSync(require("path").join(__dirname, "..", "index.html"), "utf8");
const m = html.match(/\/\* @@MECH-START \*\/([\s\S]*?)\/\* @@MECH-END \*\//);
assert(m, "MECH block not found");
const ctx = {}; vm.createContext(ctx);
vm.runInContext(m[1] + "\nthis.api = { mulberry32, newSeed, CHAOS, chaosCfg, GATE_IDS, assignGates, jitterPos, cipherPuzzle, caesar, huntPuzzle, patternPuzzle, eventEligible, pickEvent, spendHint, wrongCost, needOf, BADGES, newBadges };", ctx);
const A = ctx.api; let n = 0;
const test = (name, fn) => { fn(); n++; console.log("ok -", name); };

test("seeded RNG is deterministic", () => {
  const a = A.mulberry32(42), b = A.mulberry32(42);
  for (let i = 0; i < 20; i++) assert.strictEqual(a(), b());
  assert.notStrictEqual(A.mulberry32(1)(), A.mulberry32(2)());
});
test("same seed gives same gates, different seeds differ", () => {
  assert.strictEqual(JSON.stringify(A.assignGates(7, 3, 5, 3)), JSON.stringify(A.assignGates(7, 3, 5, 3)));
  const seen = new Set(); for (let s = 1; s <= 30; s++) seen.add(JSON.stringify(A.assignGates(s, 3, 5, 3)));
  assert(seen.size > 20, "layouts should vary");
});
test("chaos 0 is classic: only question gates", () => {
  for (let s = 1; s < 50; s++) assert(A.assignGates(s, 0, 5, 3).flat().every(g => g === "question"));
});
test("gates are valid, the middle question is never gated, shape is locks x steps", () => {
  const g = A.assignGates(99, 3, 5, 3); assert.strictEqual(g.length, 5);
  g.forEach(row => { assert.strictEqual(row.length, 3); assert.strictEqual(row[1], "question"); row.forEach(x => assert(x === "question" || A.GATE_IDS.includes(x))); });
});
test("higher chaos means more gates", () => {
  const share = lvl => { let gated = 0, tot = 0; for (let s = 1; s <= 400; s++) A.assignGates(s, lvl, 5, 3).flat().forEach(x => { tot++; if (x !== "question") gated++; }); return gated / tot; };
  const [c0, c1, c2, c3] = [0, 1, 2, 3].map(share);
  assert.strictEqual(c0, 0); assert(c1 > 0 && c1 < c2 && c2 < c3, `${c1} ${c2} ${c3}`);
});
test("all gate types appear at chaos 3", () => {
  const all = new Set(); for (let s = 1; s <= 100; s++) A.assignGates(s, 3, 5, 3).flat().forEach(x => all.add(x));
  A.GATE_IDS.concat("question").forEach(g => assert(all.has(g), g));
});
test("hotspot jitter is stable per seed, bounded and varies by seed", () => {
  assert.strictEqual(String(A.jitterPos(5, 2, 55, 55, 3)), String(A.jitterPos(5, 2, 55, 55, 3)));
  for (let s = 1; s < 200; s++) { const [x, y] = A.jitterPos(s, 1, 15, 50, 3); assert(Math.abs(x - 15) <= 3.01 && Math.abs(y - 50) <= 3.01); }
  assert(A.jitterPos(1, 0, 90, 90, 9)[0] <= 94);
  assert.notStrictEqual(String(A.jitterPos(1, 0, 50, 50, 3)), String(A.jitterPos(2, 0, 50, 50, 3)));
});
test("cipher decodes back to the word", () => {
  for (let s = 1; s < 100; s++) { const c = A.cipherPuzzle(s, s % 5); assert.strictEqual(A.caesar(c.text, -c.shift), c.word); assert(c.shift >= 1 && c.shift <= 5); }
});
test("hunt and pattern puzzles are valid and deterministic", () => {
  for (let s = 1; s < 100; s++) { const h = A.huntPuzzle(s, 3); assert(h.target >= 0 && h.target < h.n); const p = A.patternPuzzle(s, 3); assert.strictEqual(p.length, 4); p.forEach(x => assert(x >= 0 && x < 4)); }
  assert.strictEqual(String(A.patternPuzzle(8, 1)), String(A.patternPuzzle(8, 1)));
});
const EV = [{ id: "a", w: 1 }, { id: "wild", w: 1, min: 3 }, { id: "lively", w: 1, min: 2 }, { id: "cond", w: 1, cond: c => c.streak >= 3 }];
const ctxOf = o => Object.assign({ used: [], incidents: 0, streak: 0 }, o);
test("event eligibility: used, cap, chaos level, condition", () => {
  assert(A.eventEligible(EV[0], ctxOf(), 0));
  assert(!A.eventEligible(EV[0], ctxOf({ used: ["a"] }), 0));
  assert(!A.eventEligible(EV[0], ctxOf({ incidents: 3 }), 0), "chaos 0 cap is 3");
  assert(A.eventEligible(EV[0], ctxOf({ incidents: 4 }), 3), "chaos 3 allows more");
  assert(!A.eventEligible(EV[2], ctxOf(), 1) && A.eventEligible(EV[2], ctxOf(), 2));
  assert(!A.eventEligible(EV[1], ctxOf(), 2) && A.eventEligible(EV[1], ctxOf(), 3));
  assert(!A.eventEligible(EV[3], ctxOf({ streak: 2 }), 3) && A.eventEligible(EV[3], ctxOf({ streak: 3 }), 3));
});
test("pickEvent respects eligibility and returns null when nothing fits", () => {
  for (let i = 0; i < 100; i++) { const e = A.pickEvent(EV, ctxOf(), 0, Math.random); assert(e && e.id === "a"); }
  assert.strictEqual(A.pickEvent(EV, ctxOf({ used: ["a"] }), 0), null);
  const ids = new Set(); for (let i = 0; i < 300; i++) ids.add(A.pickEvent(EV, ctxOf({ streak: 5 }), 3).id);
  assert.strictEqual(ids.size, 4);
  assert.strictEqual(A.pickEvent(EV, ctxOf(), 3, () => 0).id, "a", "injected rng is used");
});
test("hint budget: unlimited at chaos 0, limited otherwise", () => {
  const r0 = {}; for (let i = 0; i < 50; i++) assert(A.spendHint(r0, 0));
  const r = {}; for (let i = 0; i < 4; i++) assert(A.spendHint(r, 2)); assert(!A.spendHint(r, 2)); assert.strictEqual(r.hintsLeft, 0);
});
test("wrong answer cost: none at chaos 0, a hint first, then time", () => {
  assert.strictEqual(A.wrongCost({}, 0), null);
  const r = { hintsLeft: 1 }; assert.strictEqual(A.wrongCost(r, 1), "hint"); assert.strictEqual(A.wrongCost(r, 1), "time");
});
test("needOf defaults to the normal 3 and honours a shortcut", () => {
  assert.strictEqual(A.needOf({}, 0, 3), 3); assert.strictEqual(A.needOf({ need: [0, 0] }, 1, 3), 3);
  assert.strictEqual(A.needOf({ need: [1, 3] }, 0, 3), 1);
});
test("badges are earned once and only when conditions hold", () => {
  assert.strictEqual(A.newBadges({ badges: {}, gates: {} }, {}).length, 0);
  const m = { badges: {}, gates: { hunt: 1, pattern: 1, cipher: 2 }, secrets: 1, shortcuts: 0, runs: 5 };
  assert.deepStrictEqual(Array.from(A.newBadges(m, {})).sort(), ["hopper", "regular", "secret"]);
  m.badges = { hopper: "x" }; assert(!Array.from(A.newBadges(m, {})).includes("hopper"));
  const lab = { lens: { best: 12 }, mirror: { best: 15 }, tir: { best: 11 } };
  assert(!Array.from(A.newBadges({ badges: {}, gates: {} }, lab)).includes("lab"));
  lab.tir.best = 12; assert(Array.from(A.newBadges({ badges: {}, gates: {} }, lab)).includes("lab"));
});
test("chaosCfg clamps bad input", () => { assert.strictEqual(A.chaosCfg(-5).id, 0); assert.strictEqual(A.chaosCfg(99).id, 3); assert.strictEqual(A.chaosCfg("x").id, 0); });
console.log(`\n${n} tests passed`);
