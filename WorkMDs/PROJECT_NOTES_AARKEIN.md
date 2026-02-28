# PROJECT_NOTES_AARKEIN.md

Purpose: quick context file I will read before working on this repo.

## Project Identity
- Repo: `Sherzybath/Portfolio`
- Purpose: Kal's personal website/portfolio
- Framework: React (Create React App)
- Current working branch policy: **only `aarkein/playground`** unless Kal explicitly changes this.

## Working Rules (for me)
1. Always verify branch first:
   - `git branch --show-current` must be `aarkein/playground`
2. Keep edits minimal and visual-first (portfolio UX matters most).
3. Run the app after changes and confirm no crash.
4. Explain changes in plain language (what changed + where + why).
5. Ask before any external action (push/PR/etc).

## Local Runbook
- Install deps: `npm install`
- Dev server: `npm start -- --host 0.0.0.0 --port 3000`
- Live preview (Tailscale): `http://100.64.66.104:3000`

## Tech Snapshot
- React 18 + react-scripts 5 (CRA)
- Routing: `react-router-dom`
- Animations: `framer-motion`, `gsap`, `split-type`
- UI assets and components live mainly in `src/components` and `src/Assets`

## Known Current State
- Dev server works, but lint warnings exist (unused vars, hook dependency warnings, some anchor validity warnings).
- No immediate blocker for local preview.
- Homepage now includes a GSAP-driven **Game Mode** staging flow from ADHD tile into keycap layout + central game screen.
- Key highlights are wired for keyboard input in Game Mode (`WASD`, arrows, `Q`, `E`).

## Game Mode Controls Spec (current)
- `Q` = mapped input key (planned dodge action in game logic)
- `E` = mapped input key (planned shoot action in game logic)
- Arrows / WASD currently drive key highlight states only.
- Actual asteroid gameplay logic still pending implementation.

## Standard Change Checklist
- [ ] Confirm branch is `aarkein/playground`
- [ ] Make requested change
- [ ] Validate in live preview
- [ ] Summarize exactly what changed
- [ ] Ask before push/remote actions

## Notes for Future Sessions
If structure changes significantly, update this file first so future work starts with accurate context.
