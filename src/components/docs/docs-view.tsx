"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { CopyPageControl } from "@/components/docs/copy-page-control";
import { Button } from "@/components/ui/button";
import { copyWithToast } from "@/lib/copy-toast";
import {
  docsGroups,
  envVars,
  resolutionSteps,
  type CommandDoc,
} from "@/lib/docs-commands";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const toc = [
  { id: "concepts", label: "concepts" },
  ...docsGroups.map((g) => ({ id: g.id, label: g.label.toLowerCase() })),
  { id: "env", label: "environment" },
];

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const ok = await copyWithToast(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-base-content/12 bg-base-100">
      <Button
        size="xs"
        variant="ghost"
        className="absolute top-2 right-2 z-10 rounded-full"
        onClick={onCopy}
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="size-3.5 text-base-content" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
      <pre className="min-w-0 overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed whitespace-pre-wrap wrap-anywhere text-base-content/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CommandCard({ command }: { command: CommandDoc }) {
  return (
    <article
      id={command.id}
      className="scroll-mt-28 border-t border-base-content/10 pt-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-mono text-lg font-medium tracking-tight text-base-content sm:text-xl">
          {command.name}
        </h3>
        <p className="max-w-xl font-mono text-[11px] leading-relaxed wrap-anywhere text-base-content/40 sm:text-right">
          {command.synopsis}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/65 sm:text-base">
        {command.body}
      </p>
      <div className="mt-4">
        <CopyBlock code={command.example} />
      </div>
      {command.flags?.length ? (
        <dl className="mt-5 space-y-3">
          {command.flags.map((flag) => (
            <div
              key={flag.name}
              className="grid gap-1 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4"
            >
              <dt className="font-mono text-[12px] text-base-content/85">
                {flag.name}
                {flag.required ? (
                  <span className="ml-2 font-sans text-[10px] tracking-[0.14em] text-base-content/35 uppercase">
                    required
                  </span>
                ) : null}
              </dt>
              <dd className="text-sm leading-relaxed text-base-content/55">{flag.body}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {command.notes?.length ? (
        <ul className="mt-4 space-y-1.5">
          {command.notes.map((note) => (
            <li
              key={note}
              className="relative pl-4 text-sm leading-relaxed text-base-content/50 before:absolute before:top-[0.55em] before:left-0 before:size-1 before:rounded-full before:bg-base-content/30"
            >
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function DocsView() {
  const [active, setActive] = useState("concepts");

  useEffect(() => {
    const ids = toc.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const pick = () => {
      const marker = window.scrollY + window.innerHeight * 0.22;
      let current = ids[0];
      for (const el of elements) {
        if (el.offsetTop <= marker) current = el.id;
      }
      setActive(current);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl gap-10 lg:gap-16">
      <nav
        aria-label="On this page"
        className="sticky top-24 hidden h-fit w-44 shrink-0 lg:block"
      >
        <p className="font-mono text-[10px] tracking-[0.18em] text-base-content/40 uppercase">
          Index
        </p>
        <ul className="mt-4 space-y-1">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-1 font-mono text-[13px] transition-colors",
                  active === item.id
                    ? "text-base-content"
                    : "text-base-content/40 [@media(hover:hover)_and_(pointer:fine)]:hover:text-base-content/70",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
              Command reference
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Every acct command.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-base-content/55 sm:text-lg">
              Package name is <span className="font-mono text-base-content/80">acct-sh</span>.
              The binary is <span className="font-mono text-base-content/80">acct</span>. One
              folder, one GitHub account, one identity.{" "}
              <a
                href="/docs.md"
                className="font-mono text-sm text-base-content/70 underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
              >
                docs.md
              </a>
            </p>
          </div>
          <CopyPageControl />
        </header>

        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 rounded-full border border-base-content/12 px-3 py-1 font-mono text-[11px] text-base-content/55"
            >
              {item.label}
            </a>
          ))}
        </div>

        <section id="concepts" className="mt-16 scroll-mt-28">
          <p className="font-mono text-[10px] tracking-[0.18em] text-base-content/40 uppercase">
            Concepts
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            How cwd picks an account.
          </h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {resolutionSteps.map((step) => (
              <li
                key={step.n}
                className="rounded-lg border border-base-content/10 bg-base-100 p-4"
              >
                <p className="font-mono text-[11px] text-base-content/40">{step.n}</p>
                <p className="mt-2 font-display text-lg font-semibold tracking-tight">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-base-content/60">
            <p>
              A repo-local <span className="font-mono text-base-content/80">.acct</span> file
              is YAML with a <span className="font-mono">profile</span> key. An empty profile
              means this tree is unbound, even inside a bound parent.
            </p>
            <CopyBlock code={'profile: work'} />
          </div>
        </section>

        {docsGroups.map((group) => (
          <section key={group.id} id={group.id} className="mt-20 scroll-mt-28">
            <p className="font-mono text-[10px] tracking-[0.18em] text-base-content/40 uppercase">
              {group.label}
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {group.intro}
            </h2>
            <div className="mt-4">
              {group.commands.map((command) => (
                <CommandCard key={command.id} command={command} />
              ))}
            </div>
          </section>
        ))}

        <section id="env" className="mt-20 scroll-mt-28 pb-8">
          <p className="font-mono text-[10px] tracking-[0.18em] text-base-content/40 uppercase">
            Environment
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Files and env vars.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-content/60 sm:text-base">
            Config lives in <span className="font-mono text-base-content/80">config.yaml</span>{" "}
            under the config dir. Tokens live in the OS keychain, never in that file.
          </p>
          <dl className="mt-8 space-y-5">
            {envVars.map((item) => (
              <div key={item.name} className="border-t border-base-content/10 pt-4">
                <dt className="font-mono text-sm text-base-content">{item.name}</dt>
                <dd className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/55">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-xl text-sm text-base-content/45">
            Behavioral contracts are in the{" "}
            <Link
              href={siteConfig.docs.invariants}
              className="text-base-content/70 underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
              target="_blank"
              rel="noreferrer"
            >
              invariants
            </Link>{" "}
            and{" "}
            <Link
              href={siteConfig.docs.threatModel}
              className="text-base-content/70 underline decoration-base-content/25 underline-offset-4 hover:decoration-base-content/60"
              target="_blank"
              rel="noreferrer"
            >
              threat model
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
