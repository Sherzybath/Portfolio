# Homepage Compiler (`src/components/Homepage/Compiler.js`)

## Purpose
Controls command interactions on the home route (`/`).

## Connected pieces
- Input: `src/components/Homepage/CommandInputBox.js`
- Shared actions: `src/Commands.js`
- Parent container: `src/components/Homepage/Base.js`

## Current command map
- `/help` → toggle help/list panel (`handleHelpCommand` / `unhandleHelpCommand`)
- `/aboutme` → toggle info panels (`aboutMeCommand` / `closeAboutMe`)
- `/projects` → route to projects page (`handleTransitionProjects`)

## Visual command list currently shown
- `/aboutME`
- `/projects`
- `/hobbies` (displayed, currently no wired action)
- `/experience` (displayed, currently no wired action)

## State dependencies
- `isHelp`, `setHelp`
- `isPlus`, `setPlus`
- `setOpen` local state for open/close compiler shell

## Notes
- Typed command parsing is lowercase, so `/aboutME` display still maps to `/aboutme`.
- Good future cleanup: either wire `/hobbies` and `/experience` or hide until implemented.
