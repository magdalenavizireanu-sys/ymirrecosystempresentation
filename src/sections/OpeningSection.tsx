import { SectionShell } from '../components/SectionShell';
import { HeroConvergence } from '../components/HeroConvergence';
import { Reveal } from '../components/Reveal';
import { brandTagline } from '../data/messaging';

export function OpeningSection() {
  return (
    <SectionShell id="opening" className="opening-section">
      <div className="opening-section__layout">
        <div className="opening-section__text">
          <Reveal>
            <p className="eyebrow">Ymirr™ ecosystem — interactive presentation</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 id="opening-heading" className="opening-section__title">
              <span className="gradient-text">{brandTagline}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="opening-section__sub">
              Ymirr™ is a governed operations ecosystem where workflows, AI agents and people operate under
              the same rules, permissions and audit trail — turning stated purpose into measurable,
              accountable outcomes.
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <button
              type="button"
              className="opening-section__cta"
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Begin the story ↓
            </button>
          </Reveal>
        </div>
        <div className="opening-section__visual">
          <HeroConvergence />
        </div>
      </div>
    </SectionShell>
  );
}
