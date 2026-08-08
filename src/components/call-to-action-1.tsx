"use client";

import Link from "next/link";
import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";

export default function CallToAction() {
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeContent blur>
          <div className="relative overflow-hidden rounded-box border border-base-content/10 bg-base-200/50 px-6 py-14 text-center sm:px-10 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(94%_0_0_/_0.08),transparent_60%)]" />
            <div className="relative mx-auto max-w-3xl">
              <h2 className="font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Keep work and personal GitHub accounts{" "}
                <GradientText
                  colors={["#F5F5F5", "#A3A3A3", "#F5F5F5", "#737373", "#F5F5F5"]}
                  animationSpeed={6}
                  className="inline"
                >
                  tied to the right folders.
                </GradientText>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base text-base-content/55 sm:text-lg">
                Install once, bind your trees, and stop switching accounts by hand.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="#install" className="cta-btn cta-btn-primary">
                  Install acct
                </Link>
                <a
                  href="https://github.com/acct-sh/acct"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-btn cta-btn-outline"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
