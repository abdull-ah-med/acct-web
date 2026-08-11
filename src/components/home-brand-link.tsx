"use client";

import Image from "next/image";
import Link from "next/link";
import { scrollToTopSmooth } from "@/lib/scroll-events";
import { cn } from "@/lib/utils";

type HomeBrandLinkProps = {
  className?: string;
  imageSize?: number;
  labelClassName?: string;
  onNavigate?: () => void;
};

/** Logo + “acct” — navigates home, or smooth-scrolls to top when already there. */
export function HomeBrandLink({
  className,
  imageSize = 24,
  labelClassName,
  onNavigate,
}: HomeBrandLinkProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="acct home"
      onClick={(event) => {
        onNavigate?.();
        if (window.location.pathname === "/") {
          event.preventDefault();
          scrollToTopSmooth();
        }
      }}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={imageSize}
        height={imageSize}
        className="rounded-sm"
      />
      <span className={cn("font-semibold tracking-tight text-base-content", labelClassName)}>
        acct
      </span>
    </Link>
  );
}
