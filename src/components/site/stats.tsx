import { ArrowDownToLine, GitBranch, Heart, Terminal } from "lucide-react";
import { getNpmStats } from "@/lib/npm-stats";
import type { NpmStats } from "@/lib/npm-stats";
function StatsBar({ stats }: { stats: NpmStats | null }) {
  const downloads = stats?.downloads;
  return (
    <section
      className="stats-section page-width"
      aria-label="Package information"
    >
      <div className="stats-grid">
        <a
          className="stat-item download-stat"
          href="https://www.npmjs.com/package/acct-sh"
          target="_blank"
          rel="noreferrer"
          title={
            stats?.through
              ? `All npm downloads since ${stats.since}, through ${stats.through}. Refreshed hourly.`
              : "View package statistics on npm"
          }
        >
          <ArrowDownToLine size={21} strokeWidth={1.7} />
          <div>
            <strong>
              {downloads === undefined
                ? "…"
                : downloads === null
                  ? "Unavailable"
                  : downloads.toLocaleString("en-US")}
            </strong>
            <span>Total npm downloads</span>
          </div>
        </a>
        <a
          className="stat-item"
          href="https://www.npmjs.com/package/acct-sh"
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={21} strokeWidth={1.7} />
          <div>
            <strong>{stats?.version ? `v${stats.version}` : "See npm"}</strong>
            <span>Latest release</span>
          </div>
        </a>
        <div className="stat-item">
          <Terminal size={21} strokeWidth={1.7} />
          <div>
            <strong>Node.js 20+</strong>
            <span>Required Node.js version</span>
          </div>
        </div>
        <a
          className="stat-item"
          href="https://github.com/abdull-ah-med/acct/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          <Heart size={21} strokeWidth={1.7} />
          <div>
            <strong>MIT licensed</strong>
            <span>Open-source license</span>
          </div>
        </a>
      </div>
    </section>
  );
}
export async function Stats() {
  return <StatsBar stats={await getNpmStats()} />;
}
export function StatsFallback() {
  return <StatsBar stats={null} />;
}
