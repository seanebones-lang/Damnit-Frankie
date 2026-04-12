import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-paper)]/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-paper)]">
            Damnit Frankie
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Books always open · Walk-ins always welcome
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a
            href="tel:+18176550959"
            className="text-[var(--color-accent-soft)] hover:underline"
          >
            817-655-0959
          </a>
          <Link
            href="https://www.instagram.com/damnitfrankie/"
            className="text-[var(--color-muted)] hover:text-[var(--color-paper)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </Link>
          <Link
            href="https://www.facebook.com/damnitfrankie/about"
            className="text-[var(--color-muted)] hover:text-[var(--color-paper)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </Link>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
        © {new Date().getFullYear()} Damnit Frankie. All rights reserved.
      </p>
    </footer>
  );
}
