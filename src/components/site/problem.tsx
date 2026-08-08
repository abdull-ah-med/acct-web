"use client";

import FadeContent from "@/components/FadeContent";
import TrueFocus from "@/components/TrueFocus";

const leaks = [
  {
    title: "Git config is not login",
    body: "Setting user.name and user.email only changes the commit stamp. Pushing still uses whatever credentials are active, so you can author as one person and authenticate as another.",
  },
  {
    title: "gh auth switch is global",
    body: "Switching accounts in the GitHub CLI affects your whole machine. Open a personal repo after a work day and you can still be on the wrong account.",
  },
  {
    title: "Credentials ignore your folders",
    body: "HTTPS helpers usually key off the host (github.com), not which project directory you are in. Two people on the same host look the same to git.",
  },
  {
    title: "SSH offers every key",
    body: "Your agent will try keys until one works. Without locking identity to a folder, the wrong key can win.",
  },
];

export function Problem() {
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeContent blur className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
            The problem
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Multiple GitHub accounts on one machine is easy to get wrong.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-content/60 sm:text-lg">
            Work in ~/Work, personal in ~/Personal. Without folder-scoped identity, git and gh
            keep using the last account you switched to. That is how commits and pushes leak
            across jobs.
          </p>
          <div className="mt-8">
            <TrueFocus
              sentence="No manual account switching.|No silent wrong-account push."
              separator="|"
              blurAmount={2.5}
              borderColor="oklch(94% 0 0)"
            />
          </div>
        </FadeContent>

        <div className="grid gap-px overflow-hidden rounded-box border border-base-content/10 bg-base-content/10 sm:grid-cols-2">
          {leaks.map((item, i) => (
            <FadeContent key={item.title} delay={i * 80}>
              <article className="h-full bg-base-100 p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold tracking-tight text-base-content">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-base-content/60 sm:text-base">
                  {item.body}
                </p>
              </article>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
