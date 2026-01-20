# Implementation Plan - Offline Support & PWA

## Phase 1: PWA Foundations [checkpoint: f66bd7e]
- [x] Task: Install and configure `next-pwa` (or equivalent service worker generator) [a7c9696]
    - [x] Sub-task: Install dependencies and update `next.config.js`.
    - [x] Sub-task: Configure build exclusions to avoid caching large development files.
- [x] Task: Create Web App Manifest [e7e2cdb]
    - [x] Sub-task: Generate `manifest.json` with correct icons, colors, and display modes.
    - [x] Sub-task: Add meta tags for PWA support (viewport, theme-color) in `layout.tsx`.
- [ ] Task: Conductor - User Manual Verification 'PWA Foundations' (Protocol in workflow.md)

## Phase 2: Offline UX & State Management [checkpoint: c264cc0]
- [x] Task: Implement `useOnlineStatus` hook [809e23d]
- [x] Task: Create Offline Indicator Component [3596e59]
- [x] Task: Update Model Selection Logic [c264cc0]
- [x] Task: Conductor - User Manual Verification 'Offline UX & State Management' (Protocol in workflow.md)

## Phase 3: Advanced Caching Strategy
- [x] Task: Configure Service Worker for Static Assets [3497c23]
    - [x] Sub-task: Ensure all JS/CSS chunks are aggressively cached.
    - [x] Sub-task: Verify that fonts and SVGs (like `logo.svg`) are cached.
- [x] Task: Configure Service Worker for Model Weights [3497c23]
    - [x] Sub-task: Add specific runtime caching rules for the CDN domains used by MediaPipe/WebLLM (e.g., `storage.googleapis.com`, `huggingface.co`).
    - [x] Sub-task: Set appropriate cache expiration policies (long-term caching for models).
- [ ] Task: Conductor - User Manual Verification 'Advanced Caching Strategy' (Protocol in workflow.md)

## Phase 4: Final Validation
- [ ] Task: Comprehensive Offline Test
    - [ ] Sub-task: Verify "Install App" flow on Desktop/Mobile.
    - [ ] Sub-task: Perform a full user journey (Open App -> Load Local Model -> Chat -> Create Journal) with Wi-Fi disabled.
- [ ] Task: Conductor - User Manual Verification 'Final Validation' (Protocol in workflow.md)
