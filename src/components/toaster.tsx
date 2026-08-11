"use client";

import { Toaster as Sonner } from "sonner";
import "sonner/dist/styles.css";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      visibleToasts={3}
      gap={12}
      offset={24}
      mobileOffset={16}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border !border-base-content/12 !bg-base-200 !text-base-content !shadow-[0_16px_40px_oklch(0%_0_0/0.45)] !font-sans",
          title: "!text-sm !font-medium !text-base-content",
          description: "!text-xs !text-base-content/55",
          success: "!border-base-content/15",
          error: "!border-base-content/20",
        },
      }}
    />
  );
}
