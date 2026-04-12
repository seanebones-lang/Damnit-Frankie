"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookingFullSchema, type BookingFullInput } from "@/lib/validation/booking";

type FormState = Omit<BookingFullInput, "consentContact" | "consentData"> & {
  consentContact: boolean;
  consentData: boolean;
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = ["Contact", "Schedule", "Project", "Consent"] as const;

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    city: "",
    timeline: "flexible",
    isTravel: true,
    placement: "",
    sizeDescription: "",
    styleNotes: "",
    referenceLinks: "",
    firstTattoo: false,
    budgetRange: "unsure",
    consentContact: false,
    consentData: false,
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setErr(null);
    if (!form.consentContact || !form.consentData) {
      setErr("Please accept both consent checkboxes.");
      return;
    }
    const parsed = bookingFullSchema.safeParse({
      ...form,
      consentContact: true,
      consentData: true,
    });
    if (!parsed.success) {
      setErr("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("fail");
      setDone(true);
    } catch {
      setErr("Something went wrong — call 817-655-0959.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else void submit();
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  if (done) {
    return (
      <Card id="booking" className="scroll-mt-20">
        <CardHeader>
          <CardTitle>You&apos;re in the queue.</CardTitle>
          <CardDescription>
            Frankie or the studio will follow up. If you&apos;re impatient in a
            cute way, call <a href="tel:+18176550959" className="text-[var(--color-accent-soft)]">817-655-0959</a>.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card id="booking" className="scroll-mt-20">
      <CardHeader>
        <CardTitle>Book Damnit Frankie</CardTitle>
        <CardDescription>
          Custom intake — step {step + 1} of {steps.length}: {steps[step]}
        </CardDescription>
        <div className="mt-4 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={steps[i]}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[var(--color-accent)]" : "bg-[var(--color-paper)]/15"}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name ?? ""}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="city">City / where you want to be tattooed</Label>
                <Input
                  id="city"
                  value={form.city ?? ""}
                  onChange={(e) => update("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Timeline</Label>
                <select
                  className="flex h-11 w-full rounded-xl border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/5 px-4 text-sm text-[var(--color-paper)]"
                  value={form.timeline}
                  onChange={(e) =>
                    update(
                      "timeline",
                      e.target.value as BookingFullInput["timeline"]
                    )
                  }
                >
                  <option value="asap">ASAP</option>
                  <option value="1-3mo">1–3 months</option>
                  <option value="3-6mo">3–6 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={form.isTravel ?? false}
                  onChange={(e) => update("isTravel", e.target.checked)}
                  className="size-4 accent-[var(--color-accent)]"
                />
                This is for a travel / guest spot date
              </label>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="placement">Placement on body</Label>
                <Input
                  id="placement"
                  value={form.placement ?? ""}
                  onChange={(e) => update("placement", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size description</Label>
                <Input
                  id="size"
                  value={form.sizeDescription ?? ""}
                  onChange={(e) => update("sizeDescription", e.target.value)}
                  required
                  placeholder="e.g. palm-sized, full outer forearm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Style / idea notes</Label>
                <Textarea
                  id="style"
                  value={form.styleNotes ?? ""}
                  onChange={(e) => update("styleNotes", e.target.value)}
                  placeholder="Traditional, fine line, blackwork, mixed references…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refs">Reference links (Pinterest, IG, etc.)</Label>
                <Textarea
                  id="refs"
                  value={form.referenceLinks ?? ""}
                  onChange={(e) => update("referenceLinks", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget range (ballpark)</Label>
                <select
                  className="flex h-11 w-full rounded-xl border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/5 px-4 text-sm text-[var(--color-paper)]"
                  value={form.budgetRange}
                  onChange={(e) =>
                    update(
                      "budgetRange",
                      e.target.value as BookingFullInput["budgetRange"]
                    )
                  }
                >
                  <option value="unsure">Not sure yet</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1500">$500 – $1,500</option>
                  <option value="1500-4000">$1,500 – $4,000</option>
                  <option value="4000-plus">$4,000+</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  checked={form.firstTattoo ?? false}
                  onChange={(e) => update("firstTattoo", e.target.checked)}
                  className="size-4 accent-[var(--color-accent)]"
                />
                First tattoo
              </label>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4 text-sm text-[var(--color-muted)]"
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consentContact ?? false}
                  onChange={(e) => update("consentContact", e.target.checked)}
                  className="mt-1 size-4 accent-[var(--color-accent)]"
                />
                <span>
                  I agree to be contacted about this booking request (SMS/email
                  per studio policy).
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consentData ?? false}
                  onChange={(e) => update("consentData", e.target.checked)}
                  className="mt-1 size-4 accent-[var(--color-accent)]"
                />
                <span>
                  I understand my details are used to schedule and quote — not
                  sold to random lists.
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {err && <p className="text-sm text-red-400">{err}</p>}

        <div className="flex flex-wrap gap-3">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={back}>
              Back
            </Button>
          )}
          <Button type="button" onClick={next} disabled={loading}>
            {step === steps.length - 1
              ? loading
                ? "Submitting…"
                : "Submit request"
              : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
