"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: string;
  className?: string;
  textClassName?: string;
}

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const filter = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);

  return (
    <motion.span style={{ opacity, filter }} className={cn("inline-block", className)}>
      {children}
    </motion.span>
  );
}

export default function ScrollReveal({
  children,
  className = "",
  textClassName = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  const words = children.split(" ");

  return (
    <h2 ref={ref} className={cn("my-0", className)}>
      <span
        className={cn(
          "font-display text-3xl leading-tight font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl",
          textClassName
        )}
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <span key={`${word}-${i}`}>
              <Word progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
              {i < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </h2>
  );
}
