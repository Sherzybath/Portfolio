# Project Page Transition & Swap Logic

This documents how project switching works on `/project` after the Rentique transition fix.

## Files involved
- `src/components/Projects/Project.js`
- `src/components/Projects/Compiler.js`

## Core idea
Project switches no longer depend on a `true/false` swap flag.
They use an incrementing counter (`swapTick`) so every switch forces a fresh transition mount.

## Current flow
1. User runs a project command in compiler (`/rilli`, `/skillweave`, `/rentique`).
2. Compiler calls `triggerSwap()` from parent.
3. Parent increments `swapTick`.
4. `swapTick` is used in `key` values for transition layers:
   - `key={swapTick + "-in"}`
   - `key={swapTick + "-out"}`
5. Compiler schedules `setCurrentComponent(target)` after `900ms`.

Because keys always change, transition layers remount reliably on every switch.

## Why this fixed the bug
Before: a boolean `isSwap` was set `true` then reset too quickly, causing race/timing issues where transitions sometimes didn't fire (notably `Rilli -> Rentique` / `SkillWeave -> Rentique`).

Now: each switch increments a counter, so transition re-trigger is deterministic.

## Command handler helper
`Compiler.js` uses `runProjectSwap(targetComponent, closeCompiler=false)` to keep switch behavior consistent.

## Tuning points
- Transition start timing: in `Compiler.js` timeout before `setCurrentComponent` (currently `900ms`).
- Transition animation itself: in `Project.js` motion props for `.slide-in` and `.slide-out`.

## Safety notes
- Keep all project switch commands routed through `runProjectSwap`.
- If adding new projects, add command + call `runProjectSwap('NewProjectName')`.
