"use client";

import { useEffect } from "react";

/**
 * Replace the broken URL in the history stack with `/` so the browser Back
 * button does not return to the missing route.
 */
export function NotFoundHistoryReplace() {
  useEffect(() => {
    window.history.replaceState(window.history.state, "", "/");
  }, []);

  return null;
}
