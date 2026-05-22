# Agent Improvement Task Index

This folder contains implementation-ready task briefs for the major issues listed in `SOFTWARE_QUALITY_AUDIT.md`.

Each task is intentionally scoped so another agent can work independently. Every task file includes a `Subtask Checklist` section for high-level progress, a `Subtask Explanations` section that explains what each checklist item means and how to know it is complete, and a `Detailed Low-Level Subtasks` section with literal file-by-file actions for low-autonomy agents. Agents should still inspect the current code before editing, because the repo may change between task assignment and implementation.

## Recommended Order

1. [01 - Restore Build Quality Gates](./01-restore-build-quality-gates.md)
2. [02 - Fix Dependency And Package Manager Drift](./02-fix-dependency-and-package-manager-drift.md)
3. [10 - Establish Test And CI Coverage](./10-establish-test-and-ci-coverage.md)
4. [03 - Harden Chat API And Rate Limits](./03-harden-chat-api-and-rate-limits.md)
5. [04 - Unify AI Model Registry And Env](./04-unify-ai-model-registry-and-env.md)
6. [08 - Harden Markdown And Journal Security](./08-harden-markdown-journal-security.md)
7. [05 - Move User Data To Durable Storage](./05-move-user-data-to-durable-storage.md)
8. [06 - Repair Attachments And Multimodal Chat](./06-repair-attachments-and-multimodal-chat.md)
9. [09 - Rework Study Mode Contract](./09-rework-study-mode-contract.md)
10. [07 - Improve Performance And Bundle Size](./07-improve-performance-and-bundle-size.md)
11. [11 - Refresh Documentation And Onboarding](./11-refresh-documentation-and-onboarding.md)

## Shared Rules For Agents

- Do not remove user-facing functionality unless the task explicitly asks you to replace it.
- Preserve existing UI conventions unless the task is specifically about changing them.
- Add or update tests for every behavioral change.
- Prefer typed shared contracts over duplicated string literals.
- Keep migrations backward-compatible for existing `localStorage` data.
- Never re-enable build bypasses to make checks pass.
- Document any intentionally deferred risk in the final response and in code comments only where needed.

## Common Verification Commands

Use the package manager selected by task 02. Once fixed, the project should provide these scripts:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

If the project chooses Bun instead of npm, mirror the same script names so contributors can still run:

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```
