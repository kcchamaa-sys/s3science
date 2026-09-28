# 🔦 Chiikawa Physics Escape

A bite-sized, Chiikawa-themed escape room game for **S3 Science, Chapter 14: Light, Colours and Beyond**. Concept-only: there are **no calculations** anywhere in the game.

- **Play:** open `index.html` in any browser. No install, no build step.
- **Session length:** one room ≈ 10–15 minutes. One room a day is the whole goal.

## Rooms (Chapter 14 topics)

| # | Room | Topic |
|---|------|-------|
| 1 | The Dark Cavern | Light propagation and sight (luminous objects, straight lines, parallel/divergent/convergent beams) |
| 2 | The Hall of Mirrors | Reflection and plane mirrors (law of reflection, image features, periscopes, driving mirrors) |
| 3 | The Bent Pool | Refraction (towards/away from the normal, shallow pools, bent chopsticks) |
| 4 | The Crystal Fibre Tunnel | Total internal reflection (two conditions, optical fibres, prisms, diamonds) |
| 5 | The Lens Workshop | Convex and concave lenses (images, magnifying glass, projector, peephole, short sight) |
| 6 | The Rainbow Prism Tower | Visible spectrum and colours (dispersion, RGB mixing, object colours) |
| 7 | The Wave Observatory | Electromagnetic spectrum (order, uses, hazards) |

Puzzles are multiple choice or combination dials. 🎵 Soft background music is generated in the browser (music-box tune on the map, calmer mysterious tune in rooms) and can be turned off with the 🎵 button.

## How a room works

- Tap the glowing **?** objects (bookshelf, wall clock, room object, locked box, safe). Each opens a puzzle: multiple choice or combination dials.
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
