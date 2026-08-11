"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface FadeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  container?: Element | string | null;
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
}

/** Marketing scroll reveal: opacity + translateY (and optional blur). Once. */
const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 480,
  ease = "power2.out",
  delay = 0,
  threshold = 0.12,
  initialOpacity = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power2.out",
  onComplete,
  onDisappearanceComplete,
  className = "",
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.opacity = "1";
      el.style.filter = "none";
      el.style.transform = "none";
      el.style.visibility = "visible";
      return;
    }

    const getSeconds = (val: number) => (val > 10 ? val / 1000 : val);
    let played = false;

    // Skip CSS filter blur — animating `filter` forces expensive layer paints.
    // Keep a slightly longer fade when callers pass blur for similar weight.
    const play = () => {
      if (played) return;
      played = true;
      gsap.fromTo(
        el,
        {
          autoAlpha: initialOpacity,
          y: blur ? 16 : 12,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: getSeconds(duration) + (blur ? 0.08 : 0),
          delay: getSeconds(delay),
          ease,
          onComplete: () => {
            onComplete?.();
            if (disappearAfter > 0) {
              gsap.to(el, {
                autoAlpha: initialOpacity,
                y: -6,
                delay: getSeconds(disappearAfter),
                duration: getSeconds(disappearDuration),
                ease: disappearEase,
                onComplete: () => onDisappearanceComplete?.(),
              });
            }
          },
        },
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);

    const fallback = window.setTimeout(play, 1200 + delay);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      gsap.killTweensOf(el);
    };
  }, [
    blur,
    delay,
    disappearAfter,
    disappearDuration,
    disappearEase,
    duration,
    ease,
    initialOpacity,
    onComplete,
    onDisappearanceComplete,
    threshold,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, visibility: "hidden" }}
      {...props}
    >
      {children}
    </div>
  );
};

export default FadeContent;
