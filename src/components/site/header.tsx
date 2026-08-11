"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { Ellipsis, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeBrandLink } from "@/components/home-brand-link";

const links = [
  { href: "#demo", id: "demo", label: "how it works" },
  { href: "#planes", id: "planes", label: "what it does" },
  { href: "#install", id: "install", label: "install" },
  { href: "#releases", id: "releases", label: "releases" },
  { href: "#faq", id: "faq", label: "faq" },
] as const;

type LinkItem = (typeof links)[number];

const ease = [0.23, 1, 0.32, 1] as const;

function heroCompactThreshold() {
  const hero = document.getElementById("hero");
  const heroBottom = hero
    ? hero.offsetTop + hero.offsetHeight
    : window.innerHeight;
  return heroBottom - window.innerHeight * 0.55;
}

export function SiteHeader() {
  const [compact, setCompact] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const ratiosRef = useRef<Map<string, number>>(new Map());
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  const activeLink = useMemo(() => {
    if (!compact || !active) return null;
    return links.find((l) => l.id === active) ?? null;
  }, [active, compact]);

  const otherLinks = useMemo(
    () => links.filter((l) => l.id !== activeLink?.id),
    [activeLink]
  );

  // Cache threshold — querying layout every Lenis frame was a steady main-thread tax.
  const compactThresholdRef = useRef(0);

  useEffect(() => {
    const refreshThreshold = () => {
      compactThresholdRef.current = heroCompactThreshold();
      setCompact(window.scrollY >= compactThresholdRef.current);
    };
    refreshThreshold();
    window.addEventListener("resize", refreshThreshold);
    return () => window.removeEventListener("resize", refreshThreshold);
  }, []);

  useLenis((lenis) => {
    const next = lenis.scroll >= compactThresholdRef.current;
    setCompact((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!compact) setMoreOpen(false);
  }, [compact]);

  useEffect(() => {
    setMoreOpen(false);
  }, [active]);

  useEffect(() => {
    if (!moreOpen) return;

    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  useEffect(() => {
    const sectionIds = links.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    // No page sections (e.g. 404) — never mark a nav item active.
    if (!elements.length) {
      setActive("");
      return;
    }

    const pickActive = (scrollY = window.scrollY) => {
      if (scrollY < compactThresholdRef.current) {
        setActive("");
        return;
      }

      let bestId = "";
      let bestRatio = 0;
      for (const id of sectionIds) {
        const ratio = ratiosRef.current.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (bestRatio > 0.02) {
        setActive(bestId);
        return;
      }

      // Past the hero: default to the first section until a later one crosses the marker.
      const marker = scrollY + window.innerHeight * 0.33;
      let current: string = sectionIds[0];
      for (const el of elements) {
        if (el.offsetTop <= marker) current = el.id;
      }
      setActive(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosRef.current.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }
        pickActive();
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    const onScroll = () => pickActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    pickActive();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const navClass = (id: string) =>
    cn(
      "relative rounded-full px-3.5 py-1.5 font-sans text-sm whitespace-nowrap transition-colors",
      active === id
        ? "font-medium text-base-content"
        : "font-normal text-base-content/50 hover:text-base-content/85"
    );

  const InstallButton = () => (
    <a
      href="#install"
      className="inline-flex h-8 shrink-0 items-center rounded-full bg-base-content px-3.5 font-sans text-sm font-medium text-base-100 transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02]"
      onClick={() => setMoreOpen(false)}
    >
      install
    </a>
  );

  const moreMenu = (items: readonly LinkItem[], desktop = false) => (
    <AnimatePresence>
      {moreOpen ? (
        <motion.div
          role="menu"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(-6px) scale(0.96)" }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px) scale(1)" }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(-6px) scale(0.96)" }
          }
          transition={{ duration: 0.2, ease }}
          style={{ transformOrigin: "top right" }}
          className={cn(
            "absolute top-[calc(100%+0.55rem)] right-0 z-50 min-w-46 overflow-hidden rounded-2xl border border-base-content/12 bg-base-100/95 p-1.5 shadow-[0_16px_40px_oklch(0%_0_0/0.45)] backdrop-blur-xl",
            desktop ? "hidden md:block" : "md:hidden"
          )}
        >
          {items.map((link, index) => (
            <motion.a
              key={link.id}
              role="menuitem"
              href={link.href}
              initial={reduceMotion ? false : { opacity: 0, transform: "translateX(6px)" }}
              animate={{ opacity: 1, transform: "translateX(0px)" }}
              transition={{ delay: reduceMotion ? 0 : index * 0.03, duration: 0.18, ease }}
              className={cn(
                "block rounded-xl px-3 py-2 font-sans text-sm transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:bg-base-content/8 [@media(hover:hover)_and_(pointer:fine)]:hover:text-base-content",
                active === link.id
                  ? "bg-base-content/8 font-medium text-base-content"
                  : "text-base-content/65"
              )}
              onClick={() => setMoreOpen(false)}
            >
              {link.label}
            </motion.a>
          ))}
          <div className="my-1 h-px bg-base-content/10" />
          <a
            role="menuitem"
            href="https://github.com/abdull-ah-med/acct"
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl px-3 py-2 font-sans text-sm text-base-content/65 transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:bg-base-content/8 [@media(hover:hover)_and_(pointer:fine)]:hover:text-base-content"
            onClick={() => setMoreOpen(false)}
          >
            github
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <LayoutGroup id="site-nav">
        <motion.div
          ref={menuRef}
          layout
          transition={{ layout: { duration: 0.38, ease } }}
          className={cn(
            "pointer-events-auto relative flex max-w-[calc(100vw-1.5rem)] items-center rounded-full border border-base-content/12 bg-base-100/80 shadow-[0_8px_32px_oklch(0%_0_0/0.35)] backdrop-blur-xl",
            compact
              ? "gap-1 py-1.5 pr-1.5 pl-2"
              : "gap-1.5 py-2 pr-2 pl-2.5 md:gap-2 md:px-3"
          )}
        >
          <motion.div layout="position" transition={{ layout: { duration: 0.38, ease } }}>
            <HomeBrandLink
              className="shrink-0 rounded-full px-1.5 py-1"
              labelClassName="text-[15px]"
              onNavigate={() => {
                setMoreOpen(false);
                setActive("");
              }}
            />
          </motion.div>

          {/* Desktop wide (hero) */}
          <AnimatePresence initial={false} mode="popLayout">
            {!compact ? (
              <motion.nav
                key="wide-nav"
                layout
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease }}
                className="hidden items-center gap-0.5 md:flex"
                aria-label="Primary"
              >
                <div className="mx-1 h-4 w-px shrink-0 bg-base-content/12" aria-hidden />
                {links.map((link) => (
                  <WideNavLink
                    key={link.id}
                    link={link}
                    active={active === link.id}
                    className={navClass(link.id)}
                  />
                ))}
                <div className="mx-1 h-4 w-px shrink-0 bg-base-content/12" aria-hidden />
                <a
                  href="https://github.com/abdull-ah-med/acct"
                  className="rounded-full px-3.5 py-1.5 font-sans text-sm text-base-content/50 transition-colors hover:text-base-content/85"
                  target="_blank"
                  rel="noreferrer"
                >
                  github
                </a>
              </motion.nav>
            ) : null}
          </AnimatePresence>

          {/* Desktop compact: current → install → more */}
          <AnimatePresence initial={false} mode="popLayout">
            {compact ? (
              <motion.div
                key="compact-nav"
                layout
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease }}
                className="hidden items-center gap-1 md:flex"
              >
                {activeLink ? (
                  <>
                    <div className="mx-0.5 h-4 w-px shrink-0 bg-base-content/12" aria-hidden />

                    <motion.div
                      layout
                      transition={{ layout: { duration: 0.34, ease } }}
                      className="relative mr-1 overflow-hidden rounded-full bg-base-content/10"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.a
                          key={activeLink.id}
                          href={activeLink.href}
                          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                          transition={{ duration: 0.24, ease }}
                          className="flex items-center px-3 py-1.5 font-sans text-sm font-medium whitespace-nowrap text-base-content"
                          aria-current="true"
                        >
                          {activeLink.label}
                        </motion.a>
                      </AnimatePresence>
                    </motion.div>
                  </>
                ) : null}

                <InstallButton />

                <div className="relative">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-full text-base-content/70 transition-colors hover:bg-base-content/8 hover:text-base-content",
                      moreOpen && "bg-base-content/8 text-base-content"
                    )}
                    aria-expanded={moreOpen}
                    aria-haspopup="menu"
                    aria-label={moreOpen ? "Hide other sections" : "Other sections"}
                    onClick={() => setMoreOpen((v) => !v)}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={moreOpen ? "close" : "more"}
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, transform: "rotate(-30deg) scale(0.95)" }
                        }
                        animate={{ opacity: 1, transform: "rotate(0deg) scale(1)" }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, transform: "rotate(30deg) scale(0.95)" }
                        }
                        transition={{ duration: 0.16, ease }}
                        className="inline-flex"
                      >
                        {moreOpen ? <X className="size-4" /> : <Ellipsis className="size-4" />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  {moreMenu(otherLinks, true)}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Mobile: divider → current → install → more */}
          <div className="flex items-center gap-1 md:hidden">
            <div className="mx-0.5 h-4 w-px shrink-0 bg-base-content/12" aria-hidden />

            <AnimatePresence mode="wait" initial={false}>
              {compact && activeLink ? (
                <motion.a
                  key={activeLink.id}
                  href={activeLink.href}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease }}
                  className="mr-1 inline-flex h-8 max-w-36 shrink items-center truncate rounded-full bg-base-content/10 px-3.5 font-sans text-sm font-medium text-base-content"
                  aria-current="true"
                >
                  {activeLink.label}
                </motion.a>
              ) : null}
            </AnimatePresence>

            <InstallButton />

            <div className="relative">
              <button
                type="button"
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full text-base-content/70 transition-colors hover:bg-base-content/8 hover:text-base-content",
                  moreOpen && "bg-base-content/8 text-base-content"
                )}
                aria-expanded={moreOpen}
                aria-label={moreOpen ? "Hide menu" : "Menu"}
                onClick={() => setMoreOpen((v) => !v)}
              >
                {moreOpen ? <X className="size-4" /> : <Ellipsis className="size-4" />}
              </button>
              {moreMenu(compact ? otherLinks : links, false)}
            </div>
          </div>

          {/* Desktop wide only: install after full link row */}
          {!compact ? (
            <motion.div
              layout="position"
              transition={{ layout: { duration: 0.38, ease } }}
              className="hidden md:block"
            >
              <InstallButton />
            </motion.div>
          ) : null}
        </motion.div>
      </LayoutGroup>

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px origin-left bg-base-content/80"
        style={{ scaleX: scrollYProgress }}
        aria-hidden
      />
    </header>
  );
}

function WideNavLink({
  link,
  active,
  className,
}: {
  link: LinkItem;
  active: boolean;
  className: string;
}) {
  return (
    <a href={link.href} className={className} aria-current={active ? "true" : undefined}>
      {active ? (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-base-content/10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
      <span className="relative z-10">{link.label}</span>
    </a>
  );
}
