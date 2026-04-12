import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { Portfolio } from "@/components/sections/portfolio";
import { Travel } from "@/components/sections/travel";
import { AftercarePricing } from "@/components/sections/aftercare-pricing";
import { SessionEstimator } from "@/components/session-estimator";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Portfolio />
      <Travel />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-paper)] md:text-4xl">
            Start your booking
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Tell us about the piece, your city, and timing. Frankie&apos;s team
            follows up to lock dates and deposits.
          </p>
        </div>
        <BookingWizard />
      </section>
      <SessionEstimator />
      <AftercarePricing />
      <Footer />
    </>
  );
}
