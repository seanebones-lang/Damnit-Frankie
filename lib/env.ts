/**
 * Typed environment access. Server-only secrets must never be imported in client components.
 */
export function getServerEnv() {
  return {
    xaiApiKey: process.env.XAI_API_KEY ?? "",
    xaiModel: process.env.XAI_MODEL ?? "grok-3-mini",
    bookingWebhookUrl: process.env.BOOKING_WEBHOOK_URL ?? "",
    nodeEnv: process.env.NODE_ENV,
  };
}
