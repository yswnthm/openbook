# Implementation Plan: Local LLM Inference (MediaPipe)

This plan outlines the integration of client-side LLM inference using MediaPipe, supporting predefined Gemma 3 models and custom file uploads with persistent caching.

## Phase 1: Core Engine Enhancements [checkpoint: 736e61a]
- [x] Task: Update `useMediaPipeLLM` for URL Loading and Progress eb2101c
    - [ ] Create unit tests for `useMediaPipeLLM` to verify loading states and progress reporting.
    - [ ] Enhance `loadModel` to accept a URL (string) in addition to a `File`.
    - [ ] Implement `fetch` with progress tracking to report download percentage to the UI.
- [x] Task: Implement System Prompt Injection Logic 9e517cb
    - [ ] Update `generate` function in `useMediaPipeLLM` to handle system prompts for LiteRT models.
    - [ ] Logic: Prepend system instructions to the user's prompt string: `(System Instruction: <SYSTEM_PROMPT>) User: <USER_PROMPT>`.
    - [ ] Verify with tests that the combined prompt is formatted correctly before being sent to the engine.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Core Engine Enhancements' (Protocol in workflow.md)

## Phase 2: Data Persistence & Model Management [checkpoint: 255fa3e]
- [x] Task: Implement Model Caching Layer 30ad657
    - [ ] Create a utility for browser `CacheStorage` to store and retrieve large `.task` files.
    - [ ] Integrate caching into the `loadModel` flow: Check cache -> Fetch if missing -> Save to cache.
- [x] Task: Define Local Model Registry 4a4e2fa
    - [ ] Create a configuration file (e.g., `lib/local-models.ts`) containing metadata and URLs for Gemma 3 models (270M, 1B, 4B, 12B).
    - [ ] Ensure models are mapped to their respective LiteRT task file URLs.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Data Persistence & Model Management' (Protocol in workflow.md)

## Phase 3: UI Integration
- [x] Task: Update `AiModelPicker` with Gemma Models df75d04
    - [ ] Add the predefined Gemma 3 models from the registry to the `ALL_MODELS` list in `ai-model-picker.tsx`.
    - [ ] Style the items to indicate they are "Downloadable Local Models".
- [ ] Task: Enhance `ChatInput` & `ChatClient` Integration
    - [ ] Ensure `ChatClient` triggers the download flow when a predefined local model is selected.
    - [ ] Verify that the progress bar correctly reflects both download and initialization phases.
    - [ ] Handle error states (e.g., WebGPU not supported) with user-friendly toast messages.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Integration' (Protocol in workflow.md)

## Phase 4: Final Polishing & Verification
- [ ] Task: Performance & Memory Optimization
    - [ ] Ensure previous model instances are correctly disposed of to prevent memory leaks.
    - [ ] Optimize the context window handling to stay within local device limits.
- [ ] Task: Offline Mode Verification
    - [ ] Verify that once a model is cached, the application can load it and perform inference without an internet connection.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Verification' (Protocol in workflow.md)
