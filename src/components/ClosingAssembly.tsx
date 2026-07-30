import { motion } from 'framer-motion';
import { modules } from '../data/modules';
import { productEntities } from '../data/productEntities';
import { volund } from '../data/foundation';
import { ModuleIcon } from './ModuleIcon';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ring = [...productEntities.map((p) => ({ id: p.id, icon: p.icon, name: p.name })), volund, ...modules.filter((m) => m.hasOfficialIcon)];

/** Closing-chapter set piece: every module and product-entity icon arranged
 *  in a ring, animating inward toward the central Ymirr symbol on scroll —
 *  "all modules align into the Ymirr symbol". */
export function ClosingAssembly() {
  const reduced = useReducedMotion();
  const count = ring.length;
  const radius = 46; // percent

  return (
    <div className="closing-assembly">
      <div className="closing-assembly__field">
        {ring.map((item, i) => {
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
              {'icon' in item && typeof item.icon === 'string' ? (
                <img src={item.icon} alt="" width={36} height={36} />
              ) : (
                <ModuleIcon module={item as (typeof modules)[number]} size={36} />
              )}
            </motion.div>
          );
        })}

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
