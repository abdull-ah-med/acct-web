"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#demo", id: "demo", label: "how it works" },
  { href: "#planes", id: "planes", label: "what it does" },
  { href: "#install", id: "install", label: "install" },
  { href: "#releases", id: "releases", label: "releases" },
  { href: "#faq", id: "faq", label: "faq" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = links.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
          return;
        }

        const marker = window.scrollY + window.innerHeight * 0.28;
        let current = "";
        for (const el of elements) {
          if (el.offsetTop <= marker) current = el.id;
        }
        setActive(current);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navClass = (id: string) =>
    cn(
      "px-2.5 py-1.5 font-sans text-sm transition-colors",
      active === id
        ? "font-medium text-base-content"
        : "font-normal text-base-content/45 hover:text-base-content/80"
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 font-sans transition-[background,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-base-content/10 bg-base-100/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="navbar relative z-10 px-4 sm:px-6">
        <div className="navbar-start gap-3">
          <Link href="/" className="flex items-center gap-2.5" aria-label="acct home">
            <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-sm" />
            <span className="text-lg font-semibold tracking-tight text-base-content">
              acct
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden md:flex">
          <nav className="flex items-center gap-1" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={navClass(link.id)}
                aria-current={active === link.id ? "true" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="navbar-end gap-2">
          <a
            href="https://github.com/acct-sh/acct"
            className="btn btn-ghost btn-sm hidden font-sans text-base-content/60 sm:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
          <a href="#install" className="btn btn-primary btn-sm rounded-full font-sans">
            install
          </a>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Overlay menu: absolute so it does not shift page content */}
      <div
        id="mobile-nav"
        className={cn(
          "absolute inset-x-0 top-full z-40 border-b border-base-content/10 bg-base-100/95 px-4 py-3 backdrop-blur-xl md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(navClass(link.id), "py-2.5")}
              aria-current={active === link.id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 -bottom-px z-50 h-px bg-base-content/10"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 -bottom-px z-50 h-px origin-left bg-base-content"
        style={{ scaleX: scrollYProgress }}
        aria-hidden
      />
    </header>
  );
}
