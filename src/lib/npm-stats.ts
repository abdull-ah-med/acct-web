export type NpmStats = {
  version: string | null;
  downloads: number | null;
  since: string | null;
  through: string | null;
};
type Registry = {
  "dist-tags"?: { latest?: string };
  time?: { created?: string };
};
type DownloadCount = {
  downloads: number;
  start: string;
  end: string;
  package: string;
};
const DAY = 86400000;
const PACKAGE = "acct-sh";

async function readJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json", "User-Agent": "acct-web/0.2" },
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}
function validDate(value: string | null | undefined): value is string {
  return (
    !!value &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

/** npm limits each query to 18 months; sum inclusive, non-overlapping 365-day
 * windows from package creation, never label a partial response as a lifetime total.
 * https://github.com/npm/registry/blob/main/docs/download-counts.md
 */
export async function getNpmStats(): Promise<NpmStats> {
  const [registry, latestDay] = await Promise.all([
    readJson<Registry>(`https://registry.npmjs.org/${PACKAGE}`),
    readJson<DownloadCount>(
      `https://api.npmjs.org/downloads/point/last-day/${PACKAGE}`,
    ),
  ]);
  const rawVersion = registry?.["dist-tags"]?.latest;
  const version =
    typeof rawVersion === "string" && rawVersion ? rawVersion : null;
  const created = registry?.time?.created;
  const since = typeof created === "string" ? created.slice(0, 10) : null;
  const through = typeof latestDay?.end === "string" ? latestDay.end : null;
  const unavailable: NpmStats = {
    version,
    downloads: null,
    since: since ?? null,
    through: through ?? null,
  };
  if (
    !validDate(since) ||
    !validDate(through) ||
    since > through ||
    latestDay?.package !== PACKAGE
  )
    return unavailable;

  const ranges: { start: string; end: string }[] = [];
  const lastDay = Date.parse(through);
  for (let cursor = Date.parse(since); cursor <= lastDay;) {
    const end = Math.min(cursor + 364 * DAY, lastDay);
    ranges.push({
      start: new Date(cursor).toISOString().slice(0, 10),
      end: new Date(end).toISOString().slice(0, 10),
    });
    cursor = end + DAY;
  }
  const counts = await Promise.all(
    ranges.map(async (range) => {
      const count = await readJson<DownloadCount>(
        `https://api.npmjs.org/downloads/point/${range.start}:${range.end}/${PACKAGE}`,
      );
      return count &&
        count.package === PACKAGE &&
        count.start === range.start &&
        count.end === range.end &&
        Number.isSafeInteger(count.downloads) &&
        count.downloads >= 0
        ? count.downloads
        : null;
    }),
  );
  if (counts.some((count) => count === null)) return unavailable;
  const downloads = counts.reduce<number>((sum, count) => sum + count!, 0);
  return Number.isSafeInteger(downloads)
    ? { version, downloads, since, through }
    : unavailable;
}
