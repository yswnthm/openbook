# Task 02 - Fix Dependency And Package Manager Drift

## Goal

Make installation deterministic and make imported packages match `package.json`. The current repo mixes package managers and contains imports for packages that are not declared.

## Evidence

- `package.json` scripts use `bun --bun`.
- README setup uses `npm install` and `npm run dev`.
- Both `bun.lock` and `package-lock.json` exist.
- A static import scan found undeclared imports from `components/ui`, including many Radix packages, `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, and `vaul`.
- Test files import `bun:test`, but no Bun dependency or test script is documented.

## Scope

In scope:

- Package manager decision.
- Lockfile cleanup.
- Missing dependencies.
- Package scripts that reference the chosen package manager.
- Unused generated UI components if removing them is better than installing unused dependencies.

Out of scope:

- Feature behavior.
- API contract changes.
- Deep visual redesign.

## Subtask Checklist

- [ ] Decide and document the single package manager.
- [ ] Align all `package.json` scripts with that package manager.
- [ ] Remove the unused lockfile after regenerating the chosen lockfile.
- [ ] Inventory all bare imports from source files.
- [ ] Compare imports against `dependencies` and `devDependencies`.
- [ ] Add missing dependencies that are needed by used files.
- [ ] Remove unused generated UI files instead of installing unused packages when appropriate.
- [ ] Remove clearly unused dependencies after confirming they are not runtime/config requirements.
- [ ] Run a fresh install and confirm it succeeds.
- [ ] Run typecheck/build to confirm all imports resolve.
- [ ] Update README setup commands if they changed.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Decide package manager | Compare `package.json`, lockfiles, README, and available tooling. Pick npm or Bun and make that choice explicit before editing. | The repo has one documented package manager decision. |
| Align scripts | Rewrite scripts so they use the selected package manager or plain local binaries consistently. | No script calls the unselected package manager. |
| Remove unused lockfile | Keep only the lockfile for the selected package manager after reinstalling. | Exactly one lockfile remains. |
| Inventory imports | Scan source files for bare package imports, excluding relative imports, aliases, and Node built-ins. | You have a list of packages the source actually imports. |
| Compare against dependencies | Check every imported package against `dependencies` and `devDependencies`. | Missing and unused package candidates are listed. |
| Add needed missing dependencies | For packages used by live source files, add the correct dependency entry and regenerate the lockfile. | Typecheck no longer fails because that package cannot be resolved. |
| Remove unused generated UI files | If a missing dependency is only used by a component that nothing imports, remove that unused file instead of adding dead package weight. | Deleted files have no remaining imports. |
| Remove clearly unused dependencies | Remove packages only after confirming they are not imported, required by config, or intentionally reserved. | Lockfile and package file reflect only needed dependencies. |
| Run fresh install | Install from scratch or as close to fresh as possible with the selected manager. | Install completes without mixed-lockfile warnings or missing package errors. |
| Run typecheck/build | Verify dependency changes resolve imports during actual project checks. | Typecheck and build get past module-resolution errors. |
| Update README | Make setup commands match the final package manager and scripts. | A new contributor can follow README commands as written. |

## Detailed Low-Level Subtasks

- [ ] Open `package.json` and note whether scripts call `npm`, `bun`, or plain binaries.
- [ ] Open `README.md` and note the documented install and dev commands.
- [ ] Check whether `package-lock.json` exists.
- [ ] Check whether `bun.lock` exists.
- [ ] Choose one package manager and write the choice at the top of your notes.
- [ ] If choosing npm, replace `bun --bun next dev --turbopack` with `next dev --turbopack`.
- [ ] If choosing npm, replace `bun --bun next build` with `next build`.
- [ ] If choosing npm, replace `bun --bun next start` with `next start`.
- [ ] If choosing npm, replace analyzer scripts so they do not call Bun.
- [ ] If choosing Bun, update README prerequisites to say Bun is required.
- [ ] If choosing Bun, make sure every script can run through `bun run`.
- [ ] Run an import inventory script or use `rg` to list all non-relative package imports.
- [ ] Create a temporary list of every imported package name.
- [ ] Compare the list against `dependencies` and `devDependencies`.
- [ ] For each missing package, run `rg` for that package name to see which files use it.
- [ ] If a missing package is used by a currently imported component, add it to `package.json`.
- [ ] If a missing package is used only by unused generated UI files, decide whether to delete those files.
- [ ] Before deleting any UI file, run `rg` for its component name and file path.
- [ ] Do not delete a file if any app/component imports it.
- [ ] After dependency changes, run the selected install command.
- [ ] Confirm the chosen lockfile changed.
- [ ] Remove the unchosen lockfile.
- [ ] Run `npm run typecheck` or the selected equivalent.
- [ ] Run `npm run build` or the selected equivalent.
- [ ] Update README commands to match the final scripts.
- [ ] Add a handoff note listing packages added and files removed, if any.

## Likely Files

- `package.json`
- `package-lock.json`
- `bun.lock`
- `README.md`
- `components/ui/*`
- `tsconfig.json`

## Implementation Steps

1. Decide the package manager. Recommendation: use npm unless the owner explicitly wants Bun, because README already documents npm and this workspace did not have Bun available.
2. If choosing npm:
   - Replace `bun --bun next dev --turbopack` with `next dev --turbopack`.
   - Replace `bun --bun next build` with `next build`.
   - Replace `bun --bun next start` with `next start`.
   - Replace `ANALYZE=true bun --bun run build` with an npm-compatible analyzer command.
   - Remove `bun.lock` after confirming `package-lock.json` is updated.
3. If choosing Bun:
   - Update README to say Bun is required.
   - Add `test`, `typecheck`, and lint scripts using Bun.
   - Remove `package-lock.json` after confirming `bun.lock` is updated.
4. Generate a clean dependency report. Use a script or tool to list bare imports in source files and compare them with `package.json`.
5. For every undeclared import, choose one:
   - Add the dependency if the component is used or should stay available.
   - Delete the unused generated component if it is not used anywhere and keeping it creates dependency bloat.
6. Known undeclared package candidates to resolve:
   - `@radix-ui/react-accordion`
   - `@radix-ui/react-alert-dialog`
   - `@radix-ui/react-aspect-ratio`
   - `@radix-ui/react-avatar`
   - `@radix-ui/react-checkbox`
   - `@radix-ui/react-collapsible`
   - `@radix-ui/react-context-menu`
   - `@radix-ui/react-dropdown-menu`
   - `@radix-ui/react-label`
   - `@radix-ui/react-menubar`
   - `@radix-ui/react-navigation-menu`
   - `@radix-ui/react-popover`
   - `@radix-ui/react-progress`
   - `@radix-ui/react-radio-group`
   - `@radix-ui/react-scroll-area`
   - `@radix-ui/react-select`
   - `@radix-ui/react-slider`
   - `@radix-ui/react-switch`
   - `@radix-ui/react-tabs`
   - `@radix-ui/react-toast`
   - `@radix-ui/react-toggle`
   - `@radix-ui/react-toggle-group`
   - `@radix-ui/react-tooltip`
   - `cmdk`
   - `embla-carousel-react`
   - `input-otp`
   - `react-day-picker`
   - `react-hook-form`
   - `react-resizable-panels`
   - `recharts`
   - `vaul`
7. Remove packages that are declared but not imported unless they are required by runtime config or planned near-term work. Be conservative with AI SDK packages.
8. Reinstall dependencies with the selected package manager to update the remaining lockfile.
9. Run typecheck and build. If errors remain because of generated UI files, either add missing dependencies or remove those files.

## Acceptance Criteria

- The repo has one package manager story and one lockfile.
- README setup commands match `package.json`.
- No source import points to an undeclared package.
- `npm install` or the selected equivalent succeeds on a fresh clone.
- `npm run typecheck` and `npm run build` can resolve all imports.

## Verification

```bash
npm install
npm run typecheck
npm run build
```

Run a dependency scan again and confirm there are no undeclared imports. If using `knip`, update config if necessary and run:

```bash
npm run knip
```

## Notes For The Agent

Do not keep both lockfiles. Mixed lockfiles make future installs non-reproducible and make dependency bugs difficult to debug.
