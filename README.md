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

## Daily streak system

- 🔥 **Streak:** +1 for each consecutive day you open the game.
- 🛡️ **Streak shields:** start with 1. A shield covers one missed day automatically. Earn 1 every 7-day milestone (max 3); the daily chest can also drop one.
- 🎁 **Daily chest:** Momonga & Kuri-Manju's snack chest, once per day.
- 🏅 **Badges & items:** earned the first time you escape each room.
- 📈 **Physics mastery:** per topic, counts locks solved on the first try without a hint.

Progress is saved in the browser (`localStorage`). The **🔒 Save data** panel on the map shows the full JSON state and lets you copy it to another device or restore it.

See [`PROMPT.md`](PROMPT.md) for the original Game Master spec.

*Fan-made educational project. Characters are original hand-drawn tributes, not official artwork; Chiikawa belongs to Nagano.*
