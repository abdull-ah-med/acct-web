"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import FadeContent from "@/components/FadeContent";
import { Button } from "@/components/ui/button";
import { runnableCommand } from "@/lib/terminal";
import { cn } from "@/lib/utils";

const blocks = [
  {
    key: "install" as const,
    step: "01",
    title: "Install",
    prefix: "$",
    snippet: `npm install -g acct-sh
# or
pnpm add -g acct-sh`,
  },
  {
    key: "init" as const,
    step: "02",
    title: "Init + bind",
    prefix: "$",
    snippet: `acct init \\
  --id work \\
  --user your-work-user \\
  --email you@company.com \\
  --name "Your Name" \\
  --bind ~/Work \\
  --import-gh`,
  },
  {
    key: "hook" as const,
    step: "03",
    title: "Hook + verify",
    prefix: "$",
    snippet: `eval "$(acct hook zsh)"
cd ~/Work/some-repo
acct status
acct whoami`,
  },
];

export function Install() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section id="install" className="scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeContent blur className="mb-10 md:mb-14">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-base-content/45 uppercase">
            Install
          </p>
          <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Three steps to folder-scoped GitHub accounts.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-base-content/55">
            Install the CLI, bind a folder to a profile, then add the shell hook so every new
            terminal picks up the right account from your current directory.
          </p>
        </FadeContent>

        <div className="grid gap-4 lg:grid-cols-3">
          {blocks.map((block, i) => (
            <FadeContent key={block.key} delay={i * 90}>
              <div className="flex h-full flex-col overflow-hidden rounded-lg border border-base-content/15 bg-base-100">
                <div className="flex items-center justify-between gap-2 border-b border-base-content/10 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="font-mono text-xs text-base-content/40 tabular-nums">
                      {block.step}
                    </span>
                    <span className="font-mono text-xs text-base-content/70">
                      {block.title}
                    </span>
                  </div>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => copy(block.key, runnableCommand(block.snippet))}
                    aria-label={`Copy ${block.title}`}
                  >
                    {copied === block.key ? (
                      <Check className="size-3.5 text-base-content" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
                <div className="mockup-code flex-1 rounded-none bg-transparent text-xs sm:text-sm">
                  {block.snippet.split("\n").map((line, idx) => (
                    <pre
                      key={`${block.key}-${idx}`}
                      data-prefix={line.startsWith("#") ? "#" : block.prefix}
                      className={cn(line.startsWith("#") && "text-base-content/40")}
                    >
                      <code>{line.replace(/^#\s?/, "")}</code>
                    </pre>
                  ))}
                </div>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
