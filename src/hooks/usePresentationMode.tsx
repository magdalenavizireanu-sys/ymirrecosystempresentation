import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type PresentationMode = 'guided' | 'explore';

interface PresentationModeContextValue {
  mode: PresentationMode;
  setMode: (mode: PresentationMode) => void;
  toggle: () => void;
}

const PresentationModeContext = createContext<PresentationModeContextValue | null>(null);

export function PresentationModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PresentationMode>('guided');

  // "Guided" gives the chapters gentle scroll-snap (deck-like, one chapter at
  // a time); "explore" is plain free scroll. Exposed as a data attribute so
  // global.css can apply it without every section needing to know the mode.
  useEffect(() => {
    document.documentElement.dataset.presentationMode = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === 'guided' ? 'explore' : 'guided')),
    }),
    [mode],
  );

  return <PresentationModeContext.Provider value={value}>{children}</PresentationModeContext.Provider>;
}

export function usePresentationMode() {
  const ctx = useContext(PresentationModeContext);
  if (!ctx) throw new Error('usePresentationMode must be used within PresentationModeProvider');
  return ctx;
}
