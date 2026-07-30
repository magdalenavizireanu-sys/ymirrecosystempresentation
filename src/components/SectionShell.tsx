import type { ReactNode } from 'react';

interface SectionShellProps {
  id: string;
  children: ReactNode;
  wide?: boolean;
  className?: string;
  eyebrow?: string;
}

/** Common full-viewport chapter wrapper: background wash, technical grid lines,
 *  and a centred content column. Every chapter in App.tsx renders inside one. */
export function SectionShell({ id, children, wide, className, eyebrow }: SectionShellProps) {
  return (
    <section id={id} className={`section-shell${className ? ` ${className}` : ''}`} aria-labelledby={`${id}-heading`}>
      <div className="section-bg" aria-hidden="true" />
      <div className="section-grid-lines" aria-hidden="true" />
      <div className={`section-inner${wide ? ' section-inner--wide' : ''}`}>
        {eyebrow && <p className="eyebrow" style={{ marginBottom: 'var(--space-sm)' }}>{eyebrow}</p>}
        {children}
      </div>
    </section>
  );
}

export function KickerTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="kicker-title">
      <span className="index">{index}</span>
      <span className="rule" aria-hidden="true" />
      <span className="kicker-title__label">{title}</span>
    </div>
  );
}
