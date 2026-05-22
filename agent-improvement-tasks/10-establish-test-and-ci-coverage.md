# Task 10 - Establish Test And CI Coverage

## Goal

Create a reliable test setup and CI workflow that protects the highest-risk user flows.

## Evidence

- Several test files exist and import `bun:test`.
- `package.json` has no `test` script.
- No `.github/workflows` directory exists.
- `@testing-library/react`, `@testing-library/jest-dom`, `happy-dom`, and `@happy-dom/global-registrator` are present, but no shared test setup is visible.
- Core API, model registry, storage migration, markdown security, and attachment behavior lack obvious coverage.

## Scope

In scope:

- Unit/component test runner.
- Test setup file.
- CI workflow.
- Initial high-value tests.
- Coverage thresholds only if they help without causing noise.

Out of scope:

- Full end-to-end suite unless the owner approves a browser test dependency.
- Snapshot-heavy visual tests.
- Rewriting all existing tests.

## Subtask Checklist

- [ ] Confirm the test runner based on the package manager decision.
- [ ] Add a top-level `test` script.
- [ ] Add a watch-mode test script.
- [ ] Add shared DOM/test setup.
- [ ] Convert existing tests if changing away from `bun:test`.
- [ ] Make existing tests pass.
- [ ] Add model registry consistency tests.
- [ ] Add chat request schema tests.
- [ ] Add markdown and journal sanitizer tests.
- [ ] Add study framework contract tests.
- [ ] Add chat input command and submit tests.
- [ ] Add attachment tests after task 06 lands.
- [ ] Add storage migration tests after task 05 lands.
- [ ] Add CI workflow for install, typecheck, lint, test, and build.
- [ ] Ensure provider-dependent tests use mocks rather than real API keys.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Confirm runner | Use the package-manager decision to choose Bun test or Vitest. Do not mix both unless intentionally transitioning. | The test runner choice is clear in `package.json`. |
| Add test script | Add a standard `test` script so every agent can run the suite the same way. | `npm run test` or equivalent exists. |
| Add watch script | Add a watch-mode script for local development. | Developers can run tests continuously. |
| Add setup | Configure DOM environment, testing-library matchers, and shared mocks. | Component tests can render without repeated setup code. |
| Convert existing tests | If changing runners, update imports and APIs in existing tests carefully. | Existing tests run under the new runner. |
| Make tests pass | Fix mocks/config issues before adding many new tests. | Baseline suite is green. |
| Add registry tests | After task 04, prove UI and server models share one valid registry. | Model drift fails tests. |
| Add schema tests | After task 03, test valid and invalid API request bodies. | Validation cannot be removed silently. |
| Add sanitizer tests | After task 08, test unsafe markdown and journal payloads. | XSS regressions fail tests. |
| Add study tests | After task 09, test framework registry and prompt mapping. | Study-mode drift fails tests. |
| Add chat input tests | Test Enter submit and slash command menu behavior. | Core chat input interactions are protected. |
| Add attachment tests | After task 06, test file add/remove/send behavior. | Attachment regressions fail tests. |
| Add storage tests | After task 05, test migration and ownership behavior. | Data-loss and cross-user bugs are caught. |
| Add CI workflow | Run install, typecheck, lint, tests, and build in GitHub Actions. | Pull requests get automated feedback. |
| Mock providers | Ensure tests never call real OpenAI/Google/Groq/etc. APIs. | CI can run without secrets. |

## Detailed Low-Level Subtasks

- [ ] Open `package.json` and confirm whether a `test` script exists.
- [ ] List every existing `*.test.ts` and `*.test.tsx` file.
- [ ] Open one existing test and confirm whether it imports `bun:test`.
- [ ] Decide the test runner based on task 02 package manager.
- [ ] If keeping Bun, add `test:watch` if supported.
- [ ] If moving to Vitest, add Vitest dependencies.
- [ ] If moving to Vitest, create `vitest.config.ts`.
- [ ] If moving to Vitest, create a shared test setup file.
- [ ] If moving to Vitest, replace `bun:test` imports with Vitest imports.
- [ ] Add DOM environment setup using `happy-dom` or the chosen environment.
- [ ] Add `@testing-library/jest-dom` setup if using compatible assertions.
- [ ] Run existing tests once without changing product code.
- [ ] Fix broken mocks one at a time.
- [ ] Avoid deleting failing tests unless they test removed behavior.
- [ ] Add tests for model registry consistency after task 04 exists.
- [ ] Add tests for chat request schema after task 03 exists.
- [ ] Add tests for unsafe markdown protocols after task 08 exists.
- [ ] Add tests for journal sanitizer after task 08 exists.
- [ ] Add tests for study framework registry after task 09 exists.
- [ ] Add tests for chat input Enter submit.
- [ ] Add tests for `/model` command opening model picker.
- [ ] Add tests for `/frameworks` command opening framework picker.
- [ ] Add tests for `/compact` command opening confirmation when props exist.
- [ ] Add tests for attachment add/remove after task 06 exists.
- [ ] Add tests for storage migration after task 05 exists.
- [ ] Create `.github/workflows/ci.yml`.
- [ ] In CI, add checkout step.
- [ ] In CI, add Node/package-manager setup step.
- [ ] In CI, add dependency install step.
- [ ] In CI, run typecheck.
- [ ] In CI, run lint.
- [ ] In CI, run tests.
- [ ] In CI, run build.
- [ ] Ensure tests mock AI provider calls and never require real API keys.
- [ ] Run all CI commands locally in the same order.
- [ ] Add a handoff note with test count and skipped/deferred tests.

## Likely Files

- `package.json`
- New test config, for example `vitest.config.ts` if choosing Vitest.
- New setup file, for example `test/setup.ts`
- `.github/workflows/ci.yml`
- Existing test files under `app`, `components`, and `contexts`
- New tests for API/schema/security/registry

## Implementation Steps

1. Align with task 02 package manager decision.
2. If the project keeps Bun:
   - Add `"test": "bun test"`.
   - Add shared setup for DOM APIs.
   - Keep existing `bun:test` imports.
3. If the project chooses npm:
   - Install Vitest.
   - Convert `bun:test` imports to Vitest equivalents.
   - Add `vitest.config.ts` with `happy-dom` environment.
   - Add a setup file for `@testing-library/jest-dom`.
4. Add scripts:

   ```json
   "test": "vitest run"
   "test:watch": "vitest"
   ```

   Adjust names if using Bun, but keep the same top-level `test` script.
5. Make existing tests pass without over-mocking real bugs.
6. Add high-value unit tests:
   - Model registry UI/server consistency.
   - Chat request schema accepts valid requests and rejects invalid ones.
   - Markdown link sanitizer rejects unsafe protocols.
   - Journal sanitizer strips script/event attributes.
   - Study framework registry rejects invalid values.
7. Add high-value component tests:
   - Chat input submits normal text.
   - Chat input handles `/model`, `/frameworks`, and `/compact` commands.
   - Attachment add/remove behavior from task 06.
   - Search modal navigates to journal and space results.
8. Add storage tests:
   - Existing `localStorage` keys migrate safely.
   - Clear storage removes only OpenBook keys.
9. Add CI:
   - Checkout.
   - Setup Node.
   - Install dependencies with the selected package manager.
   - Run format check if desired.
   - Run typecheck.
   - Run lint.
   - Run tests.
   - Run build.
10. Keep CI secrets out of the workflow. API-provider tests should mock providers.

## Acceptance Criteria

- `npm run test` or selected equivalent runs all committed tests.
- CI runs on pull requests and pushes to main branches.
- Existing tests pass.
- New tests cover the highest-risk code paths.
- Provider/API-key-dependent tests use mocks.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

If GitHub Actions is added, verify the YAML syntax and run the same commands locally before pushing.

## Notes For The Agent

Start with a small suite that catches real regressions. Do not chase arbitrary coverage percentage before the core flows are protected.
