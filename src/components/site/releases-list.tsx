import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Release } from "@/lib/releases";
import { Disclosure } from "@/components/disclosure";

function dateLabel(release: Release) {
  const raw =
    release.publishedAt ?? (release.date ? `${release.date}T12:00:00Z` : null);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : release.date;
}
function ReleaseEntry({
  release,
  latest = false,
}: {
  release: Release;
  latest?: boolean;
}) {
  return (
    <Disclosure
      id={
        latest
          ? "latest-release"
          : `release-${release.version.replaceAll(".", "-")}`
      }
      className="release-entry"
      defaultOpen={latest}
      headingLevel={2}
      label={
        <>
          <span className="release-version">
            v{release.version}
            {release.isLatest && <span className="version-badge">Latest</span>}
          </span>
          <span className="release-date">{dateLabel(release)}</span>
          <span className="release-toggle">
            Release notes <ChevronDown size={17} />
          </span>
        </>
      }
    >
      <div className="release-body">
        {release.sections.length ? (
          release.sections.map((section, sectionIndex) => (
            <section
              className="release-section"
              key={`${section.title}-${sectionIndex}`}
            >
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p>Read the complete release notes on GitHub.</p>
        )}
        <a
          className="text-link"
          href={release.htmlUrl}
          target="_blank"
          rel="noreferrer"
        >
          View v{release.version} on GitHub <ArrowUpRight size={15} />
        </a>
      </div>
    </Disclosure>
  );
}
export function ReleasesList({ releases }: { releases: Release[] }) {
  const [latest, ...previous] = releases;
  if (!latest) return null;
  return (
    <div className="release-list">
      <ReleaseEntry release={latest} latest />
      {previous.length > 0 && (
        <Disclosure
          id="previous-releases"
          className="previous-releases"
          headingLevel={2}
          label={
            <>
              Previous Releases <span>{previous.length} versions</span>
              <ChevronDown size={17} />
            </>
          }
        >
          <div className="previous-release-list">
            {previous.map((release) => (
              <ReleaseEntry key={release.version} release={release} />
            ))}
          </div>
        </Disclosure>
      )}
    </div>
  );
}
