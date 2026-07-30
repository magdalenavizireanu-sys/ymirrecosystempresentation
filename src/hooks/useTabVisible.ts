import { useEffect, useState } from 'react';

/**
 * True while this browser tab is the active/foreground tab. Combined with
 * useInViewport to pause non-essential continuous-loop animations when the
 * tab is backgrounded, per the brief's "pause non-essential loops when the
 * tab is inactive" requirement.
 */
export function useTabVisible() {
  const [visible, setVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  );

  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return visible;
}
