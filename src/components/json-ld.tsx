import { siteConfig } from "@/lib/site";
import { jsonLdText } from "@/lib/json-ld";

/** Structured data for search engines and answer engines. */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.svg`,
        },
        sameAs: [siteConfig.github, siteConfig.npm],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteConfig.url}/#software`,
        name: "acct",
        alternateName: ["acct-sh", "acct cli"],
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Version Control",
        operatingSystem: "macOS, Linux, Windows",
        description: siteConfig.longDescription,
        url: siteConfig.url,
        downloadUrl: siteConfig.npm,
        installUrl: siteConfig.npm,
        softwareVersion: "0.1.x",
        license: "https://opensource.org/licenses/MIT",
        codeRepository: siteConfig.github,
        programmingLanguage: "TypeScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Person",
          name: "Abdullah Ahmed",
          url: siteConfig.github,
        },
        keywords: siteConfig.keywords.join(", "),
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#software` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteConfig.url}${siteConfig.ogImage.url}`,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I install acct?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Run `npm install -g acct-sh`, then `acct` for the command list. Create a profile with `acct init` (--id, --user, --email, --name, --bind). Add a shell hook with eval \"$(acct hook zsh)\".",
            },
          },
          {
            "@type": "Question",
            name: "Does acct replace gh auth switch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes for directory-scoped work. acct injects GH_TOKEN from the OS keychain for the bound profile and does not call gh auth switch. Git HTTPS uses git-credential-acct; identity uses includeIf.",
            },
          },
          {
            "@type": "Question",
            name: "Where are tokens stored?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In the OS keychain via @napi-rs/keyring (macOS Keychain, Windows Credential Manager, Linux Secret Service / libsecret). CI hosts may set ACCT_SECRET_BACKEND=file for an explicit plaintext secrets.json opt-in.",
            },
          },
          {
            "@type": "Question",
            name: "How do I diagnose conflicts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Run `acct doctor` (add --online to verify ambient GH_TOKEN against the cwd profile). It scans credential helpers, install blocks, orphan bindings, sticky tokens, and keyring availability.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdText(graph) }}
    />
  );
}
