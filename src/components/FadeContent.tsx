"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface FadeContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  delay?: number;
  threshold?: number;
}

/** Marketing scroll reveal: opacity + translateY. Fires once, when in view. */
const FadeContent = ({
  children,
  blur = false,
  duration = 480,
  delay = 0,
  threshold = 0.12,
  className = "",
  style,
  ...props
}: FadeContentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.dataset.visible = "true";
      return;
    }

    el.dataset.ready = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.visible = "true";
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    const frame = window.requestAnimationFrame(() => observer.observe(el));

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn("reveal", blur && "reveal-deep", className)}
      style={
        {
          "--reveal-duration": `${duration}ms`,
          "--reveal-delay": `${delay}ms`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
};

export default FadeContent;
