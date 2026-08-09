const REPO = "abdull-ah-med/acct";
const CHANGELOG_URL = `https://raw.githubusercontent.com/${REPO}/main/CHANGELOG.md`;
const RELEASES_URL = `https://api.github.com/repos/${REPO}/releases?per_page=20`;
const NPM_LATEST_URL = "https://registry.npmjs.org/acct-sh/latest";
const REVALIDATE = 60 * 30; // 30 minutes

export type ReleaseSection = {
  title: string;
  items: string[];
};

export type Release = {
  version: string;
  date: string | null;
  sections: ReleaseSection[];
  htmlUrl: string;
  publishedAt: string | null;
  isLatest: boolean;
  isUnreleased: boolean;
};

export type ReleasesPayload = {
  latestNpm: string | null;
  releases: Release[];
  changelogUrl: string;
  releasesUrl: string;
};

type GhRelease = {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
};

type ChangelogEntry = {
  version: string;
  date: string | null;
  body: string;
};

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseChangelog(markdown: string): ChangelogEntry[] {
  const lines = markdown.split(/\r?\n/);
  const entries: ChangelogEntry[] = [];
  let current: ChangelogEntry | null = null;
  const bodyLines: string[] = [];

  const flush = () => {
    if (!current) return;
    entries.push({ ...current, body: bodyLines.join("\n").trim() });
    bodyLines.length = 0;
    current = null;
  };

  for (const line of lines) {
    const heading = line.match(/^## \[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/);
    if (heading) {
      flush();
      current = { version: heading[1], date: heading[2] ?? null, body: "" };
      continue;
    }
    if (current) bodyLines.push(line);
  }
  flush();
  return entries;
}

function parseSections(body: string, maxItemsPerSection = 6): ReleaseSection[] {
  const sections: ReleaseSection[] = [];
  let current: ReleaseSection | null = null;

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const section = line.match(/^###\s+(.+)$/);
    if (section) {
      current = { title: section[1].trim(), items: [] };
      sections.push(current);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet && current && current.items.length < maxItemsPerSection) {
      current.items.push(stripMarkdown(bullet[1]));
    }
  }

  return sections.filter((s) => s.items.length > 0);
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json", "User-Agent": "acct-web" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      headers: { "User-Agent": "acct-web" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function tagToVersion(tag: string): string {
  return tag.replace(/^v/i, "");
}

export async function getReleases(limit = 6): Promise<ReleasesPayload> {
  const changelogUrl = `https://github.com/${REPO}/blob/main/CHANGELOG.md`;
  const releasesUrl = `https://github.com/${REPO}/releases`;

  const [changelogMd, ghReleases, npmLatest] = await Promise.all([
    fetchText(CHANGELOG_URL),
    fetchJson<GhRelease[]>(RELEASES_URL),
    fetchJson<{ version?: string }>(NPM_LATEST_URL),
  ]);

  const latestNpm = npmLatest?.version ?? null;
  const ghByVersion = new Map<string, GhRelease>();
  for (const release of ghReleases ?? []) {
    if (release.draft) continue;
    ghByVersion.set(tagToVersion(release.tag_name), release);
  }

  const entries = changelogMd ? parseChangelog(changelogMd) : [];

  const releases: Release[] = entries
    .filter((entry) => entry.version.toLowerCase() !== "unreleased")
    .slice(0, limit)
    .map((entry) => {
      const gh = ghByVersion.get(entry.version);

      return {
        version: entry.version,
        date: entry.date,
        sections: parseSections(entry.body),
        htmlUrl: gh?.html_url ?? `${releasesUrl}/tag/v${entry.version}`,
        publishedAt: gh?.published_at ?? null,
        isLatest: Boolean(latestNpm && entry.version === latestNpm),
        isUnreleased: false,
      };
    })
    .filter((r) => r.sections.length > 0);

  // If CHANGELOG fetch failed, fall back to GitHub release titles only
  if (!releases.length && ghReleases?.length) {
    for (const gh of ghReleases.filter((r) => !r.draft).slice(0, limit)) {
      const version = tagToVersion(gh.tag_name);
      releases.push({
        version,
        date: gh.published_at?.slice(0, 10) ?? null,
        sections: [],
        htmlUrl: gh.html_url,
        publishedAt: gh.published_at,
        isLatest: Boolean(latestNpm && version === latestNpm),
        isUnreleased: false,
      });
    }
  }

  return { latestNpm, releases, changelogUrl, releasesUrl };
}
