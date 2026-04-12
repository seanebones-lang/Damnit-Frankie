"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const sampleCities = [
  { city: "Los Angeles", window: "Late spring" },
  { city: "New York", window: "Early fall" },
  { city: "London", window: "TBD — waitlist open" },
  { city: "Tokyo", window: "Invite-only guest spots" },
];

export function Travel() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/travel-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, notes: notes || undefined }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setEmail("");
      setCity("");
      setNotes("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <section id="travel" className="scroll-mt-20 border-y border-[var(--color-paper)]/10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-paper)] md:text-5xl">
              Worldwide by appointment
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">
              Frankie travels for the right projects. Check for availability or
              dates in your area — join the travel drop list and we&apos;ll ping
              you when routes open.
            </p>
            <ul className="mt-8 space-y-4">
              {sampleCities.map((c, i) => (
                <motion.li
                  key={c.city}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-paper)]/10 px-4 py-3"
                >
                  <span className="font-medium text-[var(--color-paper)]">
                    {c.city}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">
                    {c.window}
                  </span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[var(--color-muted)]">
              Sample windows above are placeholders — real routing is confirmed
              with Frankie after consult.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Travel drop list</CardTitle>
              <CardDescription>
                Your city, your email — we&apos;ll reach out when dates land.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tw-email">Email</Label>
                  <Input
                    id="tw-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tw-city">City / region</Label>
                  <Input
                    id="tw-city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Berlin, Paris CDG, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tw-notes">Notes (optional)</Label>
                  <Textarea
                    id="tw-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ideal month, convention, guest spot…"
                  />
                </div>
                <Button type="submit" disabled={status === "loading"} className="w-full">
                  {status === "loading" ? "Sending…" : "Join the list"}
                </Button>
                {status === "ok" && (
                  <p className="text-sm text-[var(--color-accent-soft)]">
                    You&apos;re on the list. Frankie loves a good chase.
                  </p>
                )}
                {status === "err" && (
                  <p className="text-sm text-red-400">
                    Couldn&apos;t save — try again or call 817-655-0959.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
