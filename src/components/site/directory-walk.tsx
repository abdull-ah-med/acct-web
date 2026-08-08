"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import FadeContent from "@/components/FadeContent";
import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Scene = {
  id: string;
  path: string;
  profile: string | null;
  email: string;
  token: string;
  state: "bound" | "unbound";
  note: string;
};

const scenes: Scene[] = [
  {
    id: "personal",
    path: "~/Personal/blog",
    profile: "personal",
    email: "you@home",
    token: "personal · keychain",
    state: "bound",
    note: "Inside ~/Personal, commits and GitHub auth use your personal account.",
  },
  {
    id: "work",
    path: "~/Work/api",
    profile: "work",
    email: "you@company.com",
    token: "work · keychain",
    state: "bound",
    note: "Inside ~/Work, the same tools use your work account instead. No manual switch.",
  },
  {
    id: "downloads",
    path: "~/Downloads",
    profile: null,
    email: "-",
    token: "cleared",
    state: "unbound",
    note: "Outside a bound folder, that account is not active. In strict mode, managed ops are blocked.",
  },
];

export function DirectoryWalk() {
  const [index, setIndex] = useState(1);
  const [auto, setAuto] = useState(true);
  const scene = scenes[index];

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [auto]);

  const startTour = useCallback(() => {
    setAuto(false);
    const tour = driver({
      showProgress: true,
      animate: true,
      overlayOpacity: 0.72,
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: "acct-tour",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      steps: [
        {
          element: "#demo-path",
          popover: {
            title: "Where you are",
            description:
              "acct looks at your current folder and picks the matching profile.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#demo-profile",
          popover: {
            title: "Active account",
            description:
              "That profile sets your git name/email and which GitHub user is in play.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#demo-token",
          popover: {
            title: "Credentials",
            description:
              "Push, pull, and gh use this profile's token from the OS keychain.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#demo-enforce",
          popover: {
            title: "Safety",
            description:
              "If the account does not match the folder, strict mode blocks the operation.",
            side: "top",
            align: "start",
          },
        },
      ],
    });
    tour.drive();
  }, []);

  const tree = useMemo(
    () => [
      { label: "~", depth: 0, active: false },
      {
        label: "Personal/",
        depth: 1,
        active: scene.id === "personal",
        profile: "personal",
      },
      {
        label: "blog/",
        depth: 2,
        active: scene.id === "personal",
      },
      {
        label: "Work/",
        depth: 1,
        active: scene.id === "work",
        profile: "work",
      },
      {
        label: "api/",
        depth: 2,
        active: scene.id === "work",
      },
      {
        label: "Downloads/",
        depth: 1,
        active: scene.id === "downloads",
      },
    ],
    [scene.id]
  );

  return (
    <section id="demo" className="relative scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeContent blur>
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
                How it works
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl">
                <BlurText
                  text="Enter a bound folder."
                  delay={40}
                  animateBy="words"
                  direction="bottom"
                  className="font-display text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
                />
                <span className="mt-1 block text-base-content/45">
                  Your GitHub account switches with you.
                </span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-base-content/55 sm:text-base">
                Each path maps to one profile. Longer paths win. Leave the tree and that
                account stops applying.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md"
                onClick={startTour}
                id="tour-trigger"
              >
                Take a tour
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md"
                onClick={() => setAuto((v) => !v)}
              >
                {auto ? "Pause" : "Autoplay"}
              </Button>
            </div>
          </div>
        </FadeContent>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <FadeContent delay={120} className="h-full">
            <div className="h-full rounded-lg border border-base-content/15 bg-base-100 p-4 sm:p-5">
              <p className="mb-4 font-mono text-xs text-base-content/45">filesystem</p>
              <ul className="space-y-1 font-mono text-sm">
                {tree.map((node) => (
                  <li
                    key={`${node.depth}-${node.label}`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 transition-colors duration-300",
                      node.active ? "text-base-content" : "text-base-content/45"
                    )}
                    style={{ paddingLeft: `${0.5 + node.depth * 0.85}rem` }}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        node.active ? "bg-base-content" : "bg-base-content/25"
                      )}
                    />
                    <span>{node.label}</span>
                    {"profile" in node && node.profile ? (
                      <span className="ml-auto font-mono text-[11px] tracking-wide text-base-content/40">
                        {node.profile}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-base-content/10 pt-4">
                {scenes.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setAuto(false);
                      setIndex(i);
                    }}
                    className={cn(
                      "font-mono text-xs transition-colors",
                      i === index
                        ? "text-base-content"
                        : "text-base-content/35 hover:text-base-content/70"
                    )}
                  >
                    {s.path.replace("~/", "")}
                  </button>
                ))}
              </div>
            </div>
          </FadeContent>

          <FadeContent delay={220} className="h-full">
            <div className="relative h-full overflow-hidden rounded-lg border border-base-content/15 bg-base-100 p-5 sm:p-6">
              {/* Stack every scene in one grid cell so height stays at the tallest
                  state (Downloads) and scene changes never push page content. */}
              <div className="grid">
                {scenes.map((s) => {
                  const active = s.id === scene.id;
                  return (
                    <motion.div
                      key={s.id}
                      className="col-start-1 row-start-1"
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        y: active ? 0 : 8,
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden={!active}
                      style={{ pointerEvents: active ? "auto" : "none" }}
                    >
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div id={active ? "demo-path" : undefined}>
                          <p className="font-mono text-xs text-base-content/45">cwd</p>
                          <p className="mt-1 font-mono text-lg text-base-content sm:text-xl">
                            {s.path}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 font-mono text-xs",
                            s.state === "bound"
                              ? "text-base-content"
                              : "text-base-content/45"
                          )}
                          id={active ? "demo-enforce" : undefined}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              s.state === "bound"
                                ? "bg-base-content"
                                : "bg-base-content/30"
                            )}
                            aria-hidden
                          />
                          {s.state === "bound"
                            ? "bound · local wins"
                            : "unbound · fail closed"}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div
                          id={active ? "demo-profile" : undefined}
                          className="rounded-lg border border-base-content/12 p-4"
                        >
                          <p className="font-mono text-xs text-base-content/45">
                            profile
                          </p>
                          <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
                            {s.profile ?? "none"}
                          </p>
                          <p className="mt-3 font-mono text-xs text-base-content/55">
                            user.email → {s.email}
                          </p>
                        </div>
                        <div
                          id={active ? "demo-token" : undefined}
                          className="rounded-lg border border-base-content/12 p-4"
                        >
                          <p className="font-mono text-xs text-base-content/45">auth</p>
                          <p className="mt-2 font-mono text-sm text-base-content/80">
                            GH_TOKEN · {s.token}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-base-content/55">
                            {s.note}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 mockup-code w-full rounded-lg border border-base-content/12 bg-transparent text-sm">
                        <pre data-prefix="$">
                          <code>cd {s.path}</code>
                        </pre>
                        <pre data-prefix=">">
                          <code>
                            {s.profile
                              ? `acct whoami → ${s.profile}`
                              : "acct whoami → unbound"}
                          </code>
                        </pre>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
