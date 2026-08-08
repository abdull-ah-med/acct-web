"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative flex min-h-[min(92vh,920px)] items-start overflow-hidden px-4 sm:px-6 lg:items-center">
      {/* Background: mobile */}
      <Image
        src="/kamran-primaryayev-9V1cYW4JIfQ-unsplash.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center md:hidden"
      />
      {/* Background: desktop */}
      <Image
        src="/andrew-kliatskyi--e_thdWzgis-unsplash.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none hidden object-cover object-center md:block"
      />
      {/* Readability veil */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/45 to-base-100/85 md:bg-gradient-to-r md:from-base-100/80 md:via-base-100/50 md:to-base-100/20"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-stretch gap-10 pt-28 pb-20 text-left md:pt-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-24">
        <div className="max-w-2xl max-md:mx-auto max-md:w-full max-md:text-center md:mx-0">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.88] font-extrabold tracking-tight text-base-content max-md:text-center"
          >
            acct
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-md:flex max-md:justify-center"
          >
            <span className="inline-flex items-center rounded-md border border-base-content/15 bg-base-100/40 px-2.5 py-1 font-mono text-xs tracking-wide text-base-content/70 backdrop-blur-sm">
              npm i -g acct-sh
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-6 max-w-xl text-2xl leading-snug font-medium tracking-tight text-base-content max-md:mx-auto sm:text-3xl md:text-4xl"
          >
            Switch GitHub accounts by folder. Automatically.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-lg text-base leading-relaxed text-base-content/70 max-md:mx-auto sm:text-lg"
          >
            Bind a directory to a GitHub user, email, and token. Open that folder and you are
            that account. Leave it and that identity is gone. No global switch. No wrong-account
            pushes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3 max-md:justify-center"
          >
            <a href="#install" className="cta-btn cta-btn-primary">
              Install acct
            </a>
            <a href="#demo" className="cta-btn cta-btn-outline">
              See how it works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md max-md:mx-auto"
        >
          <div
            className="relative overflow-hidden rounded-lg border border-base-content/15 bg-base-100/70 p-5 backdrop-blur-md"
            id="hero-status"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-base-content/45">acct status</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-base-content">
                <span className="size-1.5 rounded-full bg-base-content" aria-hidden />
                bound
              </span>
            </div>
            <dl className="space-y-3 font-mono text-sm">
              <div className="flex justify-between gap-4 border-b border-base-content/10 pb-2">
                <dt className="text-base-content/45">cwd</dt>
                <dd className="truncate text-right text-base-content">~/Work/api</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-base-content/10 pb-2">
                <dt className="text-base-content/45">profile</dt>
                <dd className="text-base-content">work</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-base-content/10 pb-2">
                <dt className="text-base-content/45">user.email</dt>
                <dd className="truncate text-right text-base-content/80">you@company.com</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-base-content/45">token</dt>
                <dd className="text-base-content/70">keychain · work only</dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>

      <div className="hairline absolute inset-x-0 bottom-0 z-10" />
    </section>
  );
}
