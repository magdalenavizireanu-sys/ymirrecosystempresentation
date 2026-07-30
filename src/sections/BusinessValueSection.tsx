import { SectionShell, KickerTitle } from '../components/SectionShell';
import { BusinessValueGrid } from '../components/BusinessValueGrid';
import { Reveal } from '../components/Reveal';

export function BusinessValueSection() {
  return (
    <SectionShell id="business-value" wide>
      <KickerTitle index="08" title="Business value" />
      <Reveal>
        <h2 id="business-value-heading" className="section-title">
          Done is not the same as achieved.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">
          Each benefit below is a mechanism, not a slogan — select a tile to see which modules produce it, and
          how.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <BusinessValueGrid />
      </Reveal>
    </SectionShell>
  );
}
