# Code review: voicu-tulai site

**Date:** 2026-11-05 · **Commit reviewed:** `bf569ca` · **Scope:** all application code (`app/`, `components/`, `lib/`, `next.config.ts`).

## Summary

The codebase is small, readable and in good shape for a personal site. The API key never reaches the browser, chat input is validated and size-capped, model output is rendered as safe text (no raw HTML injection), and security headers are in place.

The most important issue is that **other websites can make visitors' browsers call the chat API**, spending your OpenRouter credits. After that come two confirmed UI bugs: a page that stays unscrollable after the mobile menu, and a closed chat panel that keyboard users can still tab into. Several other items are cleanups that become worth doing as the site grows.

Findings marked **Confirmed** were reproduced while writing this review. **Plausible** means the cause is clear from the code but wasn't reproduced.

| # | Severity | Finding | Status | Resolution |
|---|----------|---------|--------|------------|
| 1 | High | Other websites can trigger chat requests | Confirmed | **Fixed** |
| 2 | Medium | Rate limiter is weak and its memory grows without limit | By design (known) | **Fixed** (memory); still per-instance |
| 3 | Medium | Keyboard users can tab into the closed chat panel | Confirmed | **Fixed** |
| 4 | Medium | Mobile menu can leave the page unscrollable | Confirmed | **Fixed** |
| 5 | Medium | Hero glow animation runs continuously | Confirmed (by reading the code) | **Fixed** |
| 6 | Medium | Some content is hard-coded outside `lib/data.ts` | Confirmed | **Fixed** |
| 7 | Medium | No social-preview image or `metadataBase` | Confirmed | **Fixed** |
| 8 | Low | Starting a new chat mid-reply can bring back the old conversation | Plausible | Open |
| 9 | Low | A fast double Enter can send the same message twice | Plausible | Open |
| 10 | Low | Chat auto-scroll pulls the reader to the bottom on every update | Confirmed | Open |
| 11 | Low | Without JavaScript, sections are invisible and stats read "0" | Confirmed | Open |
| 12 | Low | Dates are fixed at build time | Confirmed | Open |
| 13 | Low | Smaller API route issues | Plausible / info | Open |
| 14 | Tooling | `npm run lint` is broken and there are no tests | Confirmed | Open |

## Fixes applied (2026-11-05)

Issues 1 to 7 are fixed. They were retested against a local production build (`next build && next start`): API checks with curl, plus a 33-check headless-Chrome suite, all passing.

| # | What changed | How it was verified |
|---|--------------|---------------------|
| 1 | `route.ts` rejects non-JSON bodies (415) and requests marked cross-site or same-site by `Sec-Fetch-Site` (403) before doing any work. | `text/plain` cross-site request: was `200` with a model reply, now `415`. An attacker page on another origin: its `text/plain` POST gets `415`, and its JSON POST is blocked by the browser's CORS check. Same-origin browser chat and non-browser JSON clients still get `200`. |
| 2 | Expired entries are swept from the `hits` map once it holds more than 1,000 IPs. | 31 requests from one IP: 30 allowed, the 31st gets `429`; a different IP is unaffected. The sweep was checked by reading the code (expiry takes 5 minutes, too long to test live). |
| 3 | The panel is `inert` while closed (and the launcher while open). Focus returns to whatever opened the chat. Below the `sm` breakpoint the page behind the chat can't scroll, through a shared scroll-lock helper (`lib/scroll-lock.ts`). | 40 Tab presses never reach the closed chat. Escape and the close button both return focus to the opener. The mobile scroll lock is applied, released and re-applied correctly when crossing the breakpoint. |
| 4 | The menu closes when the viewport widens past `md`, and the scroll lock is always released by the effect cleanup (shared helper). | The menu reproduction (open at 390px, resize to 1440px) now leaves the page scrollable; tapping a menu link also unlocks scrolling. |
| 5 | The animation loop stops once the glow settles, restarts on pointer movement, and pauses while the hero is off-screen. | `requestAnimationFrame` count: 0 frames at rest, about 60/s while moving, 0 after settling, 0 when the hero is off-screen. |
| 6 | The timeline is derived from `career` and `earlierRoles` (`lib/timeline.ts`). The hero trail, terminal card, marquee, journey intro and earlier-role years (now numbers) moved to `lib/data.ts`. | Same 7 lanes in the same order, "29 years · 7 companies", same axis ticks. The hero, terminal card and earlier roles render identically. |
| 7 | Added `metadataBase` (`lib/site.ts`: `NEXT_PUBLIC_SITE_URL`, then Vercel's production domain, then localhost), a canonical URL, full Open Graph profile tags, a `summary_large_image` Twitter/X card, a generated 1200×630 `app/opengraph-image.tsx` in the site's fonts, plus `robots.txt` (disallows `/api/`) and `sitemap.xml`. | The `og:image` and `twitter:image` URLs are absolute, and the image is a 1200×630 PNG. `robots.txt` and the sitemap are served correctly. |

No console errors or CSP violations on desktop or mobile, and no horizontal overflow. A real chat round-trip works in the browser.

---

## High

### 1. Other websites can trigger chat requests
**Where:** [app/api/chat/route.ts:55-62](app/api/chat/route.ts#L55-L62)

`req.json()` parses the body whatever its `Content-Type` is. A browser can send a `text/plain` POST to another site without first asking permission (the "CORS preflight"). So any web page can make its visitors' browsers call `/api/chat`. The attacking page can't read the reply, but every request is still sent to OpenRouter and billed to you.

**Reproduced:** a request with `Content-Type: text/plain`, `Origin: https://evil.example` and `Sec-Fetch-Site: cross-site` returned `200` with a model reply.

**Impact:** a high-traffic page could drain your OpenRouter credits, each visitor's browser adding requests from a different IP address. Your hard credit cap limits the total cost, but once it's hit, the twin stops working for real visitors.

**Fix:** reject requests that aren't same-origin JSON before doing any work:
```ts
if (!req.headers.get("content-type")?.includes("application/json")) return json(415, "Unsupported media type.");
const site = req.headers.get("sec-fetch-site");
if (site && site !== "same-origin") return json(403, "Forbidden.");
```
Requiring `application/json` forces the browser's permission check, which fails because the route sends no CORS headers. The `Sec-Fetch-Site` check is a second layer that modern browsers support.

## Medium

### 2. Rate limiter is weak and its memory grows without limit
**Where:** [app/api/chat/route.ts:12-23](app/api/chat/route.ts#L12-L23)

- **The `hits` map never shrinks.** Old timestamps are dropped only when the same IP returns, so every IP that has ever called the route stays in memory for the life of the instance.
- **Each server instance keeps its own count.** On Vercel, several instances run at once and are recycled, so the effective limit is "30 per 5 minutes per instance". It's a soft limit. (Known and documented in CLAUDE.md.)
- **Rejected requests still count.** Requests are counted before they're validated, so malformed requests use up a visitor's allowance too. This is harmless, just worth knowing.

**Fix:** if the map is kept, remove expired entries (for example, sweep it whenever it passes some size). For a real limit, use a shared store such as Upstash Redis or a Vercel Firewall rate-limit rule. Your OpenRouter credit cap already bounds the worst case.

### 3. Keyboard users can tab into the closed chat panel
**Where:** [components/twin-chat.tsx:169-177](components/twin-chat.tsx#L169-L177)

When closed, the panel is hidden visually and with `aria-hidden`, but its 7 buttons and the text box can still receive keyboard focus. Tabbing through the page therefore lands on invisible controls. Hiding content from screen readers with `aria-hidden` while it stays focusable is also an accessibility failure in its own right.

Related:
- Focus isn't returned to the launcher button when the chat closes.
- On mobile, the full-screen panel doesn't stop the page behind it from scrolling or receiving focus.

**Fix:** add `inert={!open}` to the panel, which removes it from focus and from screen readers in one step. Store the element that opened the chat and focus it again on close. On small screens, lock the page scroll while the chat is open.

### 4. Mobile menu can leave the page unscrollable
**Where:** [components/interactive.tsx:185-187](components/interactive.tsx#L185-L187)

Opening the mobile menu sets `document.body.style.overflow = "hidden"`. If the window then widens past the `md` breakpoint (rotating a tablet, resizing a browser), the menu and its close button disappear but `open` stays `true`, so the page can't scroll. The scroll lock is also never removed when the component unmounts.

**Reproduced:** opened the menu at 390px wide, resized to 1440px: `body.style.overflow` stayed `"hidden"` and the toggle button was `display: none`.

**Fix:** close the menu when `matchMedia("(min-width: 768px)")` starts matching, and reset the overflow in the effect's cleanup function.

### 5. Hero glow animation runs continuously
**Where:** [components/interactive.tsx:102-124](components/interactive.tsx#L102-L124)

The `requestAnimationFrame` loop runs on every frame for the whole visit: after the glow has settled, and while the hero is scrolled out of view. That's needless CPU work and battery drain, mostly on laptops and phones.

**Fix:** stop the loop once the glow is within a small distance of its target, and restart it on `pointermove`. Also pause it with an `IntersectionObserver` while the hero is off-screen.

### 6. Some content is hard-coded outside `lib/data.ts`
**Where:** [components/sections.tsx](components/sections.tsx):
- Career timeline lanes (lines 277-285)
- Terminal card rows (125-131)
- Hero footer, "Nokia → HERE → Salesforce / Tableau" (117)
- Marquee items (188-201)
- Journey intro text (352-353)
- `START`/`END` years (273-274)

The README and CLAUDE.md say all content lives in `lib/data.ts`, but these values are written directly in the components. Editing `career` in `lib/data.ts` won't update the timeline, and the twin never sees any of this text, so the site and the twin can drift apart.

**Fix:** build the timeline lanes from `career` and `earlierRoles` (grouped by company), and move the remaining strings into `lib/data.ts`.

### 7. No social-preview image or `metadataBase`
**Where:** [app/layout.tsx:17-25](app/layout.tsx#L17-L25)

There's no Open Graph image, no Twitter/X card and no `metadataBase`. Links shared on LinkedIn, Slack or iMessage will show plain text with no image, which matters for a career site that will mostly be shared as a link.

**Fix:** set `metadataBase: new URL("https://voicu-tulai.vercel.app")` (or a custom domain), and add an `app/opengraph-image.tsx` that generates a card in the site's style. Add `twitter: { card: "summary_large_image" }`. Optionally add `app/robots.ts` and `app/sitemap.ts`.

## Low

### 8. Starting a new chat mid-reply can bring back the old conversation
**Where:** [components/twin-chat.tsx:122-127](components/twin-chat.tsx#L122-L127), [144-149](components/twin-chat.tsx#L144-L149)

The streaming loop sets `messages` from a variable captured when the request started. If "New conversation" is pressed while a chunk is already being processed, the next update can write the old conversation back over the cleared one.

**Fix:** give each request an ID (or keep the active `AbortController` in a ref) and skip updates from a request that is no longer current.

### 9. A fast double Enter can send the same message twice
**Where:** [components/twin-chat.tsx:99](components/twin-chat.tsx#L99)

The duplicate-send guard checks React state (`streaming`), which only changes on the next render. Two Enter presses in the same frame both pass the check.

**Fix:** keep a `useRef` flag that is set to `true` before the first `await` and checked at the top of `send`.

### 10. Chat auto-scroll pulls the reader to the bottom on every update
**Where:** [components/twin-chat.tsx:91-94](components/twin-chat.tsx#L91-L94)

The chat jumps to the bottom with every streamed chunk, so a visitor who scrolls up to re-read an earlier answer is pulled back down.

**Fix:** auto-scroll only when the view was already within about 80px of the bottom.

### 11. Without JavaScript, sections are invisible and stats read "0"
**Where:** `.reveal` in [app/globals.css](app/globals.css), [components/interactive.tsx:44](components/interactive.tsx#L44)

Sections that animate in on scroll start at `opacity: 0` and only appear once JavaScript runs. The counters are rendered on the server as `0`. Visitors without JavaScript, some readers and archivers, and printouts therefore see a mostly blank page with "0+" statistics. Search engines still index the text.

**Fix:** only apply the hidden starting state once JavaScript has run (for example, a `js` class on `<html>` and `.js .reveal { opacity: 0 }`). Render the real number on the server and animate from zero only on the client.

### 12. Dates are fixed at build time
**Where:** [components/sections.tsx](components/sections.tsx):
- Footer `new Date().getFullYear()` (784)
- Hero "2026" (118)
- `END = 2026` (274)
- `yearsLabel` handling of `"Present"` (333)

The page is statically generated, so these values are fixed when it's built. After 31 December the footer still says © 2026 until the next deployment.

**Fix:** redeploy each January, or render the year on the client. Ideally, derive `END` from the data.

### 13. Smaller API route issues
**Where:** [app/api/chat/route.ts](app/api/chat/route.ts)
- **Possible error on disconnect (line 131, plausible):** `controller.close()` in `finally` may throw if the client already disconnected and cancelled the stream. Wrap it in `try {}`.
- **Truncated answers go unnoticed (line 78):** replies that hit `max_tokens: 1200` stop mid-sentence without any signal. Check `finish_reason === "length"` and log it, or append "…".
- **Attribution uses the visitor's `Origin` (line 71):** the `HTTP-Referer` sent to OpenRouter comes from the visitor's header, so anyone can set it. It only affects OpenRouter's app attribution. Use a fixed site URL from an environment variable.
- **Client-written "assistant" turns are accepted (line 34, info):** the browser sends the whole history, so a visitor can make up earlier twin replies to steer the model. It only affects that visitor's own session, but could produce a misleading screenshot. Accept that risk, or sign earlier replies on the server if it ever matters.
- **Prompt rebuilt per request (line 80, nit):** `buildSystemPrompt()` runs on every request but its result never changes. Compute it once when the module loads.

## Tooling

### 14. `npm run lint` is broken and there are no tests
**Where:** [package.json](package.json)

`next lint` was removed in Next.js 16, and ESLint isn't installed, so `npm run lint` fails. The only automated check is the TypeScript pass inside `npm run build`.

**Fix:**
- Install `eslint` and `eslint-config-next` with a flat config, and point the `lint` script at `eslint .`.
- Add a few unit tests (for example with Vitest) for the two pieces of logic that would fail silently: `parseMessages`, and the stream parsing in `route.ts` (split lines, `[DONE]`, keep-alive comments, mid-stream errors).

## Noted and accepted

- **The CSP allows `'unsafe-inline'` scripts.** Next.js needs this unless nonce-based CSP is used, and that forces every page to be rendered per request. Documented in `next.config.ts` and CLAUDE.md.
- **HSTS sends `preload` with `includeSubDomains`.** This has no effect on `*.vercel.app`. If you add a custom domain, only submit it to the browser preload list if every subdomain will always be served over HTTPS.
