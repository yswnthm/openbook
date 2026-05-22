# Task 07 - Improve Performance And Bundle Size

## Goal

Reduce initial chat bundle size, improve long-conversation rendering, and remove avoidable runtime churn.

## Evidence

- `hooks/use-web-llm.ts` statically imports `@mlc-ai/web-llm`, and `ChatClient.tsx` imports that hook for all chat users.
- `contexts/SpacesContext.tsx` persists the full spaces payload to `localStorage` whenever spaces change.
- `JournalContext.tsx` persists full journal entries whenever entries change.
- `components/features/spaces/chat/markdown.tsx` creates random keys during render, causing remount churn.
- Markdown cache keys use content length and the first 50 characters, which can collide for different content.
- `ChatClient.tsx` contains many unguarded `console.log` calls in render/effect paths.
- Long message lists are rendered directly without virtualization.

## Scope

In scope:

- Bundle measurement.
- Dynamic imports for heavy optional features.
- Render stability for markdown/messages.
- Storage write throttling/debouncing.
- Long-list performance.
- Console cleanup.

Out of scope:

- Product redesign.
- Replacing the AI SDK.
- Backend persistence, except to coordinate with task 05.

## Subtask Checklist

- [ ] Capture baseline bundle analyzer output for `/chat`.
- [ ] Capture baseline behavior for a long seeded conversation.
- [ ] Dynamically import WebLLM only after a `local-*` model is selected.
- [ ] Confirm normal chat bundles no longer include WebLLM code.
- [ ] Preserve local model loading progress after dynamic import.
- [ ] Replace random markdown render keys with stable keys or no unnecessary keys.
- [ ] Replace collision-prone markdown cache keys with full-content keys or stable hashes.
- [ ] Debounce or scope full workspace persistence writes.
- [ ] Remove production console logs from hot render/effect paths.
- [ ] Add virtualization or another long-list strategy for large conversations if needed.
- [ ] Re-run analyzer and record before/after results.
- [ ] Add focused tests for any changed rendering/cache behavior.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Capture bundle baseline | Run the analyzer before edits and record relevant `/chat` bundle sizes and large chunks. | Before/after comparison is possible. |
| Capture long-chat baseline | Seed or create a long conversation and observe scroll/render responsiveness before edits. | Performance changes can be judged against a baseline. |
| Dynamic import WebLLM | Move WebLLM loading behind local-model selection so normal users do not download local-model code. | WebLLM chunk is absent from default chat load. |
| Confirm normal bundle | Re-run analyzer or inspect loaded chunks to prove default model path avoids WebLLM. | Default chat load does not request WebLLM assets. |
| Preserve local progress | Keep the current local model loading UI while the dynamically imported engine initializes. | Local model selection still shows progress and completion. |
| Stabilize markdown keys | Remove random keys that force React to remount rendered markdown unnecessarily. | Markdown output uses stable keys or no unnecessary keys. |
| Fix cache keys | Use full content or a stable full-content hash so two messages with same prefix do not collide. | Cache cannot return another message's processed markdown. |
| Debounce persistence writes | Reduce full dataset writes from contexts during rapid state changes. | Repeated edits cause fewer storage/backend writes. |
| Remove hot-path logs | Remove or development-gate console logs in render/effect paths. | Production console stays quiet during normal chat. |
| Add long-list strategy | If long chats lag, virtualize, chunk, or otherwise reduce expensive full-list rendering. | Long conversations remain responsive. |
| Re-run analyzer | Measure again and record whether chunk size or load behavior improved. | Handoff includes before/after observations. |
| Add focused tests | Test deterministic markdown/cache behavior if changed. | Key/cache regressions are caught automatically. |

## Detailed Low-Level Subtasks

- [ ] Run the existing analyzer script and save the output or screenshot path in your notes.
- [ ] Record the current first-load JS size for `/chat`.
- [ ] Record whether WebLLM appears in the normal `/chat` bundle.
- [ ] Create or seed a long conversation with at least 100 messages.
- [ ] Record current scroll/render behavior for that long conversation.
- [ ] Open `hooks/use-web-llm.ts`.
- [ ] Replace static WebLLM imports with a dynamic import inside the model load function.
- [ ] Keep WebLLM types local or import them as type-only if safe.
- [ ] Ensure selecting a non-local model never imports WebLLM.
- [ ] Ensure selecting a local model imports WebLLM and still loads the model.
- [ ] Open `ChatClient.tsx` and locate local model selection logic.
- [ ] Make sure loading state still appears while the dynamic import starts.
- [ ] Open `markdown.tsx` and locate `generateKey`.
- [ ] Remove random key generation from renderer output where possible.
- [ ] Replace required keys with stable values derived from available content/index.
- [ ] Open markdown cache logic.
- [ ] Replace cache key based on first 50 characters with full content or a stable full-content hash.
- [ ] Keep the markdown cache bounded to avoid unbounded memory growth.
- [ ] Open `SpacesContext.tsx` and locate full `localStorage.setItem` writes.
- [ ] Add debouncing or scoped writes so repeated changes do not write too frequently.
- [ ] Open `JournalContext.tsx` and locate full `localStorage.setItem` writes.
- [ ] Add debounced journal persistence for block edits.
- [ ] Search `ChatClient.tsx` for `console.log`.
- [ ] Remove logs or route them through a development-only logger.
- [ ] Inspect `messages.tsx` for full-list rendering.
- [ ] If long conversations lag, add virtualization or chunked rendering.
- [ ] Preserve auto-scroll behavior after any message-list change.
- [ ] Re-run analyzer and compare against baseline.
- [ ] Re-test long conversation scrolling.
- [ ] Add tests for stable markdown output if render logic changed.
- [ ] Add a handoff note with before/after bundle and interaction observations.

## Likely Files

- `hooks/use-web-llm.ts`
- `app/(core)/ChatClient.tsx`
- `components/features/spaces/chat/markdown.tsx`
- `components/features/spaces/chat/messages.tsx`
- `contexts/SpacesContext.tsx`
- `contexts/JournalContext.tsx`
- `next.config.js`
- `package.json`

## Implementation Steps

1. Establish baseline measurements:
   - Run the bundle analyzer.
   - Record first load JS for `/chat`.
   - Record largest client chunks.
   - Record performance with a seeded long conversation, such as 200 messages.
2. Lazy-load WebLLM:
   - Remove static `import { CreateMLCEngine } from '@mlc-ai/web-llm'` from the default chat bundle.
   - Dynamically import WebLLM only after a `local-*` model is selected.
   - Show a clear loading state while the local engine chunk downloads.
3. Confirm local model code is absent from the normal chat bundle.
4. Stabilize markdown keys:
   - Do not use `Math.random()` for React keys inside markdown rendering.
   - Use deterministic keys from renderer position if available, or avoid keys where React does not require them.
5. Fix markdown cache keys:
   - Use the full content string as the key if cache size is capped.
   - Or use a stable hash of full content.
   - Keep the cache bounded.
6. Reduce storage writes:
   - Debounce journal block persistence.
   - For spaces, persist per-space deltas if task 05 is complete; otherwise debounce full writes.
   - Avoid writing during every token of streaming output.
7. Virtualize long lists:
   - Add lightweight virtualization for long message lists if message counts can exceed a practical threshold.
   - Preserve auto-scroll behavior and editing/retry controls.
8. Lazy-load syntax highlighting styles if possible:
   - Current `react-syntax-highlighter` component is lazy, but imported styles can still increase bundle cost.
   - Confirm analyzer output before changing.
9. Replace unguarded development logs with `debugLog` or remove them.
10. Add performance regression checks where practical:
   - A unit test for stable markdown render output.
   - A browser smoke test for long conversations if the project adds Playwright.

## Acceptance Criteria

- Normal `/chat` users do not download WebLLM until selecting a local model.
- Bundle analyzer shows a measurable reduction or clear separation of optional local-model chunks.
- Long conversations remain responsive.
- Markdown rendering does not remount large subtrees due to random keys.
- Storage writes are debounced or scoped.
- Production console noise is removed from hot paths.

## Verification

```bash
npm run analyze
npm run typecheck
npm run test
npm run build
```

Manual checks:

- Load `/chat` with default model and confirm local model assets are not requested.
- Select a local model and confirm WebLLM still loads and reports progress.
- Open a long conversation and confirm scrolling/editing remain usable.

## Notes For The Agent

Measure before and after. Do not replace working code with a larger abstraction unless analyzer or interaction evidence supports it.
