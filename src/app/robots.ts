import type { MetadataRoute } from "next";
import { aiCrawlerUserAgents, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/llms.txt", "/llms-full.txt", "/agents.md", "/privacy", "/sitemap.xml"],
      },
      ...aiCrawlerUserAgents.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
