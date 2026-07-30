import { useEffect, useRef, useState } from 'react';

export interface SectionMeta {
  id: string;
  label: string;
}

/**
 * Tracks which registered section is currently most visible in the viewport,
 * for the progress rail / chapter indicator. Uses IntersectionObserver so it
 * stays cheap during scroll.
 */
export function useActiveSection(sections: SectionMeta[]) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let best = activeId;
        let bestRatio = 0;
        ratios.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (bestRatio > 0) setActiveId(best);
      },
      { threshold: [0.15, 0.35, 0.55, 0.75, 0.95] },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.map((s) => s.id).join(',')]);

  return activeId;
}
