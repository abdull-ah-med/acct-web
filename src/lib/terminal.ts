/** Canonical global install — use everywhere users see an install command. */
export const INSTALL_COMMAND = "npm install -g acct-sh";

/** Runnable lines only (drops comments / blank lines). */
export function runnableCommand(snippet: string): string {
  return snippet
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0 && !line.trimStart().startsWith("#"))
    .join("\n");
}

/** Copy a command to the clipboard. Never downloads or opens apps. */
export async function copyCommand(command: string): Promise<boolean> {
  const text = runnableCommand(command) || command.trim();
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
