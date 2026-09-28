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

## Daily streak

- 🔥 +1 for each day in a row. 🛡️ Shields cover missed days (earn one every 7 days, max 3). 🎁 Daily snack chest.

*Fan-made educational project. Characters are original Chiikawa-style drawings, not official artwork; Chiikawa belongs to Nagano.*
