/**
 * Official brand marks only — lockups and symbols from each vendor's
 * brand kit / press page / Wikimedia (sourced from the vendor). No
 * generated marks, no substitute typefaces.
 */
const AGENTS = [
  {
    name: "Cursor",
    src: "/brands/cursor.svg",
    height: 22,
    invert: false,
  },
  {
    name: "Antigravity",
    src: "/brands/antigravity.png",
    height: 22,
    invert: false,
  },
  {
    name: "Kiro",
    kind: "kiro" as const,
  },
  {
    name: "Claude Code",
    kind: "lockup" as const,
    icon: "/brands/claude.svg",
    wordmark: "/brands/claudecode-text.svg",
    iconHeight: 26,
    wordmarkHeight: 18,
  },
  {
    name: "Codex",
    kind: "lockup" as const,
    icon: "/brands/codex.svg",
    wordmark: "/brands/codex-text.svg",
    iconHeight: 24,
    wordmarkHeight: 18,
    iconClass: "opacity-[0.48] group-hover:opacity-90",
    wordmarkClass: "opacity-[0.62] group-hover:opacity-90",
    skipItemFade: true,
  },
  {
    name: "OpenCode",
    src: "/brands/opencode.svg",
    height: 22,
    invert: false,
  },
  {
    name: "DeepSeek",
    src: "/brands/deepseek.svg",
    height: 22,
    invert: false,
  },
  {
    name: "Kimi",
    src: "/brands/kimi.svg",
    height: 24,
    invert: true,
  },
  {
    name: "VS Code",
    src: "/brands/vscode.svg",
    height: 26,
    invert: false,
  },
  {
    name: "Copilot",
    src: "/brands/copilot.svg",
    height: 22,
    invert: false,
  },
] as const;

function BrandMark({
  agent,
}: {
  agent: (typeof AGENTS)[number];
}) {
  if ("kind" in agent && agent.kind === "kiro") {
    return (
      <span className="inline-flex items-center gap-2" aria-label="Kiro">
        <img
          src="/brands/kiro-icon.svg"
          alt=""
          height={28}
          width={28}
          className="size-7 rounded-md"
        />
        <img
          src="/brands/kiro-wordmark.png"
          alt="Kiro"
          height={18}
          className="h-4.5 w-auto"
        />
      </span>
    );
  }

  if ("kind" in agent && agent.kind === "lockup") {
    return (
      <span
        className="inline-flex items-center gap-2 text-base-content"
        aria-label={agent.name}
      >
        <img
          src={agent.icon}
          alt=""
          height={agent.iconHeight}
          className={`w-auto ${"iconClass" in agent ? agent.iconClass : ""}`}
          style={{ height: agent.iconHeight }}
        />
        <img
          src={agent.wordmark}
          alt={agent.name}
          height={agent.wordmarkHeight}
          className={`w-auto ${"wordmarkClass" in agent ? agent.wordmarkClass : ""}`}
          style={{ height: agent.wordmarkHeight }}
        />
      </span>
    );
  }

  const item = agent as Extract<(typeof AGENTS)[number], { src: string }>;
  return (
    <img
      src={item.src}
      alt={item.name}
      height={item.height}
      className={`w-auto ${item.invert ? "brightness-0 invert" : ""}`}
      style={{ height: item.height }}
    />
  );
}

const MARQUEE_COPIES = 4;

function Track({ copy }: { copy: number }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
      aria-hidden={copy > 0 ? true : undefined}
    >
      {AGENTS.map((agent) => (
        <li
          key={`${copy}-${agent.name}`}
          className={`group flex shrink-0 items-center grayscale transition-[opacity,filter] duration-(--duration-popover) ease-out hover:grayscale-0 ${
            "skipItemFade" in agent && agent.skipItemFade
              ? "hover:opacity-90"
              : "opacity-[0.48] hover:opacity-90"
          }`}
        >
          <BrandMark agent={agent} />
        </li>
      ))}
    </ul>
  );
}

export function AgentMarquee() {
  return (
    <div
      className="agent-marquee relative z-10 w-full pb-8 pt-4 sm:pb-10"
      role="region"
      aria-label="Works with all of your coding agents"
    >
      <p className="agent-marquee-label mb-5 px-4 text-center text-[0.68rem] font-medium tracking-[0.12em] text-base-content/40 sm:text-xs">
        Works with all of your coding agents
      </p>
      <div className="agent-marquee-fade overflow-hidden">
        <div className="agent-marquee-track flex w-max">
          {Array.from({ length: MARQUEE_COPIES }, (_, i) => (
            <Track key={i} copy={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
