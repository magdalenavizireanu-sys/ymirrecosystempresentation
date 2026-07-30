import { SectionShell, KickerTitle } from '../components/SectionShell';
import { JourneyFlow } from '../components/JourneyFlow';
import { Reveal } from '../components/Reveal';

export function JourneySection() {
  return (
    <SectionShell id="journey" wide>
      <KickerTitle index="03" title="The purpose journey" />
      <Reveal>
        <h2 id="journey-heading" className="section-title">
          Purpose → Intent → Governed Action → Knowledge → Outcome
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">
          Select a stage to see what happens, which modules and entities contribute, the business value it
          creates, and how information moves to the next stage. An outcome that falls short doesn’t close the
          file — it loops back into Intent.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <JourneyFlow />
      </Reveal>
    </SectionShell>
  );
}
