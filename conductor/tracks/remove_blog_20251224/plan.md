# Plan: Remove Blog Feature

Remove every trace of the blog feature, including components, pages, routes, logic, and exclusive dependencies.

## Phase 1: Discovery & Scoping [checkpoint: 3f8bdae]
- [x] Task: Identify all files related to the blog feature (components, pages, types, utils) [e50bebb]
- [x] Task: Identify npm dependencies used exclusively for the blog (check `package.json` and imports) [37ac449]
- [x] Task: Conductor - User Manual Verification 'Discovery & Scoping' (Protocol in workflow.md) [3f8bdae]

## Phase 2: UI & Component Removal [checkpoint: 8b3aa3a]
- [x] Task: Remove blog components from `components/landing/` (`blog-section.tsx`, `blog-card.tsx`, `BlogPost.tsx`) [439e0f6]
- [x] Task: Remove references to the Blog section in `app/page.tsx` [33a73f5]
- [x] Task: Update `components/landing/header.tsx` and `footer.tsx` (or `CombinedFooter.tsx`) to remove blog links [b1a0201]
- [x] Task: Conductor - User Manual Verification 'UI & Component Removal' (Protocol in workflow.md) [8b3aa3a]

## Phase 3: Route & Logic Removal
- [x] Task: Delete blog-related pages in `app/` (e.g., `app/(pages)/blog` if it exists, or similar) [N/A]
- [x] Task: Remove any blog-specific API routes in `app/api/` [N/A]
- [ ] Task: Clean up blog-specific types in `lib/types.ts` or `types/`
- [ ] Task: Conductor - User Manual Verification 'Route & Logic Removal' (Protocol in workflow.md)

## Phase 4: Cleanup & Dependency Management
- [ ] Task: Uninstall blog-exclusive dependencies using `bun remove`
- [ ] Task: Perform a full codebase search for "blog" to ensure no straggling references remain
- [ ] Task: Verify the build passes with `bun run build`
- [ ] Task: Conductor - User Manual Verification 'Cleanup & Dependency Management' (Protocol in workflow.md)
