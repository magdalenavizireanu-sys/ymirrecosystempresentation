import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProductEntity } from '../data/types';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** Product-entity cards get materially stronger visual emphasis than
 *  ModuleCard: larger icon stage, gradient edge, and always-visible
 *  contribution line, per the brief's "stronger visual emphasis" requirement. */
export function ProductEntityCard({ entity }: { entity: ProductEntity }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduced = useReducedMotion();

  return (
    <div className={`entity-card${open ? ' is-open' : ''}`}>
      <div className="entity-card__icon-stage">
        <div className="entity-card__glow" aria-hidden="true" />
        <img src={entity.icon} alt="" className="entity-card__icon" />
      </div>

      <div className="entity-card__body">
        <p className="eyebrow">{entity.officialTagline}</p>
        <h3 className="entity-card__name">{entity.name}</h3>
        <p className="entity-card__desc">{entity.description}</p>
        <p className="entity-card__contribution"><strong>Contribution: </strong>{entity.contribution}</p>

        <button
          type="button"
          className="entity-card__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Show less' : 'Why is this independent?'}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0.001 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="entity-card__details"
            >
              <p>{entity.independenceReason}</p>
              {entity.tensionNote && (
                <p className="module-card__note">
                  <span aria-hidden="true">⚠</span> {entity.tensionNote}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
