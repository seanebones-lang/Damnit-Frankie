/**
 * Parse assistant text from xAI Responses API JSON.
 * @see https://docs.x.ai/docs/guides/chat
 */
export function extractResponsesApiText(data: unknown): string {
  if (typeof data !== "object" || data === null) return "";
  const d = data as Record<string, unknown>;

  const tryFromOutput = (output: unknown): string => {
    if (!Array.isArray(output)) return "";
    for (const item of output) {
      if (typeof item !== "object" || item === null) continue;
      const o = item as Record<string, unknown>;
      if (o.type === "message" && o.role === "assistant" && Array.isArray(o.content)) {
        for (const part of o.content) {
          if (typeof part !== "object" || part === null) continue;
          const p = part as Record<string, unknown>;
          if (p.type === "output_text" && typeof p.text === "string") return p.text;
        }
      }
    }
    return "";
  };

  const fromTop = tryFromOutput(d.output);
  if (fromTop) return fromTop;

  const choices = d.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const msg = (choices[0] as Record<string, unknown>)?.message as
      | Record<string, unknown>
      | undefined;
    if (typeof msg?.content === "string") return msg.content;
  }

  if (typeof d.text === "string") return d.text;
  return "";
}

export async function createXaiResponse(params: {
  apiKey: string;
  model: string;
  system: string;
  userMessages: { role: "user" | "assistant"; content: string }[];
  previousResponseId?: string;
}): Promise<{ text: string; id?: string; raw: unknown }> {
  const input: Array<Record<string, unknown>> = [
    { role: "system", content: params.system },
    ...params.userMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const body: Record<string, unknown> = {
    model: params.model,
    input,
    store: false,
  };
  if (params.previousResponseId) {
    body.previous_response_id = params.previousResponseId;
  }

  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const raw = (await res.json()) as unknown;
  if (!res.ok) {
    const err = typeof raw === "object" && raw && "error" in raw ? raw : { raw };
    throw new Error(JSON.stringify(err));
  }

  const text = extractResponsesApiText(raw);
  const id =
    typeof raw === "object" &&
    raw !== null &&
    "id" in raw &&
    typeof (raw as { id: unknown }).id === "string"
      ? (raw as { id: string }).id
      : undefined;

  return { text, id, raw };
}
