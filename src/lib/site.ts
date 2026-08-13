/** Canonical site URL for metadata, robots, and sitemap. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://acct-web.vercel.app";

export const siteConfig = {
  name: "acct",
  title: "acct — Switch GitHub accounts by folder",
  description:
    "Directory-scoped GitHub identity and auth. Bind a folder to a GitHub user, email, and token — enter the tree and that account is active. Leave and it is gone.",
  /** Longer pitch for JSON-LD / llms-full. */
  longDescription:
    "acct (npm: acct-sh) is a CLI that binds a directory tree to one GitHub account, git identity, and credential. It wires includeIf identity, an HTTPS credential helper, IdentitiesOnly SSH, GH_TOKEN injection for gh, and optional pre-commit/pre-push enforcement. Local always wins; fail closed when unbound under strict mode. Official gh documents automatic directory switching as out of scope — acct owns that gap.",
  keywords: [
    "git",
    "github",
    "gh",
    "multi-account",
    "github multi account",
    "credential helper",
    "git-credential",
    "directory-scoped",
    "git identity",
    "user.name",
    "user.email",
    "includeIf",
    "acct-sh",
    "acct cli",
    "developer tools",
    "switch github account",
    "folder scoped github",
    "OS keychain",
    "libsecret",
  ],
  url: siteUrl,
  github: "https://github.com/abdull-ah-med/acct",
  npm: "https://www.npmjs.com/package/acct-sh",
  githubPackages: "https://github.com/abdull-ah-med/acct/pkgs/npm/acct-sh",
  docs: {
    threatModel:
      "https://github.com/abdull-ah-med/acct/blob/main/docs/threat-model.md",
    invariants:
      "https://github.com/abdull-ah-med/acct/blob/main/docs/invariants.md",
    changelog:
      "https://github.com/abdull-ah-med/acct/blob/main/CHANGELOG.md",
    agents: "https://github.com/abdull-ah-med/acct/blob/main/AGENTS.md",
  },
  install: "npm install -g acct-sh",
  locale: "en_US",
  ogImage: {
    url: "/og.jpeg",
    width: 2720,
    height: 972,
    alt: "acct — switch GitHub accounts by folder",
  },
} as const;

/** AI crawler user-agents we explicitly allow in robots.txt. */
export const aiCrawlerUserAgents = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Anthropic-AI",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
] as const;
