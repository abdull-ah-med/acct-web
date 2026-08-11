import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Releases, ReleasesFallback } from "@/components/site/releases";
import Footer from "@/components/footer-1";

// Below-fold client sections — keep the hero chunk small.
const DirectoryWalk = dynamic(
  () =>
    import("@/components/site/directory-walk").then((m) => m.DirectoryWalk),
  { loading: () => <section className="min-h-[28rem]" aria-hidden /> },
);
const Problem = dynamic(() =>
  import("@/components/site/problem").then((m) => m.Problem),
);
const Planes = dynamic(() =>
  import("@/components/site/planes").then((m) => m.Planes),
);
const Install = dynamic(() =>
  import("@/components/site/install").then((m) => m.Install),
);
const FAQs = dynamic(() => import("@/components/faqs-1"));
const CallToAction = dynamic(() => import("@/components/call-to-action-1"));

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <DirectoryWalk />
        <div className="hairline mx-auto max-w-7xl" />
        <Problem />
        <div className="hairline mx-auto max-w-7xl" />
        <Planes />
        <div className="hairline mx-auto max-w-7xl" />
        <Install />
        <div className="hairline mx-auto max-w-7xl" />
        <Suspense fallback={<ReleasesFallback />}>
          <Releases />
        </Suspense>
        <div className="hairline mx-auto max-w-7xl" />
        <FAQs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
