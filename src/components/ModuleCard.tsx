import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EcosystemModule } from '../data/types';
import { ModuleIcon } from './ModuleIcon';
import { useReducedMotion } from '../hooks/useReducedMotion';

const stageLabel: Record<string, string> = {
  purpose: 'Purpose',
  intent: 'Intent',
  'governed-action': 'Governed Action',
  knowledge: 'Knowledge',
  outcome: 'Outcome',
};

export function ModuleCard({ module }: { module: EcosystemModule }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduced = useReducedMotion();

  return (
    <div className={`module-card glass-panel${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="module-card__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <ModuleIcon module={module} size={56} />
        <span className="module-card__heading">
          <span className="module-card__name">{module.name}</span>
          <span className="module-card__tagline">{module.officialTagline ?? module.shortRole.split(' — ')[0]}</span>
        </span>
        <span className="module-card__chevron" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <p className="module-card__role">{module.shortRole}</p>

      <div className="module-card__stages">
        {module.journeyStages.map((s) => (
          <span key={s} className="tag-chip">{stageLabel[s]}</span>
        ))}
        {module.needsValidation && <span className="tag-chip tag-chip--warn">Needs validation</span>}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.001 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="module-card__details"
          >
            <div>
              <p className="module-card__label">Problem it solves</p>
              <p className="module-card__text">{module.problem}</p>
            </div>
            <div>
              <p className="module-card__label">Contribution to Ymirr™</p>
              <p className="module-card__text">{module.contribution}</p>
            </div>
            {module.connectsTo.length > 0 && (
              <div>
                <p className="module-card__label">Connects to</p>
                <p className="module-card__text">{module.connectsTo.join(', ')}</p>
              </div>
            )}
            {module.validationNote && (
              <div className="module-card__note">
                <span aria-hidden="true">⚠</span> {module.validationNote}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
