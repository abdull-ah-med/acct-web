import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — acct",
  description: "This path is not bound to any page.",
};

export default function NotFound() {
  return (
    <>
      <header className="border-b border-base-content/10 bg-base-100/90 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="acct home">
            <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-sm" />
            <span className="text-lg font-semibold tracking-tight text-base-content">acct</span>
          </Link>
          <Link href="/#install" className="btn btn-primary btn-sm rounded-full font-sans">
            install
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center px-4 py-16 sm:px-6">
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
            Like walking outside your work tree — there&apos;s no profile here. Head back to the
            homepage or jump straight to install.
          </p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-base-content/15 bg-base-200/40 px-3 py-2 font-mono text-sm text-base-content/70">
            <span className="text-base-content/40">pwd</span>
            <span className="text-base-content/90">~/nowhere</span>
            <span className="text-base-content/35">→</span>
            <span className="text-base-content/50">unbound</span>
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="cta-btn cta-btn-primary">
              Back home
            </Link>
            <Link href="/#install" className="cta-btn cta-btn-outline">
              Install acct
            </Link>
            <a
              href="https://github.com/abdull-ah-med/acct/issues"
              target="_blank"
              rel="noreferrer"
              className="cta-btn cta-btn-outline"
            >
              Report broken link
            </a>
          </div>
        </div>

        <div
          className="pointer-events-none mt-16 select-none font-display text-[clamp(3rem,18vw,10rem)] font-extrabold leading-none tracking-[-0.06em] [-webkit-text-fill-color:transparent] [background-clip:text] [background-image:linear-gradient(180deg,oklch(94%_0_0_/_0),oklch(94%_0_0_/_0.06)_50%,oklch(94%_0_0_/_0.2))]"
          aria-hidden="true"
        >
          acct
        </div>
      </main>
    </>
  );
}
