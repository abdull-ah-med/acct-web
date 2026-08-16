"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { copyWithToast } from "@/lib/copy-toast";
import { docsAssistantPrompt, formatDocsMarkdown } from "@/lib/docs-commands";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type CopyTarget = "page" | "chatgpt" | "claude";

const options: { id: CopyTarget; label: string }[] = [
  { id: "page", label: "Copy page" },
  { id: "chatgpt", label: "Copy to ChatGPT" },
  { id: "claude", label: "Copy to Claude" },
];

function openAssistant(target: Exclude<CopyTarget, "page">, prompt: string) {
  const q = encodeURIComponent(prompt);
  const href =
    target === "chatgpt"
      ? `https://chatgpt.com/?q=${q}`
      : `https://claude.ai/new?q=${q}`;
  window.open(href, "_blank", "noopener,noreferrer");
}

export function CopyPageControl() {
  const [target, setTarget] = useState<CopyTarget>("page");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === target) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = async () => {
    const markdown = formatDocsMarkdown(siteConfig.url);
    const ok = await copyWithToast(markdown, {
      success: target === "page" ? "Page copied" : "Copied — opening chat",
    });
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    if (target !== "page") {
      openAssistant(target, docsAssistantPrompt(siteConfig.url));
    }
  };

  return (
    <div ref={rootRef} className="relative flex shrink-0">
      <div className="flex overflow-hidden rounded-full border border-base-content/15 bg-base-100 shadow-[0_8px_24px_oklch(0%_0_0/0.25)]">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 pr-2.5 pl-3.5 font-sans text-sm text-base-content/80 transition-[color,background-color] duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-base-content/6"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Choose copy destination"
          onClick={() => setOpen((v) => !v)}
        >
          {selected.label}
          <ChevronDown
            className={cn(
              "size-3.5 text-base-content/45 transition-transform duration-[160ms] ease-[var(--ease-out)]",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 border-l border-base-content/12 bg-base-content px-3.5 font-sans text-sm font-medium text-base-100 transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-base-content/90"
          onClick={run}
          aria-label={selected.label}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          Copy
        </button>
      </div>

      {open ? (
        <ul
          role="listbox"
          aria-label="Copy destination"
          className="absolute top-[calc(100%+0.45rem)] right-0 z-40 min-w-48 overflow-hidden rounded-2xl border border-base-content/12 bg-base-100/95 p-1.5 shadow-[0_16px_40px_oklch(0%_0_0/0.45)] backdrop-blur-xl"
        >
          {options.map((option) => (
            <li key={option.id} role="option" aria-selected={option.id === target}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-left font-sans text-sm transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:bg-base-content/8",
                  option.id === target
                    ? "bg-base-content/8 font-medium text-base-content"
                    : "text-base-content/65",
                )}
                onClick={() => {
                  setTarget(option.id);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
