# ☀️ S3 Science Study Pals

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

## Question bank and incidents

- **40 questions per room** (280 in total, English + 繁中), spread across **Bloom's taxonomy levels 1–6**: Remember, Understand, Apply, Analyse, Evaluate, Create.
- Every visit picks **5 fresh questions** climbing from level 1–2 up to 5–6, avoiding the ones seen recently. Answer choices are shuffled each time.
- Mastery counts how many of a room's 40 questions you've answered right first time. The first replay each day earns a 📚 revision bonus (+20 🌰).
- **Random incidents** (up to 3 per visit, more likely on replays) add a spooky, friendly twist:
  🌑 blackout · 🐾 a wolverine takes an item (answer its riddle to get it back) · 👻 a shadow hides a lock · 🌫️ fog hides answers for 6 s · ⏩ the clock runs double speed · 😴 sleepy spores block hints · 🦉 an owl's bonus riddle (+45 s, +5 🌰) · 🍵 Kuri-Manju's tea break freezes the timer.

## How a room works

- Tap the glowing **?** objects (bookshelf, wall clock, room object, locked box, safe). Each opens a puzzle: multiple choice or combination dials.
- Each solved lock gives an item. Once all 5 are collected, the 🚪 exit door opens a **different challenge in each room**:

  | Room | Type | Door challenge |
  |---|---|---|
  | 14.1 Dark Cavern | 🧩 Jigsaw | Tap-to-swap 3×3 jigsaw of "how we see a non-luminous object", then one check question |
  | 14.2 Hall of Mirrors | 🏷️ Diagram | Label an animated reflection ray diagram (A–F); 🔊 / 🐢 read-aloud of the law of reflection |
  | 14.3 Bent Pool | 🔐 Code lock | Enter the 5 code digits shown on the items (the classic keypad) |
  | 14.4 Crystal Fibre Tunnel | 🔬 Experiment | Use the TIR simulator to trap light in diamond at an angle that would not trap it in glass |
  | 14.5–6 Lens Workshop | 🔬 Experiment | Use the lens simulator to make the image the door asks for (projector, camera or magnifying glass) |
  | 14.7 Rainbow Prism Tower | 🎨 Colour mixing | Switch red, green and blue spotlights to match 3 target colours |
  | 14.8 Wave Observatory | 🌈 Spectrum line-up | Put the 7 EM wave cards in order of wavelength; 🔊 names |

  A wrong door answer costs 20 seconds (no heart). Room types are set in `ROOM_KIND` in `index.html`.
- 15-minute countdown per room. When it runs out the room keeps going in overtime, with no penalty.
- **📓 Study Journal** (top bar): summary, formulas and bilingual key terms for each topic.

## Saving progress

- **Auto-save:** progress saves on the device after every action (`localStorage` key `escapeGameProgress`). Every sign-in or reload lands on the 🏠 **Home** main menu with a short "welcome back" note.
- **🔑 Save code:** a 5-character code (e.g. `K7Q2M`) or a link ending in `#K7Q2M` moves progress to another device with no account needed. It stores stars per room, locks solved in the current room, streak and shields. The game shows what a code contains before loading it.

## 🌤️ Login screen and 🔐 class sign-in

- **Login screen** (copied from the s1 Mochi Science Pals game): Puff, wearing prism glasses and holding a lightstick, waves next to Berry on a floating grassy island. Behind them is a cream-to-sky gradient with a faint dot grid, a scan-line, breathing glows, stardust and three glowing 3D orbit rings. Prisms, atoms, bulbs, rainbows and light rays drift past and move with the mouse or when the phone tilts. It also has a language pill, a music toggle and two teaser cards. Reduced-motion settings stop all the animation.
- **Class sign-in:** students on the class list sign in with their school Google account. Progress saves to the cloud and loads on any device. Every escape (or game over), Study check, Light Rush round and Practice run is also written to the teacher's Google Sheet.
  - A tab left open on another device can never overwrite newer progress.
  - Records wait on the device until the server has them.
  - Tap your name in the top bar to sync now, sign in again after the sign-in expires (about 1 hour), or sign out.
- **School guest mode:** an account on the school domain that isn't on the class list can still play. Its progress is saved only on that device, and nothing is recorded.
- **First sign-in:** if the device already has progress from before sign-in, the student is asked once whether to move it into their account.
- **Setup:** see [`server/SETUP.md`](server/SETUP.md) (server code: `server/Code.gs`). Until `API_URL` is filled in `window.S3_CONFIG` near the top of `index.html`, the login screen shows **Play on this device**: students type a nickname and save codes work, the same as before. Student names and emails stay in the teacher's private sheet and are never put in this repo.

## ⚡ Light Rush, 👗 Wardrobe and 🏅 Leaderboard

- **🏠 Tabbed hub:** a bottom bar (Home · Rooms · Lens Lab · Dress up · Collection) replaces the long map page, so students hardly need to scroll. Home shows Chiikawa in a cosy room, progress meters, action tiles, the streak and the chat card.
- **🍡 Mochi-style characters:** all five friends are redrawn as soft, round mochi bodies with tiny arms and feet.
- **👗 Dress-up page:** new wig, outfit and prop slots with 22 Gen Z / Hong Kong items (swoop wig, K-pop wolf cut, moonwalk fedora, sparkly glove, "six-seven" jersey, deal-with-it shades, +1000 aura sign, bubble tea, egg waffle, red-white-blue poncho…).
- **🔭 Lens Lab:** drag an object in front of a convex or concave lens. The three textbook rules draw the rays, and the lab shows the image position, its nature, u, v, magnification and everyday uses, with six missions (+5 🌰 each).
- **📘 Textbook alignment:** rooms follow sections 14.1–14.8 of "光、顏色和光譜以外", with notes rewritten from each 重點 and the textbook's terms (橫向倒置, 後視鏡, 藍綠, 洋紅, 紅外輻射, 紫外輻射, 伽瑪射線…). 33 bank questions were replaced with textbook examples (光酥餅, 貓眼石, 單車反光板, 紅外線體溫計, 快易通, 食物保存…).
- **🎌 Anime wardrobe pack:** 81 more original items (the wardrobe now has 162) that nod to Jujutsu Kaisen, Hunter x Hunter, Naruto, Demon Slayer, One Piece, Spy x Family, Dragon Ball, Sailor Moon, Frieren, Haikyu!!, Bocchi the Rock!, My Hero Academia, Chainsaw Man, Attack on Titan and Oshi no Ko: hair, hats, face items, clips, outfits, props, 5 frames, 6 backdrops and 2 escape-only costumes (Sorcerer first-year, Rookie hunter). All are simple original drawings, not official artwork.
- **☀️ Sunshine theme:** warm lemon, peach and orange interface colours. One Chinese font everywhere: M PLUS Rounded 1c is loaded only for Latin characters, so all Chinese text uses Huninn (fallback Noto Sans TC).
- **🎭 Wave-2 wardrobe:** 25 more original items that nod to memes, movies, superheroes and pop stars (big blond swoop wig, purple K-pop idol hair, curtain-bang and sky-high-ponytail pop-star wigs, mad-scientist hair, demon-hunter idol braid, web-slinger / iron-armour / merc / panther masks, thunder hammer, star shield, metal claws, chicken-jockey rider, witch hat, alien ears, Dubai chocolate, friendship bracelets, lightstick…) plus 8 room backdrops (Mong Kok neon, Victoria Harbour, brat-green wall, pixel world, stadium stage, space, hero city, emerald city).
- **🔭 Light Lab:** three simulators (lenses 14.5–14.6, plane mirror 14.2, total internal reflection 14.4 with water, glass and diamond) and a choice of arrow, pencil or pop-star doll as the object. 12 missions.
- **🎵 Music shop:** 7 unlockable background tracks for the home screen (lo-fi, pixel, disco pop, brainrot bounce, party chant, 2010 teen-pop, K-pop anthem). All melodies are original; only the style nods to famous songs.
- **📖 Study mode or 🚪 Escape mode:** students choose. Study mode = key points, key rules and terms, then a calm 5-question check (no timer, every topic open). Escape mode = 3 ❤️ hearts and a strict 10-minute timer: every wrong answer costs a heart, and 0 hearts or time up is a real **GAME OVER** (the room's locks reset). Stars = hearts left.
- **🚪 Escape-only costumes:** 💪 Gym bro (first escape), 🎣 Fish bro (3 rooms), 🍵 Performative bro (3 flawless escapes), 💼 Finance bro (5 rooms) and the legendary ♾️ Blindfold sorcerer (all 21★ + 10 flawless + 5 fast escapes).
- **New original cast:** Puff 泡芙, Berry 莓莓, Mango 芒芒, Taro 芋圓 and Chestnut 栗子伯. Bloom levels are still used to pick questions but are no longer shown to students.
- **📕 Mistake notebook (錯題本):** every wrong answer (rooms, Study, Rush, Practice) is saved with its topic, how many times it was missed and the date. Students can filter by topic, reveal the answer and explanation, retry it (a correct answer clears it and gives +3 🌰), open the notes, remove it, or start 🔁 Practice from the whole list. The tab shows a badge with the count.
- **💬 Chat card:** on the map, the Chiikawa friends take turns sharing 💡 light facts from Hong Kong life (Symphony of Lights, convex road mirrors, optical-fibre broadband…) and 💪 personal cheers (streak, mistakes waiting, nearest trophy, next room). It changes every 20 s.
- **🔥 Streak pop-up and bonus:** an animated pop-up each new day (streak up, shield saved, welcome back). Every 3 days in a row adds +10% chestnuts, up to ×1.5.
- **✦ 💎 👑 Rarity tiers:** wardrobe items are Common, Rare, Epic or Legendary. There are new Hong Kong items (pineapple-bun hat, egg-tart clip, neon-sign frame). Five special items can't be bought; students earn them through steady effort (3★ in 3 rooms, fix 30 mistakes, master 140 questions, finish 20 practice rounds, all 21★ + 250 mastered).
- **🔊 British pronunciation:** every key term (journal and answer feedback) has 🔊 normal and 🐢 slow buttons using an en-GB voice.
- **🔁 Practice mode:** loops the questions you got wrong (in rooms or Light Rush). Get **15 right in a row** to finish; a wrong answer comes back 2–5 questions later and resets the streak. If there aren't enough saved mistakes, random questions from unlocked rooms fill in. Finishing gives +10 🌰 (double on the first finish each day).
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
