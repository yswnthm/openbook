# Task 09 - Rework Study Mode Contract

## Goal

Make study modes predictable by using one typed contract across UI, context, API routes, and prompts.

## Evidence

- `lib/types.ts` defines `StudyFramework` as `feynman-technique`, `socratic-tutor`, and `active-recall`.
- `contexts/SpacesContext.tsx` has a separate stale study mode type that includes `memory-palace`, `spaced-repetition`, and `extreme-mode`.
- `lib/utils.ts` defines `SearchGroupId` as `chat | active-recall`.
- `app/(config)/actions.ts` defines `groupTools` with `chat`, `web`, and `extreme`, but no `active-recall`.
- `ChatClient.tsx` chooses `/api/study/${currentStudyMode.framework}` when a study framework is active.
- Study routes are three near-identical proxy routes that add a system message and forward to `/api/chat`.

## Scope

In scope:

- Study framework types.
- Study mode context and space metadata.
- Group/tool configuration.
- Study API route shape.
- Prompt injection path.
- Tests for each mode.

Out of scope:

- Designing new study modes.
- Large chat UI redesign.
- Durable storage, except to keep data model compatible with task 05.

## Subtask Checklist

- [ ] Create one study framework registry.
- [ ] Derive `StudyFramework` and framework IDs from that registry.
- [ ] Replace stale framework unions in `SpacesContext`.
- [ ] Reconcile `SearchGroupId` with server group configuration.
- [ ] Decide whether study mode is sent to `/api/chat` or handled by a dynamic study route.
- [ ] Remove duplicated proxy route logic if a shared route can replace it.
- [ ] Move framework prompt injection to the server.
- [ ] Replace hidden activation messages with explicit study-mode metadata where possible.
- [ ] Preserve visible UI behavior for selecting and disabling study modes.
- [ ] Define compacting behavior for active study modes.
- [ ] Add tests for each framework prompt path.
- [ ] Add tests rejecting invalid framework IDs.
- [ ] Add tests proving group IDs and server config stay in sync.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Create framework registry | Put all study framework IDs and metadata in one shared place. | No feature needs to maintain a separate framework list. |
| Derive types | Export framework types from the registry so stale string unions cannot appear. | TypeScript catches invalid framework IDs. |
| Replace stale unions | Remove old framework names from `SpacesContext` unless they are implemented now. | Space metadata matches actual study modes. |
| Reconcile groups | Decide whether study modes and search groups are separate concepts, then update types/config accordingly. | Client group IDs always exist on the server. |
| Choose API shape | Decide if study mode should be sent to `/api/chat` or handled by one dynamic study route. | There is one documented request path. |
| Remove duplicate proxy logic | Replace three near-identical study routes with shared logic if possible. | Adding a new framework does not require copy-pasting a route. |
| Server-side prompt injection | Have the server validate the framework and add its system prompt. | The client no longer controls prompt injection through hidden messages. |
| Replace hidden messages | Store study mode state as metadata instead of fake user messages where possible. | Conversation history is cleaner and exports are less surprising. |
| Preserve UI behavior | Keep `/frameworks`, picker selection, badge display, and disabling mode working. | Users see the same or clearer study-mode UX. |
| Define compact behavior | Decide whether compacting clears or carries study mode and implement that consistently. | Compacting behavior is predictable and tested. |
| Add prompt tests | Test that each framework maps to the correct prompt. | Prompt regressions fail tests. |
| Reject invalid IDs | Validate framework IDs at API boundaries. | Invalid IDs return a controlled error. |
| Add group sync tests | Test that every client group exists in server config and vice versa. | Type/config drift fails tests. |

## Detailed Low-Level Subtasks

- [ ] Open `lib/types.ts` and locate `StudyFramework`.
- [ ] Open `lib/study-prompts.ts` and locate prompt definitions.
- [ ] Open `contexts/SpacesContext.tsx` and locate the stale `studyMode.framework` union.
- [ ] Open `contexts/StudyModeContext.tsx` and list the framework type it uses.
- [ ] Open `components/features/study/study-framework-picker.tsx` and list displayed frameworks.
- [ ] Open `components/features/spaces/input/input-content-box.tsx` and locate framework selection behavior.
- [ ] Open `app/(config)/actions.ts` and list `groupTools` keys.
- [ ] Open `lib/utils.ts` and list `SearchGroupId` values.
- [ ] Compare all framework/group lists and mark mismatches.
- [ ] Create a single study framework registry file or move registry into `lib/study-prompts.ts`.
- [ ] Put each framework ID in the registry exactly once.
- [ ] Put each framework label in the registry.
- [ ] Put each framework description in the registry.
- [ ] Put each framework icon in the registry.
- [ ] Put each framework prompt in the registry.
- [ ] Export a derived `StudyFramework` type from the registry.
- [ ] Replace enum usage only if doing so does not cause large churn; otherwise make enum values derive from the same constants.
- [ ] Update `SpacesContext` to use the shared `StudyFramework | null` type.
- [ ] Remove stale framework names such as `memory-palace` unless they are being implemented now.
- [ ] Decide whether `active-recall` is a study framework, a search group, or both.
- [ ] Update `SearchGroupId` to match the final decision.
- [ ] Update `groupTools` and `groupInstructions` to include exactly the valid group IDs.
- [ ] Replace duplicated study API proxy routes with a dynamic route or direct `/api/chat` parameter if approved.
- [ ] Add request validation for study framework IDs.
- [ ] Move framework prompt injection to the server-side request path.
- [ ] Remove hidden activation messages if metadata can represent the same state.
- [ ] If hidden activation messages remain, ensure exports and display filters treat them consistently.
- [ ] Update `StudyFrameworkPicker` to render from the registry.
- [ ] Update `StudyModeBadge` to render from the registry.
- [ ] Update compact behavior so study mode is intentionally cleared or carried forward.
- [ ] Add a test that every registry framework has prompt, label, description, and icon.
- [ ] Add a test that selecting each framework sends the correct ID.
- [ ] Add a test that invalid framework IDs are rejected by the API.
- [ ] Add a test that group IDs cannot request missing server config.
- [ ] Manually select each framework and send a message.

## Likely Files

- `lib/types.ts`
- `lib/study-prompts.ts`
- `contexts/StudyModeContext.tsx`
- `contexts/SpacesContext.tsx`
- `components/features/study/study-framework-picker.tsx`
- `components/features/spaces/input/input-content-box.tsx`
- `app/(core)/ChatClient.tsx`
- `app/(config)/actions.ts`
- `app/api/study/*`
- `app/api/chat/route.ts`

## Implementation Steps

1. Define one study framework registry:

   ```ts
   export const STUDY_FRAMEWORKS = {
     "feynman-technique": { label: "...", prompt: "...", tools: [] },
     "socratic-tutor": { label: "...", prompt: "...", tools: [] },
     "active-recall": { label: "...", prompt: "...", tools: [] },
   } as const;
   ```

2. Derive `StudyFramework` from that registry instead of duplicating literals.
3. Replace the stale `SpacesContext` framework union with `StudyFramework | null`.
4. Decide how groups and study modes interact:
   - If study modes are separate from search groups, remove `active-recall` from `SearchGroupId`.
   - If active recall is a group, add it consistently to `groupTools` and `groupInstructions`.
   - Avoid a state where UI sets a group that server config cannot resolve.
5. Replace the three proxy study routes with one route if possible:
   - Option A: `/api/study/[framework]/route.ts` validates framework from registry and forwards to the shared chat handler.
   - Option B: remove study routes and pass `studyFramework` to `/api/chat`, where the server injects the system prompt.
6. Prefer server-side prompt injection inside `/api/chat`:
   - Client sends `studyFramework`.
   - Server validates it.
   - Server prepends or sets the framework system prompt.
   - This avoids hidden activation messages being stored as user messages.
7. Revisit hidden activation messages:
   - Current behavior stores hidden user messages like `Activate Feynman Technique`.
   - Replace with explicit metadata where possible.
   - If hidden messages remain, ensure they never leak into user-visible exports unless intended.
8. Ensure compacting clears or preserves study mode intentionally. Document the chosen behavior.
9. Add tests:
   - Each framework returns its prompt.
   - Invalid framework is rejected.
   - Switching frameworks updates context and API body.
   - Chat request in study mode includes the right system prompt.
   - `SearchGroupId` and server group config stay in sync.

## Acceptance Criteria

- Study framework IDs are declared once.
- UI, context, routes, and prompts all use the same type.
- Invalid study framework values cannot reach provider calls.
- The server receives clear `studyFramework` metadata instead of relying on hidden user messages.
- Each study mode has at least one test proving the correct prompt path.

## Verification

```bash
npm run typecheck
npm run test
npm run build
```

Manual checks:

- Select each study mode from `/frameworks`.
- Send a message and confirm the response follows that framework.
- Disable study mode and confirm normal chat resumes.
- Compact a study-mode conversation and confirm the chosen mode behavior is correct.

## Notes For The Agent

This task is mostly contract cleanup. Keep the UI familiar and focus on making the data path impossible to misconfigure.
