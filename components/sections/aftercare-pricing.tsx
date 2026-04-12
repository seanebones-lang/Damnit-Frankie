"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AftercarePricing() {
  return (
    <section id="aftercare" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-paper)] md:text-5xl">
          Aftercare & pricing
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          Final numbers depend on size, detail, placement, and how many sessions
          we need. You&apos;ll get written aftercare in the studio — this is the
          highlight reel.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Aftercare (general)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--color-muted)]">
                <p>
                  Follow the written protocol Frankie gives you — it beats
                  random internet threads.
                </p>
                <ul className="list-disc space-y-2 pl-5 text-[var(--color-paper)]/90">
                  <li>Keep it clean; hands off unless you&apos;re washing.</li>
                  <li>No soaking, pools, or sun on fresh work.</li>
                  <li>
                    If you see spreading redness, fever, or pus — that&apos;s a
                    clinician, not a chatbot.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Pricing framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--color-muted)]">
                <p>
                  Small / simpler pieces often fit shorter sessions. Large-scale
                  work is built across multiple sittings so it heals and ages
                  with intention.
                </p>
                <p className="text-[var(--color-paper)]">
                  Deposits, day rates, and cancellation terms are confirmed at
                  booking — ask the concierge for the process, not guesswork.
                </p>
                <p>
                  Use the session estimator below for a rough ballpark, then
                  book a consult for a real quote.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
