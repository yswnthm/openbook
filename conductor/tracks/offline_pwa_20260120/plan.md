# Implementation Plan - Offline Support & PWA

## Phase 1: PWA Foundations [checkpoint: f66bd7e]
- [x] Task: Install and configure `next-pwa` (or equivalent service worker generator) [a7c9696]
    - [x] Sub-task: Install dependencies and update `next.config.js`.
    - [x] Sub-task: Configure build exclusions to avoid caching large development files.
- [x] Task: Create Web App Manifest [e7e2cdb]
    - [x] Sub-task: Generate `manifest.json` with correct icons, colors, and display modes.
    - [x] Sub-task: Add meta tags for PWA support (viewport, theme-color) in `layout.tsx`.
- [ ] Task: Conductor - User Manual Verification 'PWA Foundations' (Protocol in workflow.md)

## Phase 2: Offline UX & State Management
- [x] Task: Implement `useOnlineStatus` hook [809e23d]
    - [x] Sub-task: Create a hook that listens to `window.addEventListener('online'/'offline')`.
    - [x] Sub-task: Add unit tests for the hook.
- [~] Task: Create Offline Indicator Component
    - [ ] Sub-task: Design a subtle UI component (e.g., status pill) to show when disconnected.
    - [ ] Sub-task: Integrate the component into the main `Layout` or `Sidebar`.
- [ ] Task: Update Model Selection Logic
    - [ ] Sub-task: Modify the chat interface to check connection status before sending a message to a cloud provider.
    - [ ] Sub-task: Display an error toast/alert if sending to a cloud model while offline.
- [ ] Task: Conductor - User Manual Verification 'Offline UX & State Management' (Protocol in workflow.md)

## Phase 3: Advanced Caching Strategy
- [ ] Task: Configure Service Worker for Static Assets
    - [ ] Sub-task: Ensure all JS/CSS chunks are aggressively cached.
    - [ ] Sub-task: Verify that fonts and SVGs (like `logo.svg`) are cached.
- [ ] Task: Configure Service Worker for Model Weights
    - [ ] Sub-task: Add specific runtime caching rules for the CDN domains used by MediaPipe/WebLLM (e.g., `storage.googleapis.com`, `huggingface.co`).
    - [ ] Sub-task: Set appropriate cache expiration policies (long-term caching for models).
- [ ] Task: Conductor - User Manual Verification 'Advanced Caching Strategy' (Protocol in workflow.md)

## Phase 4: Final Validation
- [ ] Task: Comprehensive Offline Test
    - [ ] Sub-task: Verify "Install App" flow on Desktop/Mobile.
    - [ ] Sub-task: Perform a full user journey (Open App -> Load Local Model -> Chat -> Create Journal) with Wi-Fi disabled.
- [ ] Task: Conductor - User Manual Verification 'Final Validation' (Protocol in workflow.md)
