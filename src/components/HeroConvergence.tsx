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
 *  page 1 ("From many inputs to one resolved outcome" / page 2 word cloud). */
const ORBIT_LABELS = ['Purpose', 'Knowledge', 'AI Agents', 'Orchestration', 'Outcomes', 'Resolution'];

// Evenly distributed around the orbit — a spider-web/governed-system feel
// reads as deliberate structure, not decoration, and even spacing is also
// what keeps every label's nearest neighbour the same distance away at any
// field size. Starts at 12 o'clock (-90°) and goes clockwise in 60° steps.
function evenPhase(i: number, count: number) {
  return (i / count) * Math.PI * 2 - Math.PI / 2;
}

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
// Verified live at a standard 1280px desktop viewport: the field's real
// height there is exactly 420px (its own CSS min-height), so this must sit
// below that or the orbit would never actually run on an ordinary desktop.
const MIN_ORBIT_FIELD_DIMENSION = 400;
// The second, smaller concentric guide ring, as a fraction of the main
// orbit — purely decorative depth, doesn't track anything of its own.
const INNER_GUIDE_SCALE = 0.62;

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
      ORBIT_LABELS.map((label, i) => {
        const phase = evenPhase(i, ORBIT_LABELS.length);
        return {
          label,
          phase,
          // Static fallback position (reduced motion): the same even angle,
          // just never animated — so reduced-motion users still see a
          // properly balanced, non-overlapping arrangement.
          top: 50 + ORBIT_RY_PCT * Math.sin(phase),
          left: 50 + ORBIT_RX_PCT * Math.cos(phase),
          x: motionValue(0),
          y: motionValue(0),
          pulseDelay: i * 0.9 + (i % 2) * 0.45,
        };
      }),
    [],
  );

  // The orbit's own guide ring — a lightly-visible path, not a decoration —
  // grows and shrinks in lockstep with the labels themselves (same rx/ry
  // each frame), so it always shows the path they're actually tracing. A
  // second, smaller concentric ring (fixed proportion of the first) adds
  // the layered "spider-web" depth without tracking anything of its own.
  const guide = useMemo(
    () => ({ width: motionValue(0), height: motionValue(0), innerWidth: motionValue(0), innerHeight: motionValue(0) }),
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

    guide.width.set(rx * 2);
    guide.height.set(ry * 2);
    guide.innerWidth.set(rx * 2 * INNER_GUIDE_SCALE);
    guide.innerHeight.set(ry * 2 * INNER_GUIDE_SCALE);

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
        {/* Spider-web guide: a lightly-visible ring tracing the exact path
            the labels orbit on — structure you can see, not just infer. */}
        {!simplified && !reduced && (
          <>
            <motion.div
              className="hero-convergence__guide-ring hero-convergence__guide-ring--inner"
              style={{ width: guide.innerWidth, height: guide.innerHeight }}
              aria-hidden="true"
            />
            <motion.div
              className="hero-convergence__guide-ring"
              style={{ width: guide.width, height: guide.height }}
              aria-hidden="true"
            />
          </>
        )}

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

        {/* Two elements, deliberately: the outer motion.div owns the
            entrance opacity/scale animation, the inner plain div owns the
            static translate(-50%,-50%) centering. Framer-motion writes its
            own `transform` string the moment it animates anything on an
            element (even just scale) — if that same element also carried a
            CSS-class transform:translate(-50%,-50%), framer's write would
            silently clobber it, leaving the box's top-left corner (not its
            centre) pinned to the field's 50%/50% point. That was the actual
            cause of the model reading as displaced toward the lower-right:
            not the GLTF/bounding-box math, but this box never being
            centred on screen in the first place. Same reasoning already
            applied to the orbiting pills below. */}
        <motion.div
          className="hero-convergence__core-anchor"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.001 : 0.9, delay: reduced ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-convergence__core" ref={coreRef}>
            <div className="hero-convergence__core-glow" aria-hidden="true" />
            <Suspense fallback={<img src="/brand/ymirr-mark.svg" alt="Ymirr™" className="hero-symbol3d__fallback-img" />}>
              <HeroSymbol3D />
            </Suspense>
          </div>
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
