"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToElementSmooth } from "@/lib/scroll-events";

export function DocumentationLayout({
  children,
  toc,
  markdown = false,
}: {
  children: ReactNode;
  toc: { id: string; label: string }[];
  markdown?: boolean;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(toc[0]?.id ?? "");
  const ids = toc.map((item) => item.id).join("|");
  const current = toc.some((item) => item.id === active) ? active : toc[0]?.id;

  useEffect(() => {
    let frame = 0;
    let sections: { id: string; top: number }[] = [];
    const update = () => {
      frame = 0;
      const marker = window.scrollY + 150;
      const section =
        sections.filter((item) => item.top <= marker).at(-1) ?? sections[0];
      if (section) setActive(section.id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      sections = ids
        .split("|")
        .flatMap((id) => {
          const element = document.getElementById(id);
          return element
            ? [
                {
                  id,
                  top: element.getBoundingClientRect().top + window.scrollY,
                },
              ]
            : [];
        })
        .sort((a, b) => a.top - b.top);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    const content = document.getElementById("main-content");
    if (content) resize.observe(content);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [ids]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    for (
      let parent: HTMLElement | null = element;
      parent;
      parent = parent.parentElement
    ) {
      if (parent.hasAttribute("data-disclosure"))
        parent.dispatchEvent(new Event("acct:open-disclosure"));
    }
    window.history.pushState(null, "", `#${id}`);
    element.setAttribute("tabindex", "-1");
    element.focus({ preventScroll: true });
    scrollToElementSmooth(element, { offset: -100 });
    setActive(id);
  }

  return (
    <div className="docs-layout">
      <nav className="docs-sidebar" aria-label="On this page">
        <p>ON THIS PAGE</p>
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={current === item.id ? "active" : ""}
            aria-current={current === item.id ? "location" : undefined}
            onClick={(event) => navigate(event, item.id)}
          >
            {item.label}
          </a>
        ))}
        {markdown && <Link href="/docs.md">Markdown version ↗</Link>}
        <div className="docs-page-links">
          {[
            { href: "/docs", label: "Documentation" },
            { href: "/releases", label: "Release notes" },
            { href: "/privacy", label: "Privacy policy" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="docs-content">{children}</div>
    </div>
  );
}
