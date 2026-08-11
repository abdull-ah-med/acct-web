"use client";

import { toast } from "sonner";
import { copyCommand } from "@/lib/terminal";

/** Copy a command and confirm with a Sonner toast. */
export async function copyWithToast(
  command: string,
  opts?: { success?: string; error?: string }
): Promise<boolean> {
  const ok = await copyCommand(command);
  if (ok) {
    toast.success(opts?.success ?? "Copied to clipboard", {
      description: command.split("\n")[0]?.slice(0, 64),
      duration: 2200,
    });
    return true;
  }
  toast.error(opts?.error ?? "Couldn’t copy", {
    description: "Select the command and copy it manually.",
    duration: 3200,
  });
  return false;
}
