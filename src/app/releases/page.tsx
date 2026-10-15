import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/footer-1";
import { SiteHeader } from "@/components/site/header";
import { DocumentationLayout } from "@/components/docs/documentation-layout";
import { ReleasesList } from "@/components/site/releases-list";
import { getReleases } from "@/lib/releases";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Release notes",
  description:
    "Changes, fixes, and upgrade instructions for each acct release.",
  alternates: { canonical: "/releases" },
  openGraph: {
    title: "Release notes · acct",
    description:
      "Changes, fixes, and upgrade instructions for each acct release.",
    url: `${siteConfig.url}/releases`,
    type: "article",
  },
};
export default async function ReleasesPage() {
  const { releases, changelogUrl, releasesUrl } = await getReleases(50);
  const toc = releases.length
    ? [
        { id: "latest-release", label: "Latest release" },
        ...(releases.length > 1
          ? [{ id: "previous-releases", label: "Previous Releases" }]
          : []),
      ]
    : [];
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="docs-main page-width">
        <DocumentationLayout toc={toc}>
          <header className="docs-heading">
            <div>
              <p className="eyebrow">ACCT RELEASES</p>
              <h1>Release notes</h1>
              <p>
                Review the changes, fixes, and upgrade instructions for each
                version of acct.
              </p>
            </div>
            <a
              className="reference-action"
              href={releasesUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub <ArrowUpRight size={14} />
            </a>
          </header>
          <div className="reference-releases">
            {releases.length ? (
              <ReleasesList releases={releases} />
            ) : (
              <div className="release-empty">
                <p>
                  Release notes are temporarily unavailable, but you can read
                  the full changelog on GitHub.
                </p>
                <a
                  className="text-link"
                  href={changelogUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the changelog <ArrowUpRight size={15} />
                </a>
              </div>
            )}
          </div>
        </DocumentationLayout>
      </main>
      <Footer />
    </>
  );
}
