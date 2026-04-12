"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    text: "The session felt like studio art — not a factory line.",
    who: "Client, Dallas",
  },
  {
    text: "He actually listened to the story behind the piece.",
    who: "Client, travel guest",
  },
  {
    text: "Healed clean, lines stayed arrogant in the best way.",
    who: "Collector",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.02] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          In the chair
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={q.who}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-ink)] p-6"
            >
              <p className="text-[var(--color-paper)]">&ldquo;{q.text}&rdquo;</p>
              <footer className="mt-4 text-sm text-[var(--color-muted)]">
                — {q.who}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
