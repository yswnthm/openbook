# Specification: Local LLM Inference (MediaPipe) Integration

## 1. Overview
Integrate client-side, offline LLM inference into the main `/chat` application using Google's MediaPipe (LiteRT) engine. This feature allows users to run models like Gemma directly in their browser without server dependencies, supporting both curated downloadable models and custom local file uploads.

## 2. Functional Requirements

### 2.1 Model Selection & Management
- **Integrated Selector:** Update the existing Model Selector in the `/chat` interface to support a "Local / Offline" category.
- **Predefined Models:** Provide a curated list of supported models (e.g., Gemma 2 2B, Gemma 2 9B) that can be downloaded on demand.
- **Custom Upload:** Allow users to upload their own `.task` (LiteRT) model files directly from their local file system.
- **Persistence:** Implement caching (via Cache API or IndexedDB) to prevent re-downloading large model files on page refreshes.

### 2.2 Inference Engine (MediaPipe)
- **Engine Implementation:** Utilize and expand the `use-mediapipe-llm.ts` hook to manage the MediaPipe `FilesetResolver` and `LlmInference` engine.
- **State Management:** Track and display loading states (e.g., "Downloading... 45%", "Initializing GPU...").

### 2.3 Prompt Handling & Context
- **System Prompt Strategy (Local vs. Cloud):**
  - **Cloud Models:** Continue sending System Prompts as a distinct `system` role message (standard behavior).
  - **Local Models:** Since specific LiteRT models/APIs may not strictly adhere to system roles, inject the system prompt directly into the final input prompt string.
  - **Format:** `(System Instruction: <SYSTEM_PROMPT>) User: <USER_PROMPT>` (or similar explicit delineation).
- **Context Window:** Manage context/history effectively to prevent overflowing the local model's limits.

### 2.4 User Interface
- **Chat Interface:** Reuse the existing Chat UI. The experience should be identical whether the model is local or cloud-based.
- **Performance Feedback:** Display inference speed (tokens per second) if available/feasible to give users feedback on local performance.

## 3. Non-Functional Requirements
- **Performance:** Inference must run on the main thread or a Web Worker (preferred to avoid UI blocking) using WebGPU acceleration.
- **Compatibility:** Graceful fallback or error messaging if the user's browser does not support WebGPU.
- **Security:** Ensure local files are processed entirely client-side and never uploaded to a server.

## 4. Tech Stack
- **Library:** `@mediapipe/tasks-genai`
- **Hook:** `hooks/use-mediapipe-llm.ts`
- **Storage:** Browser Cache API / IndexedDB
