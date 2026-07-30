import { useMemo, useState } from 'react';
import { SectionShell, KickerTitle } from '../components/SectionShell';
import { ModuleCard } from '../components/ModuleCard';
import { Reveal } from '../components/Reveal';
import { modules } from '../data/modules';
import type { JourneyStageId } from '../data/types';

const filters: { id: JourneyStageId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'governed-action', label: 'Governed Action' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'intent', label: 'Intent' },
  { id: 'outcome', label: 'Outcome' },
];

export function CoreModulesSection() {
  const [filter, setFilter] = useState<JourneyStageId | 'all'>('all');

  const visible = useMemo(
    () => (filter === 'all' ? modules : modules.filter((m) => m.journeyStages.includes(filter))),
    [filter],
  );

  return (
    <SectionShell id="core-modules" wide>
      <KickerTitle index="05" title="Core ecosystem modules" />
      <Reveal>
        <h2 id="core-modules-heading" className="section-title">
          The operational vertebrae of the ecosystem.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="section-lead">
          Each module solves one problem and connects to the rest through Bifrost, Syn and Hel. Icons shown are
          the ecosystem’s official 3D marks where one exists in the brand identity system.
        </p>
      </Reveal>

      <div className="filter-row" role="tablist" aria-label="Filter modules by journey stage">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`filter-chip${filter === f.id ? ' is-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* A wrapping flex row, not CSS grid: grid's justify-content only
          centres leftover space at the container level, not per row, so a
          partial last row (14 modules ÷ 4 columns leaves 2) would hug the
          left edge with a bare gap on the right. Flexbox's justify-content
          re-centres on every wrapped line independently, so that last row
          reads as deliberate regardless of how many items the active
          filter leaves visible. */}
      <div className="module-grid">
        {visible.map((m, i) => (
          <Reveal key={m.id} delay={Math.min(i, 8) * 0.04} className="module-grid__item">
            <ModuleCard module={m} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
