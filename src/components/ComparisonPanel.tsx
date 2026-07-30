import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { comparisonRows, projectTrackingFlow, purposeTrackingFlow } from '../data/comparison';
import { AnimatedConnector, ConnectorLink } from './AnimatedConnector';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** One tracking model as a connected step chain, not a bare arrow-separated
 *  sentence. The traditional chain visibly dead-ends after "Done"; the
 *  Ymirr chain visibly loops its last step back to its first — the
 *  difference the brief asks users to grasp in a few seconds, shown rather
 *  than explained. */
function FlowChain({ steps, variant }: { steps: string[]; variant: 'old' | 'new' }) {
  const reduced = useReducedMotion();
  const isNew = variant === 'new';
  const colorVar = isNew ? 'var(--color-primary)' : 'var(--text-muted)';

  return (
    <div className={`flow-chain flow-chain--${variant}`}>
      <div className="flow-chain__steps">
        {steps.map((step, i) => (
          <div key={step} className="flow-chain__slot">
            <span className={`flow-chain__step${isNew ? ' flow-chain__step--accent' : ''}`}>{step}</span>
            {i < steps.length - 1 && (
              <ConnectorLink pulse={isNew} colorVar={colorVar} className="flow-chain__link" />
            )}
          </div>
        ))}
        {!isNew && (
          <div className="flow-chain__deadend" aria-hidden="true">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none">
              <AnimatedConnector d="M 0 5 L 100 5" colorVar={colorVar} dashed strokeWidth={2} active={false} />
            </svg>
          </div>
        )}
      </div>
      {isNew && (
        <svg className="flow-chain__loop" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
          <AnimatedConnector
            d="M 97 0 C 97 28, 3 28, 3 0"
            colorVar="var(--color-primary)"
            dashed
            pulse={!reduced}
            duration={5.5}
            strokeWidth={1.75}
          />
        </svg>
      )}
      <p className="flow-chain__caption">
        {isNew
          ? 'The result routes back to purpose — the loop stays closed.'
          : 'The trail stops at "Done." Nothing routes back to why the work existed.'}
      </p>
    </div>
  );
}

/** The chapter-2 "project tracking vs purpose tracking" contrast: an
 *  animated, connected chain for each model (so the loop-vs-dead-end point
 *  is visible, not just stated), plus a click-to-reveal dimension-by-
 *  dimension comparator below for anyone who wants the detail. */
export function ComparisonPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const row = comparisonRows[activeIndex];

  return (
    <div className="comparison-panel">
      <div className="comparison-panel__flows">
        <div className="flow-strip flow-strip--old">
          <p className="module-card__label">Project tracking</p>
          <FlowChain steps={projectTrackingFlow} variant="old" />
        </div>
        <div className="flow-strip flow-strip--new">
          <p className="module-card__label">Purpose tracking</p>
          <FlowChain steps={purposeTrackingFlow} variant="new" />
        </div>
      </div>

      <div className="comparison-panel__table glass-panel">
        <div className="comparison-panel__rows" role="list">
          {comparisonRows.map((r, i) => (
            <button
              key={r.dimension}
              role="listitem"
              type="button"
              className={`comparison-panel__row-btn${i === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              {r.dimension}
            </button>
          ))}
        </div>
        <div className="comparison-panel__detail-frame">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={row.dimension}
              className="comparison-panel__detail"
              initial={reduced ? undefined : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0.001 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="comparison-panel__col">
                <p className="module-card__label">Ticket boards</p>
                <p className="module-card__text">{row.ticketConcept}</p>
              </div>
              <div className="comparison-panel__col comparison-panel__col--accent">
                <p className="module-card__label">Orlog’s purpose graph</p>
                <p className="module-card__text">{row.purposeConcept}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
