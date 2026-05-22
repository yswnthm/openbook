# Task 01 - Restore Build Quality Gates

## Goal

Make the repository fail fast when TypeScript, ESLint, tests, or production build checks fail. The current configuration allows broken code to ship.

## Evidence

- `next.config.js` sets `typescript.ignoreBuildErrors: true`.
- `next.config.js` sets `eslint.ignoreDuringBuilds: true`.
- `package.json` has no `typecheck` script.
- `package.json` has no `test` script even though test files exist.
- `package.json` uses `next lint`, which is not the best long-term command for modern ESLint flat config and Next.js 15.

## Scope

In scope:

- Build, lint, typecheck, and test scripts.
- Next.js build config.
- ESLint config fixes needed to make lint meaningful.
- Small type fixes needed to pass typecheck.

Out of scope:

- Large feature refactors.
- Moving persistence to a backend.
- Full security hardening.

If the project cannot install or resolve dependencies, complete task 02 first, then return to this task.

## Subtask Checklist

- [x] Audit current scripts and confirm which commands are expected to run locally.
- [x] Add or repair `typecheck`, `lint`, `lint:fix`, `test`, and `build` scripts.
- [x] Remove build bypasses from `next.config.js`.
- [x] Run typecheck and list every blocking error by file.
- [x] Fix import/type errors without adding suppressions.
- [x] Run lint and fix actionable violations.
- [x] Confirm the test command runs with the selected runner.
- [x] Run a production build with TypeScript and ESLint checks enabled.
- [x] Document any remaining failures as separate follow-up tasks instead of hiding them.
- [x] Leave a short handoff note with commands run and remaining risk.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Audit current scripts | Read the current `package.json` scripts and note how developers are expected to start, lint, test, and build the app today. This prevents replacing commands blindly. | Your notes contain the original script names and commands. |
| Add or repair scripts | Add stable script names for `typecheck`, `lint`, `lint:fix`, `test`, and `build`. Use the package manager selected in task 02. | Running each script starts the expected tool instead of failing because the script is missing. |
| Remove build bypasses | Delete the config that tells Next.js to ignore TypeScript and ESLint errors during production builds. | `ignoreBuildErrors` and `ignoreDuringBuilds` no longer appear in the repo. |
| Run typecheck and list errors | Run the typecheck command once before fixing anything. Group errors by root cause, such as missing package, bad local type, or stale generated file. | A short error inventory exists in your notes or handoff. |
| Fix import/type errors | Fix the smallest code or dependency problem that causes each type error. Avoid changing runtime behavior unless the type error reveals a real bug. | Typecheck progresses with fewer errors after each fix group. |
| Run lint and fix violations | Run lint after typecheck is mostly clean. Fix unused imports, hooks mistakes, unreachable code, and syntax/style issues that indicate maintainability risks. | Lint exits successfully without new broad rule disables. |
| Confirm test command | Make sure `npm run test` or the chosen equivalent discovers and executes tests. Do not require real provider API keys for tests. | The test runner starts and reports pass/fail results. |
| Run production build | Run the real build after typecheck, lint, and tests. This verifies Next.js can compile with checks turned on. | Build completes without relying on ignored TypeScript or ESLint errors. |
| Document remaining failures | If a failure is too large for this task, create or reference a follow-up task instead of re-enabling bypasses. | No hidden failure remains in config; deferred work is explicit. |
| Handoff note | Summarize changed scripts, config removals, commands run, and any known residual risk. | Another agent can continue without re-discovering your work. |

## Detailed Low-Level Subtasks

- [x] Open `package.json` and copy the existing `scripts` section into your notes.
- [x] Open `next.config.js` and locate `typescript.ignoreBuildErrors`.
- [x] Open `next.config.js` and locate `eslint.ignoreDuringBuilds`.
- [x] Open `eslint.config.mjs` and confirm it uses flat config.
- [x] Open `tsconfig.json` and confirm `strict` is enabled.
- [x] If task 02 is not complete, write down whether scripts currently use npm or Bun before changing anything.
- [x] Edit `package.json` so `typecheck` runs `tsc --noEmit`.
- [x] Edit `package.json` so `lint` runs the repo ESLint command directly.
- [x] Edit `package.json` so `lint:fix` runs the same lint command with `--fix`.
- [x] Edit `package.json` so `test` exists, even if the first implementation only runs the selected test runner.
- [x] Edit `next.config.js` and remove the full `typescript` ignore block.
- [x] Edit `next.config.js` and remove the full `eslint` ignore block.
- [x] Run the typecheck command once.
- [x] Copy the first group of typecheck failures into your notes.
- [x] If failures are missing packages, pause this task and complete task 02 first.
- [x] If failures are bad local types, fix the smallest local type mismatch.
- [x] Re-run typecheck after each small group of fixes.
- [x] Run the lint command once.
- [x] Fix lint failures that indicate real bugs, unused imports, invalid hooks, or unreachable code.
- [x] Do not disable a lint rule globally unless the same rule creates repeated false positives across the project.
- [x] Run the test command once and confirm tests are discoverable.
- [x] Run the build command once after typecheck, lint, and tests pass.
- [x] If build fails from env variables, document required env and add safe defaults only where appropriate.
- [x] Search for `ignoreBuildErrors` and confirm it no longer exists.
- [x] Search for `ignoreDuringBuilds` and confirm it no longer exists.
- [x] Search for new `@ts-ignore` or broad ESLint-disable comments and remove any added shortcuts.
- [x] Record final command results in the handoff note.

## Likely Files

- `next.config.js`
- `package.json`
- `eslint.config.mjs`
- `tsconfig.json`
- Existing files reported by typecheck or lint

## Implementation Steps

1. Confirm the selected package manager from task 02. If task 02 has not been completed, inspect `package.json`, `package-lock.json`, `bun.lock`, and README before deciding how scripts should run.
2. Add a real typecheck script:

   ```json
   "typecheck": "tsc --noEmit"
   ```

3. Replace `next lint` usage with a command that works with the existing flat config:

   ```json
   "lint": "eslint ."
   "lint:fix": "eslint . --fix"
   ```

4. Add or repair a test script. If the project stays on Bun, use `bun test`. If it moves to npm/Vitest, install and configure Vitest or another selected test runner in task 10.
5. Remove these bypasses from `next.config.js`:

   ```js
   typescript: {
     ignoreBuildErrors: true,
   },
   eslint: {
     ignoreDuringBuilds: true,
   },
   ```

6. Run typecheck and fix actual errors instead of suppressing them. Known likely errors include:
   - Missing dependencies from generated `components/ui` files.
   - `SearchGroupId` not matching `groupTools` and `groupInstructions`.
   - `SpacesContext` study mode type not matching `StudyFramework`.
   - Message types using broad `any`.
7. Keep fixes narrow. If a file imports an unused generated UI component that causes missing dependencies, either add the dependency through task 02 or remove the unused component from the repo.
8. Run lint and fix only meaningful issues. Do not turn off rules globally unless there is a clear project-wide reason.
9. Run production build after typecheck and lint pass.
10. Update `SOFTWARE_QUALITY_AUDIT.md` only if this task changes the recommended commands or findings.

## Acceptance Criteria

- `next.config.js` no longer ignores TypeScript or ESLint failures.
- `package.json` contains working `typecheck`, `lint`, `lint:fix`, `test`, and `build` scripts.
- A fresh install can run typecheck, lint, tests, and build.
- No new `@ts-ignore`, broad rule disables, or build bypasses are introduced.
- Remaining failures, if any, are tracked in separate explicit task docs and not hidden by config.

## Verification

Run these commands with the selected package manager:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Also inspect:

```bash
git diff -- next.config.js package.json eslint.config.mjs tsconfig.json
```

## Notes For The Agent

This task is a foundation task. It may expose many existing problems. Fix the smallest set needed to make checks honest. Do not widen the task into product behavior changes unless a check cannot pass without them.

## Handoff Note

- **Changed Scripts:** `package.json` has `typecheck` (`tsc --noEmit`), `lint` (`eslint .`), `lint:fix` (`eslint . --fix`), `test` (`bun test`), and `build` (`bun --bun next build`).
- **Configuration Changes:** Removed `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` blocks from `next.config.js`.
- **Harden Environment & Mocks:** Introduced `test-setup.ts` to initialize Happy DOM, configure `ResizeObserver` mockup, set `window.location.href = "http://localhost/"` for Next.js Image url validation in tests.
- **Fixed Issues:**
  - Resolved leaking Bun mocks in sidebar and layouts by mocking modules inline per test file.
  - Cleared all compiler and static analyzer unused imports, variables, and properties using safe object deletes or underscoring.
- **Validation Run:**
  - Typecheck: `/Users/yswnth/.bun/bin/bun run typecheck` (tsc --noEmit) passes successfully.
  - Lint: `/Users/yswnth/.bun/bin/bun run lint` exits with 0 errors (99 warnings).
  - Tests: `/Users/yswnth/.bun/bin/bun test` executes 17/17 tests passing.
  - Production Build: `PATH="/Users/yswnth/.bun/bin:$PATH" /Users/yswnth/.bun/bin/bun run build` builds the production Next.js bundle successfully.
