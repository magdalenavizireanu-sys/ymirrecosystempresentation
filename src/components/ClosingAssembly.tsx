import { motion } from 'framer-motion';
import { modules } from '../data/modules';
import { productEntities } from '../data/productEntities';
import { volund } from '../data/foundation';
import { ModuleIcon } from './ModuleIcon';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Inner ring: the identity-level entities — product entities plus Völund.
// Outer ring: the core ecosystem modules that have an icon to show.
const innerRing = [...productEntities.map((p) => ({ id: p.id, icon: p.icon, name: p.name })), volund];
const outerRing = modules.filter((m) => m.hasOfficialIcon);

interface RingProps {
  items: { id: string; icon?: string; name: string }[];
  radius: number;
  reverse?: boolean;
  duration: number;
  reduced: boolean;
}

/** One orbital ring: the ring itself rotates continuously (pure CSS,
 *  looped), while each item counter-rotates at the same rate so the icon
 *  artwork stays upright — only its position travels around the circle.
 *  No JS animation loop is needed since the rotation is a fixed, constant
 *  rate (unlike the hero orbit, whose radius has to react to the model's
 *  measured size — nothing here needs to be measured at runtime). */
function OrbitRing({ items, radius, reverse, duration, reduced }: RingProps) {
  const count = items.length;
  return (
    <div
      className={`closing-assembly__ring${reduced ? ' closing-assembly__ring--static' : ''}${reverse ? ' closing-assembly__ring--reverse' : ''}`}
      style={{ animationDuration: `${duration}s` }}
    >
      <div className="closing-assembly__guide" style={{ width: `${radius * 2}%`, height: `${radius * 2}%` }} aria-hidden="true" />
      {items.map((item, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <motion.div
            key={item.id}
            className="closing-assembly__item"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduced ? 0.001 : 0.7, delay: reduced ? 0 : i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={`closing-assembly__item-counter${reduced ? ' closing-assembly__item-counter--static' : ''}${reverse ? ' closing-assembly__item-counter--reverse' : ''}`}
              style={{ animationDuration: `${duration}s` }}
            >
              {item.icon ? (
                <img src={item.icon} alt="" width={36} height={36} />
              ) : (
                <ModuleIcon module={item as (typeof modules)[number]} size={36} />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/** Closing-chapter set piece: every module and product-entity icon orbiting
 *  the central Ymirr symbol on two calm, continuous, counter-rotating
 *  rings — "a governed ecosystem revolving around a core system," not a
 *  one-off entrance animation. Split into two rings (rather than one
 *  crowded ring of ~20 icons) purely for spacing/legibility. */
export function ClosingAssembly() {
  const reduced = useReducedMotion();

  return (
    <div className="closing-assembly">
      <div className="closing-assembly__field">
        <OrbitRing items={innerRing} radius={26} duration={70} reduced={reduced} />
        <OrbitRing items={outerRing} radius={46} duration={130} reverse reduced={reduced} />

        <motion.div
          className="closing-assembly__core"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduced ? 0.001 : 0.9, delay: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src="/brand/ymirr-mark.svg" alt="Ymirr™" width={140} height={155} />
        </motion.div>
      </div>
    </div>
  );
}
