"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#travel", label: "Travel" },
  { href: "#booking", label: "Book" },
  { href: "#aftercare", label: "Aftercare" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-40 w-full border-b border-[var(--color-paper)]/10 bg-[var(--color-ink)]/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-16">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-paper)] sm:text-2xl"
        >
          Damnit Frankie
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-paper)]"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <a href="tel:+18176550959">817-655-0959</a>
          </Button>
        </nav>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-[var(--color-paper)]/20 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn("overflow-hidden border-t border-[var(--color-paper)]/10 md:hidden")}
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-3 text-[var(--color-paper)]"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="tel:+18176550959"
                className="rounded-lg px-3 py-3 text-[var(--color-accent-soft)]"
                onClick={() => setOpen(false)}
              >
                Call 817-655-0959
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
