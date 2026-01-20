# Specification: Full Offline Support & PWA Integration

## Overview
Transform OpenBook into a Progressive Web App (PWA) to provide a seamless, "local-first" experience. The app will function completely offline by caching the application shell and AI models, while gracefully handling features that require an active internet connection.

## Functional Requirements

### 1. PWA & Service Worker
- **App Shell Caching:** Implement a service worker to cache all static assets (HTML, CSS, JS, Fonts) so the UI loads instantly without a network.
- **Manifest & Installability:** Configure a `manifest.json` using existing branding (`logo.svg`) to allow users to "Install" OpenBook to their desktop or home screen.
- **Cache Management:** Implement strategies for background updates and cache purging to ensure users don't get stuck on old versions.

### 2. Connection Awareness
- **Status Detection:** Implement a global hook to monitor `navigator.onLine`.
- **Offline Indicator:** Add a subtle visual indicator (e.g., a "Disconnected" badge or toast) when the user goes offline.
- **Feature Gating:** 
    - Keep local models (MediaPipe, Web-LLM) fully functional.
    - If a user attempts to use a cloud model (OpenAI, Gemini, etc.) while offline, display a "Network Connection Required" alert.

### 3. Local Model Persistence
- **Cache API Integration:** Ensure large model weights (WASM, binary files) are stored in the browser's Cache API to prevent redundant multi-gigabyte downloads.
- **Persistence Verification:** Verify that local models can be initialized and run even when the initial request to the CDN fails.

### 4. Data Continuity
- **LocalStorage Reliability:** Ensure the existing `localStorage` data flow for Journals, Chats, and Notebooks remains uninterrupted by the offline state.
- **Creation/Editing:** Users must be able to create new journals or chats while offline, with data persisting to the local storage immediately.

## Non-Functional Requirements
- **Performance:** App shell should load in under 500ms when served from the service worker.
- **Storage:** Handle potential storage quota limits for large AI models gracefully.

## Acceptance Criteria
- [ ] The app is "Installable" on Chromium and Safari browsers.
- [ ] The app loads the full UI and allows navigation while in "Airplane Mode."
- [ ] Local AI models (if previously loaded) can start a new chat while offline.
- [ ] Switching to a cloud model while offline triggers a clear error message.
- [ ] The UI correctly reflects the online/offline status in real-time.

## Out of Scope
- Cloud synchronization or backup.
- Offline support for external web search (Tavily).
