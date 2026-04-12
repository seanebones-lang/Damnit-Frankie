"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Filter = "all" | "tattoos" | "mixed";

const items: {
  id: string;
  title: string;
  filter: Exclude<Filter, "all">;
  src: string;
  story?: string;
}[] = [
  {
    id: "port1",
    title: "Tattoo work I",
    filter: "tattoos",
    src: "/images/tattoos/port1.jpg",
  },
  {
    id: "port2",
    title: "Tattoo work II",
    filter: "tattoos",
    src: "/images/tattoos/port2.jpg",
  },
  {
    id: "port3",
    title: "Tattoo work III",
    filter: "tattoos",
    src: "/images/tattoos/port3.jpg",
  },
  {
    id: "port4",
    title: "Tattoo work IV",
    filter: "tattoos",
    src: "/images/tattoos/port4.jpg",
  },
  {
    id: "mixed1",
    title: "Mixed media I",
    filter: "mixed",
    src: "/images/mixed/mixed1.jpg",
    story: "Studio work beyond the skin.",
  },
  {
    id: "mixed2",
    title: "Mixed media II",
    filter: "mixed",
    src: "/images/mixed/mixed2.jpg",
  },
  {
    id: "mixed3",
    title: "Mixed media III",
    filter: "mixed",
    src: "/images/mixed/mixed3.jpg",
  },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tattoos", label: "Tattoos" },
  { id: "mixed", label: "Mixed media" },
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
              Tattoo portfolio and mixed-media pieces — swap titles anytime to
              match the story behind each image.
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
