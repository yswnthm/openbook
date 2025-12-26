# Implementation Plan: Redesign Team Page with Portfolio Hero

This plan details the steps to replace the current Team page with a new, interactive Hero section based on the provided reference design.

## Phase 1: Preparation & Assets [checkpoint: e536d2d]
- [x] Task: Verify and add necessary animations to `app/globals.css` (e.g., `fadeInUp`, `animate-fade-in-up`, and delays).
- [x] Task: Confirm `public/pfp.webp` is correctly placed and accessible.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Assets' (Protocol in workflow.md)

## Phase 2: Component Development
- [ ] Task: Create `components/team/team-hero.tsx`.
    - Adapt logic from reference `hero.tsx`.
    - Implement dynamic age counter with 100ms interval.
    - Style using Tailwind CSS to match the reference layout (grid with profile image on left/center).
    - Add a primary CTA button (e.g., "Get in Touch") as requested.
- [ ] Task: Write unit tests for `TeamHero` in `components/team/__tests__/team-hero.test.tsx`.
    - Verify age calculation updates.
    - Verify social links are rendered correctly.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Component Development' (Protocol in workflow.md)

## Phase 3: Page Integration
- [ ] Task: Update `app/team/page.tsx`.
    - Remove current `PageHero`, `teamMembers` map, and `CallToAction` section.
    - Import and render the new `TeamHero` component.
    - Ensure `Header`, `LandingBackground`, and `CombinedFooter` remain intact.
- [ ] Task: Verify the full page layout and responsiveness.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Page Integration' (Protocol in workflow.md)
