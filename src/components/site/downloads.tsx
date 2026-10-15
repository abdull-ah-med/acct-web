import { getNpmStats } from "@/lib/npm-stats";

export async function Downloads() {
  const stats = await getNpmStats();
  if (stats.downloads === null) return null;
  return (
    <a
      className="hero-downloads"
      href="https://www.npmjs.com/package/acct-sh"
      target="_blank"
      rel="noreferrer"
      title={`Cumulative npm downloads from ${stats.since} through ${stats.through}`}
    >
      {stats.downloads.toLocaleString("en-US")}+ downloads
    </a>
  );
}
