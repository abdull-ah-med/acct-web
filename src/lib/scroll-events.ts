import type Lenis from "lenis";

export const SCROLL_TOP_EVENT = "acct:scroll-top";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

declare global {
  interface Window {
    __acctLenis?: Lenis;
  }
}

/** Smooth scroll to top via Lenis when available, else rAF fallback. */
export function scrollToTopSmooth(lenis?: Lenis | null) {
  const instance = lenis ?? (typeof window !== "undefined" ? window.__acctLenis : undefined);

  if (instance) {
    const distance = Math.abs(instance.scroll);
    const duration = Math.min(2.4, Math.max(0.95, distance / 1600));

    instance.scrollTo(0, {
      duration,
      easing: easeOutCubic,
      immediate: false,
      force: true,
      lock: true,
    });
    return;
  }

  const start = window.scrollY;
  if (start <= 0) return;
  const durationMs = Math.min(2400, Math.max(950, start / 1.6));
  const t0 = performance.now();

  const tick = (now: number) => {
    const t = Math.min(1, (now - t0) / durationMs);
    window.scrollTo(0, start * (1 - easeOutCubic(t)));
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function scrollToElementSmooth(
  el: HTMLElement,
  options?: { offset?: number; lenis?: Lenis | null }
) {
  const instance =
    options?.lenis ?? (typeof window !== "undefined" ? window.__acctLenis : undefined);
  const offset = options?.offset ?? -88;

  if (instance) {
    const target = el.getBoundingClientRect().top + instance.scroll + offset;
    const distance = Math.abs(instance.scroll - target);
    const duration = Math.min(2, Math.max(0.85, distance / 1800));

    instance.scrollTo(el, {
      offset,
      duration,
      easing: easeOutCubic,
      immediate: false,
      force: true,
    });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
