# Damnit Frankie — landing

Premium landing page for **Damnit Frankie**: portfolio, custom booking intake, travel waitlist, xAI concierge, and **Eve** TTS.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS v4
- Framer Motion + GSAP (ScrollTrigger)
- xAI [Responses API](https://docs.x.ai/docs/guides/chat) + [TTS](https://docs.x.ai/developers/rest-api-reference/inference/voice)

## Setup

```bash
npm install
cp .env.example .env.local
# Add XAI_API_KEY and optional BOOKING_WEBHOOK_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
|----------|---------|
| `XAI_API_KEY` | Server-side xAI key for `/api/chat` and `/api/tts` |
| `XAI_MODEL` | Grok model id ([models list](https://docs.x.ai/developers/models)); default `grok-4-1-fast-non-reasoning` |
| `BOOKING_WEBHOOK_URL` | Optional POST target for booking + waitlist JSON |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata |

## Scripts

- `npm run dev` — Turbopack dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint

## Deploy

Optimized for [Vercel](https://vercel.com): set env vars in project settings, connect repo, deploy.

## Roadmap

See [docs/feature-roadmap.md](docs/feature-roadmap.md).
