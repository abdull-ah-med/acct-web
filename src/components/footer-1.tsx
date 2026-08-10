import Image from "next/image";
import Link from "next/link";
import { BackToTopButton } from "@/components/back-to-top";

const footerLinks = [
  {
    name: "Product",
    links: [
      { href: "/#demo", id: "demo", label: "how it works" },
      { href: "/#planes", id: "planes", label: "what it does" },
      { href: "/#install", id: "install", label: "install" },
      { href: "/#releases", id: "releases", label: "releases" },
      { href: "/#faq", id: "faq", label: "faq" },
    ],
  },
  {
    name: "Docs",
    links: [
      {
        href: "https://github.com/abdull-ah-med/acct/blob/main/README.md",
        label: "README",
      },
      {
        href: "https://github.com/abdull-ah-med/acct/blob/main/CHANGELOG.md",
        label: "Changelog",
      },
      {
        href: "https://github.com/abdull-ah-med/acct/blob/main/docs/invariants.md",
        label: "Invariants",
      },
      {
        href: "https://github.com/abdull-ah-med/acct/blob/main/docs/threat-model.md",
        label: "Threat model",
      },
      {
        href: "https://www.npmjs.com/package/acct-sh",
        label: "npm",
      },
    ],
  },
  {
    name: "Community",
    links: [
      { href: "https://github.com/abdull-ah-med/acct", label: "GitHub" },
      {
        href: "https://github.com/abdull-ah-med/acct/releases",
        label: "Releases",
      },
      {
        href: "https://github.com/abdull-ah-med/acct/issues",
        label: "Issues",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-x-hidden overflow-y-hidden border-t border-base-content/10 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 md:pt-16 md:pb-8">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="mx-auto max-w-sm md:mx-0 md:max-w-none">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="acct home">
              <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-sm" />
              <span className="text-lg font-semibold tracking-tight text-base-content">
                acct
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-base-content/50 md:whitespace-nowrap">
              Bind folders to GitHub accounts so commits, pushes, and gh stay on the right
              identity.
            </p>
            <p className="mt-3 font-mono text-[11px] text-base-content/35">MIT · 2026</p>
          </div>
          <BackToTopButton />
        </div>

        <div className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 border-t border-base-content/10 pt-10 sm:gap-x-8 lg:gap-x-12">
          {footerLinks.map((group) => (
            <nav key={group.name} aria-label={group.name}>
              <p className="font-mono text-[10px] tracking-[0.18em] text-base-content/40 uppercase sm:text-[11px]">
                {group.name}
              </p>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[13px] text-base-content/60 transition-colors hover:text-base-content sm:text-sm"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Full-bleed wordmark, flush to page bottom */}
      <div
        className="relative w-full max-w-[100vw] select-none overflow-hidden leading-none"
        aria-hidden="true"
      >
        <p className="m-0 w-full max-w-full pb-0 text-center font-display font-extrabold tracking-[-0.06em] text-[clamp(4.5rem,28vw,24rem)] leading-[0.68] [-webkit-text-fill-color:transparent] [background-clip:text] [background-image:linear-gradient(180deg,oklch(94%_0_0_/_0),oklch(94%_0_0_/_0.08)_40%,oklch(94%_0_0_/_0.32))]">
          acct
        </p>
      </div>
    </footer>
  );
}
