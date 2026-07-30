import { SectionShell, KickerTitle } from '../components/SectionShell';
import { ProductEntityCard } from '../components/ProductEntityCard';
import { Reveal } from '../components/Reveal';
import { productEntities } from '../data/productEntities';

export function ProductEntitiesSection() {
  return (
    <SectionShell id="product-entities" wide>
      <KickerTitle index="06" title="Ymirr™ product entities" />
      <Reveal>
        <h2 id="product-entities-heading" className="section-title">
          Independent. Connected. Built on the same governance.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">
          Huginn, Orlog, Wyrd and Skuld are not features of one another — each is an independent entity with
          its own reason to exist, running on the shared ecosystem beneath them.
        </p>
      </Reveal>

      <div className="entity-grid">
        {productEntities.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.08}>
            <ProductEntityCard entity={e} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
