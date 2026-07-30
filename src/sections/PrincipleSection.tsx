import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionShell, KickerTitle } from '../components/SectionShell';
import { Reveal } from '../components/Reveal';
import { ConnectorLink } from '../components/AnimatedConnector';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { governanceInputs, governanceOutcome, governanceStages } from '../data/governance';
import { brandPromiseQuote, missionQuote, oneSentenceDefinition, toneOfVoice, visionQuote } from '../data/messaging';

const DEFAULT_HINT = 'Select a stage to see what happens there.';

export function PrincipleSection() {
  const reduced = useReducedMotion();
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const activeDetail = governanceStages.find((s) => s.id === activeStage);

  return (
    <SectionShell id="principle" wide>
      <KickerTitle index="02" title="The Ymirr™ principle" />
      <Reveal>
        <h2 id="principle-heading" className="section-title">
          Every workflow, AI agent and person operates<br /> under the same rules, permissions and audit trail.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">{oneSentenceDefinition}</p>
      </Reveal>

      {/* The principle, shown rather than stated: three actors enter the
          same governed pipeline and come out the other side as one
          coordinated, traceable outcome — no actor gets a shorter path. */}
      <Reveal delay={0.18}>
        <div
          className="governance-diagram"
          role="group"
          aria-label="Governed system: Human, AI Agent and Workflow all pass through the same identity, permission and audit pipeline to a single coordinated outcome"
        >
          <div className="governance-diagram__inputs">
            {governanceInputs.map((n) => (
              <div key={n.id} className="governance-node governance-node--input glass-panel">
                <p className="governance-node__name">{n.name}</p>
                <p className="governance-node__detail">{n.detail}</p>
              </div>
            ))}
          </div>

          <div className="governance-diagram__merge governance-diagram__merge--in" aria-hidden="true">
            <ConnectorLink pulse={!reduced} className="governance-diagram__merge-link" />
          </div>

          <div className="governance-diagram__pipeline">
            {governanceStages.map((stage, i) => {
              const isActive = activeStage === stage.id;
              return (
                <div key={stage.id} className="governance-diagram__stage-slot">
                  <button
                    type="button"
                    className={`governance-node governance-node--stage${isActive ? ' is-active' : ''}`}
                    onClick={() => setActiveStage(isActive ? null : stage.id)}
                    aria-expanded={isActive}
                    aria-controls="governance-stage-detail"
                  >
                    <span className="governance-node__index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="governance-node__name">{stage.name}</span>
                  </button>
                  {i < governanceStages.length - 1 && (
                    <ConnectorLink pulse={!reduced} className="governance-diagram__stage-link" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="governance-diagram__merge governance-diagram__merge--out" aria-hidden="true">
            <ConnectorLink pulse={!reduced} className="governance-diagram__merge-link" />
          </div>

          <div className="governance-node governance-node--outcome glass-panel">
            <p className="governance-node__name">{governanceOutcome.name}</p>
            <p className="governance-node__detail">{governanceOutcome.detail}</p>
          </div>
        </div>

        <div className="governance-diagram__detail" id="governance-stage-detail" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeStage ?? 'hint'}
              initial={reduced ? undefined : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduced ? 0.001 : 0.22 }}
            >
              {activeDetail ? (
                <>
                  <strong>{activeDetail.name}.</strong> {activeDetail.detail}
                </>
              ) : (
                DEFAULT_HINT
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </Reveal>

      {/* Mission / vision / brand promise still matter, but they're brand
          statements, not the operational principle above — kept present,
          not competing for the same visual weight. */}
      <Reveal delay={0.26}>
        <div className="principle-secondary">
          <button
            type="button"
            className="closing-notes__toggle principle-secondary__toggle"
            aria-expanded={secondaryOpen}
            aria-controls="principle-secondary-panel"
            onClick={() => setSecondaryOpen((v) => !v)}
          >
            Mission, vision &amp; brand promise
            <span className="closing-notes__chevron">{secondaryOpen ? '−' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {secondaryOpen && (
              <motion.div
                id="principle-secondary-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0.001 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="principle-grid">
                  <div className="glass-panel principle-grid__quote">
                    <p className="module-card__label">Mission</p>
                    <p className="module-card__text">{missionQuote}</p>
                  </div>
                  <div className="glass-panel principle-grid__quote">
                    <p className="module-card__label">Vision</p>
                    <p className="module-card__text">{visionQuote}</p>
                  </div>
                  <div className="glass-panel principle-grid__quote principle-grid__quote--accent">
                    <p className="module-card__label">Brand promise</p>
                    <p className="module-card__text">“{brandPromiseQuote}”</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      {/* Tone of voice — how Ymirr talks about the principle above, kept
          visually distinct so it never reads as a list of system features. */}
      <Reveal delay={0.32}>
        <div className="voice-strip">
          <p className="voice-strip__label">How we talk about it</p>
          <div className="voice-strip__row">
            {toneOfVoice.map((t) => (
              <div key={t.name} className="voice-strip__item">
                <span className="voice-strip__name">{t.name}</span>
                <span className="voice-strip__body">{t.body}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
