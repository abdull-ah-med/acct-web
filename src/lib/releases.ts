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
  body?: string;
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
    const heading = line.match(
      /^## \[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/,
    );
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

function parseSections(body: string): ReleaseSection[] {
  const sections: ReleaseSection[] = [];
  let current: ReleaseSection | null = null;
  let continuing = false;
  let fenced = false;

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (!line) {
      continuing = false;
      continue;
    }
    const heading = !fenced && line.match(/^#{2,6}\s+(.+)$/);
    if (heading) {
      current = { title: stripMarkdown(heading[1]), items: [] };
      sections.push(current);
      continuing = false;
      continue;
    }
    if (/^\[[^\]]+\]:/.test(line) || /^---+$/.test(line)) continue;
    if (!current) {
      current = { title: "Overview", items: [] };
      sections.push(current);
    }
    const bullet = !fenced && line.match(/^(?:[-*+] |\d+\. )(.+)$/);
    if (bullet) {
      current.items.push(bullet[1]);
    } else if (current.items.length && (continuing || /^\s+/.test(raw))) {
      current.items[current.items.length - 1] += ` ${line}`;
    } else {
      current.items.push(line);
    }
    continuing = true;
  }
  return sections
    .filter((section) => section.items.length)
    .map((section) => ({
      ...section,
      items: section.items.map(stripMarkdown),
    }));
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json", "User-Agent": "acct-web/0.2" },
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
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "acct-web/0.2" },
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

  // Keep complete GitHub release bodies when the changelog is unavailable.
  if (!releases.length && ghReleases?.length) {
    for (const gh of ghReleases.filter((r) => !r.draft).slice(0, limit)) {
      const version = tagToVersion(gh.tag_name);
      releases.push({
        version,
        date: gh.published_at?.slice(0, 10) ?? null,
        sections: parseSections(gh.body ?? ""),
        htmlUrl: gh.html_url,
        publishedAt: gh.published_at,
        isLatest: Boolean(latestNpm && version === latestNpm),
        isUnreleased: false,
      });
    }
  }

  return { latestNpm, releases, changelogUrl, releasesUrl };
}
