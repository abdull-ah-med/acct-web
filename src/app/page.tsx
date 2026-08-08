import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { DirectoryWalk } from "@/components/site/directory-walk";
import { Problem } from "@/components/site/problem";
import { Planes } from "@/components/site/planes";
import { Install } from "@/components/site/install";
import FAQs from "@/components/faqs-1";
import CallToAction from "@/components/call-to-action-1";
import Footer from "@/components/footer-1";

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
        <FAQs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
