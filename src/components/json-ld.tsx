import { faqs } from "@/lib/faq";
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
        softwareVersion: "0.2.0",
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
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
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
