import { PresentationModeProvider } from './hooks/usePresentationMode';
import { useActiveSection, type SectionMeta } from './hooks/useActiveSection';
import { TopNav } from './components/TopNav';

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
  const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label ?? '';

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      {/* Screen-reader-only announcer: TopNav's own current-chapter text is
          only visible on the mobile layout, but the chapter change should
          be announced at every viewport width. */}
      <span className="visually-hidden" aria-live="polite">{activeLabel}</span>

      <TopNav sections={SECTIONS} activeId={activeId} />

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
