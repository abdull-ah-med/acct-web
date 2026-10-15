"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Folder,
  FolderOpen,
  GitBranch,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { GithubMark } from "@/components/github-mark";
import { copyWithToast } from "@/lib/copy-toast";
import { AgentMarquee } from "@/components/site/agent-marquee";
import { INSTALL_COMMAND } from "@/lib/terminal";

const Silk = dynamic(() => import("@/components/Silk"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#2a2c30]" aria-hidden />,
});

function HeroBackdrop() {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    if (reduce) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const start = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: 500 });
    } else {
      timeoutId = window.setTimeout(start, 120);
    }

    return () => {
      if (
        idleId !== undefined &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [reduce]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || reduce) return;

    const io = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio > 0.02),
      { threshold: [0, 0.02, 0.1], rootMargin: "10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 contain-paint bg-[radial-gradient(ellipse_at_30%_40%,#3a3d44_0%,#141414_55%,#0a0a0a_100%)]"
      aria-hidden
    >
      {ready && !reduce && (
        <Silk
          speed={4}
          scale={1.15}
          color="#4e5259"
          noiseIntensity={2}
          rotation={1.7}
          active={inView && pageVisible}
        />
      )}
    </div>
  );
}

export function InstallButton() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (await copyWithToast(INSTALL_COMMAND)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="install-copy"
      aria-label="Copy npm install command"
    >
      <span aria-hidden className="command-dollar">
        $
      </span>
      <code>{INSTALL_COMMAND}</code>
      {copied ? <Check size={17} /> : <Copy size={17} />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
const folders = [
  {
    id: "work",
    name: "Work",
    path: "~/Work/api",
    profile: "work",
    user: "you-at-work",
    email: "you@company.com",
    letter: "W",
    status: "Bound to work",
    command: "expected=you-at-work",
    tone: "work",
  },
  {
    id: "personal",
    name: "Personal",
    path: "~/Personal/blog",
    profile: "personal",
    user: "you-on-github",
    email: "you@personal.dev",
    letter: "P",
    status: "Bound to personal",
    command: "expected=you-on-github",
    tone: "personal",
  },
  {
    id: "downloads",
    name: "Downloads",
    path: "~/Downloads",
    profile: "unbound",
    user: "No acct profile",
    email: "No managed identity",
    letter: "—",
    status: "No profile inherited",
    command: "actual=unknown (unbound directory)",
    tone: "unbound",
  },
];
function IdentityPreview() {
  const [selected, setSelected] = useState("work");
  const folder = folders.find((item) => item.id === selected)!;
  return (
    <figure id="demo" className={`identity-preview ${folder.tone}`}>
      <div className="workspace-toolbar">
        <span>
          <Folder size={15} /> ~/workspace
        </span>
        <span className="preview-label">Example profiles</span>
      </div>
      <div className="workspace-content">
        <div className="workspace-tree">
          <span className="tree-home">~ /</span>
          {folders.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelected(item.id)}
              aria-pressed={selected === item.id}
              aria-label={`Select ${item.name} folder`}
              className={`folder-choice ${selected === item.id ? "selected" : ""}`}
            >
              <ChevronRight size={13} />
              {selected === item.id ? (
                <FolderOpen size={18} />
              ) : (
                <Folder size={18} />
              )}
              <span>{item.name}</span>
              {selected === item.id && <span className="folder-dot" />}
            </button>
          ))}
        </div>
        <div className="identity-details" aria-live="polite" aria-atomic="true">
          <div className="identity-kicker">
            CURRENT IDENTITY <span className="status-dot" />
          </div>
          <div className="profile-heading">
            <span className="profile-avatar">{folder.letter}</span>
            <div>
              <span className="profile-name">{folder.profile}</span>
              <span className="profile-caption">
                {selected === "downloads"
                  ? "outside your bound folders"
                  : "directory-bound profile"}
              </span>
            </div>
          </div>
          <dl className="identity-fields">
            <div>
              <dt>
                <GithubMark size={14} /> GitHub
              </dt>
              <dd>{folder.user}</dd>
            </div>
            <div>
              <dt>
                <GitBranch size={14} /> Git identity
              </dt>
              <dd>{folder.email}</dd>
            </div>
            <div>
              <dt>
                <KeyRound size={14} /> Credentials
              </dt>
              <dd>
                {selected === "downloads"
                  ? "No account carried over"
                  : "OS keychain"}
              </dd>
            </div>
          </dl>
          <div className="identity-status">
            <ShieldCheck size={15} />
            {folder.status}
          </div>
        </div>
      </div>
      <div className="preview-terminal" aria-live="polite">
        <p>
          <span>$</span> cd {folder.path}
        </p>
        <p>
          <span>$</span> acct whoami
        </p>
        <p className="terminal-answer">
          {folder.command}
          <span className="terminal-cursor" aria-hidden>
            ▍
          </span>
        </p>
      </div>
      <figcaption>Select a folder to see which profile applies.</figcaption>
    </figure>
  );
}
export function Hero({ downloads }: { downloads: ReactNode }) {
  return (
    <section className="home-hero" id="hero">
      <div className="hero-backdrop" aria-hidden>
        <HeroBackdrop />
      </div>
      <div className="hero-shade" aria-hidden />
      <div className="hero-section page-width">
        <div className="hero-copy">
          <h1>acct</h1>
          <h2>Use the right GitHub account in every folder.</h2>
          <p className="hero-description">
            Bind a directory to a GitHub account so your Git identity,
            authentication, and managed gh commands follow the folder you’re
            working in.
          </p>
          <div className="hero-actions">
            <div className="hero-install">
              <InstallButton />
              {downloads}
            </div>
            <Link href="/docs" className="hero-docs-link">
              Read the documentation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <IdentityPreview />
        </div>
      </div>
      <AgentMarquee />
    </section>
  );
}
