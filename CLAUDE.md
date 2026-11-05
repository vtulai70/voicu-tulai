# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal website for Voicu Tulai: a single-page portfolio plus an AI "Digital Twin" chat. Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript 5. Deployed on Vercel.

**Next.js 16 has breaking changes from older versions** (see `AGENTS.md`). Before using a Next API you're unsure of, read the bundled docs in `node_modules/next/dist/docs/`.

## Commands

```bash
npm run dev           # http://localhost:3000
npm run build         # production build + type check (the main verification step)
npx tsc --noEmit      # type check only
```

- There are no tests and no linter. `npm run lint` is broken (`next lint` was removed in Next 16 and ESLint isn't installed).
- The user's `~/.npm` cache has root-owned files, so `npm install` fails with EACCES. Use `npm install --cache <some-temp-dir> ...` instead of sudo.

## Architecture

**Content is data-driven.** All site copy lives in `lib/data.ts` (profile, stats, career roles, certifications, portfolio slots, contact links, nav). Edit content there, not in components.
- Contact links that are empty strings (`""`) are hidden, and the contact grid adapts its column count to however many remain.
- A portfolio item becomes a link only when it has an `href` and `status: "live"`.
- `nav` entry `id`s must match section `id`s in `components/sections.tsx`; the nav's active-section tracking depends on it.
- Don't hard-code content in components. The hero terminal card, company trail, marquee and journey intro all live in `lib/data.ts`. The career timeline chart is derived from `career` and `earlierRoles` by `lib/timeline.ts`; it merges roles at the same employer, and its year range and ticks come from the data.

**Rendering split:**
- `components/sections.tsx` holds the page sections as server components.
- `components/interactive.tsx` (`"use client"`) has the client pieces: `Nav`, `Reveal` (scroll-in animation), `CountUp`, `SpotlightCard`, `HeroGlow`, `LocalTime`.
- `app/page.tsx` composes the sections and mounts `<TwinChat />`.
- Page scroll locking must go through `lockScroll()` in `lib/scroll-lock.ts`, never `body.style.overflow` directly. It's reference-counted, so the mobile menu and the full-screen mobile chat can't release each other's lock.
- **SEO and link previews:** `lib/site.ts` resolves the canonical URL (`NEXT_PUBLIC_SITE_URL`, then Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then localhost), which `metadataBase` in `app/layout.tsx`, `app/robots.ts` and `app/sitemap.ts` all use.
- `app/opengraph-image.tsx` generates the 1200×630 link-preview card at build time, using `.woff` font files from the `@fontsource/*` packages (Satori can't read `woff2` or `next/font`).

**Styling:** Tailwind v4 is configured in CSS, not a JS config. Design tokens (`ink`, `line`, `fg`, `muted`, `faint`, `acid`, `signal`) and font families are defined in the `@theme` block of `app/globals.css`, alongside the custom effect classes (`.reveal`, `.rise`, `.brackets`, `.spotlight`, `.bg-grid`, `.gantt-bar`).
- Fonts load via `next/font` in `app/layout.tsx` as `--nf-*` CSS variables, which `@theme` maps to `--font-*`. Don't name them `--font-*` directly: the `@theme` entries would reference themselves.
- The `.reveal` animation is triggered by the `Reveal` component adding `.is-visible`. Elements that animate on scroll (for example `.gantt-bar`) key off `.is-visible`.
- `prefers-reduced-motion` turns animations off.

**Digital Twin chat:**
- `components/twin-chat.tsx` is the client UI. Any element can open it by dispatching the `twin:open` window event (`OpenTwinButton` does this). Responses are rendered with a minimal, safe markdown renderer (paragraphs, `-` bullets, `**bold**`), with no `dangerouslySetInnerHTML`.
- `app/api/chat/route.ts` (Node runtime) first rejects anything that isn't same-origin JSON, so other sites can't spend credits through visitors' browsers. Non-JSON bodies get 415, and requests whose `Sec-Fetch-Site` is `cross-site` or `same-site` get 403. When testing with curl, send `-H 'Content-Type: application/json'`.
- It then validates input (at most 20 messages, 2,000 characters each, last message from the user) and applies an in-memory per-IP rate limit. That limit is per instance, so it is soft on Vercel.
- The route calls OpenRouter with model `openai/gpt-oss-120b` (streaming, `reasoning.exclude`) and re-streams only the content deltas to the client as plain text. It also normalizes the non-breaking spaces and hyphens that gpt-oss emits.
- `lib/twin.ts` builds the system prompt from `lib/data.ts`, so content changes reach the twin automatically. Its strict accuracy rules exist because the model invented hobbies and metrics during testing; keep them.
- The prompt also tells the twin to refer to Voicu by name rather than he/she pronouns, because the user's pronouns aren't known.

**Security headers:** `next.config.ts` sets a no-nonce Content-Security-Policy plus the standard security headers on every route.
- The CSP allows only same-origin resources. `connect-src 'self'` means any new external fetch from the browser must be added there, or it will be blocked.
- `'unsafe-eval'` is added in development only; `vercel.live` is allowed on Vercel preview builds only, for the preview toolbar.
- Check for CSP violations against a production build (`npm run build && npx next start`), not `next dev`.

## Environment & deployment

- `OPENROUTER_API_KEY` must be set in `.env` locally. Never print or commit it.
- On Vercel (project `voicu/voicu-tulai`), the key is a team-level shared environment variable linked to the project. `vercel env ls` does not show it; test `/api/chat` on a deployment to confirm it's available.
- Preview deployments sit behind Vercel's login, so test them with `vercel curl /api/chat --deployment <url> -- <curl args>`.
- `resume.md` is the user's source resume. It is git-ignored and listed in `.vercelignore` (along with `.env*`) so personal details never reach GitHub or Vercel. When the user updates it, carry the changes into `lib/data.ts` by hand.
- Don't add a phone number to the site. The user removed it deliberately, and the repo is public.
