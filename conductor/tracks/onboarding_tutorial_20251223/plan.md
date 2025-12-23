# Track Plan: Interactive Onboarding Tutorial

## Phase 1: Foundation & State Management
- [x] Task: Create `OnboardingContext` to manage tutorial state (active step, visibility, seen status). [587e1e8]
- [x] Task: Implement `useOnboarding` hook for components to register themselves as tour targets. [3fae293]
- [x] Task: Create a persistent storage mechanism (localStorage) to remember if the user has completed the tutorial. [3fae293]
- [ ] Task: Conductor - User Manual Verification 'Foundation & State Management' (Protocol in workflow.md)

## Phase 2: UI Components
- [ ] Task: Design and build the `OnboardingOverlay` component (backdrop and spotlight effect).
- [ ] Task: Create the `TooltipCard` component for displaying the explanation text and navigation buttons ("Next", "Skip").
- [ ] Task: Implement smooth Framer Motion animations for the overlay and tooltip transitions.
- [ ] Task: Conductor - User Manual Verification 'UI Components' (Protocol in workflow.md)

## Phase 3: Integration & Content
- [ ] Task: Integrate `OnboardingContext` into the root layout.
- [ ] Task: Update the `AIModelPicker` component to register as step 1.
- [ ] Task: Update the `ModeToggle` (or equivalent) component to register as step 2.
- [ ] Task: Update the main `ChatInput` area to register as step 3.
- [ ] Task: Update the `Sidebar` toggle to register as step 4.
- [ ] Task: Define the final tour content (text strings) for each step.
- [ ] Task: Conductor - User Manual Verification 'Integration & Content' (Protocol in workflow.md)

## Phase 4: Polish & Review
- [ ] Task: Verify keyboard navigation and focus management for accessibility.
- [ ] Task: Test the "Skip" and "Complete" flows to ensure persistence works.
- [ ] Task: Refine animations and visual styling to match product guidelines.
- [ ] Task: Conductor - User Manual Verification 'Polish & Review' (Protocol in workflow.md)
