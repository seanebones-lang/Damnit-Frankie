import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { buildKnowledgeContext, KNOWLEDGE_BLOCK } from "@/lib/ai/knowledge";
import { PERSONA_SYSTEM, SAFETY_REFUSAL } from "@/lib/ai/persona";
import { createXaiAssistantReply } from "@/lib/ai/xai";

export const runtime = "nodejs";
/** Vercel / Next — raise on Pro if Grok runs long. @see https://vercel.com/docs/functions/runtimes */
export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
      })
    )
    .max(30),
  previousResponseId: z.string().optional(),
});

const blockedPatterns =
  /\b(child|minor|underage|rape|non-?consent|kill yourself|suicide method)\b/i;

export async function POST(req: Request) {
  const { xaiApiKey, xaiModel } = getServerEnv();
  if (!xaiApiKey) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        reply:
          "Frankie’s concierge needs an API key on the server — tell the studio to set XAI_API_KEY. Meanwhile: **817-655-0959** or book on this page.",
      },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const lastUser = [...parsed.data.messages].reverse().find((m) => m.role === "user");
  if (lastUser && blockedPatterns.test(lastUser.content)) {
    return NextResponse.json({
      reply: SAFETY_REFUSAL,
      responseId: undefined as string | undefined,
    });
  }

  const retrieval = lastUser ? buildKnowledgeContext(lastUser.content) : "";
  const system = `${PERSONA_SYSTEM}

STATIC_KNOWLEDGE_BASE:
${KNOWLEDGE_BLOCK}

${retrieval}`;

  try {
    const { text, responseId } = await createXaiAssistantReply({
      apiKey: xaiApiKey,
      model: xaiModel,
      system,
      userMessages: parsed.data.messages,
      previousResponseId: parsed.data.previousResponseId,
    });

    const reply = text.trim() || "I’m speechless — in a good way. Try again or call **817-655-0959**.";
    return NextResponse.json({ reply, responseId });
  } catch (e) {
    console.error("[chat]", e);
    return NextResponse.json(
      {
        error: "xai_error",
        reply:
          "Something glitched on my end — classic. Text **817-655-0959** or drop your details in the booking form and Frankie will get back to you.",
      },
      { status: 502 }
    );
  }
}
