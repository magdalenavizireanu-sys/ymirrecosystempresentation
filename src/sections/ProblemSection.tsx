import { SectionShell, KickerTitle } from '../components/SectionShell';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { Reveal } from '../components/Reveal';

export function ProblemSection() {
  return (
    <SectionShell id="problem" wide>
      <KickerTitle index="01" title="The problem" />
      <Reveal>
        <h2 id="problem-heading" className="section-title">
          Ticket boards record activity.<br /> They lose the reason work exists.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">
          Traditional project tools track tasks, owners, deadlines and statuses. That tells you what moved.
          It rarely tells you why the work existed, whether it served its goal, or what to do when it didn’t.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <ComparisonPanel />
      </Reveal>
    </SectionShell>
  );
}
