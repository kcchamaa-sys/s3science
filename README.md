# 🔦 Chiikawa Physics Escape

A bite-sized, Chiikawa-themed escape room game for **S3 (Grade 9) Physics — Light & Optics**.

- **Play:** open `index.html` in any browser. No install, no build step.
- **Session length:** one room ≈ 10–15 minutes. One room a day is the whole goal.

## Rooms

| # | Room | Topic |
|---|------|-------|
| 1 | The Dark Cavern | Luminous / non-luminous, light travels in straight lines |
| 2 | The Hall of Mirrors | Law of reflection, plane mirror images |
| 3 | The Bent Pool | Refraction, refractive index, apparent depth |
| 4 | The Crystal Fibre Tunnel | Critical angle, total internal reflection |
| 5 | The Lens Workshop | Convex & concave lenses, magnification |
| 6 | The Rainbow Prism Tower | Dispersion, visible spectrum, colour mixing & filters |
| 7 | The Wave Observatory | Electromagnetic spectrum & its uses |

Each room has 5 locks (puzzles). Wrong answers are safe: Hachiware gives a hint and you try again.

- Wording follows HK S3 / junior physics conventions (erect, laterally inverted, m s⁻¹, infra-red, n = sin i / sin r, c = fλ).
- After each lock: an explanation, an exam tip where useful, and bilingual key terms (English + 中文).
- After each room: revision notes (重點筆記).
- Sound effects are generated in the browser (🔊 button to mute). Animations respect the device's reduce-motion setting.

## How a room works

- Tap the glowing **?** objects (bookshelf, wall clock, room object, locked box, safe). Each opens a puzzle: multiple choice, keypad lock or combination dials.
- Each solved lock gives an item with one digit of the **door code**. Enter the 5 digits at the 🚪 exit door to escape.
- 15-minute countdown per room. When it runs out the room keeps going in overtime, with no penalty.
- **📓 Study Journal** (top bar): summary, formulas and bilingual key terms for each topic.

## Saving progress

- **Auto-save:** progress saves on the device after every action (`localStorage` key `escapeGameProgress`). Reopening the game shows a **Resume game** prompt.
- **🔑 Save code:** a 5-character code (e.g. `K7Q2M`) or a link ending in `#K7Q2M` moves progress to another device with no account needed. It stores stars per room, locks solved in the current room, streak and shields. The game shows what a code contains before loading it.

## Trophies 🏆

10 hard trophies in the **Trophy Cabinet** (map screen and 🏆 button). They reward effort over many days: 7- and 30-day streaks, 20 play days, 15 first-try answers in a row, 100 locks opened, all rooms escaped, 3★ everywhere, 5 clean escapes, 5 no-hint escapes, 10 replays. Locked trophies show a progress bar.

## Anti-guessing rules ⚠️

- Every wrong answer costs **30 seconds** on the room timer.
- **Guessing** (a wrong answer within 5 s of opening a lock or of the last wrong answer) jams the lock for 30 s.
- A **second wrong answer** on the same lock jams it for 15 s, rising to 45 s.
- Each jam adds a **guess strike**: 3 strikes = −1 star, 6 strikes = −2 stars for that escape (minimum 1★).

## Daily streak

- 🔥 +1 for each day in a row. 🛡️ Shields cover missed days (earn one every 7 days, max 3). 🎁 Daily snack chest.

*Fan-made educational project. Characters are original Chiikawa-style drawings, not official artwork; Chiikawa belongs to Nagano.*
