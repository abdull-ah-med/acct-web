"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const Silk = dynamic(() => import("@/components/Silk"), { ssr: false });

export function NotFoundView() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Silk
          speed={10}
          scale={1.2}
          color="#4e5259"
          noiseIntensity={5}
          rotation={1.7}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base-100/55 via-base-100/40 to-base-100/70"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] tracking-[0.2em] text-base-content/40 uppercase">
          error · unbound
        </p>

        <h1
          className="mt-4 font-display text-[clamp(5rem,22vw,11rem)] font-extrabold leading-none tracking-tight text-base-content"
          aria-label="404"
        >
          404
        </h1>

        <p className="mt-6 font-display text-2xl font-medium tracking-tight text-base-content sm:text-3xl">
          This path isn&apos;t bound to anything.
        </p>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-base-content/55">
          Like walking outside your work tree — there&apos;s no profile here.
        </p>

        <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-base-content/15 bg-base-100/40 px-3 py-2 font-mono text-sm text-base-content/70 backdrop-blur-sm">
          <span className="text-base-content/40">pwd</span>
          <span className="text-base-content/90">~/nowhere</span>
          <span className="text-base-content/35">→</span>
          <span className="text-base-content/50">unbound</span>
        </p>

        <div className="mt-10 flex justify-center">
          <Link href="/" className="cta-btn cta-btn-primary">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
