"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Filter = "all" | "tattoos" | "mixed" | "healed";

const items: {
  id: string;
  title: string;
  filter: Exclude<Filter, "all">;
  src: string;
  story?: string;
}[] = [
  {
    id: "1",
    title: "Blackwork sleeve — session 2",
    filter: "tattoos",
    src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e1d?w=600&q=80",
    story: "Geometry meets negative space; built for how it ages.",
  },
  {
    id: "2",
    title: "Fine line botanical",
    filter: "tattoos",
    src: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600&q=80",
  },
  {
    id: "3",
    title: "Mixed media study — ink on paper",
    filter: "mixed",
    src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    story: "Original composition — sometimes the skin starts on the wall.",
  },
  {
    id: "4",
    title: "Traditional chest piece",
    filter: "tattoos",
    src: "https://images.unsplash.com/photo-1598371626478-0e3f64949c87?w=600&q=80",
  },
  {
    id: "5",
    title: "Healed color — 8 months",
    filter: "healed",
    src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80",
    story: "Saturated pigments, sane aftercare, sun discipline.",
  },
  {
    id: "6",
    title: "Charcoal + gold leaf",
    filter: "mixed",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
  },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tattoos", label: "Tattoos" },
  { id: "mixed", label: "Mixed media" },
  { id: "healed", label: "Healed" },
];

export function Portfolio() {
  const [active, setActive] = useState<Filter>("all");
  const visible = items.filter((i) => active === "all" || i.filter === active);

  return (
    <section id="portfolio" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-paper)] md:text-5xl">
              Portfolio
            </h2>
            <p className="mt-3 max-w-xl text-[var(--color-muted)]">
              Tattoos, healed results, and mixed-media work — curated so you can
              feel the range before you sit.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  active === f.id
                    ? "bg-[var(--color-accent)] text-white"
                    : "border border-[var(--color-paper)]/20 text-[var(--color-muted)] hover:border-[var(--color-paper)]/40 hover:text-[var(--color-paper)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.ul
          layout
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.li
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="group relative overflow-hidden rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.03]"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xs uppercase tracking-wider text-[var(--color-accent-soft)]">
                      {item.filter}
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-paper)]">
                      {item.title}
                    </h3>
                    {item.story && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                        {item.story}
                      </p>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
