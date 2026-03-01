# Projects Compiler (`src/components/Projects/Compiler.js`)

## Purpose
Controls command interactions on the project route (`/project`) and switches showcased project modules.

## Connected pieces
- Input: `src/components/Projects/CommandInputBox.js`
- Shared actions: `src/Commands.js`
- Parent container: `src/components/Projects/Project.js`

## Current command map
- `/help` → toggle help/list panel (`helpProject` / `unhandleHelpCommand`)
- `/aboutme` → navigate back to home (`navigate('/')`)
- `/rilli` → set active module to `Rilli`
- `/skillweave` → set active module to `SkillWeave`
- `/rentique` → set active module to `Rentique`

## Display list behavior
- Uses plus/minus icon based on active project (`currentComponent`)
- Shows active styling for selected project command

## Important implementation note
There is a list button using `commands['/eeeeeeeeeeeeeeeeeeeee']` for `/aboutME` display.
- This key does not exist in `commands` map.
- It should be replaced with `commands['/aboutme']`.

## State dependencies
- `currentComponent`, `setCurrentComponent`
- `isHelp`, `setHelp`
- `setSwap` for transition animation timing
