import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionShell, KickerTitle } from '../components/SectionShell';
import { ClosingAssembly } from '../components/ClosingAssembly';
import { Reveal } from '../components/Reveal';
import { closingStatement, manifesto } from '../data/messaging';
import { openQuestions } from '../data/openQuestions';

export function ClosingSection() {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <SectionShell id="closing" wide>
      <KickerTitle index="09" title="Closing" />
      <Reveal>
        <ClosingAssembly />
      </Reveal>
      <Reveal delay={0.2}>
        <h2 id="closing-heading" className="closing-statement">{closingStatement}</h2>
      </Reveal>

      <Reveal delay={0.3}>
        <ul className="manifesto-list">
          {manifesto.map((m) => (
            <li key={m.title}>
              <span className="manifesto-list__title">{m.title}</span>
              <span className="manifesto-list__body">{m.body}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.35}>
        <div className="closing-notes">
          <button
            type="button"
            className="closing-notes__toggle"
            aria-expanded={notesOpen}
            aria-controls="closing-notes-panel"
            onClick={() => setNotesOpen((v) => !v)}
          >
            <span aria-hidden="true">⚠</span> Notes on this presentation — what remains unverified
            <span className="closing-notes__chevron">{notesOpen ? '−' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {notesOpen && (
              <motion.div
                id="closing-notes-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <ul className="closing-notes__list">
                  {openQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </SectionShell>
  );
}
