/**
 * Safe metadataBase for Next.js — empty or invalid NEXT_PUBLIC_SITE_URL must not throw at build time.
 */
export function resolveMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw);
      if (u.protocol === "http:" || u.protocol === "https:") {
        return u;
      }
    } catch {
      // fall through to default
    }
  }
  return new URL("https://damnitfrankie.com");
}
