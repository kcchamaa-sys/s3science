# 🔦 Chiikawa Physics Escape

A bite-sized, Chiikawa-themed escape room game for **S3 Science, Chapter 14: Light, Colours and Beyond**. Concept-only: there are **no calculations** anywhere in the game.

🌐 **English / 繁體中文:** switch language with the 🌐 button (or on the welcome screen). Everything is translated using HK junior science terms; key-term chips stay bilingual.

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

## ⚡ Light Rush, 👗 Wardrobe and 🏅 Leaderboard

- **Light Rush:** 60 seconds of mixed quick questions (multiple choice, true/false, matching, put in order, odd one out, fill the gap, colour mixer). Combos give ×2 / ×3 points; a wrong answer costs 3 seconds. Every 10 points = 1 🌰 chestnut; the first round each day pays double.
- **Wardrobe & Shop:** spend chestnuts on hats, glasses, hair clips and frames for Chiikawa, or on power-ups for the escape rooms: 🔦 Torch (removes a wrong answer / fixes a dial), ⏳ Time crystal (+60 s), 🛡️ Guard charm (blocks one wrong answer's penalties).
- **Leaderboard:** top 10 by dedication points (10 per day played + 1 per lock + 10 per room + 5 per rush round + 25 per trophy). It needs a free Google Sheet: see [`leaderboard/SETUP.md`](leaderboard/SETUP.md), then put the web-app URL in `LEADERBOARD_URL` in `index.html`.

## Trophies 🏆

10 hard trophies in the **Trophy Cabinet** (map screen and 🏆 button). They reward effort over many days: 7- and 30-day streaks, 20 play days, 15 first-try answers in a row, 100 locks opened, all rooms escaped, 3★ everywhere, 5 clean escapes, 5 no-hint escapes, 10 replays. Locked trophies show a progress bar.

## Anti-guessing rules ⚠️

- Every wrong answer: **−20 seconds**, and the lock **reshuffles** (answer order shuffles, dials spin).
- **Guessing** (a wrong answer within 5 s of opening a lock or of the last wrong answer) jams the lock for 25 s; a **repeat miss** jams it for 20–40 s.
- Each jam adds a **guess strike** and costs **3 🌰 chestnuts**. Every 3rd strike, the **lights dim** for 45 s.
- 3 strikes = −1 star, 6 strikes = −2 stars for that escape (minimum 1★).

## Daily streak

- 🔥 +1 for each day in a row. 🛡️ Shields cover missed days (earn one every 7 days, max 3). 🎁 Daily snack chest.

*Fan-made educational project. Characters are original Chiikawa-style drawings, not official artwork; Chiikawa belongs to Nagano.*
