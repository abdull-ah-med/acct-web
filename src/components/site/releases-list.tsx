"use client";

import { useState } from "react";
import FadeContent from "@/components/FadeContent";
import type { Release } from "@/lib/releases";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(isoDate: string | null, publishedAt: string | null): string | null {
  const raw = publishedAt ?? (isoDate ? `${isoDate}T12:00:00Z` : null);
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  const dateLabel = release.isUnreleased
    ? "in progress"
    : formatDate(release.date, release.publishedAt);

  return (
    <FadeContent delay={Math.min(index * 70, 280)}>
      <article className="border-b border-base-content/10 py-8 last:border-b-0 md:py-10">
        <div className="grid gap-6 md:grid-cols-[10rem_1fr] md:gap-10 lg:grid-cols-[12rem_1fr]">
          <div className="md:pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={release.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-base-content transition-colors hover:text-base-content/70"
              >
                {release.isUnreleased ? "next" : `v${release.version}`}
              </a>
              {release.isLatest ? (
                <span className="font-mono text-[10px] tracking-[0.14em] text-base-content/50 uppercase">
                  latest
                </span>
              ) : null}
              {release.isUnreleased ? (
                <span className="font-mono text-[10px] tracking-[0.14em] text-base-content/40 uppercase">
                  unreleased
                </span>
              ) : null}
            </div>
            {dateLabel ? (
              <p className="mt-2 font-mono text-xs text-base-content/40">{dateLabel}</p>
            ) : null}
          </div>

          <div className="space-y-5">
            {release.sections.length === 0 ? (
              <p className="text-sm text-base-content/50">
                See the GitHub release notes for details.
              </p>
            ) : (
              release.sections.map((section) => (
                <div key={`${release.version}-${section.title}`}>
                  <p className="mb-2 font-mono text-[11px] tracking-[0.16em] text-base-content/40 uppercase">
                    {section.title}
                  </p>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={`${section.title}-${itemIndex}`}
                        className="relative pl-4 text-sm leading-relaxed text-base-content/65 before:absolute before:top-[0.55em] before:left-0 before:size-1 before:rounded-full before:bg-base-content/35"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </FadeContent>
  );
}

export function ReleasesList({ releases }: { releases: Release[] }) {
  const [expanded, setExpanded] = useState(false);
  const [latest, ...older] = releases;

  if (!latest) return null;

  const olderLabel =
    older.length === 1 ? "1 older release" : `${older.length} older releases`;

  return (
    <div className="border-t border-base-content/10">
      <ReleaseCard release={latest} index={0} />

      {older.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="flex w-full items-center justify-center gap-2 border-t border-base-content/10 py-6 font-mono text-xs tracking-[0.12em] text-base-content/50 uppercase transition-colors hover:text-base-content"
          >
            {expanded ? "Hide older releases" : `Show ${olderLabel}`}
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                expanded && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          {expanded ? (
            <div className="border-t border-base-content/10">
              {older.map((release, index) => (
                <ReleaseCard key={release.version} release={release} index={index + 1} />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
