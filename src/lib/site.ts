/** Canonical site URL for metadata, robots, and sitemap. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://acct-web.vercel.app";

export const siteConfig = {
  name: "acct",
  title: "acct — Switch GitHub accounts by folder",
  description:
    "Directory-scoped GitHub identity and auth. Bind a folder to a GitHub user, email, and token — enter the tree and that account is active. Leave and it is gone.",
  keywords: [
    "git",
    "github",
    "gh",
    "multi-account",
    "credential helper",
    "directory-scoped",
    "git identity",
    "acct-sh",
    "developer tools",
  ],
  url: siteUrl,
  github: "https://github.com/abdull-ah-med/acct",
  npm: "https://www.npmjs.com/package/acct-sh",
};
