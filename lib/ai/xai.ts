/**
 * xAI HTTP client aligned with current docs:
 * - Responses API: POST /v1/responses — assistant text often in `output_text` on the response object.
 *   @see https://docs.x.ai/developers/quickstart
 *   @see https://docs.x.ai/docs/guides/chat
 * - Chat Completions (legacy): POST /v1/chat/completions — same base URL, OpenAI-compatible body.
 *   @see https://docs.x.ai/docs/guides/chat-completions
 */

const XAI_BASE = "https://api.x.ai/v1";

function extractChatCompletionText(data: unknown): string {
  if (typeof data !== "object" || data === null) return "";
  const d = data as Record<string, unknown>;
  const choices = d.choices;
  if (!Array.isArray(choices) || choices.length === 0) return "";
  const choice0 = choices[0] as Record<string, unknown>;
  const message = choice0?.message as Record<string, unknown> | undefined;
  const content = message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part !== "object" || part === null) return "";
        const p = part as Record<string, unknown>;
        if (typeof p.text === "string") return p.text;
        return "";
      })
      .join("");
  }
  return "";
}

/**
 * Parse assistant text from Responses API JSON.
 * Current SDKs expose `response.output_text`; REST includes the same field in many cases.
 */
export function extractResponsesApiText(data: unknown): string {
  if (typeof data !== "object" || data === null) return "";
  const d = data as Record<string, unknown>;

  if (typeof d.output_text === "string" && d.output_text.trim()) {
    return d.output_text;
  }

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

  const fromNested = tryFromOutput(d.output);
  if (fromNested) return fromNested;

  if (Array.isArray(d.choices) && d.choices.length > 0) {
    return extractChatCompletionText(data);
  }

  if (typeof d.text === "string") return d.text;
  return "";
}

export async function createXaiChatCompletion(params: {
  apiKey: string;
  model: string;
  system: string;
  userMessages: { role: "user" | "assistant"; content: string }[];
}): Promise<{ text: string; raw: unknown }> {
  const messages = [
    { role: "system" as const, content: params.system },
    ...params.userMessages,
  ];

  const res = await fetch(`${XAI_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      messages,
      stream: false,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    throw new Error(JSON.stringify({ error: "invalid_json_from_xai" }));
  }

  if (!res.ok) {
    throw new Error(JSON.stringify(raw));
  }

  const text = extractChatCompletionText(raw);
  return { text, raw };
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

  const res = await fetch(`${XAI_BASE}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  const raw = (await res.json()) as unknown;
  if (!res.ok) {
    throw new Error(JSON.stringify(raw));
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

/**
 * Prefer Responses API (current primary in quickstart); fall back to Chat Completions if needed.
 */
export async function createXaiAssistantReply(params: {
  apiKey: string;
  model: string;
  system: string;
  userMessages: { role: "user" | "assistant"; content: string }[];
  previousResponseId?: string;
}): Promise<{ text: string; responseId?: string; raw: unknown }> {
  let lastErr: unknown;

  try {
    const { text, id, raw } = await createXaiResponse({
      apiKey: params.apiKey,
      model: params.model,
      system: params.system,
      userMessages: params.userMessages,
      previousResponseId: params.previousResponseId,
    });
    if (text.trim()) {
      return { text, responseId: id, raw };
    }
  } catch (e) {
    lastErr = e;
  }

  try {
    const { text, raw } = await createXaiChatCompletion({
      apiKey: params.apiKey,
      model: params.model,
      system: params.system,
      userMessages: params.userMessages,
    });
    if (text.trim()) {
      return { text, raw };
    }
  } catch (e) {
    lastErr = e;
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
