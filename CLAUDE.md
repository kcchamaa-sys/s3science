# S3 Science Study Pals (s3science)

Part of a **three-repo family** that shares knowledge. Read [`docs/SHARED_KNOWLEDGE.md` in biology](https://github.com/kcchamaa-sys/biology/blob/claude/wonderful-turing-8ehr7a/docs/SHARED_KNOWLEDGE.md) (or `/home/user/biology/docs/SHARED_KNOWLEDGE.md` if the repo is cloned in this session) before designing or porting a feature.

Siblings: `kcchamaa-sys/biology` (hub), `kcchamaa-sys/s1science`, `kcchamaa-sys/s3science`. If a task would benefit from a sibling and it isn't in the session, attach it with `add_repo`.

## This repo
- S3 Science escape rooms for all three parts (Biology Ch 12, Chemistry Ch 13 in `SCI_ROOMS` with `T(en, zh)` data; Physics Ch 14 Light), Chiikawa-inspired, bilingual EN / 繁中, concept-only (no calculations). Single `index.html`; spec in `PROMPT.md`, new-subject template in `NEW_SUBJECT_PROMPT.md`. `.github/workflows/deploy-pages.yml` auto-publishes to the `gh-pages` branch.

## Working agreements
- Keep this repo standalone: no runtime dependency on the siblings.
- When you build or change something reusable, add a line to the cross-project log in the hub's `docs/SHARED_KNOWLEDGE.md`.
- Never commit student names or other personal data.
- No official logos, artwork or music from existing franchises.

## Tests
`node tests/mechanics.test.js`, `tests/lab_challenge.test.js` and `tests/server.test.js` need nothing installed. `tests/layout.test.js` (all tabs × 5 widths × 2 languages: overflow, clipped cards, "undefined" names) and `tests/flow.test.js` (study, escape, game over, notebook, practice, rush, shop) and `tests/lab_ui.test.js` (all 45 Light Lab challenge questions: 🎯 step doable, starts undone, answers locked until done, zone shown, Next on screen) need Playwright + Chromium. Run them before pushing.
