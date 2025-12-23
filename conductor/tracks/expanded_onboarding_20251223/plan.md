# Implementation Plan: Expanded Onboarding Tutorial

This plan expands the interactive onboarding tutorial to cover advanced research tools, study frameworks, and utility features.

## Phase 1: Infrastructure & ID Preparation [checkpoint: be5cdfc]
Prepare the UI components by adding necessary DOM IDs for targeting by the onboarding overlay.

- [x] Task: Add DOM IDs to Chat Components [aecc7e5]
    - [x] Add `id="onboarding-widgets-container"` to the `WidgetSection` wrapper in `app/(core)/ChatClient.tsx`.
- [x] Task: Add DOM IDs to Sidebar Components [a56b4ae]
    - [x] Add `id="sidebar-settings-trigger"` to the Settings button in `components/layout/sidebar.tsx`.
    - [x] Add `id="sidebar-clear-storage-trigger"` to the Clear Storage button in `components/layout/sidebar.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & ID Preparation' (Protocol in workflow.md) [checkpoint: be5cdfc]

## Phase 2: Expanded Registration Logic
Update the onboarding step registration to split slash commands and add the new widget step.

- [ ] Task: Update ChatClient Registration
    - [ ] Write failing test to verify new steps are registered in `ChatClient`.
    - [ ] Replace single 'command-menu' step with 'model-switching', 'study-frameworks', and 'compacting' steps.
    - [ ] Add 'daily-tools' step targeting `onboarding-widgets-container`.
    - [ ] Ensure tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Expanded Registration Logic' (Protocol in workflow.md)

## Phase 3: Sidebar Utility Steps
Add the remaining onboarding steps for Settings and Clear Storage within the Sidebar component.

- [ ] Task: Update Sidebar Registration
    - [ ] Write failing test to verify sidebar utility steps are registered.
    - [ ] Register 'personalization' step targeting `sidebar-settings-trigger`.
    - [ ] Register 'data-control' step targeting `sidebar-clear-storage-trigger`.
    - [ ] Ensure tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Sidebar Utility Steps' (Protocol in workflow.md)

## Phase 4: Final Sequence & Polish
Refine the sequence and descriptions to ensure a smooth user flow.

- [ ] Task: Refine Step Sequence and Copy
    - [ ] Review all registered steps for logical flow: Welcome -> Model -> Study -> Compact -> Widgets -> Search -> Settings -> Clear Storage.
    - [ ] Update descriptions to match the professional copy defined in the spec.
    - [ ] Perform a full walkthrough to verify tooltip positioning.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Sequence & Polish' (Protocol in workflow.md)
