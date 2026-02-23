"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when the given CSS media query matches.
 * Initialises to false (mobile-safe SSR default) and updates after mount.
 *
 * Usage:
 *   const isDesktop = useMediaQuery("(min-width: 1200px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
