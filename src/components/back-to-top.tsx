"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

export function BackToTopButton() {
  const lenis = useLenis();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-base-content/15 bg-base-content/5 px-4 py-2 font-sans text-sm text-base-content/70 transition-colors hover:border-base-content/25 hover:bg-base-content/10 hover:text-base-content"
      onClick={() => {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
          return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <ArrowUp className="size-3.5" aria-hidden />
      To the top
    </button>
  );
}
