# Project Page Architecture

## Entry
- Route: `/project`
- File: `src/components/Projects/Project.js`

## Main responsibility
Hosts project showcase modules and lets user switch them via compiler commands.

## Major children
- `Compiler` (project command navigator)
- `Rilli`
- `SkillWeave`
- `Rentique`

## Interaction model
- Commands switch `currentComponent`
- Transition layers (`slide-in` / `slide-out`) animate project swaps
- Theme variables change per selected project via GSAP

## Key state
- `currentComponent`
- `isSwap`
- `isHelp`

## Useful files
- `src/components/Projects/Project.js`
- `src/components/Projects/Compiler.js`
- `src/Commands.js`
- `WorkMDs/PROJECT_PAGE/TRANSITIONS_AND_SWAPS.md`
