# Task 11 - Refresh Documentation And Onboarding

## Goal

Make setup, environment configuration, scripts, architecture, and contribution docs match the actual repository.

## Evidence

- README says to copy `.env.example`, but no `.env.example` exists.
- README links to missing docs:
  - `docs/overview.md`
  - `docs/ai-models.md`
  - `docs/form-component.md`
  - `docs/search-functionality.md`
  - `docs/project-structure.md`
- README links to `./CONTRIBUTING.md`, but the file exists at `docs/CONTRIBUTING.md`.
- README mentions npm while `package.json` scripts use Bun.
- README advertises providers/features that are not consistently wired in the current code.

## Scope

In scope:

- README setup and feature accuracy.
- `.env.example`.
- Contribution link and local workflow.
- Short architecture docs.
- AI provider/model docs.
- Known limitations.

Out of scope:

- Marketing copy rewrite.
- Large design docs for future features.
- API docs for endpoints that are still changing under tasks 03 and 04.

## Subtask Checklist

- [ ] Audit every README command and link.
- [ ] Update setup instructions to match the selected package manager.
- [ ] Add or update `.env.example` with all provider and public env vars.
- [ ] Fix the contributing guide link or move the file.
- [ ] Create missing docs referenced by README or remove stale references.
- [ ] Add a concise product overview document.
- [ ] Add a project structure document.
- [ ] Add AI model/provider documentation after task 04.
- [ ] Add search documentation covering local and provider-backed search.
- [ ] Add security/privacy documentation after task 08.
- [ ] Update feature claims so they match implemented behavior.
- [ ] Add known limitations for incomplete or local-only features.
- [ ] Add troubleshooting for env keys, install issues, local models, and builds.
- [ ] Verify all relative markdown links resolve.
- [ ] Follow the README from a clean install path and note any gaps.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Audit README commands | List every command shown to users and compare each with `package.json`. | README contains no stale commands. |
| Update setup instructions | Rewrite prerequisites, install, dev, test, lint, typecheck, and build steps for the selected package manager. | Fresh contributors can follow setup without guessing. |
| Add `.env.example` | Create a template containing every supported env var with empty values and helpful comments. | `cp .env.example .env.local` works as documented. |
| Fix contributing link | Point README to the real contributing guide or move the guide to the linked location. | The contributing link resolves locally. |
| Create missing docs | Either create docs the README references or remove stale links. | README has no broken relative links. |
| Add overview doc | Explain what OpenBook does and how chat, spaces, journals, study modes, and search fit together. | A new agent can understand the product shape quickly. |
| Add structure doc | Describe key directories and ownership boundaries. | Agents know where to look before editing. |
| Add AI docs | After task 04, document providers, model registry, env keys, and unavailable states. | Model/provider setup is discoverable. |
| Add search docs | Explain local search versus provider-backed search tools and their API key needs. | Search behavior is not confused with web search by default. |
| Add security docs | After task 08, document content sanitization, link policy, image policy, and analytics choices. | Security decisions are easy to review. |
| Update feature claims | Remove or qualify README claims for features that are partial, local-only, or not wired. | Docs describe current product behavior, not aspirations. |
| Add known limitations | Clearly list incomplete areas such as local-only persistence or partial attachments when applicable. | Users are not surprised by missing behavior. |
| Add troubleshooting | Include fixes for missing env keys, install problems, local model support, and build failures. | Common setup issues have a first place to check. |
| Validate links | Run a local markdown link check or equivalent script. | All relative links resolve. |
| Follow clean setup | Read and execute the README flow from a clean install perspective. | Any confusing step is fixed or documented. |

## Detailed Low-Level Subtasks

- [ ] Open `README.md`.
- [ ] Make a list of every command shown in README.
- [ ] Make a list of every relative markdown link in README.
- [ ] Check whether `.env.example` exists.
- [ ] Check whether every linked doc file exists.
- [ ] Check whether root `CONTRIBUTING.md` exists.
- [ ] Compare README install command with final task 02 package manager.
- [ ] Compare README dev command with final `package.json` script.
- [ ] Compare README build command with final `package.json` script.
- [ ] Compare README test/lint/typecheck commands with final scripts.
- [ ] Create `.env.example` if missing.
- [ ] Add every server provider key from `lib/env/server.ts` to `.env.example`.
- [ ] Add every public key from `lib/env/client.ts` to `.env.example`.
- [ ] Add comments marking optional provider keys.
- [ ] Keep every secret value empty in `.env.example`.
- [ ] Fix the contributing link to point to the real file.
- [ ] If keeping contributing docs under `docs`, update README link.
- [ ] If moving contributing docs to root, keep a docs link or redirect note.
- [ ] Create `docs/overview.md` if README links to it.
- [ ] In overview, document chat, spaces, journals, study modes, and search.
- [ ] Create `docs/project-structure.md` if README links to it.
- [ ] In project structure docs, describe `app`, `components`, `contexts`, `hooks`, `lib`, `data`, and `public`.
- [ ] Create or update `docs/ai-models.md` after task 04.
- [ ] In AI docs, list providers, env keys, local models, and unavailable-provider behavior.
- [ ] Create or update `docs/search-functionality.md`.
- [ ] In search docs, separate local search from AI/search-provider tools.
- [ ] Create or update attachment docs only after task 06 behavior is true.
- [ ] Create or update storage/sync docs only after task 05 behavior is true.
- [ ] Add a "Known limitations" section for any feature still local-only or partial.
- [ ] Remove feature claims that are not currently implemented.
- [ ] Add troubleshooting for missing env keys.
- [ ] Add troubleshooting for dependency install failures.
- [ ] Add troubleshooting for local WebLLM/WebGPU support.
- [ ] Add troubleshooting for typecheck/build failures.
- [ ] Run a markdown link validation script.
- [ ] Read the README from top to bottom as a new contributor and fix confusing steps.
- [ ] Add a handoff note listing docs created, links fixed, and claims intentionally removed.

## Likely Files

- `README.md`
- `.env.example`
- `docs/overview.md`
- `docs/ai-models.md`
- `docs/search-functionality.md`
- `docs/project-structure.md`
- `docs/security.md`
- `docs/CONTRIBUTING.md`
- `SOFTWARE_QUALITY_AUDIT.md` if priorities change

## Implementation Steps

1. Wait until task 02 decides the package manager. Documentation must match actual scripts.
2. Update README setup:
   - Required Node version.
   - Required package manager.
   - Install command.
   - Dev command.
   - Build command.
   - Test/typecheck/lint commands.
3. Add `.env.example` with every documented env var from `lib/env/server.ts`, `lib/env/client.ts`, and provider registry:

   ```bash
   OPENAI_API_KEY=
   OPENROUTER_API_KEY=
   HF_TOKEN=
   GOOGLE_GENERATIVE_AI_API_KEY=
   GROQ_API_KEY=
   CEREBRAS_API_KEY=
   TAVILY_API_KEY=
   EXA_API_KEY=
   NEXT_PUBLIC_POSTHOG_KEY=
   NEXT_PUBLIC_POSTHOG_HOST=
   ```

   Keep secrets empty. Add comments for optional providers.
4. Fix broken links:
   - Either create the linked docs or remove the links.
   - Point contribution link to `docs/CONTRIBUTING.md` or move the file to root.
5. Create `docs/overview.md`:
   - What OpenBook does.
   - Main user flows: chat, spaces, journals, study modes, search.
   - Current storage model and any known limitations.
6. Create `docs/project-structure.md`:
   - `app`
   - `components`
   - `contexts`
   - `hooks`
   - `lib`
   - `data`
   - `public`
   - `agent-improvement-tasks`
7. Create or update `docs/ai-models.md` after task 04:
   - Explain model registry.
   - Explain provider env vars.
   - Explain unavailable provider behavior.
   - Explain local models if WebLLM remains supported.
8. Create `docs/search-functionality.md`:
   - Explain local search across spaces and journals.
   - Explain academic/web search tools if enabled.
   - Document API key requirements.
9. Update feature list so it does not overclaim:
   - Attachments only if task 06 is complete.
   - Auth/sync only if task 05 is complete.
   - Providers only if task 04 confirms them.
10. Add troubleshooting:
   - Missing env keys.
   - Dependency install issues.
   - Local model/WebGPU support.
   - Build/typecheck failures.

## Acceptance Criteria

- A new contributor can follow README from a fresh clone and run the app.
- `.env.example` exists and covers all configured provider keys.
- README has no broken relative links.
- Docs match the selected package manager.
- Feature claims match implemented behavior.

## Verification

```bash
npm run typecheck
npm run test
npm run build
```

Documentation checks:

- Click every README relative link.
- Compare `.env.example` against env schema and provider registry.
- Follow setup steps in a fresh clone or clean worktree.

## Notes For The Agent

Do not document aspirational behavior as current behavior. Use a "Known limitations" section when the product direction is clear but implementation is not complete yet.
