import { useCallback, useEffect, useRef, useState } from 'react';
import type { SectionMeta } from '../hooks/useActiveSection';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Logo } from './Logo';

interface TopNavProps {
  sections: SectionMeta[];
  activeId: string;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Two explicit, always-visible options rather than one ambiguous toggle
 *  button — clicking a mode always selects it directly. */
function ModeSwitch({ className = '' }: { className?: string }) {
  const { mode, setMode } = usePresentationMode();
  return (
    <div className={`mode-switch ${className}`} role="group" aria-label="Presentation mode">
      <button
        type="button"
        className={`mode-switch__option${mode === 'guided' ? ' is-active' : ''}`}
        aria-pressed={mode === 'guided'}
        onClick={() => setMode('guided')}
      >
        Guided story
      </button>
      <button
        type="button"
        className={`mode-switch__option${mode === 'explore' ? ' is-active' : ''}`}
        aria-pressed={mode === 'explore'}
        onClick={() => setMode('explore')}
      >
        Free exploration
      </button>
    </div>
  );
}

/**
 * The single fixed top navbar: logo, a horizontal chapter row (desktop/
 * tablet) or a compact current-chapter bar (mobile), the guided/explore
 * mode control, and prev/next — replacing the separate `.app-header` plus
 * the old right-side vertical rail, which had no way to avoid overlapping
 * page content at in-between viewport widths.
 */
export function TopNav({ sections, activeId }: TopNavProps) {
  const reduced = useReducedMotion();
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));
  const current = sections[activeIndex];

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const registerItem = (id: string) => (el: HTMLLIElement | null) => {
    if (el) itemRefs.current.set(id, el);
    else itemRefs.current.delete(id);
  };

  const goTo = useCallback(
    (delta: number) => {
      const next = sections[activeIndex + delta];
      if (next) scrollToSection(next.id);
    },
    [activeIndex, sections],
  );

  // Transparent-over-hero at the top of the page; once the user actually
  // scrolls, the navbar gets a solid tint + blur so text stays readable
  // over whatever section is currently underneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keeps the active chapter visible in the horizontal row on tablet widths,
  // where the row can overflow and scroll horizontally.
  useEffect(() => {
    const el = itemRefs.current.get(activeId);
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  }, [activeId, reduced]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(-1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <header className={`top-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="top-nav__inner">
        <div className="top-nav__logo">
          <Logo size={30} />
        </div>

        <nav className="top-nav__chapters" aria-label="Presentation chapters">
          <ol>
            {sections.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={s.id} ref={registerItem(s.id)}>
                  <button
                    type="button"
                    className={`top-nav__chapter${isActive ? ' is-active' : ''}`}
                    onClick={() => scrollToSection(s.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="top-nav__chapter-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="top-nav__chapter-title">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="top-nav__end">
          <div className="top-nav__arrows">
            <button type="button" onClick={() => goTo(-1)} disabled={activeIndex === 0} aria-label="Previous section">
              ↑
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={activeIndex === sections.length - 1}
              aria-label="Next section"
            >
              ↓
            </button>
          </div>
          <ModeSwitch className="mode-switch--nav" />
        </div>

        {/* ---------- Mobile: compact current-chapter bar ---------- */}
        <div className="top-nav__mobile-row">
          <button
            type="button"
            className="top-nav__mobile-nav"
            onClick={() => goTo(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous section"
          >
            ↑
          </button>

          <button
            type="button"
            className="top-nav__mobile-current"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="top-nav-mobile-menu"
          >
            <span className="top-nav__mobile-current-text">
              <span className="top-nav__mobile-index">{String(activeIndex + 1).padStart(2, '0')}</span>
              {current?.label}
            </span>
            <span className="top-nav__mobile-count">
              {activeIndex + 1} / {sections.length}
            </span>
            <span className="top-nav__mobile-fill-track" aria-hidden="true">
              <span
                className="top-nav__mobile-fill"
                style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
              />
            </span>
          </button>

          <button
            type="button"
            className="top-nav__mobile-nav"
            onClick={() => goTo(1)}
            disabled={activeIndex === sections.length - 1}
            aria-label="Next section"
          >
            ↓
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="top-nav__mobile-backdrop"
            aria-label="Close chapter menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="top-nav__mobile-menu" id="top-nav-mobile-menu" role="menu">
            <div className="top-nav__mobile-menu-header">
              <span>Chapters</span>
              <ModeSwitch className="mode-switch--mobile" />
            </div>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={`top-nav__mobile-menu-item${i === activeIndex ? ' is-active' : ''}`}
                    onClick={() => {
                      scrollToSection(s.id);
                      setMenuOpen(false);
                    }}
                    aria-current={i === activeIndex ? 'true' : undefined}
                  >
                    <span className="top-nav__mobile-index">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </header>
  );
}
