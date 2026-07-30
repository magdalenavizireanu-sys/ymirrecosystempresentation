import { useId } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedConnectorProps {
  d: string;
  dashed?: boolean;
  active?: boolean;
  pulse?: boolean;
  colorVar?: string;
  strokeWidth?: number;
  duration?: number;
}

/**
 * A single SVG connector path used for module/stage relationships across the
 * journey flow and the ecosystem map. When `pulse` is true (and the user has
 * not requested reduced motion), a small dot travels the path on a loop —
 * this is the "purpose signal moving through the ecosystem" effect called
 * for in the brief.
 */
export function AnimatedConnector({
  d,
  dashed = false,
  active = true,
  pulse = false,
  colorVar = 'var(--color-primary-40)',
  strokeWidth = 1.5,
  duration = 3.4,
}: AnimatedConnectorProps) {
  const id = useId();
  const reduced = useReducedMotion();

  return (
    <g className="connector" opacity={active ? 1 : 0.35}>
      <path
        id={id}
        d={d}
        fill="none"
        stroke={colorVar}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '5 6' : undefined}
        strokeLinecap="round"
      />
      {pulse && !reduced && (
        <circle r={3.2} fill="var(--color-primary)">
          <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}

/**
 * A straight connector sized to exactly fill its own flex-grow slot between
 * two adjacent nodes in a chain/pipeline (the Problem section's tracking
 * chains, the Principle section's governance pipeline). It measures itself
 * via its own box, not the row's overall width, so it stays visually
 * aligned regardless of how wide the neighbouring chips happen to be —
 * unlike a single absolutely-positioned SVG spanning the whole row.
 */
export function ConnectorLink({
  pulse = false,
  dashed = false,
  colorVar = 'var(--color-primary-40)',
  strokeWidth = 2.2,
  className = '',
}: {
  pulse?: boolean;
  dashed?: boolean;
  colorVar?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <svg className={`connector-link ${className}`} viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
      <AnimatedConnector d="M 0 5 L 100 5" colorVar={colorVar} dashed={dashed} pulse={pulse && !reduced} strokeWidth={strokeWidth} />
    </svg>
  );
}
