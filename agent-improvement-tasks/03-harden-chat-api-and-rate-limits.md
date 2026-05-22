# Task 03 - Harden Chat API And Rate Limits

## Goal

Make API routes safer, predictable, and production-ready. Requests should be validated before reaching model providers, rate limits should work in deployed environments, and failures should return stable user-safe responses.

## Evidence

- `app/api/chat/route.ts` reads `await req.json()` directly and trusts `messages`, `model`, `group`, `user_id`, `timezone`, and `systemPrompt`.
- `lib/auth.ts` accepts any non-empty bearer token and is not enforced by the chat routes.
- `middleware.ts` stores rate limits in a process-local `Map`, which does not work reliably across serverless instances.
- Study routes proxy to `/api/chat` and duplicate request forwarding logic.
- `code_interpreter` is described as code execution but only returns a simulation.

## Scope

In scope:

- `/api/chat`
- `/api/chat/compact`
- `/api/study/*`
- `middleware.ts`
- `lib/auth.ts`
- Shared request and response schemas
- Safe logging and error responses

Out of scope:

- Full account system if none exists.
- Database persistence for conversations, unless needed for rate limiting.
- Real sandboxed code execution.

## Subtask Checklist

- [ ] Define shared Zod schemas for chat, compact, and study requests.
- [ ] Add request body size, message count, and message length limits.
- [ ] Validate model IDs against the shared model registry.
- [ ] Validate group/tool choices against a shared allowlist.
- [ ] Decide and implement policy for client-provided `systemPrompt`.
- [ ] Replace or remove placeholder auth behavior.
- [ ] Replace process-local rate limiting with deploy-safe rate limiting.
- [ ] Add separate limits for expensive AI/search endpoints.
- [ ] Convert provider/key failures into stable user-safe errors.
- [ ] Remove raw user-message logging from production paths.
- [ ] Rename, hide, or clearly label simulated `code_interpreter`.
- [ ] Add tests for invalid JSON, invalid model, oversized payloads, missing keys, and rate limits.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Define shared schemas | Create reusable validation schemas for request bodies instead of validating separately in each route. Include limits and allowed values. | Routes import a shared schema/helper for parsing. |
| Add payload limits | Enforce maximum message count, per-message length, and total request size before provider calls. | Oversized requests return a stable 400 response. |
| Validate model IDs | Check `model` against the shared model registry or temporary allowlist before calling `neuman.languageModel`. | Invalid models never reach provider code. |
| Validate group/tools | Check `group` against server-supported groups and ensure requested tools are allowed for that group. | Invalid groups return a stable 400 response. |
| Decide system prompt policy | Decide whether client `systemPrompt` is allowed, length-limited, ignored, or auth-gated. Implement that policy consistently. | Anonymous prompt override behavior is explicit and tested. |
| Replace placeholder auth | Remove misleading fake auth or wire routes to real user/session validation. Do not keep "any token works" for production. | Auth behavior is either real or clearly marked as not active. |
| Replace rate limiting | Put rate limiting behind a deploy-safe store/adapter. A process-local Map can stay only as a development fallback. | Limits work conceptually across serverless instances. |
| Add expensive-route limits | Give chat, compacting, and search/tool-heavy calls their own stricter buckets. | Expensive endpoints cannot bypass the general API limit. |
| Safe provider errors | Convert missing API keys and provider setup failures into user-safe structured errors. | Users see unavailable-provider errors instead of generic 500s. |
| Reduce raw logging | Stop logging full user messages or provider responses in production paths. Log counts, IDs, status, and timing instead. | Production logs do not expose conversation content. |
| Label simulated tools | Rename or clearly describe `code_interpreter` as simulated unless it truly executes code in a sandbox. | UI/model tool descriptions no longer overpromise. |
| Add tests | Test invalid JSON, bad model, oversized payload, missing key, and rate limit behavior. | Tests fail if validation is removed or bypassed. |

## Detailed Low-Level Subtasks

- [ ] Open `app/api/chat/route.ts` and list every field read from `req.json()`.
- [ ] Open each `app/api/study/*/route.ts` file and list duplicated request-forwarding code.
- [ ] Open `app/api/chat/compact/route.ts` and list its existing validation.
- [ ] Create a shared schema file such as `lib/api/chat-schema.ts`.
- [ ] In the schema file, define allowed message roles.
- [ ] In the schema file, define maximum message count.
- [ ] In the schema file, define maximum characters per message.
- [ ] In the schema file, define maximum total request characters.
- [ ] Add a `ChatMessageSchema` with `role`, `content`, optional `id`, and optional metadata fields used by the app.
- [ ] Add a `ChatRequestSchema` with `messages`, `model`, `group`, `timezone`, and optional `systemPrompt`.
- [ ] Add a helper that safely parses JSON and returns a typed error instead of throwing.
- [ ] In `/api/chat`, replace direct destructuring from `await req.json()` with schema parsing.
- [ ] Return HTTP 400 when schema validation fails.
- [ ] Ensure validation happens before any provider/model/search tool is created.
- [ ] Add model allowlist validation using task 04 registry or a temporary local allowlist.
- [ ] Add group allowlist validation using the server group config.
- [ ] Add explicit behavior for invalid timezone values.
- [ ] Limit `systemPrompt` length.
- [ ] Decide whether anonymous users can send `systemPrompt`.
- [ ] If anonymous users cannot send `systemPrompt`, ignore or reject it before provider calls.
- [ ] Replace production `debugLog` calls that include full messages with metadata-only logs.
- [ ] Replace in-memory rate limit with a deploy-safe adapter if the project has a store.
- [ ] If no deploy-safe store exists yet, isolate rate limiting behind an interface and keep current Map as development fallback only.
- [ ] Add separate rate limit keys for `/api/chat`, `/api/chat/compact`, and search-heavy routes.
- [ ] Make missing API keys return an unavailable-provider error instead of a generic 500.
- [ ] Rename `code_interpreter` or update its description so users know it is simulated.
- [ ] Add unit tests for schema success and failure cases.
- [ ] Add route tests for invalid JSON, bad model, oversized body, and missing provider key.
- [ ] Add a manual curl or fetch example in your handoff note for one valid and one invalid request.

## Likely Files

- `app/api/chat/route.ts`
- `app/api/chat/compact/route.ts`
- `app/api/study/active-recall/route.ts`
- `app/api/study/feynman-technique/route.ts`
- `app/api/study/socratic-tutor/route.ts`
- `middleware.ts`
- `lib/auth.ts`
- `lib/env/server.ts`
- New shared API schema file, for example `lib/api/chat-schema.ts`

## Implementation Steps

1. Create Zod schemas for chat request bodies:
   - `messages`: array with max length and role allowlist.
   - `content`: string with max length.
   - `model`: value from the central model registry from task 04.
   - `group`: value from a central group registry.
   - `timezone`: valid IANA timezone or optional fallback.
   - `systemPrompt`: optional, size-limited, and gated by settings or auth.
2. Add body size and message count limits before provider calls. Suggested starting limits:
   - max 100 messages per chat request.
   - max 40,000 total characters per request.
   - max 8,000 characters per single message.
3. Wrap JSON parsing and model streaming setup in `try/catch`.
4. Return structured JSON errors for validation failures:

   ```json
   { "error": "invalid_request", "message": "..." }
   ```

5. Add an allowlist check so unsupported model IDs fail before `neuman.languageModel(model)` is called.
6. Decide how custom `systemPrompt` should work:
   - If it remains a user setting, validate length and strip unsafe control instructions if needed.
   - If it should be premium or trusted only, enforce that before using it.
   - Never let anonymous callers silently override safety-critical instructions.
7. Replace placeholder auth behavior:
   - If auth is not ready, remove misleading `lib/auth.ts` or rename it to make its placeholder status obvious.
   - If auth is needed now, validate a real session/JWT/provider token.
8. Replace process-local rate limiting for production:
   - Use a persistent store such as Redis, Upstash, Vercel KV, or a provider-native rate limit.
   - Key by authenticated user ID when available, falling back to IP with care.
   - Use separate buckets for expensive routes like `/api/chat`, `/api/chat/compact`, and search tools.
9. Add cost/budget protections:
   - Limit `maxSteps` by model/tier.
   - Limit search tool calls.
   - Add clear errors when provider API keys are missing.
10. Rename or hide `code_interpreter` unless real sandbox execution is implemented. A simulated tool should not be advertised as execution.
11. Add tests for:
   - Invalid JSON.
   - Unsupported model.
   - Oversized payload.
   - Missing API key.
   - Rate limit exceeded.
   - Study route prompt injection path.

## Acceptance Criteria

- Invalid chat requests return 400-level errors without calling providers.
- Unsupported model IDs never reach provider constructors.
- Rate limits work across deployed instances, not only in one Node process.
- API logs avoid full raw user messages in production.
- Study routes and compact route use shared validation patterns.
- Tests cover both valid and invalid paths.

## Verification

```bash
npm run test
npm run typecheck
npm run build
```

Manual checks:

- Send a chat request with an invalid model and confirm a stable 400 response.
- Send an oversized message and confirm a stable 400 response.
- Temporarily remove a provider key and confirm the UI receives a useful unavailable-provider response.

## Notes For The Agent

This task should coordinate with task 04. Do not duplicate model or group string literals in API schemas if a shared registry is being created.
