# Task 05 - Move User Data To Durable Storage

## Goal

Move important user data out of browser-only `localStorage` and into durable, user-owned storage with migration, sync, and recovery paths.

## Evidence

The following contexts persist core data in `localStorage`:

- `contexts/SpacesContext.tsx`
- `contexts/JournalContext.tsx`
- `contexts/NotebookContext.tsx`
- `contexts/StudyModeContext.tsx`
- `contexts/UserContext.tsx`
- `contexts/SidebarContext.tsx`
- `contexts/MotionContext.tsx`

This means conversations, journals, notebooks, premium state, and study modes are device-bound, not recoverable after local storage loss, hard to sync across tabs/devices, and constrained by browser quota.

## Scope

In scope:

- Data model for notebooks, spaces, messages, journals, study modes, settings, and user profile.
- Migration from current `localStorage` keys.
- Backward-compatible local fallback while migration rolls out.
- Sync/loading/error states in existing contexts.
- Tests for migration and persistence.

Out of scope:

- Full billing system.
- Large UI redesign.
- Real-time collaboration unless requested separately.

## Subtask Checklist

- [ ] Confirm the target persistence backend with the project owner.
- [ ] Define typed schemas for users, notebooks, spaces, messages, journals, blocks, study modes, and settings.
- [ ] Add ownership, timestamps, and deletion strategy to every user-owned entity.
- [ ] Create a storage adapter interface for all current context operations.
- [ ] Implement a local adapter that preserves existing `localStorage` behavior.
- [ ] Implement the backend adapter and API routes.
- [ ] Add server-side validation and ownership checks to every persistence API.
- [ ] Build a versioned migration from existing `localStorage` keys.
- [ ] Add migration success, retry, and partial-failure handling.
- [ ] Update contexts to use the adapter instead of direct `localStorage` access.
- [ ] Add save/loading/error states where user data can be delayed or fail.
- [ ] Debounce high-frequency saves, especially journal block edits.
- [ ] Preserve export/import behavior with validation.
- [ ] Add tests for migration, ownership, save failure, and local fallback.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Confirm backend | Do not invent a storage provider silently. Check project direction or ask the owner if the backend is undecided. | The task notes name the selected backend or blocker. |
| Define schemas | Convert current TypeScript/client shapes into durable tables/documents for every user-owned entity. | Schema/migration files or schema docs exist for all entities. |
| Add ownership/timestamps | Every saved record needs `user_id`, `created_at`, `updated_at`, and a deletion strategy. | Records can be scoped to one user and sorted/synced by time. |
| Create storage adapter | Define an interface that contexts use instead of calling `localStorage` or backend APIs directly. | Context code can call storage methods without knowing implementation details. |
| Implement local adapter | Preserve current `localStorage` behavior behind the new interface before adding backend complexity. | The app behaves the same using the local adapter. |
| Implement backend adapter/APIs | Add server routes/actions and client adapter methods for loading and saving workspace data. | Data can be loaded/saved through backend code paths. |
| Add validation and ownership | Validate all persistence payloads and ensure users can access only their own records. | Tests or route checks block cross-user access. |
| Build migration | Read old `localStorage` keys, validate them, upload them, and mark migration complete only after success. | Existing local users keep their data after moving to backend storage. |
| Add migration failure handling | Handle network errors, partial uploads, invalid old data, and retry without deleting source data too early. | Failed migration does not lose user data. |
| Update contexts | Replace direct storage calls in contexts with adapter calls and loading/saving/error states. | Contexts no longer directly own persistence details. |
| Add save states | Surface delayed or failed saves so users are not misled into thinking data is safe when it is not. | UI/context state can represent saving and save error. |
| Debounce frequent saves | Avoid backend writes on every keystroke or tiny state change, especially journal edits. | Save frequency is controlled and tested. |
| Preserve export/import | Keep user data portability and validate imports before merging into workspace data. | Existing export behavior still works or has a documented replacement. |
| Add tests | Cover migration, ownership checks, save failures, and local fallback. | Persistence changes are protected against data loss regressions. |

## Detailed Low-Level Subtasks

- [ ] Open every context that directly calls `localStorage`.
- [ ] List each storage key used by each context.
- [ ] Open `lib/storageKeys.ts` and compare the central key list with actual usage.
- [ ] Write down the current shape of notebooks, spaces, messages, journal entries, journal blocks, study modes, and user settings.
- [ ] Choose the persistence backend or record that the owner must choose it before implementation.
- [ ] Create a schema document or migration file for `users`.
- [ ] Create a schema document or migration file for `notebooks`.
- [ ] Create a schema document or migration file for `spaces`.
- [ ] Create a schema document or migration file for `messages`.
- [ ] Create a schema document or migration file for `journal_entries`.
- [ ] Create a schema document or migration file for `journal_blocks`.
- [ ] Create a schema document or migration file for `study_modes`.
- [ ] Create a schema document or migration file for `user_settings`.
- [ ] Add `user_id` to every user-owned table or document.
- [ ] Add `created_at` and `updated_at` to every user-owned table or document.
- [ ] Decide whether deletion is hard delete or soft delete for every entity.
- [ ] Create a `WorkspaceSnapshot` type that represents all user data needed by the app.
- [ ] Create an `OpenBookStorage` interface with load, save, delete, and export operations.
- [ ] Implement a local storage adapter using the existing keys.
- [ ] Replace one low-risk context read path with the adapter.
- [ ] Replace one low-risk context write path with the adapter.
- [ ] Repeat context migration one context at a time, verifying after each.
- [ ] Implement backend API route or server action for loading workspace data.
- [ ] Implement backend API route or server action for saving a notebook.
- [ ] Implement backend API route or server action for saving a space.
- [ ] Implement backend API route or server action for saving a journal entry.
- [ ] Implement backend API route or server action for saving study mode/settings.
- [ ] Add server-side auth/user lookup to every backend persistence operation.
- [ ] Add ownership checks before every read/update/delete.
- [ ] Build a migration function that reads old `localStorage` data.
- [ ] Build a migration function that validates old data before upload.
- [ ] Build a migration function that uploads old data to backend storage.
- [ ] Mark migration complete only after backend save succeeds.
- [ ] Keep old local data until successful migration is confirmed.
- [ ] Add a migration retry path for network failure.
- [ ] Add user-visible save error state where data could fail to persist.
- [ ] Add debounced journal save behavior to avoid saving on every keystroke.
- [ ] Add tests for old-key migration into the new snapshot format.
- [ ] Add tests for partial migration failure.
- [ ] Add tests for user A being blocked from reading user B data.
- [ ] Add tests for local fallback when backend is unavailable.
- [ ] Manually create data, refresh, and confirm it reloads from the new path.

## Likely Files

- `contexts/SpacesContext.tsx`
- `contexts/JournalContext.tsx`
- `contexts/NotebookContext.tsx`
- `contexts/StudyModeContext.tsx`
- `contexts/UserContext.tsx`
- `lib/storageKeys.ts`
- New persistence layer, for example `lib/storage/client.ts`, `lib/storage/server.ts`, `lib/storage/schema.ts`
- New API routes under `app/api/*` if using server APIs

## Implementation Steps

1. Choose a persistence backend with the project owner. Reasonable options:
   - Supabase/Postgres.
   - Neon/Postgres plus Drizzle or Prisma.
   - Vercel Postgres/KV depending on expected query patterns.
   - Local-first IndexedDB plus cloud sync if offline-first is a priority.
2. Define a typed schema. Minimum entities:
   - `users`
   - `notebooks`
   - `spaces`
   - `messages`
   - `journal_entries`
   - `journal_blocks`
   - `study_modes`
   - `user_settings`
3. Include ownership and timestamps on every user-owned row:
   - `id`
   - `user_id`
   - `created_at`
   - `updated_at`
   - `deleted_at` for soft delete where useful.
4. Build a storage adapter interface before changing UI contexts:

   ```ts
   interface OpenBookStorage {
     loadWorkspace(): Promise<WorkspaceSnapshot>;
     saveSpace(space: Space): Promise<void>;
     saveJournal(entry: JournalEntry): Promise<void>;
     deleteSpace(id: string): Promise<void>;
     deleteJournal(id: string): Promise<void>;
   }
   ```

5. Implement a local adapter using the current `localStorage` keys. This preserves current behavior while the backend adapter is developed.
6. Implement the backend adapter and API routes. Validate every request server-side and enforce user ownership.
7. Add a migration flow:
   - Detect existing `localStorage` data on first signed-in load.
   - Show a non-blocking migration status if UI patterns allow.
   - Upload data to backend.
   - Mark migration complete using a new versioned storage key.
   - Keep local data until backend save is confirmed.
8. Add conflict handling:
   - Use `updated_at` and version numbers.
   - For MVP, last-write-wins with clear timestamps may be acceptable.
   - For journals, consider per-block updates if conflicts are likely.
9. Update contexts to load from the adapter:
   - Add `initialized`, `isSaving`, and `saveError` states where needed.
   - Avoid writing full datasets on every keystroke.
   - Debounce journal block saves.
10. Keep export/import:
   - Preserve `exportSpace`.
   - Add workspace export for all notebooks, spaces, and journals.
   - Add import validation before merging data.
11. Add tests:
   - Local adapter compatibility with existing keys.
   - Migration success and partial failure.
   - Ownership enforcement on API routes.
   - Save debounce behavior.

## Acceptance Criteria

- A signed-in user can access spaces and journals across browser sessions/devices.
- Existing `localStorage` users are migrated without data loss.
- App still works in a local-only mode if backend config is absent, or it clearly tells the user sync is unavailable.
- User-owned records are protected by server-side ownership checks.
- Journal edits and chat messages are saved without rewriting the entire workspace on every small change.

## Verification

```bash
npm run typecheck
npm run test
npm run build
```

Manual checks:

- Create a notebook, space, chat message, study mode, and journal entry.
- Refresh and confirm data persists.
- Sign in from a second browser profile or device and confirm data loads.
- Seed old `localStorage` keys and confirm migration preserves data.
- Simulate backend save failure and confirm the UI does not silently discard data.

## Notes For The Agent

Do not delete the existing `localStorage` migration utilities until old users have a safe path. This task has high blast radius; keep changes layered behind an adapter.
