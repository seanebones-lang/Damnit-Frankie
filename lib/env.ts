/**
 * Typed environment access. Server-only secrets must never be imported in client components.
 */
export function getServerEnv() {
  return {
    xaiApiKey: process.env.XAI_API_KEY ?? "",
    // Current Grok 4 family — override in env; see https://docs.x.ai/developers/models
    xaiModel: process.env.XAI_MODEL ?? "grok-4-1-fast-non-reasoning",
    bookingWebhookUrl: process.env.BOOKING_WEBHOOK_URL ?? "",
    nodeEnv: process.env.NODE_ENV,
  };
}
