# Specification: Full Offline Support & PWA Integration

## Overview
Transform OpenBook into a Progressive Web App (PWA) to provide a seamless, "local-first" experience. The app will function completely offline by caching the application shell and AI models, while gracefully handling features that require an active internet connection.

## Functional Requirements

### 1. PWA & Service Worker
- **App Shell Caching:** Implement a service worker to cache all static assets (HTML, CSS, JS, Fonts) so the UI loads instantly without a network.
- **Manifest & Installability:** Configure a `manifest.json` using existing branding (`logo.svg`) to allow users to "Install" OpenBook to their desktop or home screen.
- **Cache Management Strategy:** Implement a concrete cache management plan with the following specifications:
    - **Primary Caching Strategy:**
        - Use `stale-while-revalidate` as the default strategy for most assets.
        - Use `network-first` for API calls to ensure fresh data when online.
        - Use `cache-first` for static assets (CSS, JS, fonts, images) to maximize offline performance.
    - **User Update UX:**
        - Show a non-blocking toast/banner when a new service worker is available with a "Refresh" action button.
        - For critical fixes, implement auto-refresh after user confirmation.
        - Store update preference in localStorage to respect user choice.
    - **Service Worker Lifecycle:**
        - **Option A: Immediate Updates (Recommended for this phase)**
            - Explicitly call `skipWaiting()` in the new service worker's install event for immediate activation.
            - Call `clients.claim()` on activation to take immediate control of all clients.
        - **Option B: Controlled Updates**
            - Defer activation until next navigation to ensure consistency.
            - Provide a UI trigger (e.g., "Update Available" button) that posts a message to SW to call `skipWaiting()`.
    - **Cache Versioning and Purge Rules:**
        - Use a semantic `CACHE_NAME` with version string (e.g., `openbook-v1.2.3`).
        - Remove old caches in the service worker's `activate` event handler when the version changes.
        - Implement a cache size limit and LRU (Least Recently Used) eviction policy for large assets.
    - **References:**
        - Service worker update flow: `skipWaiting()` and `clients.claim()`.
        - `CACHE_NAME` versioning pattern.
        - Activate event cache cleanup implementation.

### 2. Connection Awareness
- **Status Detection:** Implement a hybrid connectivity detector that combines `navigator.onLine` with active network probes:
    - Keep existing global listeners for 'online'/'offline' events and `navigator.onLine` property as a baseline.
    - Augment with periodic active probes (e.g., `fetch` to a configurable health endpoint) with timeouts to detect stalled connections.
    - Use exponential backoff retry logic for failed probes to avoid excessive network requests.
    - Expose the combined result as the single source of truth (e.g., `ConnectivityService.isOnline`) so consumers use that instead of `navigator.onLine` directly.
    - Ensure probe timeouts, retry/backoff parameters, and health-endpoint URL are configurable.
    - Surface probe errors in logging for diagnostics.
- **Offline Indicator:** Add a subtle visual indicator (e.g., a "Disconnected" badge or toast) when the user goes offline.
- **Feature Gating:** 
    - Keep local models (MediaPipe, Web-LLM) fully functional.
    - If a user attempts to use a cloud model (OpenAI, Gemini, etc.) while offline, display a "Network Connection Required" alert.

### 3. Local Model Persistence
- **Cache API Integration:** Ensure large model weights (WASM, binary files) are stored in the browser's Cache API to prevent redundant multi-gigabyte downloads.
- **Persistence Verification:** Verify that local models can be initialized and run even when the initial request to the CDN fails.

### 4. Data Continuity
- **IndexedDB Persistence:** Replace the current `localStorage`-based persistence for Journals, Chats, and Notebooks with an IndexedDB-backed implementation:
    - Identify all places that read/write `localStorage` for content persistence.
    - Implement asynchronous IndexedDB stores with appropriate object stores and indexes for each content type (Journals, Chats, Notebooks).
    - Convert synchronous reads/writes to async calls:
        - Ensure save/create/edit operations call the new async persistence functions and return promises.
        - Update UI flows to handle async state (loading indicators, error states).
    - Add basic transaction and error handling to avoid data corruption:
        - Use read-write transactions for mutations.
        - Implement rollback/retry logic for failed transactions.
    - Provide an export option for offline-created content (e.g., JSON download) to prevent data loss if users clear browser data.
    - Warn users about clearing browser data and its impact on offline content.

## Non-Functional Requirements
- **Storage Quota Management:** Handle potential storage quota limits for large AI models gracefully with the following concrete requirements:
    - Attempt Storage Persistence API `persist()` (reference: [Storage Persistence API](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)).
        - Note: `persist()` returns a boolean. If `false` (denied), do NOT retry automatically as it won't change the browser policy.
        - Instead, record the denial in state and surface a clear user message explaining how to enable persistence (usually via browser settings or "Add to Home Screen").
        - Recommend alternative strategies (e.g., manual cache clearing) if persistence is not granted.
    - Define exact UI/UX flows for quota errors:
        - Display a user-facing error banner when quota is exceeded.
        - Provide an option to free space (clear cache) with a confirmation dialog.
        - Show a prioritized model-selection dialog when caching fails, allowing users to choose which models to keep.
    - Require a lightweight quota management view showing:
        - Total storage used by each cached model.
        - Last-access timestamps for each model.
        - Option to manually remove individual models.
    - Define fallback behavior when a model cannot be cached:
        - Switch to streaming-only mode with an "offline-unavailable" indicator.
        - Graceful degradation: allow continued use of cloud models when online.
    - Acceptance criteria must include:
        - Tests for `persist()` outcomes (granted, denied, prompt).
        - UI states for quota-exceeded and cache-clear actions.
        - Spec note: TBD - "PWA Storage Persistence API best practices" guide to be authored.

## Acceptance Criteria
- [ ] The app is "Installable" on Chromium and Safari browsers.
- [ ] The app loads the full UI and allows navigation while in "Airplane Mode."
- [ ] Local AI models (if previously loaded) can start a new chat while offline.
- [ ] Switching to a cloud model while offline triggers a clear error message.
- [ ] The UI correctly reflects the online/offline status in real-time.

## Out of Scope
- Cloud synchronization or backup.
- Offline support for external web search (Tavily).
