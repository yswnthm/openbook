# Task 06 - Repair Attachments And Multimodal Chat

## Goal

Make attachments work end-to-end or remove the UI claims. The code currently carries attachment state but does not actually let users add and send files.

## Evidence

- `components/features/spaces/input/input-content-box.tsx` has a hidden file input with no `onChange` handler.
- There is no visible attach button connected to `fileInputRef`.
- `ChatClient.tsx` stores `attachments`, but `appendWithPersist` sends only message content.
- `components/features/spaces/chat/message.tsx` expects `experimental_attachments`, but persisted `ChatMessage` does not include them.
- README advertises rich attachments, drag-and-drop, and clipboard paste support.

## Scope

In scope:

- File input UX.
- File validation.
- Attachment previews.
- Sending attachments to the AI SDK request.
- Persisting attachment metadata with messages.
- Clearing attachments after successful send.
- Tests for attachment behavior.

Out of scope:

- Full document OCR or PDF extraction unless the owner requests it.
- Large file storage backend if task 05 has not selected one yet.
- Multi-user file sharing.

## Subtask Checklist

- [ ] Decide supported MVP file types and size limits.
- [ ] Add a shared `ChatAttachment` type.
- [ ] Add attachment fields to persisted chat message types.
- [ ] Add a visible attach button connected to the hidden file input.
- [ ] Implement file input `onChange` handling.
- [ ] Add shared validation for type, file count, per-file size, and total size.
- [ ] Add removable attachment previews before send.
- [ ] Revoke object URLs or avoid leaking preview URLs.
- [ ] Include attachments in the AI SDK request payload.
- [ ] Persist sent attachment metadata with the user message.
- [ ] Render sent attachments in chat history after refresh.
- [ ] Clear attachments only after a successful submit start.
- [ ] Add paste and drag-drop support only after click-to-attach works.
- [ ] Add tests for add, reject, remove, send, persist, and render flows.
- [ ] Update README/docs to match the exact supported attachment behavior.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Decide supported files | Pick the exact MIME types and sizes supported in the first implementation. Do not claim PDFs or arbitrary files work unless they really reach the model. | Constants or docs list supported types and limits. |
| Add attachment type | Define one shared attachment shape used by input state, messages, and rendering. | No separate incompatible attachment shapes remain. |
| Add message fields | Extend persisted chat messages so sent attachments survive refresh and retry/edit flows. | Message type includes optional attachments. |
| Add visible attach button | Add a user-accessible button that opens the file picker. | Users can discover and click attachment upload. |
| Implement file input handling | Read selected files, validate them, convert them to attachment objects, and reset the input. | Selecting a valid file updates attachment state. |
| Add validation | Reject too many files, too-large files, and unsupported types with clear feedback. | Invalid files never enter pending attachment state. |
| Add previews | Show pending files before send, with image thumbnails where supported and remove controls for all. | User can inspect and remove attachments before sending. |
| Revoke preview URLs | Clean up object URLs when attachments are removed or the component unmounts. | No long-lived object URL leaks are introduced. |
| Send to AI SDK | Pass attachments in the exact request field expected by the installed AI SDK version. | Network/request payload includes attachment data for supported files. |
| Persist metadata | Save sent attachment metadata with the user message. | Refreshing history still shows attachment entries. |
| Render after refresh | Update message rendering to display persisted attachments, not only live SDK messages. | Sent attachments are visible after page reload. |
| Clear after submit | Clear pending attachments only once a send has actually started successfully. | Failed validation does not discard user-selected files. |
| Add paste/drop later | Implement paste and drag-drop by reusing the same validation path, not by creating separate logic. | All attachment entry points behave consistently. |
| Add tests | Cover add, reject, remove, send, persist, and render behavior. | Breaking attachment flow causes test failures. |
| Update docs | State exactly which attachment types work and any local-only limitations. | README no longer overclaims attachment support. |

## Detailed Low-Level Subtasks

- [ ] Open `input-content-box.tsx` and locate the hidden file input.
- [ ] Confirm the hidden file input has no `onChange` handler before editing.
- [ ] Open `ChatClient.tsx` and locate `attachments` state.
- [ ] Open `message.tsx` and locate `experimental_attachments` rendering.
- [ ] Create or update a shared `ChatAttachment` type.
- [ ] Add `attachments?: ChatAttachment[]` to the persisted `ChatMessage` type.
- [ ] Add constants for allowed MIME types.
- [ ] Add constants for max file count.
- [ ] Add constants for max per-file size.
- [ ] Add constants for max total attachment size.
- [ ] Add a helper that converts `File` objects to attachment objects.
- [ ] Add a helper that validates one file.
- [ ] Add a helper that validates the whole selected file list.
- [ ] Add a visible icon button beside the chat textarea.
- [ ] Connect the icon button to `fileInputRef.current?.click()`.
- [ ] Add `onChange` to the hidden file input.
- [ ] In `onChange`, read `event.target.files`.
- [ ] In `onChange`, validate selected files before updating state.
- [ ] Show a toast for every rejected file group.
- [ ] Reset `event.target.value` after processing selected files.
- [ ] Render each pending attachment with name, type/size, and remove button.
- [ ] For image files, render a small preview.
- [ ] Revoke object URLs when an attachment is removed.
- [ ] Revoke all remaining object URLs when the input component unmounts.
- [ ] Update `appendWithPersist` to include attachments on the user message.
- [ ] Update `appendWithPersist` to pass attachments to the AI SDK append call.
- [ ] Confirm the correct AI SDK field name for the installed version.
- [ ] Clear `attachments` after a successful submit starts.
- [ ] Keep `attachments` unchanged if validation or submit fails before sending.
- [ ] Update edit/retry logic so original message attachments are preserved.
- [ ] Update chat history rendering so persisted attachments display after refresh.
- [ ] Add a test that clicking attach triggers the file input.
- [ ] Add a test that unsupported file types are rejected.
- [ ] Add a test that an image preview appears.
- [ ] Add a test that removing an attachment removes it from submit payload.
- [ ] Add a test that submitting sends attachment metadata.
- [ ] Add a test that sent message attachments render in history.

## Likely Files

- `components/features/spaces/input/input-content-box.tsx`
- `app/(core)/ChatClient.tsx`
- `components/features/spaces/chat/message.tsx`
- `components/features/spaces/chat/messages.tsx`
- `contexts/SpacesContext.tsx`
- `lib/types.ts`
- New file helpers such as `lib/attachments.ts`

## Implementation Steps

1. Decide the first supported attachment types. Recommended MVP:
   - Images: `image/png`, `image/jpeg`, `image/webp`, `image/gif`.
   - Text: `text/plain`, `text/markdown`, `text/csv`.
   - PDFs only if the model/provider path can actually use them.
2. Add attachment fields to the chat message type:

   ```ts
   type ChatAttachment = {
     id: string;
     name: string;
     contentType: string;
     size: number;
     url?: string;
     dataUrl?: string;
   };
   ```

3. Add a visible attach button in `ChatInput`. Use an icon button, likely `Paperclip` from `lucide-react`.
4. Wire the hidden input:
   - `onClick` on attach button calls `fileInputRef.current?.click()`.
   - `onChange` reads selected files.
   - Reset input value after handling files so selecting the same file again works.
5. Validate files:
   - Reject unsupported MIME types.
   - Enforce per-file and total size limits.
   - Show a toast with the reason.
   - Suggested MVP limit: 5 files, 10 MB total, 5 MB per image.
6. Generate previews:
   - Images can use object URLs or data URLs.
   - Revoke object URLs on removal/unmount.
   - Text files can show filename and size only.
7. Send attachments:
   - For AI SDK support, pass attachments through the correct options object for the installed `@ai-sdk/react` version.
   - Preserve current message ID so persisted user message and SDK message stay aligned.
   - Include `experimental_attachments` or the current SDK equivalent.
8. Persist attachments:
   - Add attachments to `ChatMessage`.
   - Store metadata and stable URLs, not large base64 strings, once durable storage exists.
   - If backend storage is not ready, document local-only limits and avoid storing large files indefinitely.
9. Clear attachments only after successful submit starts. If submit fails validation, keep them so the user can fix the message.
10. Add paste and drag-drop only after click-to-attach works:
   - Paste images from clipboard.
   - Drop files onto the input area.
   - Reuse the same validation helper.
11. Add tests:
   - Attach button opens file picker.
   - Invalid type is rejected.
   - Valid image is added and removable.
   - Submit sends attachments and clears them.
   - Persisted message renders attachment preview.

## Acceptance Criteria

- Users can add and remove supported files before sending.
- Unsupported or oversized files produce clear UI feedback.
- Sent user messages display their attachments.
- The API request includes attachments in the format expected by the AI SDK/provider.
- Attachment state is not lost during edit/retry flows.
- README accurately describes what is supported.

## Verification

```bash
npm run test
npm run typecheck
npm run build
```

Manual checks:

- Attach one image and send a chat message.
- Attach multiple images and remove one before sending.
- Try an unsupported file and confirm it is rejected.
- Refresh after sending and confirm attachment rendering does not break.

## Notes For The Agent

Avoid adding a paperclip button that only updates UI state. This task is complete only when a supported attachment reaches the model request or the documentation explicitly narrows support.
