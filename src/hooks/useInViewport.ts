import { useEffect, useRef, useState } from 'react';

/**
 * True while the referenced element has any part on screen. Used to gate
 * continuous-loop animations (e.g. the journey's travelling signal dots) so
 * they don't keep running — and burning cycles — while their chapter is
 * scrolled out of view.
 */
export function useInViewport<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}
