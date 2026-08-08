"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  blurAmount?: number;
  borderColor?: string;
  className?: string;
  wordClassName?: string;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function TrueFocus({
  sentence = "True Focus",
  separator = " ",
  blurAmount = 2.5,
  borderColor = "oklch(94% 0 0)",
  className = "",
  wordClassName = "",
}: TrueFocusProps) {
  const words = sentence.split(separator).filter(Boolean);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.35"],
  });

  const progressIndex = useTransform(scrollYProgress, (v) => {
    if (words.length <= 1) return 0;
    const stepped = Math.min(
      words.length - 1,
      Math.floor(v * words.length)
    );
    return stepped;
  });

  useMotionValueEvent(progressIndex, "change", (latest) => {
    setCurrentIndex(latest);
  });

  useEffect(() => {
    const update = () => {
      const parent = containerRef.current;
      const active = wordRefs.current[currentIndex];
      if (!parent || !active) return;

      const parentRect = parent.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();

      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [currentIndex, words.length]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-wrap items-center justify-start gap-x-3 gap-y-2",
        className
      )}
      style={{ outline: "none", userSelect: "none" }}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className={cn(
              "relative font-display text-2xl font-semibold tracking-tight text-base-content sm:text-3xl md:text-4xl",
              wordClassName
            )}
            style={{
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.4,
              transition: "filter 0.2s ease, opacity 0.2s ease",
              outline: "none",
              userSelect: "none",
            }}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="pointer-events-none absolute top-0 left-0 box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 34,
          mass: 0.55,
        }}
      >
        <span
          className="absolute top-[-6px] left-[-6px] h-3 w-3 rounded-[2px] border-[1.5px] border-r-0 border-b-0"
          style={{ borderColor }}
        />
        <span
          className="absolute top-[-6px] right-[-6px] h-3 w-3 rounded-[2px] border-[1.5px] border-b-0 border-l-0"
          style={{ borderColor }}
        />
        <span
          className="absolute bottom-[-6px] left-[-6px] h-3 w-3 rounded-[2px] border-[1.5px] border-t-0 border-r-0"
          style={{ borderColor }}
        />
        <span
          className="absolute right-[-6px] bottom-[-6px] h-3 w-3 rounded-[2px] border-[1.5px] border-t-0 border-l-0"
          style={{ borderColor }}
        />
      </motion.div>
    </div>
  );
}
