# Escape-room mechanics: design (v1, approved scope 1, 2, 3, 5, 7)

Roles / multiplayer (mechanic 6) is **not** built. Everything is bilingual (EN / 繁中).

## Currency
- The currency is **🪙 coins** (`S.coins`). Chestnut 栗子伯 is only a character.
- 🚪 Escape **costumes stay achievement-only** (no price).
- Other 🔒 rare / epic / legend accessories can now be **earned _or_ bought** (rare 150, epic 300, legend 600 🪙).

## Where it plugs in (no rewrite)
| Seam | Existing code | New use |
|---|---|---|
| Lock gate | `openPuzzle(i)` | a **gate** may run before the question |
| Events | `INCIDENTS` + `tryIncident` | new events share the same list |
| Penalties | wrong-answer handler | hint / time cost |
| Room start | `enterRoom`, `freshRun` | `run.seed`, `run.gates`, `run.need` |
| Save | `load()` / `save()` | optional `S.cfg`, `S.meta`, `S.lab_ch` (defaults filled in) |

Pure logic (seeded RNG, gate assignment, event eligibility, chaos table, badges) lives in one DOM-free block
`/* @@MECH-START */ … /* @@MECH-END */` in `index.html`, so `tests/mechanics.test.js` can run it in Node.

## Mechanics
### 1. Multiple ways to progress – `LOCK_GATES` registry
Each gate = `{ id, icon, en, zh, run(ctx, pass, fail) }`. The **question always follows**, so learning stays the core.
- `question` – today's behaviour (no gate).
- `hunt` 🔎 – find the glowing spark among 12 tiles (position from the seed).
- `pattern` 🎨 – memorise a 4-colour sequence, then repeat it.
- `cipher` 🔐 – decode a short Caesar-shifted science word.
Add a gate = add one object to `LOCK_GATES` and its id to `GATE_WEIGHTS`.
**Trigger:** when a lock is opened at step 0 (and for each later step with the same gate roll). Fail = −10 s (see 5), then retry.

### 2. Randomization
- `run.seed` is created with the run. `mulberry32(seed)` drives everything below, so one seed gives one layout.
- `assignGates(seed, chaos)` gives every lock × step a gate.
- Hotspot positions are jittered ±3 % (never leaving the scene).
- Questions are still drawn from the pool (`pickRun`), harder lock by lock.
- Old runs without a seed get one on entry.

### 3. Unpredictable events (added to `INCIDENTS`)
- 🚧 **Lockdown** – one open lock is blocked 30 s; answer a riddle to open it early.
- 🧑‍🍳 **Trader** – Chestnut offers: pay 1 hint for +30 s, or answer a riddle for +1 hint.
- 🌟 **Secret room** – only after 3 first-try answers in a row: one hard riddle → 🪙 + badge.
- ⏱️ **Bonus challenge** – optional side question for +30 s (max 2 per room).
Existing events (blackout, wolverine, shadow, fog, clock, spores, owl, tea) stay. `eventEligible()` checks the condition, the per-room cap and the chaos level.

### 4. Branching paths
At chaos ≥ 2, opening an untouched lock offers:
- 🛡️ **Safe** – 3 questions, +1 hint when done.
- ⚡ **Shortcut** – 1 harder question, **no second chance** (a miss costs a heart); success jumps the lock to done and gives +20 s.
Stored in `run.need[i]` (default 3).

### 5. Resource and risk
- **Hint budget** per room (`run.hintsLeft`, from the chaos table; unlimited at chaos 0).
- A wrong answer costs **1 hint, or 10 s when no hints are left** (on top of the existing heart/jam rules).
- Bonus challenges and the trader add time back.

### 7. Meta-progression
`S.meta = { badges:{id:date}, gates:{id:n}, secrets, runs }`. Badges pay coins once, show in 🎒 Collect, and one costume
(Detective hat) is **achievement-only** (3 badges).
Badges: 🎲 *Gate hopper* (all gate types seen), 🌟 *Secret finder*, ⚡ *Risk taker* (shortcut done), 🔁 *Regular* (5 runs),
🧪 *Lab expert* (all 3 lab challenges ≥ 12/15).

## Teacher config (`S.cfg`, also `?chaos=0-3`)
| chaos | question-gate share | events | branching | hints / room |
|---|---|---|---|---|
| 0 Predictable | 100 % | as before | off | ∞ |
| 1 Light | 60 % | as before | off | 6 |
| 2 Lively | 40 % | + new events | on | 4 |
| 3 Wild | 25 % | + new events, secret room | on | 3 |
Panel: Rooms tab → 🎲 *Session settings*. **At chaos 0 a room plays exactly as before.**

## Lab challenge (new)
Each simulation (Lenses, Plane mirror, Total internal reflection) gets a **15-question challenge**.
- Most questions need the student to **set the simulator** (e.g. "put the object beyond 2F'") — the card unlocks only when the live state matches, then asks what they see.
- Others show a **snapshot of the simulator diagram** as the media.
- Wrong = explanation + retry (first-try score counts). ≥ 12/15 first time = +30 🪙; best score is saved in `S.lab_ch`.
- Questions are plain data (`LAB_CHALLENGE[tab]`), so more can be added.

## Compatibility
No existing key changes. Missing `cfg/meta/lab_ch/seed/gates/need` get defaults. Stars, trophies, save code and leaderboard untouched.

## Tests & manual checklist
Run: `node tests/mechanics.test.js` and `node tests/lab_challenge.test.js`.

Manual (set chaos with 🎲 Session settings in Rooms, or `?chaos=0-3`):
1. Chaos 0: a room plays exactly like before.
2. Chaos 1: some locks start with a hunt / pattern / cipher puzzle; hints are limited (6).
3. Chaos 2–3: Safe/Shortcut choice appears; events (lockdown, trader, bonus) appear.
4. Chaos 3: 3 first-try answers in a row can open the secret room.
5. Collect tab shows badges; they persist after reload.
6. Dress tab: costumes are achievement-only; other locked items can be bought; no clipped text at 420px, EN and 繁中.
7. Light Lab: each tab has a 15-question challenge; choices unlock only after the simulator is set up; 12+ first-try = +30 🪙 once.
8. Load an old save: no errors.
