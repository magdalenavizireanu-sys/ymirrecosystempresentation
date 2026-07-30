import { useEffect, useState } from 'react';

/** Generic media-query subscription — same pattern as useReducedMotion, just
 *  parameterised. Used for capability queries (`(hover: hover) and
 *  (pointer: fine)`) where the point is explicitly to detect *hover
 *  capability*, not to infer it from viewport width. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
