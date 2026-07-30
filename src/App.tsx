import { useMemo } from 'react';
import { PresentationModeProvider } from './hooks/usePresentationMode';
import { useActiveSection, type SectionMeta } from './hooks/useActiveSection';
import { ProgressRail } from './components/ProgressRail';
import { Logo } from './components/Logo';

import { OpeningSection } from './sections/OpeningSection';
import { ProblemSection } from './sections/ProblemSection';
import { PrincipleSection } from './sections/PrincipleSection';
import { JourneySection } from './sections/JourneySection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { CoreModulesSection } from './sections/CoreModulesSection';
import { ProductEntitiesSection } from './sections/ProductEntitiesSection';
import { ScenarioSection } from './sections/ScenarioSection';
import { BusinessValueSection } from './sections/BusinessValueSection';
import { ClosingSection } from './sections/ClosingSection';

const SECTIONS: SectionMeta[] = [
  { id: 'opening', label: 'Opening' },
  { id: 'problem', label: 'The problem' },
  { id: 'principle', label: 'Ymirr™ principle' },
  { id: 'journey', label: 'Purpose journey' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'core-modules', label: 'Core modules' },
  { id: 'product-entities', label: 'Product entities' },
  { id: 'scenario', label: 'Business scenario' },
  { id: 'business-value', label: 'Business value' },
  { id: 'closing', label: 'Closing' },
];

function AppShell() {
  const activeId = useActiveSection(SECTIONS);
  const activeLabel = useMemo(() => SECTIONS.find((s) => s.id === activeId)?.label ?? '', [activeId]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <header className="app-header">
        <Logo size={34} />
        <span className="app-header__chapter" aria-live="polite">{activeLabel}</span>
      </header>

      <ProgressRail sections={SECTIONS} activeId={activeId} />

      <main id="main">
        <OpeningSection />
        <ProblemSection />
        <PrincipleSection />
        <JourneySection />
        <ArchitectureSection />
        <CoreModulesSection />
        <ProductEntitiesSection />
        <ScenarioSection />
        <BusinessValueSection />
        <ClosingSection />
      </main>
    </>
  );
}

function App() {
  return (
    <PresentationModeProvider>
      <AppShell />
    </PresentationModeProvider>
  );
}

export default App;
