import { SectionShell, KickerTitle } from '../components/SectionShell';
import { ScenarioTimeline } from '../components/ScenarioTimeline';
import { Reveal } from '../components/Reveal';
import { scenarioIntro, scenarioPurpose } from '../data/scenario';

export function ScenarioSection() {
  return (
    <SectionShell id="scenario" wide>
      <KickerTitle index="07" title="Real business scenario" />
      <Reveal>
        <h2 id="scenario-heading" className="section-title">
          A policy renewal, end to end.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="scenario-banner">
          <span aria-hidden="true">⚠</span> Illustrative scenario — not a verified customer case. Constructed
          from Wyrd’s documented first domain to make the framework concrete.
        </div>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="section-lead">{scenarioIntro}</p>
      </Reveal>
      <Reveal delay={0.22}>
        <div className="glass-panel scenario-purpose">
          <p className="module-card__label">Purpose</p>
          <p className="module-card__text">{scenarioPurpose}</p>
        </div>
      </Reveal>
      <ScenarioTimeline />
    </SectionShell>
  );
}
