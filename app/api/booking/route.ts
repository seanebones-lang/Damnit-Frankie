import { NextResponse } from "next/server";
import { bookingFullSchema } from "@/lib/validation/booking";
import { persistBookingLead } from "@/lib/booking/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingFullSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await persistBookingLead(parsed.data);
  } catch (e) {
    console.error("[booking]", e);
    return NextResponse.json({ error: "persist_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
