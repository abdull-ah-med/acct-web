"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTopSmooth } from "@/lib/scroll-events";

export function BackToTopButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-base-content/15 bg-base-content/5 px-4 py-2 font-sans text-sm text-base-content/70 transition-[transform,background-color,border-color,color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:border-base-content/25 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-base-content/10 [@media(hover:hover)_and_(pointer:fine)]:hover:text-base-content"
      onClick={() => scrollToTopSmooth()}
    >
      <ArrowUp className="size-3.5" aria-hidden />
      To the top
    </button>
  );
}
