"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { copyWithToast } from "@/lib/copy-toast";

const Silk = dynamic(() => import("@/components/Silk"), { ssr: false });

const HERO_INSTALL = "npm install acct-sh";
const easeOut = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  const onCopy = async () => {
    const ok = await copyWithToast(HERO_INSTALL);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const enter = (y: number, delay: number, duration = 0.55) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, transform: `translateY(${y}px)` },
          animate: { opacity: 1, transform: "translateY(0px)" },
          transition: { duration, delay, ease: easeOut },
        };

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center overflow-hidden px-4 sm:px-6"
    >
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base-100/55 via-base-100/35 to-base-100/75 md:bg-gradient-to-r md:from-base-100/65 md:via-base-100/35 md:to-base-100/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-stretch gap-10 py-28 text-left lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-24">
        <div className="max-w-2xl max-md:mx-auto max-md:w-full max-md:text-center md:mx-0">
          <motion.h1
            {...enter(18, 0.05, 0.6)}
            className="font-display text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.88] font-extrabold tracking-tight text-base-content max-md:text-center"
          >
            acct
          </motion.h1>

          <motion.p
            {...enter(14, 0.1, 0.55)}
            className="font-display mt-6 max-w-xl text-2xl leading-snug font-medium tracking-tight text-base-content max-md:mx-auto sm:text-3xl md:text-4xl"
          >
            Switch GitHub accounts by folder. Automatically.
          </motion.p>

          <motion.p
            {...enter(12, 0.18, 0.5)}
            className="mt-5 max-w-lg text-base leading-relaxed text-base-content/70 max-md:mx-auto sm:text-lg"
          >
            Bind a directory to a GitHub user, email, and token. Open that folder and you are
            that account. Leave it and that identity is gone. No global switch. No wrong-account
            pushes.
          </motion.p>

          <motion.div
            {...enter(10, 0.26, 0.45)}
            className="mt-8 flex flex-wrap items-center gap-3 max-md:justify-center"
          >
            <button
              type="button"
              onClick={onCopy}
              className="cta-btn cta-btn-primary font-mono"
              aria-label={copied ? "Copied" : `Copy ${HERO_INSTALL}`}
            >
              {copied ? "copied" : HERO_INSTALL}
            </button>
            <a href="#demo" className="cta-btn cta-btn-outline">
              See how it works
            </a>
          </motion.div>
        </div>

        <motion.div
          {...enter(20, 0.22, 0.65)}
          className="w-full max-w-md max-md:mx-auto"
        >
          <div
            className="relative overflow-hidden rounded-lg border border-base-content/15 bg-base-100/70 p-5 backdrop-blur-md"
            id="hero-status"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-base-content/45">acct status</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-base-content">
                <span className="status-pulse size-1.5 rounded-full bg-base-content" aria-hidden />
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
