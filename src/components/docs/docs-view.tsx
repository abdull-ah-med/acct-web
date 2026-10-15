"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Search } from "lucide-react";
import { CopyPageControl } from "@/components/docs/copy-page-control";
import { copyWithToast } from "@/lib/copy-toast";
import {
  docsGroups,
  envVars,
  resolutionSteps,
  type CommandDoc,
} from "@/lib/docs-commands";

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (await copyWithToast(code)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <div className="docs-code">
      <pre>
        <code>{code}</code>
      </pre>
      <button type="button" onClick={copy} aria-label="Copy command">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
function CommandCard({ command }: { command: CommandDoc }) {
  return (
    <article id={command.id} className="command-card">
      <h3>{command.name}</h3>
      <p className="command-synopsis">{command.synopsis}</p>
      <p>{command.body}</p>
      <CopyBlock code={command.example} />
      {command.flags?.length ? (
        <dl className="command-flags">
          {command.flags.map((flag) => (
            <div key={flag.name}>
              <dt>
                {flag.name}
                {flag.required && <span>required</span>}
              </dt>
              <dd>{flag.body}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {command.notes?.length ? (
        <ul className="command-notes">
          {command.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
export function DocsView() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("concepts");
  const needle = query.trim().toLowerCase();
  const groups = docsGroups
    .map((group) => ({
      ...group,
      commands: group.commands.filter((command) =>
        `${command.name} ${command.body} ${command.synopsis} ${command.flags?.map((flag) => flag.name).join(" ")}`
          .toLowerCase()
          .includes(needle),
      ),
    }))
    .filter((group) => group.commands.length);
  const toc = [
    { id: "concepts", label: "Overview" },
    ...groups.map((group) => ({ id: group.id, label: group.label })),
    { id: "env", label: "Environment" },
  ];
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" },
    );
    document
      .querySelectorAll(".docs-group, .docs-concepts")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [needle]);
  return (
    <div className="docs-layout">
      <nav className="docs-sidebar" aria-label="On this page">
        <p className="eyebrow">COMMAND REFERENCE</p>
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={active === item.id ? "active" : ""}
            aria-current={active === item.id ? "location" : undefined}
          >
            {item.label}
          </a>
        ))}
        <Link href="/docs.md">Markdown version ↗</Link>
      </nav>
      <div className="docs-content">
        <header className="docs-heading">
          <div>
            <p className="eyebrow">ACCT · V0.2</p>
            <h1>Command reference</h1>
            <p>
              The npm package is <code>acct-sh</code>, and <code>acct</code> is
              the command you run to manage your folder-based GitHub identity.
            </p>
          </div>
          <CopyPageControl />
        </header>
        <label className="docs-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Find a command, flag, or topic…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search commands"
          />
        </label>
        <section className="docs-concepts" id="concepts">
          <h2>How a folder picks its identity.</h2>
          <ol className="resolution-list">
            {resolutionSteps.map((step) => (
              <li key={step.n}>
                <span>{step.n.padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        {groups.length === 0 && (
          <p className="docs-empty" role="status">
            No commands match “{query}”. Try profile, install, or token.
          </p>
        )}
        {groups.map((group) => (
          <section className="docs-group" key={group.id} id={group.id}>
            <h2>{group.label}</h2>
            <p>{group.intro}</p>
            {group.commands.map((command) => (
              <CommandCard key={command.id} command={command} />
            ))}
          </section>
        ))}
        <section id="env" className="docs-group">
          <h2>Files and environment variables</h2>
          <p>
            Settings live in <code>config.yaml</code>, while tokens stay in your
            OS keychain or the explicitly selected file backend.
          </p>
          <dl className="docs-env">
            {envVars.map((item) => (
              <div key={item.name}>
                <dt>{item.name}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
