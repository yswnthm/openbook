# Model Updation Project & Registry Context

This document captures the current status, configuration, and objectives of the AI model registry update project. This context can be shared across conversations or used to generate public updates (e.g., LinkedIn posts).

---

## 🚀 Project Overview

We are performing a major update of the AI model registry within the **OpenBook** codebase. Over time, AI model providers release newer, faster, and more cost-effective models while deprecating older ones. The goal of this task is to audit our existing providers, identify deprecated or legacy model identifiers, and transition the application to the latest state-of-the-art models.

### 📍 Current Progress & Workspace Setup
- **Target Repository:** `openbook`
- **Active Git Branch:** `feat/model-updation` (newly created for these changes)
- **Primary Configuration Files:**
  - Model Registry: [lib/ai/model-registry.ts](file:///Users/yswnth/Documents/openbook/lib/ai/model-registry.ts)
  - API Layer Provider Mapping: [app/api/lib/ai/providers.ts](file:///Users/yswnth/Documents/openbook/app/api/lib/ai/providers.ts)

---

## 🛠️ Current Model Registry & Providers List

Below is the list of active model providers currently supported in OpenBook, alongside their currently configured models:

### 1. OpenAI (`openai`)
- **`openai-gpt-5-4-mini`** (ID) → `gpt-5.4-mini-2026-03-17`
- **`openai-gpt-5-4-nano`** (ID) → `gpt-5.4-nano-2026-03-17`

### 2. Google (`google`)
- **`google-gemini-3-1-pro`** → `models/gemini-3.1-pro-preview`
- **`google-gemini-3-5-flash`** → `models/gemini-3.5-flash`
- **`google-gemini-3-1-flash-lite`** → `models/gemini-3.1-flash-lite`
- **`google-default`** → `models/gemini-3.5-flash` *(Default fallback)*

### 3. Cerebras (`cerebras`)
- **`cerebras-gpt-oss-120b`** → `gpt-oss-120b`
- **`cerebras-llama-3-1-8b`** → `llama3.1-8b`
- **`cerebras-qwen-3-235b`** → `qwen-3-235b-a22b-instruct-2507`
- **`cerebras-zai-glm-4-7`** → `zai-glm-4.7`

### 4. Groq (`groq`)
- **`neuman-gpt-oss-free`** → `qwen/qwen3-32b`
- **`groq-compound`** → `groq/compound`
- **`groq-qwen-3`** → `qwen/qwen3-32b`
- **`groq-llama-4-scout-17b-16e-instruct`** → `meta-llama/llama-4-scout-17b-16e-instruct`

### 5. OpenRouter (`openrouter`)
- **`google-gemma-3n`** → `google/gemma-3n-e2b-it:free`
- **`google-gemma-3-27b`** → `google/gemma-3-27b-it:free`

### 6. Hugging Face (`huggingface`)
- **`hf-apriel-15b`** → `ServiceNow-AI/Apriel-1.6-15b-Thinker:together`
- **`hf-olmo-32b`** → `allenai/Olmo-3.1-32B-Think:publicai`

### 7. Local / WebGPU (`local`)
- **`local-phi-3-mini`** → `local-phi-3-mini`
- **`local-phi-2`** → `local-phi-2`

### 8. Ollama (`ollama`)
- **`ollama-gemma-3-270m`** → `gemma3:270m`
- **`ollama-llama-3`** → `llama3`
- **`ollama-mistral`** → `mistral`
- **`ollama-gemma-2`** → `gemma2`
- **`ollama-phi-3`** → `phi3`
- **`ollama-llama-3-70b`** → `llama3:70b`

---

## 📈 Planned Next Steps

1. **Information Gathering:** Check each provider's documentation for the latest release versions, deprecated flags, context limits, and cost profiles.
2. **Registry Updates:** Update the definitions inside [lib/ai/model-registry.ts](file:///Users/yswnth/Documents/openbook/lib/ai/model-registry.ts) with the verified model IDs, display labels, capability tags, and context windows.
3. **Integration Verification:** Update unit tests and verify model selection dropdown flows in the front-end user interface to ensure the application connects to the new models successfully.
