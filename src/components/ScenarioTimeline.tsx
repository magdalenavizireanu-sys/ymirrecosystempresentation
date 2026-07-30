import { scenarioSteps } from '../data/scenario';
import { Reveal } from './Reveal';

export function ScenarioTimeline() {
  return (
    <ol className="scenario-timeline">
      {scenarioSteps.map((step, i) => (
        <Reveal as="li" key={step.stageId} delay={i * 0.08} className="scenario-timeline__item">
          <div className="scenario-timeline__marker">
            <span>{String(i + 1).padStart(2, '0')}</span>
          </div>
          <div className="scenario-timeline__content glass-panel">
            <p className="eyebrow">{step.title}</p>
            <p className="module-card__text">{step.body}</p>
            <div className="module-card__stages">
              {step.actors.map((a) => (
                <span key={a} className="tag-chip">{a}</span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
