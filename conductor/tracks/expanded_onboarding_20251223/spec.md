# Track Specification: Expanded Onboarding Tutorial

## Overview
Expand the existing onboarding tutorial to cover advanced features, specifically focusing on slash commands, engagement widgets, and sidebar utility tools (Settings/Clear Storage).

## Functional Requirements
- **Sequential Tooltips:** Implement a guided tutorial flow using the existing `OnboardingContext`.
- **Targeted Highlighting:** Add unique `id` attributes to UI components to allow the `OnboardingOverlay` to target them correctly.
- **Split Slash Commands:** Replace the single "Slash Commands" step with three distinct steps: Model Switching, Study Frameworks, and Compacting.
- **Widget Integration:** Highlight the Streak and Surprise button container as a single "Daily Learning Tools" step.
- **Sidebar Utilities:** Add steps for the Settings Panel and Clear Storage button.

## Component Changes
### `ChatClient.tsx`
- Add `onboarding-widgets-container` id to the `WidgetSection` wrapper.
- Update `useEffect` to register the new split command steps and widget step.
- Ensure the tutorial sequence follows a logical path: Input -> Model -> Study -> Compact -> Widgets -> Sidebar.

### `Sidebar.tsx`
- Add `sidebar-settings-trigger` id to the Settings button.
- Add `sidebar-clear-storage-trigger` id to the Clear Storage button.
- Update `useEffect` to register these new steps when the sidebar is open.

## Acceptance Criteria
- [ ] Tutorial correctly sequences through 8 distinct steps.
- [ ] Tooltips are accurately positioned over their respective UI elements.
- [ ] The "Widgets" step correctly highlights both the Streak and Surprise buttons.
- [ ] Sidebar steps only register/trigger when the sidebar is visible (if applicable) or ensure the sidebar opens automatically if needed (though existing behavior is fine).
- [ ] Persistence: The tutorial "Completed" state remains respected.

## Out of Scope
- Creating new UI components for the features themselves (they already exist).
- Modifying the animation logic of `Framer Motion` (using existing `OnboardingOverlay`).
