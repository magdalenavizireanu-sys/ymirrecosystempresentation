import type { ReactElement } from 'react';
import type { EcosystemModule } from '../data/types';

/**
 * Renders the module's official 3D icon (extracted from Ymirr Brand Identity.pdf)
 * when one exists. When it doesn't — Niu, ysdr, claude-engine,
 * brainstormer-aggregator, Jarn — we deliberately do NOT invent a matching 3D
 * icon. Instead we reuse the brand's own "module input marker" vocabulary
 * (square / circle / triangle / diamond, from the Symbol Anatomy page) as a
 * neutral placeholder, and rely on the "no official icon yet" note in the UI.
 */
const FALLBACK_MARKERS: Record<string, ReactElement> = {
  niu: (
    <svg viewBox="0 0 40 40" width="46%" height="46%" aria-hidden="true">
      <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  ysdr: (
    <svg viewBox="0 0 40 40" width="46%" height="46%" aria-hidden="true">
      <rect x="11" y="11" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  'claude-engine': (
    <svg viewBox="0 0 40 40" width="46%" height="46%" aria-hidden="true">
      <polygon points="20,9 31,29 9,29" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  'brainstormer-aggregator': (
    <svg viewBox="0 0 40 40" width="46%" height="46%" aria-hidden="true">
      <polygon points="20,7 33,20 20,33 7,20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  jarn: (
    <svg viewBox="0 0 40 40" width="46%" height="46%" aria-hidden="true">
      <path d="M20 8 L20 32 M8 20 L32 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

export function ModuleIcon({ module, size = 64 }: { module: EcosystemModule; size?: number }) {
  if (module.hasOfficialIcon && module.icon) {
    return (
      <span
        className="module-icon module-icon--official"
        style={{ width: size, height: size }}
      >
        <img src={module.icon} alt="" width={size} height={size} loading="lazy" />
      </span>
    );
  }

  return (
    <span
      className="module-icon module-icon--fallback"
      style={{ width: size, height: size, color: 'var(--color-primary-40)' }}
      title="No official icon yet in the brand identity system"
    >
      {FALLBACK_MARKERS[module.id] ?? (
        <svg viewBox="0 0 40 40" width="46%" height="46%" aria-hidden="true">
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
