import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { motion, motionValue, useAnimationFrame } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTabVisible } from '../hooks/useTabVisible';

// three.js + @react-three/fiber/drei are the single heaviest dependency in
// this project. Code-splitting them into their own chunk means the rest of
// the presentation (chapters 2-10, all of which render immediately below the
// fold) is never blocked on downloading/parsing three.js.
const HeroSymbol3D = lazy(() => import('./HeroSymbol3D').then((m) => ({ default: m.HeroSymbol3D })));

/** The inputs that orbit the resolution core, per Ymirr Brand Identity.pdf
 *  page 1 ("From many inputs to one resolved outcome" / page 2 word cloud).
 *  top/left are each label's starting anchor — preserved from the original
 *  static composition so the orbit begins from the familiar layout. */
const ORBIT_LABELS = [
  { label: 'Purpose', top: 6, left: 46 },
  { label: 'Knowledge', top: 14, left: 82 },
  { label: 'AI Agents', top: 42, left: 90 },
  { label: 'Orchestration', top: 72, left: 84 },
  { label: 'Outcomes', top: 74, left: 10 },
  { label: 'Resolution', top: 38, left: 4 },
];

// Shared ellipse every label orbits on — one calm, consistent path rather
// than seven slightly-different wobbles. These percentages are a starting
// point only: the frame loop below grows the effective radius whenever the
// model's own measured footprint would otherwise poke through the path.
const ORBIT_RX_PCT = 45;
const ORBIT_RY_PCT = 37;
const ORBIT_PERIOD_S = 150; // one full revolution — deliberately slow/calm

// Extra breathing room kept between the orbit path and the model's bounding
// circle, on top of the model's own measured half-diagonal — this is what
// actually prevents labels from cutting through the model at any field size
// (the old fixed 45%/37% ellipse could mathematically pass through the
// core's box once the core grew close to its clamp ceiling).
const ORBIT_CLEARANCE_MARGIN = 28;
// A pill's own footprint, subtracted from the field's half-extents so the
// orbit path itself never gets clipped by the field edge when it grows to
// satisfy the clearance above.
const PILL_HALF_WIDTH = 64;
const PILL_HALF_HEIGHT = 22;
// Below this on the field's smaller dimension there isn't enough room to
// keep a full orbit clear of the model without the path spilling outside
// the field — past that point we simplify the composition (a calm static
// row under the model) instead of forcing geometry that doesn't fit.
const MIN_ORBIT_FIELD_DIMENSION = 480;

function startingPhase(top: number, left: number) {
  const dx = (left - 50) / ORBIT_RX_PCT;
  const dy = (top - 50) / ORBIT_RY_PCT;
  return Math.atan2(dy, dx);
}

/** Cinematic-but-restrained opening: the interactive 3D Ymirr symbol at the
 *  centre, with brand-vocabulary pills slowly orbiting it on a shared
 *  ellipse. Orbit motion is driven imperatively (motion values set every
 *  frame) rather than declaratively animated, so it never fights the
 *  per-pill entrance fade and stays perfectly smooth. */
export function HeroConvergence() {
  const reduced = useReducedMotion();
  const tabVisible = useTabVisible();

  const fieldRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const coreSizeRef = useRef({ width: 0, height: 0 });
  const inViewRef = useRef(false);
  // Below MIN_ORBIT_FIELD_DIMENSION the field is a React state (not just a
  // ref) because it changes what actually renders — the orbiting pills swap
  // for a static row — rather than just how the frame loop positions them.
  const [simplified, setSimplified] = useState(false);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
      setSimplified(Math.min(rect.width, rect.height) < MIN_ORBIT_FIELD_DIMENSION);
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    intersectionObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  // Measured independently of the field: the core's own clamp()-driven size
  // doesn't move in lockstep with the field's percentage-based dimensions,
  // so its clearance requirement has to be derived from its real box, not
  // assumed from the field size.
  useEffect(() => {
    const el = coreRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      coreSizeRef.current = { width: rect.width, height: rect.height };
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Motion values are created once (not on every render) and mutated in
  // place from the animation frame loop — this is what keeps the orbit
  // jitter-free: no React re-render is involved in moving the pills.
  const items = useMemo(
    () =>
      ORBIT_LABELS.map((item, i) => ({
        ...item,
        phase: startingPhase(item.top, item.left),
        x: motionValue(0),
        y: motionValue(0),
        pulseDelay: i * 0.9 + (i % 2) * 0.45,
      })),
    [],
  );

  useAnimationFrame((t) => {
    if (reduced || !tabVisible || !inViewRef.current || simplified) return;
    const { width, height } = sizeRef.current;
    if (!width || !height) return;
    const baseRx = (width * ORBIT_RX_PCT) / 100;
    const baseRy = (height * ORBIT_RY_PCT) / 100;

    // Required clearance = the model's own bounding-circle radius (from its
    // real measured box, not the ellipse's nominal percentages) plus a fixed
    // margin. The path is grown to at least this, then capped so it never
    // runs past the field's own edge (minus a pill-sized margin).
    const { width: coreW, height: coreH } = coreSizeRef.current;
    const clearance = Math.sqrt((coreW / 2) ** 2 + (coreH / 2) ** 2) + ORBIT_CLEARANCE_MARGIN;
    const maxRx = width / 2 - PILL_HALF_WIDTH;
    const maxRy = height / 2 - PILL_HALF_HEIGHT;
    const rx = Math.min(Math.max(baseRx, clearance), maxRx);
    const ry = Math.min(Math.max(baseRy, clearance), maxRy);

    const angleOffset = ((t / 1000) * (Math.PI * 2)) / ORBIT_PERIOD_S;
    for (const item of items) {
      const angle = item.phase + angleOffset;
      item.x.set(rx * Math.cos(angle));
      item.y.set(ry * Math.sin(angle));
    }
  });

  return (
    <div className="hero-convergence" aria-hidden="true">
      <div className={`hero-convergence__field${simplified ? ' hero-convergence__field--simplified' : ''}`} ref={fieldRef}>
        {!simplified &&
          items.map((item, i) => (
            <motion.div
              key={item.label}
              className="hero-convergence__pill-orbit"
              style={
                reduced
                  ? { top: `${item.top}%`, left: `${item.left}%` }
                  : { top: '50%', left: '50%', x: item.x, y: item.y }
              }
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0.3 : 1, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="pill hero-convergence__pill">
                {/* Nested element carries the soft pulse so it never fights the
                    parent's orbit/entrance transform (same pattern as the core
                    glow below). */}
                <span className="hero-convergence__pill-inner" style={{ animationDelay: `${item.pulseDelay}s` }}>
                  {item.label}
                </span>
              </span>
            </motion.div>
          ))}

        <motion.div
          className="hero-convergence__core"
          ref={coreRef}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.001 : 0.9, delay: reduced ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-convergence__core-glow" aria-hidden="true" />
          <Suspense fallback={<img src="/brand/ymirr-mark.svg" alt="Ymirr™" className="hero-symbol3d__fallback-img" />}>
            <HeroSymbol3D />
          </Suspense>
        </motion.div>

        {/* Small screens (and any field too short for a collision-free
            orbit): a calm static row under the model instead of a shrunk
            orbit — simplifying the composition rather than shrinking every
            element past legibility. */}
        {simplified && (
          <div className="hero-convergence__pill-row">
            {items.map((item) => (
              <span key={item.label} className="pill hero-convergence__pill hero-convergence__pill--static">
                <span className="hero-convergence__pill-inner" style={{ animationDelay: `${item.pulseDelay}s` }}>
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
