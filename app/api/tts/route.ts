import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({
  text: z.string().min(1).max(4000),
});

/**
 * Proxies xAI TTS (Eve) — returns MP3 bytes.
 * @see https://docs.x.ai/developers/rest-api-reference/inference/voice
 */
export async function POST(req: Request) {
  const { xaiApiKey } = getServerEnv();
  if (!xaiApiKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${xaiApiKey}`,
    },
    body: JSON.stringify({
      text: parsed.data.text,
      voice_id: "eve",
      language: "en",
      output_format: {
        codec: "mp3",
        sample_rate: 24000,
        bit_rate: 128000,
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("[tts]", res.status, t);
    return NextResponse.json({ error: "tts_failed" }, { status: 502 });
  }

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
