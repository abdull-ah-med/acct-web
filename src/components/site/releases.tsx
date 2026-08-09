import FadeContent from "@/components/FadeContent";
import { getReleases } from "@/lib/releases";
import { ReleasesList } from "@/components/site/releases-list";
import { ArrowUpRight } from "lucide-react";

export async function Releases() {
  const { latestNpm, releases, changelogUrl, releasesUrl } = await getReleases();

  if (!releases.length) {
    return (
      <section id="releases" className="scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
            Releases
          </p>
          <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Version history
          </h2>
          <p className="mt-4 max-w-xl text-base text-base-content/55">
            Could not load release notes right now.{" "}
            <a
              href={changelogUrl}
              className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
              target="_blank"
              rel="noreferrer"
            >
              Read the changelog on GitHub
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="releases" className="scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeContent blur className="mb-10 md:mb-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
                Releases
              </p>
              <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                What shipped.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-base-content/55">
                Live from the{" "}
                <a
                  href={changelogUrl}
                  className="underline decoration-base-content/25 underline-offset-4 transition-colors hover:text-base-content hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  project changelog
                </a>
                {latestNpm ? (
                  <>
                    . Latest on npm is{" "}
                    <a
                      href="https://www.npmjs.com/package/acct-sh"
                      className="font-mono text-base-content/80 underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                      target="_blank"
                      rel="noreferrer"
                    >
                      acct-sh@{latestNpm}
                    </a>
                    .
                  </>
                ) : (
                  "."
                )}
              </p>
            </div>

            <a
              href={releasesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 self-start font-mono text-xs text-base-content/50 transition-colors hover:text-base-content sm:self-auto"
            >
              all releases
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </FadeContent>

        <ReleasesList releases={releases} />
      </div>
    </section>
  );
}

export function ReleasesFallback() {
  return (
    <section id="releases" className="scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
          Releases
        </p>
        <div className="h-10 w-48 animate-pulse rounded bg-base-content/10" />
        <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded bg-base-content/5" />
        <div className="mt-12 space-y-8 border-t border-base-content/10 pt-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid gap-4 md:grid-cols-[10rem_1fr]">
              <div className="h-4 w-16 animate-pulse rounded bg-base-content/10" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-base-content/5" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-base-content/5" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-base-content/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
