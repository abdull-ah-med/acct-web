import type { Metadata } from "next";
import Footer from "@/components/footer-1";
import { NotFoundHistoryReplace } from "@/components/not-found-history";
import { NotFoundView } from "@/components/not-found-view";
import { SiteHeader } from "@/components/site/header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "This path is not bound to any page on acct.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "404 — acct",
    description: "This path is not bound to any page.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function NotFound() {
  return (
    <>
      <NotFoundHistoryReplace />
      <SiteHeader />
      <NotFoundView />
      <Footer />
    </>
  );
}
