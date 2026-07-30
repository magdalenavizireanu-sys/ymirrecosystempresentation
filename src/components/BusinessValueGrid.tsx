import { useState } from 'react';
import { businessValueItems } from '../data/businessValue';
import { getModuleById } from '../data/modules';
import { getProductEntityById } from '../data/productEntities';
import { ModuleIcon } from './ModuleIcon';
import { Reveal } from './Reveal';

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

/** Each tile states the transformation up front — current state → result —
 *  so the benefit is legible at a glance; the mechanism (which modules, and
 *  how) discloses on click for anyone who wants the "how", not just the
 *  "what". */
export function BusinessValueGrid() {
  const [openId, setOpenId] = useState<string | null>(businessValueItems[0]?.id ?? null);

  return (
    <div className="value-grid">
      {businessValueItems.map((item, i) => {
        const open = openId === item.id;
        return (
          <Reveal key={item.id} delay={i * 0.05} as="div">
            <button
              type="button"
              className={`value-tile glass-panel${open ? ' is-open' : ''}`}
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className="value-tile__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="value-tile__transform">
                <span className="value-tile__problem">{item.problem}</span>
                <span className="value-tile__arrow" aria-hidden="true">↓</span>
                <span className="value-tile__title">{item.title}</span>
              </span>
              <span className={`value-tile__mechanism${open ? ' is-visible' : ''}`}>
                <span className="value-tile__mechanism-label">Ymirr mechanism</span>
                <span className="value-tile__mechanism-chips">
                  {item.moduleIds.map((id) => <MechanismChip key={id} id={id} />)}
                </span>
                <span className="value-tile__mechanism-text">{item.mechanism}</span>
              </span>
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}
