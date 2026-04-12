import type { BookingFullInput } from "@/lib/validation/booking";
import type { TravelWaitlistInput } from "@/lib/validation/booking";

/**
 * Persist leads: optional webhook (Zapier, Make, Slack, CRM) or log in dev.
 */
export async function persistBookingLead(data: BookingFullInput): Promise<void> {
  const url = process.env.BOOKING_WEBHOOK_URL;
  if (url) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "booking", ...data, at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error("Webhook failed");
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.info("[booking lead]", JSON.stringify(data, null, 2));
  }
}

export async function persistTravelWaitlist(
  data: TravelWaitlistInput
): Promise<void> {
  const url = process.env.BOOKING_WEBHOOK_URL;
  if (url) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "travel_waitlist",
        ...data,
        at: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error("Webhook failed");
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.info("[travel waitlist]", JSON.stringify(data, null, 2));
  }
}
