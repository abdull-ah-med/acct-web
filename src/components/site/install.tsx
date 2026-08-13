"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import FadeContent from "@/components/FadeContent";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
import { Button } from "@/components/ui/button";
import { copyWithToast } from "@/lib/copy-toast";
import { INSTALL_COMMAND, runnableCommand } from "@/lib/terminal";
import { useReducedMotion } from "motion/react";

const blocks = [
  {
    key: "install" as const,
    step: "01",
    title: "Install",
    snippet: INSTALL_COMMAND,
  },
  {
    key: "init" as const,
    step: "02",
    title: "Init + bind",
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
    snippet: `eval "$(acct hook zsh)"
cd ~/Work/some-repo
acct status
acct whoami`,
  },
];

export function Install() {
  const [copied, setCopied] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const copy = async (key: string, text: string, title: string) => {
    const ok = await copyWithToast(text, { success: `${title} copied` });
    if (!ok) return;
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
            <FadeContent key={block.key} delay={i * 60}>
              <div className="relative h-full">
                <Button
                  size="xs"
                  variant="ghost"
                  className="absolute top-3 right-3 z-10 rounded-full"
                  onClick={() =>
                    copy(block.key, runnableCommand(block.snippet), block.title)
                  }
                  aria-label={`Copy ${block.title}`}
                >
                  {copied === block.key ? (
                    <Check className="size-3.5 text-base-content" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
                <Terminal
                  className="h-full max-h-none max-w-none bg-base-100"
                  sequence={!reduce}
                >
                  <AnimatedSpan className="text-muted-foreground">
                    {block.step} · {block.title}
                  </AnimatedSpan>
                  <TypingAnimation duration={22}>
                    {`$ ${block.snippet}`}
                  </TypingAnimation>
                </Terminal>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
