# Feature roadmap — phased rollout

Prioritized by **conversion impact** vs **implementation cost**.

## Phase 1 (shipped in repo baseline)

- Landing IA: hero, portfolio filters, travel waitlist, booking wizard, aftercare/pricing, session estimator.
- xAI concierge (Responses API) + grounded knowledge block + safety rails.
- xAI TTS **Eve** via server proxy (`/api/tts`).
- Optional `BOOKING_WEBHOOK_URL` for leads without running a database.

## Phase 2 (high impact)

- **Postgres** (Neon/Supabase): persist bookings, waitlist, and chat handoff notes; admin view or CSV export.
- **Deposit checkout**: Stripe Payment Links or embedded checkout tied to booking IDs.
- **SMS / email alerts** for travel drops (Resend + Twilio or similar).
- **Portfolio CMS**: Sanity, Contentful, or Tina for Frankie-controlled galleries and stories.

## Phase 3 (delight / brand)

- **AI style matcher**: image upload → embeddings → suggested style + session count (with human review disclaimer).
- **Aftercare companion**: opt-in timeline emails/SMS days 1–14 post-session.
- **VIP waitlist tiers**: cancellation priority queue with transparent rules.
- **3D / WebGL hero** accents (React Three Fiber) — keep perf budget strict.

## Phase 4 (experimental)

- **AR placement preview** (body-region overlays) — mobile-only, heavy QA.
- **Realtime voice** (xAI Realtime WebSocket) for full duplex talk instead of text + TTS playback.
- **Multi-language** concierge with localized TTS.

## Notes

- Keep **luxury motion** subtle: prefer GSAP + Framer for hero and portfolio; respect `prefers-reduced-motion`.
- Revisit **persona** copy with Frankie for legal/compliance (medical disclaimers, deposit language).
