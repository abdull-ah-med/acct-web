import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Release } from "@/lib/releases";
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
  open = false,
}: {
  release: Release;
  open?: boolean;
}) {
  return (
    <details className="release-entry" key={release.version} open={open}>
      <summary>
        <span className="release-version">
          v{release.version}
          {release.isLatest && <span className="version-badge">Latest</span>}
        </span>
        <span className="release-date">{dateLabel(release)}</span>
        <span className="release-toggle">
          Release notes <ChevronDown size={17} />
        </span>
      </summary>
      <div className="release-body">
        {release.sections.length ? (
          release.sections.map((section, sectionIndex) => (
            <section
              className="release-section"
              key={`${section.title}-${sectionIndex}`}
            >
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
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
    </details>
  );
}
export function ReleasesList({ releases }: { releases: Release[] }) {
  const [latest, ...previous] = releases;
  if (!latest) return null;
  return (
    <div className="release-list">
      <ReleaseEntry release={latest} open />
      {previous.length > 0 && (
        <details className="previous-releases">
          <summary>
            Previous Releases <span>{previous.length} versions</span>
            <ChevronDown size={17} />
          </summary>
          <div className="previous-release-list">
            {previous.map((release) => (
              <ReleaseEntry key={release.version} release={release} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
