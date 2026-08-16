import type { Metadata } from "next";
import Footer from "@/components/footer-1";
import { SiteHeader } from "@/components/site/header";
import { DocsView } from "@/components/docs/docs-view";
import { siteConfig } from "@/lib/site";
import { jsonLdText } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Command reference",
  description:
    "Every acct CLI command: init, profile, bind, status, doctor, exec, hook, install, and the flags that go with them. Also at /docs.md for agents.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: "/docs",
    types: {
      "text/markdown": [{ url: "/docs.md", title: "Command reference (markdown)" }],
      "text/plain": [
        { url: "/llms.txt", title: "LLM index" },
        { url: "/llms-full.txt", title: "LLM full context" },
      ],
    },
  },
  openGraph: {
    title: "Command reference · acct",
    description:
      "Every acct CLI command: init, profile, bind, status, doctor, exec, hook, and install.",
    url: `${siteConfig.url}/docs`,
    siteName: siteConfig.name,
    type: "article",
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
        type: "image/jpeg",
      },
    ],
  },
};

export default function DocsPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "acct command reference",
    name: "acct command reference",
    description:
      "Every acct CLI command, flag, and example. Directory-scoped GitHub identity.",
    url: `${siteConfig.url}/docs`,
    inLanguage: "en-US",
    encodingFormat: "text/html",
    encoding: {
      "@type": "MediaObject",
      contentUrl: `${siteConfig.url}/docs.md`,
      encodingFormat: "text/markdown",
    },
    isAccessibleForFree: true,
    about: { "@id": `${siteConfig.url}/#software` },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdText(articleLd) }}
      />
      <main className="overflow-x-clip px-4 pt-28 pb-20 sm:px-6 md:pt-32 md:pb-28">
        <DocsView />
      </main>
      <Footer />
    </>
  );
}
