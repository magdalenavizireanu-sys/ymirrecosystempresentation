import type { ReactElement } from 'react';
import { businessValueItems } from '../data/businessValue';
import { getModuleById } from '../data/modules';
import { getProductEntityById } from '../data/productEntities';
import { ModuleIcon } from './ModuleIcon';
import { Reveal } from './Reveal';
import { DisclosureCoordinatorProvider, TruncatedTextDisclosure } from './TruncatedTextDisclosure';

function MechanismChip({ id }: { id: string }) {
  const m = getModuleById(id);
  if (m) {
    return (
      <span className="mechanism-chip">
        <ModuleIcon module={m} size={20} />
        {m.name}
      </span>
    );
  }
  const e = getProductEntityById(id);
  if (!e) return null;
  return (
    <span className="mechanism-chip mechanism-chip--entity">
      <img src={e.icon} alt="" width={20} height={20} />
      {e.name}
    </span>
  );
}

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** One hand-drawn line icon per business-value item, matching the same
 *  abstract/geometric/stroke-based language already used for the module
 *  fallback markers elsewhere in this project (see ModuleIcon.tsx) — no new
 *  icon-library dependency, since none is installed and this sandbox has no
 *  Node to verify an install would resolve cleanly. */
const BUSINESS_VALUE_ICONS: Record<string, ReactElement> = {
  alignment: (
    <svg {...ICON_PROPS} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    </svg>
  ),
  'governed-ai': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M12 3.5 5 6v5.2c0 4.4 2.9 7.4 7 9.3 4.1-1.9 7-4.9 7-9.3V6z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </svg>
  ),
  'accountable-execution': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <rect x="5.5" y="11" width="13" height="9" rx="1.5" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  ),
  'traceable-decisions': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 8.2v7.6" />
      <path d="M8.1 6.9 15.9 10.8" />
      <path d="M8.1 17.1 15.9 13.2" />
    </svg>
  ),
  'reusable-knowledge': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M12 6.2c-1.6-1.1-3.8-1.7-6-1.7v13c2.2 0 4.4.6 6 1.7 1.6-1.1 3.8-1.7 6-1.7v-13c-2.2 0-4.4.6-6 1.7z" />
      <path d="M12 6.2v13" />
    </svg>
  ),
  'lower-fragmentation': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M12 4 20 9l-8 5-8-5z" />
      <path d="M4 14l8 5 8-5" />
    </svg>
  ),
  'cross-system-coordination': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <circle cx="5.5" cy="7" r="2.2" />
      <circle cx="18.5" cy="7" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M7.5 8.1 10.2 16" />
      <path d="M16.5 8.1 13.8 16" />
      <path d="M7.7 7h9" />
    </svg>
  ),
  'measurable-outcomes': (
    <svg {...ICON_PROPS} aria-hidden="true">
      <path d="M5 19V13" />
      <path d="M11 19V9" />
      <path d="M17 19v-4.5" />
      <path d="M14.5 7 17.5 4l2 2" />
      <path d="M12.5 9 17.2 4.3" />
    </svg>
  ),
};

/** Each tile states the transformation up front — current state → result —
 *  plus the mechanism behind it, always visible (not click-to-expand: a
 *  per-card toggle was what made the tiles different heights in the first
 *  place). Grid + flex stretch keep every tile the same height regardless
 *  of how much text or how many mechanism chips it has. The problem/
 *  mechanism text is still clamped exactly as before — TruncatedTextDisclosure
 *  only adds a hover/tap way to read the full text when a clamp actually
 *  cuts something off, without touching the clamped element itself. */
export function BusinessValueGrid() {
  return (
    <DisclosureCoordinatorProvider>
      <div className="value-grid">
        {businessValueItems.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05} as="div" className="value-tile glass-panel">
            <div className="value-tile__icon" aria-hidden="true">
              {BUSINESS_VALUE_ICONS[item.id] ?? null}
            </div>
            <span className="value-tile__index">{String(i + 1).padStart(2, '0')}</span>
            <div className="value-tile__transform">
              <TruncatedTextDisclosure
                id={`${item.id}-problem`}
                fullText={item.problem}
                contextLabel={item.title}
                className="value-tile__problem"
              >
                {item.problem}
              </TruncatedTextDisclosure>
              <span className="value-tile__arrow" aria-hidden="true">↓</span>
              <p className="value-tile__title">{item.title}</p>
            </div>
            <div className="value-tile__mechanism">
              <p className="value-tile__mechanism-label">Ymirr mechanism</p>
              <div className="value-tile__mechanism-chips">
                {item.moduleIds.map((id) => <MechanismChip key={id} id={id} />)}
              </div>
              <TruncatedTextDisclosure
                id={`${item.id}-mechanism`}
                fullText={item.mechanism}
                contextLabel={item.title}
                className="value-tile__mechanism-text"
              >
                {item.mechanism}
              </TruncatedTextDisclosure>
            </div>
          </Reveal>
        ))}
      </div>
    </DisclosureCoordinatorProvider>
  );
}
