# OpenBook Software Quality Audit

Date reviewed: 2026-05-08

This audit was prepared from a whole-codebase scan of the current repository. It focuses on issues and improvements that can create a large jump in reliability, security, developer velocity, user trust, and product quality.

The most important theme is that the product already has a useful surface area, but several foundations are currently bypassed or incomplete: real build checks are disabled, package manager setup is inconsistent, many UI dependencies are missing from `package.json`, chat APIs accept unvalidated input, most user data is only in `localStorage`, and several advertised features are only partially wired.

## Highest Impact Priorities

1. Restore build, type, lint, and test gates.
2. Fix package manager and dependency drift.
3. Harden `/api/chat`, study routes, rate limits, and model selection.
4. Move spaces, journals, notebooks, study modes, and settings out of browser-only storage.
5. Repair attachments and multimodal chat so the UI matches actual behavior.
6. Reduce bundle size and runtime churn, especially around WebLLM and chat rendering.
7. Close markdown, journal HTML, link, image, and privacy gaps.
8. Replace stale documentation with runnable setup instructions.

## Findings And Improvements

| ID | Area | Severity | Potential issue | High-impact improvement | Agent task |
| --- | --- | --- | --- | --- | --- |
| QG-01 | Quality gates | Resolved | Production builds now enforce checks after TypeScript/ESLint bypasses were removed and errors resolved. | Remove bypasses, add real typecheck/lint/build scripts, and make CI fail on broken checks. | [01-restore-build-quality-gates.md](./agent-improvement-tasks/01-restore-build-quality-gates.md) |
| DEP-02 | Dependencies and package manager | Critical | The repo has both `bun.lock` and `package-lock.json`; scripts require Bun, but README says npm. Many imported packages are missing from `package.json`. | Pick one supported package manager, repair scripts, add missing dependencies or remove unused UI files, and keep one lockfile. | [02-fix-dependency-and-package-manager-drift.md](./agent-improvement-tasks/02-fix-dependency-and-package-manager-drift.md) |
| API-03 | Chat API and rate limiting | Critical | `/api/chat` accepts raw JSON without schema validation, auth is a placeholder, rate limiting is in-memory, and arbitrary client `systemPrompt` can override instructions. | Add request schemas, model/tool allowlists, persistent/user-aware rate limiting, safe errors, and budget controls. | [03-harden-chat-api-and-rate-limits.md](./agent-improvement-tasks/03-harden-chat-api-and-rate-limits.md) |
| AI-04 | Model registry and environment | High | The model picker and provider registry can drift. Example: `neuman-gpt-oss-free` exists in the picker but not in `providers.ts`. Critical env keys are not all in the env schema. | Create one typed model registry used by UI and server; validate required env by enabled provider; return user-safe unavailable states. | [04-unify-ai-model-registry-and-env.md](./agent-improvement-tasks/04-unify-ai-model-registry-and-env.md) |
| DATA-05 | Persistence | Critical | Spaces, journals, notebooks, study modes, user data, and settings are stored in `localStorage`. Data is device-bound, easy to lose, hard to sync, and constrained by browser quota. | Introduce durable storage, authenticated user ownership, sync/migration, export/import, and conflict handling. | [05-move-user-data-to-durable-storage.md](./agent-improvement-tasks/05-move-user-data-to-durable-storage.md) |
| UX-06 | Attachments and multimodal chat | High | The chat input exposes attachment state, but file selection has no real handler or trigger, and messages are sent without attachments. | Implement file picking, validation, previews, upload/storage, AI SDK attachment payloads, persistence, and tests. | [06-repair-attachments-and-multimodal-chat.md](./agent-improvement-tasks/06-repair-attachments-and-multimodal-chat.md) |
| PERF-07 | Performance and bundle size | High | `@mlc-ai/web-llm` is statically imported into the chat path, localStorage writes are broad, markdown keys are random, and chat rendering can grow without virtualization. | Lazy-load heavy providers, measure bundles, debounce storage, stabilize render keys, and virtualize long conversations/search. | [07-improve-performance-and-bundle-size.md](./agent-improvement-tasks/07-improve-performance-and-bundle-size.md) |
| SEC-08 | Markdown, journal, links, privacy | High | Markdown links accept any `new URL` protocol, journal blocks render stored HTML with `dangerouslySetInnerHTML`, external images allow all hosts, and analytics can identify users aggressively. | Restrict protocols and image hosts, sanitize stored HTML consistently, add CSP/security headers, and add privacy controls. | [08-harden-markdown-journal-security.md](./agent-improvement-tasks/08-harden-markdown-journal-security.md) |
| STUDY-09 | Study mode contract | Medium | Study modes are split across route folders, group IDs, enum types, and duplicated proxy routes. Types already disagree in `SpacesContext.tsx`. | Build one study-mode contract and one route handler that injects framework prompts in a predictable, tested way. | [09-rework-study-mode-contract.md](./agent-improvement-tasks/09-rework-study-mode-contract.md) |
| TEST-10 | Test and CI coverage | High | Test files exist and import `bun:test`, but no test script, runner config, or CI workflow exists. Core API/storage/security flows are uncovered. | Add a runnable test stack, CI workflow, and targeted tests for chat, storage, markdown, study modes, attachments, and provider registry. | [10-establish-test-and-ci-coverage.md](./agent-improvement-tasks/10-establish-test-and-ci-coverage.md) |
| DOC-11 | Documentation and onboarding | Medium | README references missing files such as `.env.example`, `docs/overview.md`, `journal_tasks.md`, and root `CONTRIBUTING.md`. Setup instructions conflict with scripts. | Update README, add `.env.example`, document scripts, document AI providers, and create a short architecture guide. | [11-refresh-documentation-and-onboarding.md](./agent-improvement-tasks/11-refresh-documentation-and-onboarding.md) |

## Evidence Highlights

- **Resolved:** `next.config.js` config bypasses (`ignoreBuildErrors` and `ignoreDuringBuilds`) have been removed, enforcing quality gates.
- `package.json` scripts call `bun --bun`, but the environment scan found Bun unavailable and README instructs npm.
- `components/ui` imports packages that are not declared, including many Radix packages, `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, and `vaul`.
- `lib/auth.ts` accepts any non-empty bearer token and is not wired into the main API routes.
- `middleware.ts` uses process-local memory for rate limiting, which does not hold across serverless instances.
- `app/api/chat/route.ts` parses request JSON directly and accepts unvalidated `messages`, `model`, `group`, `timezone`, and `systemPrompt`.
- `contexts/SpacesContext.tsx`, `contexts/JournalContext.tsx`, `contexts/NotebookContext.tsx`, `contexts/StudyModeContext.tsx`, and `contexts/UserContext.tsx` persist important data to `localStorage`.
- `components/features/spaces/input/input-content-box.tsx` has a hidden file input but no file change handler, no visible attach button, and no attachment payload path.
- `hooks/use-web-llm.ts` statically imports `@mlc-ai/web-llm`, increasing the risk that all chat users pay for local-model code.
- `components/features/ai/ai-model-picker.tsx` contains stale implementation notes inside production code and includes at least one model value not present in the server provider map.
- `README.md` references missing setup and documentation files.

## Suggested Execution Order

1. QG-01 and DEP-02 first. These unlock reliable verification for every later task.
2. TEST-10 next, at least with smoke tests around the current behavior.
3. API-03 and AI-04 together, because request validation and model allowlists should share types.
4. SEC-08 before expanding sharing, attachments, or persisted remote content.
5. DATA-05 once quality gates are stable, because persistence touches many user flows.
6. UX-06 and STUDY-09 after API contracts are clearer.
7. PERF-07 after feature behavior is correct, so measurements compare real flows.
8. DOC-11 last in each milestone, so docs describe the actual fixed system.

## Definition Of Done For The Improvement Program

- A fresh clone can install dependencies and run documented scripts successfully.
- `typecheck`, `lint`, `test`, and `build` all run locally and in CI.
- Production builds no longer ignore type or lint errors.
- Core user data survives browser/device changes when signed in.
- API requests are validated before calling model providers.
- Unsupported model/provider choices fail gracefully in UI and API.
- Attachments either work end-to-end or the UI no longer advertises them.
- Markdown, journal content, external links, remote images, analytics, and stored data have explicit security/privacy controls.
- README and docs match the actual commands and files in the repository.
