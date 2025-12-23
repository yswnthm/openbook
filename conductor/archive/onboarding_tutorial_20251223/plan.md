# Track Plan: Interactive Onboarding Tutorial

## Phase 1: Foundation & State Management [checkpoint: 979ab93]
- [x] Task: Create `OnboardingContext` to manage tutorial state (active step, visibility, seen status). [587e1e8]
- [x] Task: Implement `useOnboarding` hook for components to register themselves as tour targets. [3fae293]
- [x] Task: Create a persistent storage mechanism (localStorage) to remember if the user has completed the tutorial. [3fae293]
- [x] Task: Conductor - User Manual Verification 'Foundation & State Management' (Protocol in workflow.md)

## Phase 2: UI Components [checkpoint: 24f51bc]
- [x] Task: Design and build the `OnboardingOverlay` component (backdrop and spotlight effect). [f14e269]
- [x] Task: Create the `TooltipCard` component for displaying the explanation text and navigation buttons ("Next", "Skip"). [3fa79e7]
- [x] Task: Implement smooth Framer Motion animations for the overlay and tooltip transitions. [3fa79e7]
- [x] Task: Conductor - User Manual Verification 'UI Components' (Protocol in workflow.md)

## Phase 3: Integration & Content [checkpoint: f51adba]
- [x] Task: Integrate `OnboardingContext` into the root layout. [c22dd55]
- [x] Task: Update the `AIModelPicker` component to register as step 1. [c22dd55]
- [x] Task: Update the `ModeToggle` (or equivalent) component to register as step 2. [c22dd55]
- [x] Task: Update the main `ChatInput` area to register as step 3. [c22dd55]
- [x] Task: Update the `Sidebar` toggle to register as step 4. [c22dd55]
- [x] Task: Define the final tour content (text strings) for each step. [c22dd55]
- [x] Task: Conductor - User Manual Verification 'Integration & Content' (Protocol in workflow.md)

## Phase 4: Polish & Review
- [x] Task: Verify keyboard navigation and focus management for accessibility. [aeae8d2]
- [x] Task: Test the "Skip" and "Complete" flows to ensure persistence works. [705d7f0]
- [x] Task: Refine animations and visual styling to match product guidelines. [705d7f0]
- [x] Task: Conductor - User Manual Verification 'Polish & Review' (Protocol in workflow.md)
