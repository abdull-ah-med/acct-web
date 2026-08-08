"use client";

import {
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Terminal,
  GitBranch,
} from "lucide-react";
import FadeContent from "@/components/FadeContent";
import SpotlightCard from "@/components/SpotlightCard";
import ScrollReveal from "@/components/ScrollReveal";

const planes = [
  {
    icon: Fingerprint,
    title: "Git identity",
    body: "Sets the right name and email for commits inside each bound folder, so work and personal authorship stay separate.",
  },
  {
    icon: KeyRound,
    title: "HTTPS push / pull",
    body: "Serves the token for this folder's GitHub account. If nothing matches, it refuses instead of falling back to the wrong credentials.",
  },
  {
    icon: Terminal,
    title: "SSH",
    body: "Uses only the SSH key for the active profile, so the agent cannot authenticate you as someone else.",
  },
  {
    icon: GitBranch,
    title: "GitHub CLI (gh)",
    body: "Points gh at the same account as the folder. You do not need gh auth switch when you change directories.",
  },
  {
    icon: ShieldCheck,
    title: "Guards",
    body: "Optional hooks stop commits and pushes when the email or GitHub user does not match the bound profile.",
  },
];

export function Planes() {
  return (
    <section id="planes" className="scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
            What acct controls
          </p>
          <ScrollReveal>
            Everything that can leak a GitHub identity across folders.
          </ScrollReveal>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/55">
            One tool keeps commit author, push credentials, SSH key, and gh aligned to the
            directory you are in.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {planes.map((plane, i) => {
            const Icon = plane.icon;
            return (
              <FadeContent key={plane.title} delay={i * 70}>
                <SpotlightCard
                  className="h-full rounded-box border border-base-content/10 bg-base-200/40 p-6"
                  spotlightColor="rgba(255, 255, 255, 0.12)"
                >
                  <Icon className="mb-5 size-5 text-base-content/70" strokeWidth={1.5} />
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {plane.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    {plane.body}
                  </p>
                </SpotlightCard>
              </FadeContent>
            );
          })}

          <FadeContent delay={360} className="sm:col-span-2 lg:col-span-1">
            <div className="flex h-full flex-col justify-between rounded-box border border-dashed border-base-content/15 bg-base-100/40 p-6">
              <p className="font-mono text-xs text-base-content/45">How it chooses</p>
              <ol className="mt-4 space-y-2 text-sm leading-relaxed text-base-content/70">
                <li>1. Explicit profile override</li>
                <li>2. Repo-local .acct file</li>
                <li>3. Longest matching folder bind</li>
                <li>4. Unbound (no acct identity)</li>
              </ol>
              <p className="mt-6 text-sm text-base-content/50">
                More specific paths always beat broader ones.
              </p>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
