import { ArrowUpRight } from "lucide-react";
import { getReleases } from "@/lib/releases";
import { ReleasesList } from "@/components/site/releases-list";
export async function Releases() {
  const { releases, changelogUrl, releasesUrl } = await getReleases();
  return (
    <section
      className="releases-section section-space page-width"
      id="releases"
    >
      <div className="section-intro">
        <h2>See what changed in each release.</h2>
        <div>
          <p>
            These notes come from the project changelog and refresh every 30
            minutes, with the complete text available for each release.
          </p>
          <a
            href={releasesUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            All releases on GitHub <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      {releases.length ? (
        <ReleasesList releases={releases} />
      ) : (
        <div className="release-empty">
          <p>
            Release notes are temporarily unavailable, but you can read the full
            changelog on GitHub.
          </p>
          <a
            href={changelogUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Read the changelog <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </section>
  );
}
export function ReleasesFallback() {
  return (
    <section
      className="releases-section section-space page-width"
      id="releases"
      aria-label="Loading release notes"
    >
      <h2>See what changed in each release.</h2>
      <p className="section-description">
        The latest release notes are loading.
      </p>
    </section>
  );
}
