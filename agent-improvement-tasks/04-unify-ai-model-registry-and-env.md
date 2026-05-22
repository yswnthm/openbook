# Task 04 - Unify AI Model Registry And Environment Validation

## Goal

Create a single typed source of truth for model IDs, provider metadata, required environment variables, capabilities, UI labels, and server provider construction.

## Evidence

- `components/features/ai/ai-model-picker.tsx` defines UI models separately from `app/api/lib/ai/providers.ts`.
- The picker includes `neuman-gpt-oss-free`, but the server provider map does not.
- `lib/env/server.ts` does not include every key used by `providers.ts`, such as `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `HF_TOKEN`, and `GOOGLE_GENERATIVE_AI_API_KEY`.
- `providers.ts` can attempt provider calls even when the required key is missing.
- Production code contains stale notes inside the model picker comments.

## Scope

In scope:

- Model registry.
- Provider key requirements.
- UI model picker data.
- Server provider map.
- Model unavailable states.

Out of scope:

- Upgrading to newer AI SDK major versions.
- Adding new providers beyond the currently intended ones.
- Real-time pricing calculation unless simple metadata is already available.

## Subtask Checklist

- [ ] Create a shared typed model registry.
- [ ] Move UI labels, provider IDs, capabilities, tiers, and required env keys into the registry.
- [ ] Export `ModelId`, `MODEL_IDS`, and model validation helpers.
- [ ] Make the model picker render from the registry.
- [ ] Make server provider construction use the same registry.
- [ ] Add all provider env vars to `lib/env/server.ts`.
- [ ] Add missing-key detection for optional providers.
- [ ] Add disabled/hidden UI states for unavailable models.
- [ ] Return stable API errors for unavailable models.
- [ ] Remove stale implementation comments from production model picker code.
- [ ] Add tests proving UI and server model IDs cannot drift.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Create model registry | Move model IDs and metadata into one shared module that both UI and API can import. | There is one authoritative registry file. |
| Move metadata into registry | Include label, provider, provider model name, tier, context window, capabilities, and required env keys for each model. | The picker no longer owns separate model metadata. |
| Export model types/helpers | Export `ModelId`, model ID arrays, and type guards so callers cannot use arbitrary strings. | API schemas and UI props can import shared types. |
| Render picker from registry | Replace the local picker model array with registry-derived data. | Every visible model comes from the registry. |
| Build server providers from registry | Use registry provider/model metadata to construct language model mappings. | Server model IDs cannot drift from registry IDs. |
| Add env vars | Add every provider key read by server code to `lib/env/server.ts`. | No provider key is read only through raw undeclared `process.env`. |
| Detect missing keys | Add helper logic that determines whether a model is usable with current env config. | Missing keys produce a known unavailable state. |
| Add UI unavailable states | Disable or hide models that cannot work because required env is absent. | User cannot unknowingly pick a broken model. |
| Add API unavailable errors | If a request still asks for an unavailable model, return a clear typed error before provider call. | API response explains the provider/model is unavailable. |
| Remove stale comments | Delete old implementation notes and uncertainty comments from production code. | Model picker reads like maintained product code. |
| Add drift tests | Add tests comparing visible UI models, registry IDs, and server provider IDs. | A missing registry/server/UI mapping causes a test failure. |

## Detailed Low-Level Subtasks

- [ ] Open `components/features/ai/ai-model-picker.tsx` and copy every `value` field into your notes.
- [ ] Open `app/api/lib/ai/providers.ts` and copy every `languageModels` key into your notes.
- [ ] Compare picker values with server keys and mark mismatches.
- [ ] Open `lib/env/server.ts` and list every server env var currently declared.
- [ ] Search for `process.env.` under `app/api` and `lib` and list env vars not declared in `serverEnv`.
- [ ] Create `lib/ai/model-registry.ts` or another agreed path.
- [ ] Add one registry entry for each currently supported server model.
- [ ] For each registry entry, include model ID, label, provider, provider model name, tier, context window, capabilities, and required env keys.
- [ ] Add `enabledInPicker` or equivalent so internal-only models can stay hidden.
- [ ] Export `ModelId` from the registry.
- [ ] Export `MODEL_IDS` from the registry.
- [ ] Export `isModelId(value)` from the registry.
- [ ] Export `getModelDefinition(modelId)` from the registry.
- [ ] Export `getMissingEnvForModel(modelId)` or equivalent.
- [ ] Update `ai-model-picker.tsx` to build its list from registry entries.
- [ ] Remove the old local `ALL_MODELS` array.
- [ ] Remove stale comments that describe previous failed refactors.
- [ ] Update `providers.ts` to use registry provider/model metadata.
- [ ] Update default model constants to import from the registry.
- [ ] Add missing env vars to `lib/env/server.ts`.
- [ ] Replace raw `process.env` reads in provider code with validated env access where possible.
- [ ] Add UI behavior for missing env keys: disabled option, hidden option, or clear unavailable state.
- [ ] Add API behavior for missing env keys: return a typed unavailable error.
- [ ] Add tests that every picker-visible model is a valid `ModelId`.
- [ ] Add tests that every server model has required UI metadata.
- [ ] Add tests that a missing env key marks a model unavailable.
- [ ] Add a handoff note listing any model removed, renamed, or intentionally hidden.

## Likely Files

- `components/features/ai/ai-model-picker.tsx`
- `app/api/lib/ai/providers.ts`
- `lib/env/server.ts`
- `lib/env/client.ts`
- New file such as `lib/ai/model-registry.ts`
- Tests near model registry and chat API

## Implementation Steps

1. Create a shared model registry file. Suggested shape:

   ```ts
   export const MODEL_REGISTRY = {
     "google-default": {
       provider: "google",
       providerModel: "models/gemini-3-flash-preview",
       label: "Gemini 3 Flash",
       tier: "preview",
       contextWindow: "1M",
       capabilities: ["fast"],
       requiredEnv: ["GOOGLE_GENERATIVE_AI_API_KEY"],
       enabledInPicker: true,
     },
   } as const;
   ```

2. Export derived types:

   ```ts
   export type ModelId = keyof typeof MODEL_REGISTRY;
   export const MODEL_IDS = Object.keys(MODEL_REGISTRY) as ModelId[];
   ```

3. Make the picker render from the shared registry instead of its own `ALL_MODELS` array.
4. Make `providers.ts` build provider language models from the registry. The server should not have a separate list of model IDs.
5. Add helper functions:
   - `isModelId(value): value is ModelId`
   - `getModelDefinition(modelId)`
   - `getAvailableModels(env)`
   - `getMissingProviderKeys(modelId, env)`
6. Expand `lib/env/server.ts` so it includes every key currently read from `process.env`:
   - `OPENAI_API_KEY`
   - `OPENROUTER_API_KEY`
   - `HF_TOKEN`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `GROQ_API_KEY`
   - `CEREBRAS_API_KEY`
   - `TAVILY_API_KEY`
   - `EXA_API_KEY`
7. Decide how optional providers work:
   - Optional keys should not crash the whole app.
   - Models with missing keys should appear disabled or hidden.
   - API requests for missing-key models should return a stable unavailable response.
8. Remove stale comments from `ai-model-picker.tsx`, especially implementation notes that mention previous refactors.
9. Make default model selection use a registry constant. Avoid hard-coding `google-default` in several files.
10. Add tests:
   - Every picker model exists in server registry.
   - Every server registry model has UI metadata.
   - Missing env key marks a model unavailable.
   - Invalid model fails validation before provider call.

## Acceptance Criteria

- There is one source of truth for model IDs.
- The UI cannot select a model that the server cannot resolve.
- Missing provider keys produce clear unavailable states.
- `lib/env/server.ts` covers all server-side provider keys.
- Stale implementation notes are removed from production code.

## Verification

```bash
npm run typecheck
npm run test
npm run build
```

Manual checks:

- Remove one provider API key locally and confirm related models are disabled or return a graceful error.
- Select every visible model in the picker and confirm the API recognizes the model ID.

## Notes For The Agent

Do not browse model documentation unless the owner asks to update model availability. The task is about internal consistency, not choosing the latest model list.
