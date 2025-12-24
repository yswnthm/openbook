# Plan: Remove Blog Feature

Remove every trace of the blog feature, including components, pages, routes, logic, and exclusive dependencies.

## Phase 1: Discovery & Scoping
- [x] Task: Identify all files related to the blog feature (components, pages, types, utils) [e50bebb]
- [ ] Task: Identify npm dependencies used exclusively for the blog (check `package.json` and imports)
- [ ] Task: Conductor - User Manual Verification 'Discovery & Scoping' (Protocol in workflow.md)

## Phase 2: UI & Component Removal
- [ ] Task: Remove blog components from `components/landing/` (`blog-section.tsx`, `blog-card.tsx`, `BlogPost.tsx`)
- [ ] Task: Remove references to the Blog section in `app/page.tsx`
- [ ] Task: Update `components/landing/header.tsx` and `footer.tsx` (or `CombinedFooter.tsx`) to remove blog links
- [ ] Task: Conductor - User Manual Verification 'UI & Component Removal' (Protocol in workflow.md)

## Phase 3: Route & Logic Removal
- [ ] Task: Delete blog-related pages in `app/` (e.g., `app/(pages)/blog` if it exists, or similar)
- [ ] Task: Remove any blog-specific API routes in `app/api/`
- [ ] Task: Clean up blog-specific types in `lib/types.ts` or `types/`
- [ ] Task: Conductor - User Manual Verification 'Route & Logic Removal' (Protocol in workflow.md)

## Phase 4: Cleanup & Dependency Management
- [ ] Task: Uninstall blog-exclusive dependencies using `bun remove`
- [ ] Task: Perform a full codebase search for "blog" to ensure no straggling references remain
- [ ] Task: Verify the build passes with `bun run build`
- [ ] Task: Conductor - User Manual Verification 'Cleanup & Dependency Management' (Protocol in workflow.md)
