# Task 08 - Harden Markdown, Journal, Link, Image, And Privacy Security

## Goal

Reduce XSS, unsafe link, remote image, and privacy risks in user-generated and model-generated content.

## Evidence

- `components/features/spaces/chat/markdown.tsx` treats any string accepted by `new URL()` as a valid external link. This can include protocols the app should not allow.
- `components/features/journal/editor/editor-content.tsx` renders block content with `dangerouslySetInnerHTML`.
- `components/features/journal/editor/editor.tsx` sanitizes pasted markdown, but stored block content can still be rendered directly later.
- `next.config.js` allows remote images from any HTTPS hostname.
- `app/layout.tsx` injects a development script from `//unpkg.com/...`.
- `app/(config)/providers.tsx` initializes PostHog with `person_profiles: 'always'`.

## Scope

In scope:

- Markdown link/image protocol filtering.
- Journal HTML sanitization and storage rules.
- Next image remote host allowlist.
- Security headers and CSP where practical.
- Analytics privacy defaults and opt-out controls.

Out of scope:

- Full account security model.
- End-to-end encryption unless requested separately.
- Replacing the editor entirely.

## Subtask Checklist

- [ ] Create a central URL/protocol sanitizer.
- [ ] Apply sanitizer to markdown links and link previews.
- [ ] Render rejected links as safe plain text.
- [ ] Add `rel` protections to model-generated external links.
- [ ] Sanitize journal HTML before storage.
- [ ] Sanitize journal HTML again at render boundaries.
- [ ] Configure DOMPurify with explicit allowed tags and attributes.
- [ ] Restrict Next image remote hosts or introduce a safe image proxy.
- [ ] Remove or harden the development script loaded from `unpkg`.
- [ ] Add security headers compatible with the app.
- [ ] Review PostHog defaults and add privacy/opt-out behavior if needed.
- [ ] Add malicious markdown and journal payload tests.
- [ ] Document the security policy in `docs/security.md`.

## Subtask Explanations

| Subtask | What to do | Completion signal |
| --- | --- | --- |
| Create URL sanitizer | Build one helper that accepts only approved protocols and rejects unsafe links. | Markdown, previews, and future callers can reuse one helper. |
| Apply to markdown | Use the sanitizer before rendering any model/user-generated markdown link. | Unsafe protocol links are not clickable. |
| Render rejected links safely | Convert rejected links to text instead of dropping surrounding content or creating broken anchors. | User can read content without executing it. |
| Add external link rel | Add `noopener noreferrer` and optionally `nofollow` to model-generated external links. | External links cannot control the opener window. |
| Sanitize before storage | Clean journal HTML when content is created or pasted so dangerous content is not saved. | Newly saved journal blocks are sanitized. |
| Sanitize at render | Clean block content again before `dangerouslySetInnerHTML` because old/imported data may bypass storage-time cleanup. | Old malicious stored data cannot execute. |
| Configure DOMPurify | Use an explicit allowlist of tags and attributes instead of broad default behavior. | Sanitizer behavior is intentional and reviewable. |
| Restrict image hosts | Replace wildcard remote image host config or add a proxy/allowlist plan. | Remote image loading policy is explicit. |
| Harden dev script | Remove the `unpkg` development script or make it explicit and development-only. | No schemeless third-party script is loaded casually. |
| Add security headers | Add CSP and related headers that fit the app without breaking normal use. | Responses include agreed security headers. |
| Review analytics privacy | Ensure PostHog settings do not identify users or capture sensitive content without product intent. | Analytics defaults and opt-out behavior are documented. |
| Add malicious tests | Test common XSS payloads in markdown and journal content. | Unsafe payloads fail to render executable content. |
| Document policy | Create a short security doc explaining allowed links, HTML, image hosts, and analytics choices. | Future agents know the intended security boundary. |

## Detailed Low-Level Subtasks

- [ ] Open `markdown.tsx` and locate `isValidUrl`.
- [ ] Replace generic `new URL` validation with an allowed-protocol helper.
- [ ] Allow `http:` links.
- [ ] Allow `https:` links.
- [ ] Decide whether to allow `mailto:` links.
- [ ] Reject `javascript:` links.
- [ ] Reject `data:` links.
- [ ] Reject `vbscript:` links.
- [ ] Render rejected links as plain text instead of clickable anchors.
- [ ] Update `renderHoverCard` to call the same URL sanitizer before rendering `Link`.
- [ ] Update `LinkPreview` to skip previews for rejected URLs.
- [ ] Add `nofollow` to model-generated external link `rel` if product policy accepts it.
- [ ] Open `editor.tsx` and locate paste sanitization.
- [ ] Create a central sanitizer helper for journal HTML.
- [ ] Configure allowed tags for journal content.
- [ ] Configure allowed attributes for journal content.
- [ ] Strip event-handler attributes such as `onclick` and `onerror`.
- [ ] Strip `script`, `style`, and unsafe embedded content.
- [ ] Sanitize pasted markdown using the central helper.
- [ ] Open `editor-content.tsx` and locate `dangerouslySetInnerHTML`.
- [ ] Sanitize `block.content` immediately before rendering with `dangerouslySetInnerHTML`.
- [ ] Add tests for pasted malicious HTML.
- [ ] Add tests for stored malicious block content.
- [ ] Add tests for unsafe markdown links.
- [ ] Open `next.config.js` and locate remote image config.
- [ ] Replace wildcard host config with explicit allowed hosts where possible.
- [ ] If arbitrary user images must remain, create a separate safe proxy task or endpoint.
- [ ] Open `app/layout.tsx` and locate the development `unpkg` script.
- [ ] Remove the script if unused.
- [ ] If the script is required, make the URL explicit `https://` and restrict it to development.
- [ ] Add security headers in middleware or Next config.
- [ ] Verify headers do not break local development.
- [ ] Open PostHog provider setup.
- [ ] Decide whether `person_profiles: 'always'` is appropriate.
- [ ] Add opt-out or less-identifying analytics behavior if required.
- [ ] Create `docs/security.md` with the accepted link, HTML, image, and analytics policies.

## Likely Files

- `components/features/spaces/chat/markdown.tsx`
- `components/features/journal/editor/editor.tsx`
- `components/features/journal/editor/editor-content.tsx`
- `next.config.js`
- `middleware.ts`
- `app/layout.tsx`
- `app/(config)/providers.tsx`
- `lib/env/client.ts`
- New helper such as `lib/security/sanitize.ts`

## Implementation Steps

1. Create a central URL sanitizer:

   ```ts
   const ALLOWED_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
   ```

   Use it anywhere model/user content creates `href` or image `src`.
2. Update markdown rendering:
   - Reject `javascript:`, `data:`, `vbscript:`, and unknown protocols.
   - Add `rel="noopener noreferrer nofollow"` for model-generated external links.
   - Decide how to render rejected links: plain text is safest.
3. Review `LinkPreview`:
   - Ensure it only fetches favicons for allowed HTTP/HTTPS hosts.
   - Consider disabling previews for private IPs or localhost.
4. Harden journal blocks:
   - Sanitize block content before storage and before render.
   - Configure DOMPurify with an explicit allowed tag and attribute list.
   - Strip event handlers and script/style tags.
   - Prefer storing structured block content where possible instead of arbitrary HTML.
5. Add tests with malicious content:
   - `<img src=x onerror=alert(1)>`
   - `<script>alert(1)</script>`
   - Markdown link using the `javascript:` protocol.
   - Markdown link using a `data:text/html` payload.
   - `mailto:` link should still work if allowed.
6. Restrict `next.config.js` image remote patterns:
   - Replace hostname `**` with explicit trusted hosts.
   - If user attachments need arbitrary image display, proxy through a validated image endpoint with size limits and host allowlist.
7. Add security headers:
   - Content Security Policy.
   - `X-Content-Type-Options: nosniff`.
   - `Referrer-Policy`.
   - `Permissions-Policy`.
   - Frame restrictions if compatible with deployment.
8. Replace schemeless development script URL with explicit `https://` or remove it if no longer needed.
9. Review analytics:
   - Do not use person profiles by default unless the product has consent and privacy copy.
   - Add an opt-out path or respect a local preference.
   - Avoid sending journal/chat content to analytics.
10. Document security decisions in a short `docs/security.md` file.

## Acceptance Criteria

- Unsafe markdown links render as text or are removed.
- Stored journal HTML is sanitized before rendering.
- Remote image host policy is explicit.
- Security headers are configured and tested.
- Analytics does not identify users by default without a deliberate product decision.
- Tests cover common XSS payloads.

## Verification

```bash
npm run test
npm run typecheck
npm run build
```

Manual checks:

- Paste malicious HTML into a journal and reload the page.
- Ask the chat to output a `javascript:` link and confirm it cannot be clicked as code.
- Confirm legitimate HTTPS and mailto links still work.

## Notes For The Agent

Do not rely on one sanitizer call at paste time. Content can enter through imports, migrations, devtools, future APIs, or old stored data. Sanitize at render boundaries too.
