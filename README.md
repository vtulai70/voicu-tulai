# Voicu Tulai — personal site

Next.js 16 (App Router) + Tailwind CSS v4. Single-page, statically rendered.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production preview
```

## Edit content

All copy lives in `lib/data.ts`:

- `contact`: add `email`, `linkedin`, `github` (empty values are hidden).
- `portfolio`: set `href` and `status: "live"` to turn a "Coming soon" card into a link.
- `career`, `stats`, `pillars`, `certifications`, and the rest map directly to page sections.

Layout and styling: `components/sections.tsx` (sections), `components/interactive.tsx`
(nav, scroll reveals, counters, cursor glow), `app/globals.css` (theme tokens and effects).

## Digital Twin (AI chat)

A chat assistant that answers questions about Voicu's career, opened from the floating
"Digital twin" button or the hero's "Ask my AI twin" button.

- Model: `openai/gpt-oss-120b` via OpenRouter. Requires `OPENROUTER_API_KEY` in `.env` (never commit it).
- API route: `app/api/chat/route.ts` (validation, in-memory rate limit, streaming).
- Persona & guardrails: `lib/twin.ts`. It is generated from `lib/data.ts`, so content edits flow
  into the twin automatically.
