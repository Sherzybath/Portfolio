# Compiler System Overview

The Compiler UI is the command-driven navigation layer of the website.

## Why it matters
This is the core interaction model:
- User types slash commands (`/aboutme`, `/projects`, etc.)
- Command box routes input to mapped handlers
- Handlers trigger navigation, section toggles, and animations

## Main files
- Homepage compiler: `src/components/Homepage/Compiler.js`
- Projects compiler: `src/components/Projects/Compiler.js`
- Shared input behavior: `src/components/Homepage/CommandInputBox.js` and `src/components/Projects/CommandInputBox.js`
- Shared command helpers: `src/Commands.js`

## Flow
1. User types command in `CommandInputBox`
2. Input normalizes command (`trim().toLowerCase()`)
3. Looks up command key in local `commands` object
4. If found → execute handler
5. If not found → show `Incorrect syntax` + shake animation (`onShakeAnimation`)

## Key behavior
- Commands are case-insensitive at input time (lowercased before lookup)
- Help panel visibility is controlled via local state (`isHelp`) + GSAP animation helpers
- Compiler open/close animation is handled through `onLoadAnimation` / `undoLoad`
