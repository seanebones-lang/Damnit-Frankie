"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const complexityLabels = ["Simple", "Moderate", "Heavy detail", "Full composition"];

export function SessionEstimator() {
  const [size, setSize] = useState(40);
  const [complexity, setComplexity] = useState(1);

  const estimate = useMemo(() => {
    const baseHours = 1.5 + (size / 100) * 6 + complexity * 1.25;
    const low = Math.max(1, Math.round(baseHours * 0.75));
    const high = Math.round(baseHours * 1.35);
    const sessions = size > 70 || complexity >= 3 ? "2–6+" : "1–3";
    return { low, high, sessions };
  }, [size, complexity]);

  return (
    <section className="py-12 md:py-16" aria-label="Session estimator">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="overflow-hidden border-[var(--color-accent)]/20">
          <CardHeader>
            <CardTitle>Session estimator</CardTitle>
            <p className="text-sm text-[var(--color-muted)]">
              Ballpark only — not a quote. Frankie will dial it in on consult.
            </p>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label>Piece size (visual weight)</Label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--color-accent)]"
                  aria-valuetext={`${size} percent`}
                />
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {size}% of a “big” piece — slide up for sleeves, backs, etc.
                </p>
              </div>
              <div>
                <Label>Detail level</Label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--color-accent)]"
                  aria-valuetext={complexityLabels[complexity]}
                />
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {complexityLabels[complexity]}
                </p>
              </div>
            </div>
            <motion.div
              key={`${size}-${complexity}`}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col justify-center rounded-2xl bg-[var(--color-paper)]/5 p-6"
            >
              <p className="text-sm uppercase tracking-wider text-[var(--color-accent-soft)]">
                Rough studio time
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--color-paper)]">
                {estimate.low}–{estimate.high} hrs
              </p>
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                Likely sittings: <strong className="text-[var(--color-paper)]">{estimate.sessions}</strong>{" "}
                (healing and design complexity matter).
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
