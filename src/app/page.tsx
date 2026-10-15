import { Suspense } from "react";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Features, Setup, FAQ } from "@/components/site/home-sections";
import { Downloads } from "@/components/site/downloads";
import Footer from "@/components/footer-1";
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero
          downloads={
            <Suspense fallback={null}>
              <Downloads />
            </Suspense>
          }
        />
        <Features />
        <Setup />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
