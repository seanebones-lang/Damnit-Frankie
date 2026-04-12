import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ConciergePanel } from "@/components/ai/concierge-panel";
import { SiteHeader } from "@/components/site-header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "Damnit Frankie | Tattoo & Mixed Media",
    template: "%s | Damnit Frankie",
  },
  description:
    "High-end tattoo artist Damnit Frankie — by appointment, traveling worldwide. Books open, walk-ins welcome. Book, browse portfolio, or ask the concierge.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://damnitfrankie.com"
  ),
  openGraph: {
    title: "Damnit Frankie",
    description: "Luxury tattoos & mixed media. Worldwide by appointment.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Damnit Frankie",
  jobTitle: "Tattoo Artist",
  telephone: "+1-817-655-0959",
  sameAs: [
    "https://www.instagram.com/damnitfrankie/",
    "https://www.facebook.com/damnitfrankie/about",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${dmSans.className} min-h-screen`}>
        <SiteHeader />
        <main>{children}</main>
        <ConciergePanel />
      </body>
    </html>
  );
}
