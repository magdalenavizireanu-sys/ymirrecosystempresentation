import { useCallback, useEffect, useState } from 'react';
import type { SectionMeta } from '../hooks/useActiveSection';
import { usePresentationMode } from '../hooks/usePresentationMode';

interface ProgressRailProps {
  sections: SectionMeta[];
  activeId: string;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Two explicit options rather than one ambiguous toggle button — clicking
 *  a mode always selects it directly, so the current state never depends on
 *  remembering what the label meant last time. */
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

/** Persistent chapter navigation: a numbered chapter rail (desktop) or a
 *  sticky top bar with an expandable chapter menu (mobile/tablet), a
 *  guided⇄explore toggle, and Prev/Next controls. Fully keyboard-operable —
 *  every control is a real <button>. */
export function ProgressRail({ sections, activeId }: ProgressRailProps) {
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = useCallback(
    (delta: number) => {
      const next = sections[activeIndex + delta];
      if (next) scrollToSection(next.id);
    },
    [activeIndex, sections],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      // Text-entry contexts only — this presentation has no other widget
      // that uses arrow keys for its own purpose, so it's safe (and expected)
      // for Up/Down to move between chapters even while a rail button itself
      // has focus, not just when focus is elsewhere on the page.
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

  const current = sections[activeIndex];

  return (
    <nav className="progress-rail" aria-label="Presentation chapters">
      {/* ---------- Desktop: vertical chapter rail ---------- */}
      <div className="progress-rail__track" aria-hidden="true">
        <div
          className="progress-rail__track-fill"
          style={{ height: `${(activeIndex / Math.max(1, sections.length - 1)) * 100}%` }}
        />
      </div>
      <ol className="progress-rail__list">
        {sections.map((s, i) => {
          const isActive = i === activeIndex;
          return (
            <li key={s.id}>
              <button
                type="button"
                className={`progress-rail__item${isActive ? ' is-active' : ''}`}
                onClick={() => scrollToSection(s.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="progress-rail__item-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="progress-rail__item-label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="progress-rail__controls">
        <ModeSwitch className="mode-switch--rail" />
        <div className="progress-rail__arrows">
          <button type="button" onClick={() => goTo(-1)} disabled={activeIndex === 0} aria-label="Previous chapter">
            ↑
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            disabled={activeIndex === sections.length - 1}
            aria-label="Next chapter"
          >
            ↓
          </button>
        </div>
      </div>

      {/* ---------- Mobile/tablet: sticky top bar + expandable menu ---------- */}
      <div className="progress-rail__mobile-bar">
        <button
          type="button"
          className="progress-rail__mobile-nav"
          onClick={() => goTo(-1)}
          disabled={activeIndex === 0}
          aria-label="Previous chapter"
        >
          ↑
        </button>

        <button
          type="button"
          className="progress-rail__mobile-current"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="progress-rail-mobile-menu"
        >
          <span className="progress-rail__mobile-current-text">
            <span className="progress-rail__mobile-index">{String(activeIndex + 1).padStart(2, '0')}</span>
            {current?.label}
          </span>
          <span className="progress-rail__mobile-count">
            {activeIndex + 1} / {sections.length}
          </span>
          <span className="progress-rail__mobile-fill-track" aria-hidden="true">
            <span
              className="progress-rail__mobile-fill"
              style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
            />
          </span>
        </button>

        <button
          type="button"
          className="progress-rail__mobile-nav"
          onClick={() => goTo(1)}
          disabled={activeIndex === sections.length - 1}
          aria-label="Next chapter"
        >
          ↓
        </button>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="progress-rail__mobile-backdrop"
            aria-label="Close chapter menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="progress-rail__mobile-menu" id="progress-rail-mobile-menu" role="menu">
            <div className="progress-rail__mobile-menu-header">
              <span>Chapters</span>
              <ModeSwitch className="mode-switch--mobile" />
            </div>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={`progress-rail__mobile-menu-item${i === activeIndex ? ' is-active' : ''}`}
                    onClick={() => {
                      scrollToSection(s.id);
                      setMenuOpen(false);
                    }}
                    aria-current={i === activeIndex ? 'true' : undefined}
                  >
                    <span className="progress-rail__mobile-index">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </nav>
  );
}
