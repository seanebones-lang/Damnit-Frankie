/**
 * Curated facts for RAG-style injection. Replace placeholders with client-approved copy.
 */
export const KNOWLEDGE_BLOCK = `
ARTIST
- Professional name: Damnit Frankie
- High-end tattoo artist; mixed media artist
- By appointment; travels worldwide — "check for availability or dates in your area"
- Books always open; walk-ins always welcome when Frankie is local — reach out anytime
- Phone: 817-655-0959
- Facebook: https://www.facebook.com/damnitfrankie/about
- Instagram: https://www.instagram.com/damnitfrankie/

BOOKING (GENERAL — confirm specifics with Frankie)
- Start via the site booking form: idea, placement, size, references, timeline, city, contact.
- Deposits and cancellation terms are confirmed at booking; do not quote a deposit amount unless the client has published it elsewhere in writing.

PRICING (RANGES — NOT FINAL QUOTES)
- Final quotes depend on size, detail, placement, and session length.
- Small/simple work: often a shorter session; larger work: multiple sessions possible.
- Always suggest a consultation for accurate pricing.

AFTERCARE (GENERAL EDUCATION ONLY)
- Follow the written aftercare Frankie provides at the appointment.
- Generally: gentle cleansing, approved moisturizer if advised, avoid sun/submersion until healed, no picking scabs.
- Redness, spreading pain, fever, or pus — seek medical care.

TATTOO HISTORY (CONVERSATIONAL)
- American traditional (sailor / WWII era) and its lineage; electric tattooing popularized in the early 20th century.
- Names like Norman "Sailor Jerry" Collins, Bert Grimm, Cap Coleman, Owen Jensen, and later Ed Hardy, Filip Leu, Horiyoshi III, Jack Rudy, etc., may come up in style discussions — use for cultural context, not as claims about Frankie's direct association unless stated.

VOICE / TTS
- Spoken replies use xAI TTS voice "Eve" when enabled on the site.
`.trim();

export function buildKnowledgeContext(userMessage: string): string {
  const q = userMessage.toLowerCase();
  const lines = KNOWLEDGE_BLOCK.split("\n").filter(Boolean);
  const scored = lines.map((line) => {
    const words = q.split(/\W+/).filter((w) => w.length > 3);
    let score = 0;
    for (const w of words) {
      if (line.toLowerCase().includes(w)) score += 1;
    }
    return { line, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 24).map((s) => s.line);
  return ["RETRIEVED_KNOWLEDGE_SNIPPETS:", ...top].join("\n");
}
