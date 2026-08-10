import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/footer-1";
import { NotFoundHistoryReplace } from "@/components/not-found-history";
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
      <header className="border-b border-base-content/10 bg-base-100/90 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2.5" aria-label="acct home">
            <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-sm" />
            <span className="text-lg font-semibold tracking-tight text-base-content">acct</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-base-content/40 uppercase">
            error · unbound
          </p>

          <h1
            className="mt-4 font-display text-[clamp(5rem,22vw,11rem)] font-extrabold leading-none tracking-tight text-base-content"
            aria-label="404"
          >
            404
          </h1>

          <p className="mt-6 font-display text-2xl font-medium tracking-tight text-base-content sm:text-3xl">
            This path isn&apos;t bound to anything.
          </p>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-base-content/55">
            Like walking outside your work tree — there&apos;s no profile here.
          </p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-base-content/15 bg-base-200/40 px-3 py-2 font-mono text-sm text-base-content/70">
            <span className="text-base-content/40">pwd</span>
            <span className="text-base-content/90">~/nowhere</span>
            <span className="text-base-content/35">→</span>
            <span className="text-base-content/50">unbound</span>
          </p>

          <div className="mt-10 flex justify-center">
            <Link href="/" className="cta-btn cta-btn-primary">
              Back home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
