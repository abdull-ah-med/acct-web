import { Suspense } from "react";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Features, Setup, FAQ } from "@/components/site/home-sections";
import { Stats, StatsFallback } from "@/components/site/stats";
import { Releases, ReleasesFallback } from "@/components/site/releases";
import Footer from "@/components/footer-1";
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<StatsFallback />}>
          <Stats />
        </Suspense>
        <Features />
        <Setup />
        <Suspense fallback={<ReleasesFallback />}>
          <Releases />
        </Suspense>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
