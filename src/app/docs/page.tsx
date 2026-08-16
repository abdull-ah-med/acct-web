import type { Metadata } from "next";
import Footer from "@/components/footer-1";
import { SiteHeader } from "@/components/site/header";
import { DocsView } from "@/components/docs/docs-view";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Command reference",
  description:
    "Every acct CLI command: init, profile, bind, status, doctor, exec, hook, install, and the flags that go with them.",
  alternates: { canonical: "/docs" },
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
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip px-4 pt-28 pb-20 sm:px-6 md:pt-32 md:pb-28">
        <DocsView />
      </main>
      <Footer />
    </>
  );
}
