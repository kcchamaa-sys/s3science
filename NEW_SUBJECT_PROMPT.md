# Paste-ready prompt: new-subject Chiikawa escape game

> Copy everything below the line into a new Claude conversation.
> Fill in the **[brackets]** first.

---

Build me a **single-file (`index.html`, HTML + CSS + vanilla JS, no build step) bilingual (English / 繁體中文) Chiikawa-style escape-room learning game** for **Hong Kong junior secondary (S[LEVEL]) students**.

It must copy the format of my finished game **"Chiikawa Physics Escape"**:
- Live: https://kcchamaa-sys.github.io/s3science/
- Repo: `kcchamaa-sys/s3science` (read `index.html` there as the reference build)

## My new subject

- **Subject:** [e.g. Biology]
- **Chapter:** [e.g. Ch 10 Human Digestive System]
- **Calculations allowed?** [No, concept-only / Yes, simple ones]
- **7 topics (one per room), from my textbook outline:**
  1. [topic 1]
  2. [topic 2]
  3. [topic 3]
  4. [topic 4]
  5. [topic 5]
  6. [topic 6]
  7. [topic 7]
- **Key textbook terms (EN / 中文):** [paste or say "use standard HK textbook terms"]
- **Rush mode name:** [e.g. "Cell Rush"; the physics one was "Light Rush"]
- **Hosting:** [new repo name, OR a sub-folder of s3science]

## Content

- 7 topics = 7 escape rooms, following my textbook wording.
- Use HK textbook terminology, with bilingual key-term chips.
- **40 questions per room**, spread across Bloom's levels 1–6:

  | Level | Questions per room |
  |---|---|
  | 1 Remember | ~7 |
  | 2 Understand | 8–10 |
  | 3 Apply | 8–10 |
  | 4 Analyse | 6–7 |
  | 5 Evaluate | 5 |
  | 6 Create | 4 |

  Count the questions per room before shipping.
- Each visit picks 5 fresh questions that climb Bloom levels and skip the last 30 seen. Answer choices are shuffled.
- Question types:
  - multiple choice
  - labelled combination dials
- Each room has:
  - a hint and an explanation
  - an optional 考試貼士 exam tip
  - revision notes and "Key rules"
- Diagrams are inline SVGs with translated labels.

## Escape-room gameplay

- A dim inline-SVG room with a torch spotlight that follows the pointer.
- Hotspots:
  - bookshelf
  - wall clock
  - a room-specific object
  - locked box
  - safe
  - exit door
- Each hotspot opens a puzzle modal.
- Each solved lock gives an inventory item holding one digit of a 5-digit door code. Students enter the code on a keypad.
- A 15-min LED countdown (overtime allowed). 1–3 ★ based on first-try answers.
- A 📓 Study Journal with the summary, key rules and bilingual terms. It highlights the current puzzle's terms.

## Chiikawa aesthetic

- **Palette:** cream `#FFFDF0`, brown outline `#4A3E3D`, pink `#FFB7C5`, blue `#A0C4FF`, yellow `#FDFFB6`.
- **Style:** 3px outlines, `4px 4px 0` shadows, **M PLUS Rounded 1c** font.
- **Characters:** ORIGINAL Chiikawa-style SVGs only. Never use official artwork (copyright).

  | Character | Role |
  |---|---|
  | Chiikawa | the player (moods: normal / happy / cry) |
  | Hachiware | hints |
  | Usagi | "Yaha!" popup |
  | Momonga | extra character |
  | Kuri-Manju | extra character |

- A fan-made disclaimer in the footer.

## Sound and animation

- Web Audio synthesized effects: tap, right, wrong, yaha, unlock, door, fanfare, creepy.
- Generated soft background music:
  - a music-box tune on the map
  - a calmer tune in rooms
  - a faster tune in rush mode
- 🎵 and 🔊 toggles.
- Confetti, shake, bob and pop animations. Respect `prefers-reduced-motion`.

## Saving

- Auto-save to localStorage. **Use a NEW key**, e.g. `escapeGame_[subject]`, so it doesn't clash with the physics game.
- Show a "Resume game" prompt on reload.
- 🔑 **5-character save code** (Crockford base32, scrambled) plus a share link `…/#CODE`.
  - It encodes stars per room, locks solved in the current room, streak and shields.
  - Preview what a code contains before loading it.
  - Reject invalid codes.

## Motivation

- Daily streak with shields: a shield covers a missed day; +1 every 7 days, max 3.
- Daily snack chest.
- **10 hard trophies** in a Trophy Cabinet (SVG cups, rarity tiers, progress bars):
  1. 7-day streak
  2. 20 play days
  3. 30-day streak
  4. 15 first-try answers in a row
  5. 100 locks opened
  6. All rooms escaped
  7. 21 stars
  8. 5 clean escapes
  9. 5 no-hint escapes
  10. 10 replays
- Revision hooks:
  - +20 🌰 daily bonus for replaying a cleared room
  - "12/40 mastered" shown per room

## Anti-guessing penalties (gentle, varied)

- **Every wrong answer:** −20 s, and the answers reshuffle or the dials spin.
- **Jams:**
  - A fast wrong answer (<5 s after opening, or <4 s after the last miss) jams the lock for 25 s.
  - A repeat miss jams it for 20–40 s.
- **Strikes:** each jam adds 1 strike and costs −3 🌰.
  - Every 3rd strike dims the lights for 45 s.
  - 3 strikes = −1★; 6 strikes = −2★ (minimum 1★).
- Show the hint during a jam.

## [Rush name] mode

- 60-second mixed rush with these question types:
  - multiple choice
  - true/false
  - matching
  - put in order
  - odd one out
  - fill the gap
  - one subject-specific visual type
- Combo ×2 and ×3 multipliers. A wrong answer costs −3 s.
- 10 points = 1 🌰. The first round each day pays double.

## Shop

- 👗 **Wardrobe:** hats, glasses, clips and frames, drawn on the player's Chiikawa everywhere.
- 🎒 **Power-ups:**
  - 🔦 Torch: removes a wrong option or fixes a dial; counts as a hint.
  - ⏳ Time crystal: +60 s.
  - 🛡️ Guard charm: blocks one miss's penalties.

## 🏅 Class leaderboard

- Top 10 by dedication points:

  | Action | Points |
  |---|---|
  | Each day played | 10 |
  | Each lock opened | 1 |
  | Each room escaped | 10 |
  | Each rush round | 5 |
  | Each trophy | 25 |

- A Google Apps Script web app writes to my Google Sheet:
  - `doGet` returns the top 10 plus the player's own rank.
  - `doPost` upserts by player id, using LockService and sanitised input.
  - The client POSTs plain-text JSON.
- Nickname only. I moderate by editing the sheet.
- Include `leaderboard/Code.gs` and a 6-step `leaderboard/SETUP.md`.
- I will deploy a **new** web app and give you the `/exec` URL.

## Random incidents

Spooky but friendly and **non-violent and healthy**. Up to 3 per visit, more likely on replays. Each has a creature SVG, a purple flicker and a creepy sound.

| Incident | Effect |
|---|---|
| 🌑 Blackout | Room nearly dark for 25 s |
| 🐾 Wolverine thief | Takes an item; tap 🐾 and answer a riddle to get it back. The door is blocked until then. |
| 👻 Shadow creature | Hides a hotspot marker |
| 🌫️ Fog | Next lock's answers blurred for 6 s |
| ⏩ Haywire clock | Timer runs double speed for 30 s |
| 😴 Sleepy spores | No hints for 45 s |
| 🦉 Owl (good) | Bonus riddle: +45 s, +5 🌰 |
| 🍵 Kuri-Manju tea (good) | Timer frozen for 30 s |

## Language and devices

- 🌐 EN / 繁中 toggle on the welcome screen and in the top bar, remembered per device. All UI and content is translated.
- Responsive on phone, iPad and desktop:
  - 16px side gutters
  - 44px tap targets
  - no horizontal scroll at 390px wide
  - safe-area insets

## Lessons from the physics build (avoid these bugs)

- `confirm()`, `alert()` and `print()` don't work in the artifact viewer. Build confirmations into the page.
- Don't show topic names twice in 繁中 mode. Use `tTopic()` / `topicHtml()` helpers.
- Every `SFX.x` you call must actually exist.
- Check phone width after adding header buttons: let the header wrap, and stack dials on phones.
- Test with Playwright:
  - Edit `S` and call `save()` (the pagehide auto-save overwrites raw localStorage edits).
  - Read `R.qs` for the answers.
  - Clear jams with `R.jam[i]=0`.
  - Disable incidents with `R.incidents=99`.

## Deploy

1. Push to the dev branch.
2. Push a `gh-pages` branch with `.nojekyll`. I give permission.
3. Give me the public **github.io student link**.
4. Also publish a Claude artifact backup (the leaderboard only works on github.io).

## How to talk to me

I'm an INFP with ADHD tendencies:
- **Scannable replies:** bullets, bold key points, white space.
- **One "next right step"** at a time. No giant plans.
- Link tasks to meaning (my students' learning); give gentle nudges.
- **Never** put model names in commits or repo files.
