"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { HomeBrandLink } from "@/components/home-brand-link";
import { scrollToElementSmooth } from "@/lib/scroll-events";

const links = [
  { href: "/#demo", id: "demo", label: "How it works" },
  { href: "/#planes", id: "planes", label: "Git tools" },
  { href: "/#install", id: "install", label: "Setup" },
  { href: "/docs", id: "docs", label: "Docs" },
  { href: "/#releases", id: "releases", label: "Releases" },
  { href: "/#faq", id: "faq", label: "FAQ" },
];
const ease = [0.23, 1, 0.32, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const reduceMotion = useReducedMotion();
  const [homeCompact, setHomeCompact] = useState(false);
  const [homeActive, setHomeActive] = useState("");
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusLast = useRef(false);
  const menuId = useId();
  const compact = !onHome || homeCompact;
  const active = onHome ? homeActive : pathname === "/docs" ? "docs" : "";
  const activeLink = links.find((link) => link.id === active);

  useEffect(() => {
    if (!onHome) return;
    let frame = 0;
    let threshold = 0;
    let isCompact = false;
    let sections: { id: string; top: number }[] = [];
    const update = () => {
      frame = 0;
      const scroll = window.scrollY;
      // A small dead band prevents the pill from repeatedly expanding near its boundary.
      isCompact = isCompact ? scroll > threshold - 28 : scroll > threshold + 28;
      setHomeCompact(isCompact);
      const marker = scroll + Math.min(window.innerHeight * 0.3, 200);
      const current = sections
        .filter((section) => section.top <= marker)
        .at(-1);
      setHomeActive(isCompact ? (current?.id ?? "planes") : "");
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      const hero = document.getElementById("hero");
      threshold =
        (hero
          ? hero.getBoundingClientRect().bottom + window.scrollY
          : window.innerHeight) - Math.min(window.innerHeight * 0.4, 320);
      sections = links
        .flatMap((link) => {
          const element = document.getElementById(link.id);
          return element
            ? [
                {
                  id: link.id,
                  top: element.getBoundingClientRect().top + window.scrollY,
                },
              ]
            : [];
        })
        .sort((a, b) => a.top - b.top);
      schedule();
    };
    const observer = new ResizeObserver(measure);
    const main = document.querySelector("main");
    if (main) observer.observe(main);
    const hero = document.getElementById("hero");
    if (hero) observer.observe(hero);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const items =
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      (focusLast.current ? items?.[items.length - 1] : items?.[0])?.focus();
    });
    const outside = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (
      !onHome ||
      !href.startsWith("/#") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const element = document.getElementById(href.slice(2));
    if (!element) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
    scrollToElementSmooth(element, { offset: -96 });
  }

  function menuKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % items.length;
        break;
      case "ArrowUp":
        next = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    items[next]?.focus();
  }

  return (
    <header className="pill-header">
      <motion.div
        ref={shellRef}
        layout
        transition={{ layout: { duration: reduceMotion ? 0 : 0.38, ease } }}
        className={`pill-shell ${compact ? "is-compact" : ""}`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            setOpen(false);
        }}
      >
        <motion.div layout="position">
          <HomeBrandLink
            className="pill-brand"
            labelClassName="text-[15px]"
            onNavigate={() => {
              setOpen(false);
              if (onHome && window.location.hash)
                window.history.pushState(null, "", "/");
            }}
          />
        </motion.div>
        <AnimatePresence initial={false} mode="popLayout">
          {!compact && (
            <motion.nav
              key="wide"
              className="pill-wide"
              aria-label="Primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {links
                .filter((link) => link.id !== "install")
                .map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(event) => navigate(event, link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
            </motion.nav>
          )}
          {compact && activeLink && (
            <motion.div
              key="context"
              className="pill-context"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              <span aria-hidden />
              <Link
                href={activeLink.href}
                aria-current={onHome ? "location" : "page"}
                onClick={(event) => navigate(event, activeLink.href)}
              >
                {activeLink.label}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout="position"
          className={`pill-menu-control ${compact || open ? "" : "mobile-menu-control"}`}
        >
          <button
            ref={triggerRef}
            type="button"
            className="pill-menu-trigger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls={menuId}
            aria-haspopup="menu"
            onClick={() => {
              focusLast.current = false;
              setOpen(!open);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                focusLast.current = event.key === "ArrowUp";
                if (open) {
                  const items =
                    menuRef.current?.querySelectorAll<HTMLElement>(
                      '[role="menuitem"]',
                    );
                  (focusLast.current
                    ? items?.[items.length - 1]
                    : items?.[0]
                  )?.focus();
                } else setOpen(true);
              }
            }}
          >
            {open ? <X size={17} /> : <ChevronDown size={17} />}
          </button>
        </motion.div>
        <motion.div layout="position">
          <Link
            href="/#install"
            className="pill-install"
            onClick={(event) => navigate(event, "/#install")}
          >
            Install <ArrowUpRight size={14} />
          </Link>
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.div
              id={menuId}
              ref={menuRef}
              role="menu"
              aria-label="Site navigation"
              className="pill-menu"
              onKeyDown={menuKeys}
              initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.16 }}
            >
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  role="menuitem"
                  tabIndex={-1}
                  aria-current={
                    active === link.id
                      ? onHome
                        ? "location"
                        : "page"
                      : undefined
                  }
                  onClick={(event) => navigate(event, link.href)}
                >
                  {link.label}
                  {active === link.id && (
                    <span className="pill-active-dot" aria-hidden />
                  )}
                </Link>
              ))}
              <a
                role="menuitem"
                tabIndex={-1}
                href="https://github.com/abdull-ah-med/acct"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                GitHub <ArrowUpRight size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
