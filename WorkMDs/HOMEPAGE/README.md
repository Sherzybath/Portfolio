# Homepage Architecture

## Entry
- Route: `/`
- File: `src/components/Homepage/Base.js`

## Main responsibility
Composes draggable info panels + compiler command surface for site exploration.

## Major children
- `Compiler` (command navigation)
- `About`
- `Skills`
- `Education`
- `Contacts`
- `ADHD` (special panel)

## Interaction model
- Compiler commands drive visibility and transitions.
- `aboutMeCommand` in `src/Commands.js` animates panel reveal.
- `closeAboutMe` hides panels.
- Clicking the ADHD panel enters a **Game Mode** UI transform.

## Game Mode (current implementation)
When ADHD panel is clicked:
1. Panels + compiler shrink into keycaps.
2. Keycaps move to bottom keyboard layout:
   - Top row: `Q`, `↑`, `E`
   - Bottom row: `←`, `↓`, `→`
3. Keycap outline animation runs (clockwise draw, slow-fast-slow).
4. Labels fade in.
5. Center game screen appears after timeline completion.

### Input highlighting (implemented)
In Game Mode, these inputs highlight matching keycaps:
- `W` / `ArrowUp` → `↑`
- `A` / `ArrowLeft` → `←`
- `S` / `ArrowDown` → `↓`
- `D` / `ArrowRight` → `→`
- `Q` → `Q`
- `E` → `E`

## Animation system
- GSAP controls Game Mode timeline and key/screen staging.
- Framer Motion still handles draggable cards.
- Homepage compiler drag-control trigger via ADHD trackpad was removed.

## Useful files
- `src/components/Homepage/Base.js`
- `src/components/Homepage/Compiler.js`
- `src/index.css`
- `src/Commands.js`
