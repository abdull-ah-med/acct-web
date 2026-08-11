"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import {
  SCROLL_TOP_EVENT,
  scrollToElementSmooth,
  scrollToTopSmooth,
} from "@/lib/scroll-events";

function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    window.__acctLenis = lenis;

    const onScrollTop = () => {
      scrollToTopSmooth(lenis);
    };

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || !hash.startsWith("#")) return;

      const el = document.querySelector(hash);
      if (!(el instanceof HTMLElement)) return;

      event.preventDefault();
      scrollToElementSmooth(el, { offset: -88, lenis });
    };

    window.addEventListener(SCROLL_TOP_EVENT, onScrollTop);
    document.addEventListener("click", onAnchorClick);
    return () => {
      if (window.__acctLenis === lenis) delete window.__acctLenis;
      window.removeEventListener(SCROLL_TOP_EVENT, onScrollTop);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.085,
        // Intentionally no default `duration` — a fixed duration makes
        // long-page programmatic scrolls feel like an abrupt snap.
        smoothWheel: true,
        anchors: false,
        stopInertiaOnNavigate: true,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
