import type { Metadata } from "next";
import Footer from "@/components/footer-1";
import { SiteHeader } from "@/components/site/header";
import { DocumentationLayout } from "@/components/docs/documentation-layout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How the acct website handles information: no accounts, no first-party analytics, hosting logs via Vercel, and a local CLI that does not phone home.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy policy · acct",
    description:
      "How the acct website handles information. No accounts, no first-party analytics.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    type: "website",
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

const updated = "15 October 2026";

const toc = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-this-policy-covers", label: "What this policy covers" },
  { id: "information-we-collect", label: "Information we collect" },
  {
    id: "cookies-and-similar-technologies",
    label: "Cookies and similar technologies",
  },
  {
    id: "why-we-process-this-information",
    label: "Why we process this information",
  },
  { id: "sharing", label: "Sharing" },
  { id: "retention-and-location", label: "Retention and location" },
  { id: "your-rights", label: "Your rights" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="docs-main page-width">
        <DocumentationLayout toc={toc}>
          <header className="docs-heading">
            <div>
              <p className="eyebrow">Last updated {updated}</p>
              <h1>Privacy policy</h1>
              <p>
                This notice explains how the acct website handles information
                and how it relates to the CLI running on your machine.
              </p>
            </div>
          </header>
          <div className="policy-content">
            <section className="docs-group policy-section" id="who-we-are">
              <h2>Who we are</h2>
              <p>
                acct is an open-source CLI (npm:{" "}
                <code className="font-mono text-sm">acct-sh</code>) maintained
                by Abdullah Ahmed. This website is the public product page for
                that tool. There are no user accounts on the site and we do not
                operate a backend that stores visitor profiles.
              </p>
            </section>

            <section
              className="docs-group policy-section"
              id="what-this-policy-covers"
            >
              <h2>What this policy covers</h2>
              <p>
                It covers visits to this website, including pages such as the
                homepage, this policy, and public files like{" "}
                <code className="font-mono text-sm">/llms.txt</code>. It does
                not replace the privacy notices of third-party sites we link to
                (GitHub, npm, Vercel).
              </p>
              <p>
                The{" "}
                <strong className="font-medium text-base-content">
                  acct CLI
                </strong>{" "}
                runs on your machine. Tokens stay in your OS keychain (or an
                explicit local file backend you opt into). The CLI source does
                not include usage telemetry or a phone-home channel to us. When
                you use GitHub through{" "}
                <code className="font-mono text-sm">gh</code> or git, that
                traffic is between you and GitHub under{" "}
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                  className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub&apos;s privacy statement
                </a>
                .
              </p>
            </section>

            <section
              className="docs-group policy-section"
              id="information-we-collect"
            >
              <h2>Information we collect</h2>
              <p>
                We do not run first-party analytics, ads, or a newsletter. The
                site has no login, no contact form, and no cookies that we set
                to identify you. Copying an install command uses the browser
                clipboard on your device only.
              </p>
              <p>
                This site is hosted on Vercel. Vercel&apos;s{" "}
                <a
                  href="https://vercel.com/legal/privacy-notice"
                  className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Notice
                </a>{" "}
                states that when people visit a customer website, Vercel
                processes traffic metadata such as IP address, coarse location
                derived from IP (city/country, not precise geolocation),
                user-agent / system configuration, and request logs in order to
                operate, secure, and deliver the site. We do not have a separate
                visitor database on top of that hosting.
              </p>
              <p>
                To render release notes, the latest version, and cumulative npm
                download counts, our servers (not your browser) fetch public
                data from GitHub (
                <a
                  href="https://docs.github.com/en/rest"
                  className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  the GitHub API
                </a>{" "}
                and the raw changelog) and from the{" "}
                <a
                  href="https://www.npmjs.com/package/acct-sh"
                  className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  npm registry and public downloads API
                </a>
                . Those requests identify the website as the client. They do not
                send your name or email to those services as part of a site
                account we run.
              </p>
            </section>

            <section
              className="docs-group policy-section"
              id="cookies-and-similar-technologies"
            >
              <h2>Cookies and similar technologies</h2>
              <p>
                We do not use advertising cookies, a cookie-consent banner, or
                third-party analytics tags (no Google Analytics, Meta pixel, or
                similar). Essential hosting and security behavior is controlled
                by Vercel. You can block cookies in your browser; the marketing
                pages do not depend on them to function.
              </p>
            </section>

            <section
              className="docs-group policy-section"
              id="why-we-process-this-information"
            >
              <h2>Why we process this information</h2>
              <p>
                Where data-protection law (including the GDPR) applies, hosting
                and security logs are processed as needed to operate and protect
                the site — typically legitimate interests in delivering a public
                documentation/marketing page and keeping it available. We do not
                use that information to profile you for ads.
              </p>
            </section>

            <section className="docs-group policy-section" id="sharing">
              <h2>Sharing</h2>
              <p>
                We do not sell personal information and we do not share it for
                cross-context behavioral advertising. Infrastructure providers
                that necessarily see request data to host the site include
                Vercel (and the cloud providers in Vercel&apos;s subprocessors
                list). Outbound links to GitHub and npm are those
                companies&apos; services, governed by their policies.
              </p>
            </section>

            <section
              className="docs-group policy-section"
              id="retention-and-location"
            >
              <h2>Retention and location</h2>
              <p>
                We do not keep a first-party store of visitor accounts. Hosting
                logs follow Vercel&apos;s retention for the platform. Vercel
                delivers the site over a global edge network; processing may
                occur in the United States and other regions where Vercel and
                its subprocessors operate. Vercel publishes a{" "}
                <a
                  href="https://vercel.com/legal/dpa"
                  className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  Data Processing Addendum
                </a>{" "}
                and is listed under the EU–U.S. Data Privacy Framework.
              </p>
            </section>

            <section className="docs-group policy-section" id="your-rights">
              <h2>Your rights</h2>
              <p>
                Depending on where you live, you may have rights to access,
                correct, delete, or restrict personal data, to object to certain
                processing, and to lodge a complaint with a supervisory
                authority. Because we do not run user accounts, there is often
                nothing in a first-party database to access or delete. For
                hosting logs held by Vercel, we can look into a request if you
                write to us with enough detail to identify the relevant traffic;
                some log data is only available to the hosting provider.
              </p>
              <p>
                If you are in the EEA, UK, or Switzerland, you can also contact
                your local data protection authority. If you are in California,
                we do not sell or share personal information as those terms are
                used in the CPRA, and we do not use sensitive personal
                information to infer characteristics about you.
              </p>
            </section>

            <section className="docs-group policy-section" id="children">
              <h2>Children</h2>
              <p>
                This site is intended for developers and is not directed at
                children under 16, and we do not knowingly collect personal
                information from children.
              </p>
            </section>

            <section className="docs-group policy-section" id="changes">
              <h2>Changes</h2>
              <p>
                If we add accounts, analytics, or other collection, we will
                update this page and the date above. Material changes will be
                reflected here before they apply to new collection.
              </p>
            </section>

            <section className="docs-group policy-section" id="contact">
              <h2>Contact</h2>
              <p>
                Privacy questions: open an issue on the{" "}
                <a
                  href="https://github.com/abdull-ah-med/acct/issues"
                  className="underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
                  target="_blank"
                  rel="noreferrer"
                >
                  acct GitHub repository
                </a>
                . That is the contact channel published for this project.
              </p>
            </section>
          </div>
        </DocumentationLayout>
      </main>
      <Footer />
    </>
  );
}
