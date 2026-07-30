import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { journeyStages } from '../data/journey';
import { getModuleById } from '../data/modules';
import { getProductEntityById } from '../data/productEntities';
import { AnimatedConnector } from './AnimatedConnector';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useInViewport } from '../hooks/useInViewport';
import { useTabVisible } from '../hooks/useTabVisible';
import type { JourneyStageId } from '../data/types';

const NODE_X = [100, 300, 500, 700, 900];

export function JourneyFlow() {
  const [activeId, setActiveId] = useState<JourneyStageId>('purpose');
  const reduced = useReducedMotion();
  const active = journeyStages.find((s) => s.id === activeId)!;

  // The travelling signal dots are decorative, continuous loops. Only run
  // them while this chapter is actually on screen and the tab is in the
  // foreground, so they don't burn cycles — or draw attention — elsewhere.
  const [diagramRef, inView] = useInViewport<HTMLDivElement>(0.2);
  const tabVisible = useTabVisible();
  const signalsActive = inView && tabVisible;

  return (
    <div className="journey-flow">
      <div className="journey-flow__diagram" ref={diagramRef}>
        <svg
          className="journey-flow__svg"
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {NODE_X.slice(0, -1).map((x, i) => (
            <AnimatedConnector
              key={i}
              d={`M ${x + 34} 70 L ${NODE_X[i + 1] - 34} 70`}
              pulse={signalsActive}
              duration={2.6}
              active
            />
          ))}
          {/* loop-back: Outcome -> Intent, "if the result does not fulfil the purpose" */}
          <AnimatedConnector
            d={`M 900 100 C 900 190, 300 190, 300 100`}
            dashed
            pulse={signalsActive}
            duration={4.5}
            colorVar="var(--color-tertiary-40)"
            strokeWidth={1.25}
          />
          <text x="600" y="205" textAnchor="middle" className="journey-flow__loop-label">
            falls short → spawns the next issue
          </text>
        </svg>

        <div className="journey-flow__nodes" role="tablist" aria-label="Purpose to outcome journey stages">
          {journeyStages.map((stage) => (
            <div key={stage.id} className="journey-flow__node-slot">
              <button
                type="button"
                role="tab"
                aria-selected={activeId === stage.id}
                className={`journey-node${activeId === stage.id ? ' is-active' : ''}`}
                onClick={() => setActiveId(stage.id)}
                onMouseEnter={() => setActiveId(stage.id)}
                onFocus={() => setActiveId(stage.id)}
              >
                <span className="journey-node__index">{stage.index.toString().padStart(2, '0')}</span>
                <span className="journey-node__name">{stage.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={{ duration: reduced ? 0.001 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="journey-flow__panel glass-panel"
          role="tabpanel"
        >
          <div className="journey-flow__panel-grid">
            <div>
              <p className="module-card__label">What happens</p>
              <p className="module-card__text">{active.detail}</p>
            </div>
            <div className="journey-flow__panel-side">
              <div>
                <p className="module-card__label">Contributing modules &amp; entities</p>
                <div className="module-card__stages">
                  {active.productEntityIds.map((id) => {
                    const e = getProductEntityById(id);
                    return e ? <span key={id} className="tag-chip tag-chip--entity">{e.name}</span> : null;
                  })}
                  {active.moduleIds.map((id) => {
                    const m = getModuleById(id);
                    return m ? <span key={id} className="tag-chip">{m.name}</span> : null;
                  })}
                  {active.moduleIds.length === 0 && active.productEntityIds.length === 0 && (
                    <span className="tag-chip">—</span>
                  )}
                </div>
              </div>
              <div>
                <p className="module-card__label">Business value created</p>
                <p className="module-card__text">{active.businessValue}</p>
              </div>
              <div>
                <p className="module-card__label">Moves to the next stage by</p>
                <p className="module-card__text">{active.handoff}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
