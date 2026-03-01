# WorkMDs

Internal documentation hub for `Sherzybath/Portfolio`.

## How to use this folder
- Start here first.
- Then jump to the section relevant to the task.
- Keep docs practical: where code lives, how it works, how to extend safely.

## Navigation
- `PROJECT_NOTES_AARKEIN.md` → quick read-first context + branch/run rules
- `TECH_STACK/README.md` → stack, libraries, runtime model
- `TECH_STACK/FONTS.md` → installed fonts, paths, and usage
- `COMPILER/` → command system (heart of the site)
  - `COMPILER/OVERVIEW.md`
  - `COMPILER/ADDING_NEW_COMMANDS.md`
  - `COMPILER/HOMEPAGE_COMPILER.md`
  - `COMPILER/PROJECTS_COMPILER.md`
- `HOMEPAGE/README.md` → homepage architecture and component map
- `PROJECT_PAGE/README.md` → project page architecture and component map

## Documentation pattern (for future docs)
When adding docs for any major feature:
1. Create a **subdirectory** in `WorkMDs` (UPPERCASE name).
2. Add a `README.md` overview in that subdirectory.
3. Add focused deep-dive files (e.g. setup, flows, extension guides).
4. Link the new files back in this root `WorkMDs/README.md`.

## Writing rules
- Keep language simple and implementation-focused.
- Always include file paths and command examples.
- Add “how to extend” steps for maintainability.
- Prefer real behavior over theory.
