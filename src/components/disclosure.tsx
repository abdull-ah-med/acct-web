"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function Disclosure({
  id,
  label,
  children,
  className = "",
  defaultOpen = false,
  headingLevel = 3,
}: {
  id?: string;
  label: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  headingLevel?: 2 | 3;
}) {
  const generatedId = useId();
  const rootId = id ?? `disclosure-${generatedId}`;
  const [expanded, setExpanded] = useState(defaultOpen);
  const [present, setPresent] = useState(defaultOpen);
  const root = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const Heading = headingLevel === 2 ? "h2" : "h3";

  useEffect(() => {
    const element = root.current;
    const reveal = () => {
      setPresent(true);
      setExpanded(true);
    };
    element?.addEventListener("acct:open-disclosure", reveal);
    return () => element?.removeEventListener("acct:open-disclosure", reveal);
  }, []);

  return (
    <div
      id={rootId}
      ref={root}
      className={className}
      data-disclosure
      data-open={expanded}
    >
      <Heading className="disclosure-heading">
        <button
          type="button"
          className="disclosure-trigger"
          id={`${rootId}-trigger`}
          aria-expanded={expanded}
          aria-controls={`${rootId}-content`}
          onClick={() => {
            if (!expanded) setPresent(true);
            setExpanded(!expanded);
          }}
        >
          {label}
        </button>
      </Heading>
      <motion.div
        id={`${rootId}-content`}
        role="region"
        aria-labelledby={`${rootId}-trigger`}
        aria-hidden={!expanded}
        inert={!expanded}
        hidden={!present}
        className="disclosure-content"
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{
          height: {
            duration: reduceMotion ? 0 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          },
          opacity: { duration: reduceMotion ? 0 : 0.18 },
        }}
        onAnimationComplete={() => {
          if (!expanded) setPresent(false);
        }}
      >
        <div className="disclosure-inner">{children}</div>
      </motion.div>
    </div>
  );
}
