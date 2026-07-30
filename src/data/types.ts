// Shared content types for the Ymirr™ ecosystem presentation.
// Every field populated in src/data/*.ts is sourced from
// ymirr-ecosystem-brand-narrative.md and/or "Ymirr Brand Identity.pdf".
// See README.md "Where the content comes from" for the citation map.

export type Tier = 'foundation' | 'core' | 'product';

export type JourneyStageId = 'purpose' | 'intent' | 'governed-action' | 'knowledge' | 'outcome';

export interface EcosystemModule {
  id: string;
  name: string;
  /** Canonical one-line role, verbatim from the Brand Identity PDF's
   *  "Ymirr Ecosystem Modules" page, where one exists. */
  officialTagline?: string;
  tier: Tier;
  /** true if this module has an official 3D icon in the brand identity PDF */
  hasOfficialIcon: boolean;
  icon?: string;
  shortRole: string;
  problem: string;
  contribution: string;
  journeyStages: JourneyStageId[];
  connectsTo: string[];
  /** true when the record is thin / unresolved and should be flagged in the UI */
  needsValidation?: boolean;
  validationNote?: string;
}

export interface ProductEntity {
  id: string;
  name: string;
  officialTagline: string;
  icon: string;
  description: string;
  independenceReason: string;
  journeyStages: JourneyStageId[];
  contribution: string;
  tensionNote?: string;
}

export interface JourneyStage {
  id: JourneyStageId;
  index: number;
  name: string;
  brandLabel?: string;
  summary: string;
  detail: string;
  moduleIds: string[];
  productEntityIds: string[];
  businessValue: string;
  handoff: string;
}

export interface ComparisonRow {
  ticketConcept: string;
  dimension: string;
  purposeConcept: string;
}

export interface BusinessValueItem {
  id: string;
  /** The business result — what changes once the mechanism is in place. */
  title: string;
  /** The current-state pain this result is the answer to. */
  problem: string;
  /** How the ecosystem actually produces the result. */
  mechanism: string;
  /** Modules/entities named in `mechanism`, for rendering as linked chips. */
  moduleIds: string[];
}

export interface ScenarioStep {
  stageId: JourneyStageId;
  title: string;
  body: string;
  actors: string[];
}

export interface MessagingPillar {
  id: string;
  name: string;
  coreIdea: string;
  explanation: string;
  evidence: string;
  headline: string;
  supportingMessage: string;
}
