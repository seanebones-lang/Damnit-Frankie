"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const line1 = useRef<HTMLHeadingElement>(null);
  const line2 = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.from([line1.current, line2.current], {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(sub.current, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
        ease: "power2.out",
      });
      gsap.from(cta.current?.children ?? [], {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.5,
        ease: "power2.out",
      });
      gsap.from(media.current, {
        scale: 1.06,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.to(media.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[100dvh] overflow-hidden pt-16"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(196,92,62,0.15),transparent_50%)]" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:gap-12 md:px-6 lg:py-24">
        <div className="relative z-10">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--color-accent-soft)]">
            By appointment · Traveling worldwide
          </p>
          <h1
            ref={line1}
            className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-[var(--color-paper)] sm:text-6xl lg:text-7xl"
          >
            Ink that
          </h1>
          <h1
            ref={line2}
            className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] text-[var(--color-accent-soft)] sm:text-6xl lg:text-7xl"
          >
            doesn&apos;t behave.
          </h1>
          <p
            ref={sub}
            className="mt-6 max-w-md text-lg text-[var(--color-muted)]"
          >
            Damnit Frankie — high-end tattooing and mixed media. Books always
            open; walk-ins always welcome. Check dates in your city, then let&apos;s
            make something unforgettable.
          </p>
          <div ref={cta} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#booking">Start a booking</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#portfolio">View work</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="tel:+18176550959">817-655-0959</a>
            </Button>
          </div>
          <motion.div
            className="mt-10 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="rounded-full border border-[var(--color-paper)]/15 px-3 py-1">
              AI concierge + Eve voice
            </span>
            <span className="rounded-full border border-[var(--color-paper)]/15 px-3 py-1">
              Mixed media + tattoos
            </span>
          </motion.div>
        </div>

        <div
          ref={media}
          className="relative aspect-[4/5] w-full max-w-md justify-self-end md:max-w-none"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-paper)]/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1590246814883-57c511cb0b2b?w=800&q=80"
              alt="Tattoo artist at work — placeholder portfolio imagery"
              width={800}
              height={1000}
              className="h-full w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/80 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 font-[family-name:var(--font-display)] text-2xl text-[var(--color-paper)]">
              Precision. Presence. A little chaos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
