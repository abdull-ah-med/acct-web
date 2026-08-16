import { formatDocsMarkdown } from "@/lib/docs-commands";
import { siteConfig } from "@/lib/site";

export function GET() {
  return new Response(formatDocsMarkdown(siteConfig.url), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
    },
  });
}
