import { SectionShell, KickerTitle } from '../components/SectionShell';
import { EcosystemMap } from '../components/EcosystemMap';
import { Reveal } from '../components/Reveal';

export function ArchitectureSection() {
  return (
    <SectionShell id="architecture" wide>
      <KickerTitle index="04" title="Ecosystem architecture" />
      <Reveal>
        <h2 id="architecture-heading" className="section-title">
          Three levels. One governed system.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">
          The Völund Foundation is the compute substrate everything runs on; the core ecosystem provides
          identity, secrets, deployment, environments, tooling and knowledge; the product entities are what a
          customer actually buys or runs. Hover or select any node to trace its documented connections, or
          filter by purpose-journey stage to see which layer supports each part of the story.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <EcosystemMap />
      </Reveal>
    </SectionShell>
  );
}
