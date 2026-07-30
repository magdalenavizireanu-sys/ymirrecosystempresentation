import { useEffect, useRef, useState, type ReactNode } from 'react';
import { modules, getModuleById } from '../data/modules';
import { volund } from '../data/foundation';
import { productEntities, getProductEntityById } from '../data/productEntities';
import { journeyStages } from '../data/journey';
import { ModuleIcon } from './ModuleIcon';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { EcosystemModule, JourneyStageId } from '../data/types';

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Every id this node is actually documented as connecting to — including
 *  the reverse direction (module.connectsTo isn't recorded symmetrically in
 *  the source data) and Völund's own cross-tier links. No connection here
 *  is inferred from naming; all of it traces back to a `connectsTo` array
 *  already in modules.ts / foundation.ts. */
function relatedIds(id: string): string[] {
  if (id === volund.id) return volund.connectsTo;
  const forward = getModuleById(id)?.connectsTo ?? [];
  const backward = modules.filter((m) => m.connectsTo.includes(id)).map((m) => m.id);
  const fromVolund = volund.connectsTo.includes(id) ? [volund.id] : [];
  return Array.from(new Set([...forward, ...backward, ...fromVolund]));
}

function journeyStagesFor(id: string) {
  if (id === volund.id) return volund.journeyStages;
  return getModuleById(id)?.journeyStages ?? getProductEntityById(id)?.journeyStages ?? [];
}

function labelFor(id: string) {
  if (id === volund.id) return volund.name;
  return getModuleById(id)?.name ?? getProductEntityById(id)?.name ?? id;
}

function ValidationBadge({ module }: { module: EcosystemModule }) {
  if (!module.needsValidation) return null;
  return (
    <span className="arch-node__badge" title={module.validationNote}>
      unverified
    </span>
  );
}

interface ArchNodeProps {
  id: string;
  kind: 'foundation' | 'core' | 'product';
  isDimmed: boolean;
  isRelated: boolean;
  isOpen: boolean;
  registerRef: (id: string, el: HTMLElement | null) => void;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  children: ReactNode;
}

function ArchNode({ id, kind, isDimmed, isRelated, isOpen, registerRef, onHover, onSelect, children }: ArchNodeProps) {
  return (
    <button
      type="button"
      ref={(el) => registerRef(id, el)}
      className={`arch-node arch-node--${kind}${isDimmed ? ' is-dimmed' : ''}${isRelated ? ' is-related' : ''}${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(id)}
      aria-pressed={isOpen}
    >
      {children}
    </button>
  );
}

/** The ecosystem architecture as an always-visible, connected three-band
 *  map (Völund Foundation at the base, core ecosystem modules in the
 *  middle, Ymirr™ product entities on top) — replacing the previous
 *  accordion, which showed one tier at a time and drew no relationships at
 *  all despite every module already carrying real `connectsTo` data. */
export function EcosystemMap() {
  const reduced = useReducedMotion();
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<JourneyStageId | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [box, setBox] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Map<string, HTMLElement>>(new Map());
  const registerRef = (id: string, el: HTMLElement | null) => {
    if (el) nodeEls.current.set(id, el);
    else nodeEls.current.delete(id);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setBox({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tracing follows whichever node is being actively explored — hover/focus
  // if present, otherwise whatever's currently open — so a keyboard user
  // who opens a node and tabs into its detail panel doesn't lose the
  // connection trace the moment focus leaves the node itself.
  const traceId = hoverId ?? openId;

  useEffect(() => {
    if (!traceId || reduced) {
      setLines([]);
      return;
    }
    const compute = () => {
      const container = containerRef.current;
      const origin = nodeEls.current.get(traceId);
      if (!container || !origin) {
        setLines([]);
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const originRect = origin.getBoundingClientRect();
      const ox = originRect.left + originRect.width / 2 - containerRect.left;
      const oy = originRect.top + originRect.height / 2 - containerRect.top;
      const next = relatedIds(traceId)
        .map((id) => nodeEls.current.get(id))
        .filter((elx): elx is HTMLElement => Boolean(elx))
        .map((elx) => {
          const r = elx.getBoundingClientRect();
          return {
            x1: ox,
            y1: oy,
            x2: r.left + r.width / 2 - containerRect.left,
            y2: r.top + r.height / 2 - containerRect.top,
          };
        });
      setLines(next);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [traceId, reduced, box]);

  const related = traceId ? new Set([traceId, ...relatedIds(traceId)]) : null;
  const isDimmed = (id: string) => {
    if (stageFilter && !journeyStagesFor(id).includes(stageFilter)) return true;
    if (related && !related.has(id)) return true;
    return false;
  };
  const isRelatedTo = (id: string) => Boolean(related && id !== traceId && related.has(id));

  const openModule = openId ? getModuleById(openId) : undefined;
  const openEntity = openId ? getProductEntityById(openId) : undefined;
  const openIsVolund = openId === volund.id;

  return (
    <div className="ecosystem-map">
      <div className="ecosystem-map__filters" role="group" aria-label="Filter by purpose journey stage">
        <button type="button" className={`filter-chip${stageFilter === null ? ' is-active' : ''}`} onClick={() => setStageFilter(null)}>
          Ecosystem view
        </button>
        {journeyStages.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`filter-chip${stageFilter === s.id ? ' is-active' : ''}`}
            onClick={() => setStageFilter(stageFilter === s.id ? null : s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="ecosystem-map__diagram" ref={containerRef}>
        {!reduced && (
          <svg className="ecosystem-map__lines" width="100%" height="100%" viewBox={`0 0 ${box.width} ${box.height}`} aria-hidden="true">
            {lines.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--color-primary)" strokeWidth={1.5} strokeOpacity={0.6} />
            ))}
          </svg>
        )}

        {/* Product entities — most prominent: what a customer actually buys. */}
        <div className="ecosystem-map__band ecosystem-map__band--product">
          <p className="ecosystem-map__band-label">Ymirr™ product entities</p>
          <div className="ecosystem-map__row ecosystem-map__row--product">
            {productEntities.map((e) => (
              <ArchNode
                key={e.id}
                id={e.id}
                kind="product"
                isDimmed={isDimmed(e.id)}
                isRelated={isRelatedTo(e.id)}
                isOpen={openId === e.id}
                registerRef={registerRef}
                onHover={setHoverId}
                onSelect={(id) => setOpenId(openId === id ? null : id)}
              >
                <img src={e.icon} alt="" width={40} height={40} />
                <span className="arch-node__name">{e.name}</span>
                <span className="arch-node__tagline">{e.officialTagline}</span>
              </ArchNode>
            ))}
          </div>
        </div>

        {/* Core ecosystem — the governed infrastructure layer. */}
        <div className="ecosystem-map__band ecosystem-map__band--core">
          <p className="ecosystem-map__band-label">Ymirr™ core ecosystem</p>
          <div className="ecosystem-map__row ecosystem-map__row--core">
            {modules.map((m) => (
              <ArchNode
                key={m.id}
                id={m.id}
                kind="core"
                isDimmed={isDimmed(m.id)}
                isRelated={isRelatedTo(m.id)}
                isOpen={openId === m.id}
                registerRef={registerRef}
                onHover={setHoverId}
                onSelect={(id) => setOpenId(openId === id ? null : id)}
              >
                <ModuleIcon module={m} size={32} />
                <span className="arch-node__name">{m.name}</span>
                <ValidationBadge module={m} />
              </ArchNode>
            ))}
          </div>
        </div>

        {/* Foundation — the substrate everything above ultimately runs on. */}
        <div className="ecosystem-map__band ecosystem-map__band--foundation">
          <p className="ecosystem-map__band-label">Völund Foundation</p>
          <ArchNode
            id={volund.id}
            kind="foundation"
            isDimmed={isDimmed(volund.id)}
            isRelated={isRelatedTo(volund.id)}
            isOpen={openId === volund.id}
            registerRef={registerRef}
            onHover={setHoverId}
            onSelect={(id) => setOpenId(openId === id ? null : id)}
          >
            <img src={volund.icon} alt="" width={44} height={44} />
            <span className="arch-node__name">{volund.name}</span>
            <span className="arch-node__tagline">{volund.officialTagline}</span>
            <ValidationBadge module={volund} />
          </ArchNode>
        </div>
      </div>

      <div className="ecosystem-map__detail glass-panel" aria-live="polite">
        {openModule && (
          <>
            <p className="module-card__label">{openModule.name}{openModule.officialTagline ? ` — ${openModule.officialTagline}` : ''}</p>
            <p className="module-card__text">{openModule.shortRole}</p>
            {openModule.connectsTo.length > 0 && (
              <div className="module-card__stages">
                <span className="tag-chip">Connects to:</span>
                {openModule.connectsTo.map((id) => (
                  <span key={id} className="tag-chip tag-chip--entity">{labelFor(id)}</span>
                ))}
              </div>
            )}
            {openModule.needsValidation && <p className="module-card__note">{openModule.validationNote}</p>}
          </>
        )}
        {openEntity && (
          <>
            <p className="module-card__label">{openEntity.name} — {openEntity.officialTagline}</p>
            <p className="module-card__text">{openEntity.description}</p>
          </>
        )}
        {openIsVolund && (
          <>
            <p className="module-card__label">{volund.name} — {volund.officialTagline}</p>
            <p className="module-card__text">{volund.shortRole}</p>
            <p className="module-card__note">{volund.validationNote}</p>
          </>
        )}
        {!openId && <p className="module-card__text">Select any node to see its role. Hover or focus a node to trace its documented connections.</p>}
      </div>
    </div>
  );
}
