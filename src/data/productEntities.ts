import type { ProductEntity } from './types';

/**
 * The four independent Ymirr™ product entities (Ymirr-tier).
 * Official taglines and icons transcribed from Ymirr Brand Identity.pdf.
 * Descriptions summarised from ymirr-ecosystem-brand-narrative.md §7.
 */
export const productEntities: ProductEntity[] = [
  {
    id: 'orlog',
    name: 'Orlog',
    officialTagline: 'Purpose Management',
    icon: '/icons/orlog.png',
    description:
      'The purpose graph — the entity most directly responsible for the Purpose and Intent stages of the journey. Replaces ticket logs with Purpose → Decisions → Actions → Outcomes, where every node traces back to the intent that demanded it.',
    independenceReason:
      'Orlog’s own documentation expresses ambition to be "a commercial product from day one," distinct from being simply a Ymirr™ feature.',
    journeyStages: ['purpose', 'intent', 'outcome'],
    contribution:
      'Owns the Purpose node, runs the Decisions debate (Issue → Debate → Position), and closes the loop by linking every Result back to the Purpose it was meant to serve.',
  },
  {
    id: 'wyrd',
    name: 'Wyrd',
    officialTagline: 'Business Operations Platform',
    icon: '/icons/wyrd.png',
    description:
      'The ecosystem’s central agentic point and core business-execution platform. Insurance operations for construction companies is its first fully implemented domain; its shared AI agents and Mastra workflows are consumed by the rest of the ecosystem.',
    independenceReason:
      'Runs real, named business operations (not infrastructure), with its own explicit stance on what it refuses to be: "not a chatbot, not a copilot, not AI-powered anything."',
    journeyStages: ['governed-action'],
    contribution:
      'Executes the governed action a purpose demands — its AI agents earn access through the exact same permission system as any human user, checked against Syn on every action.',
    tensionNote:
      'Narrative source material frames Wyrd as "central agentic point" / business execution; the brand identity system labels it "Business Operations Platform" — both are used together here.',
  },
  {
    id: 'huginn',
    name: 'Huginn',
    officialTagline: 'Platform Control Plane',
    icon: '/icons/huginn.png',
    description:
      'The intended seat of platform-wide governance and administration. Its control-plane product is architecture-agreed — every control action a Bifrost admin intent, authorized by Syn — but not yet built.',
    independenceReason:
      'Represents the intelligence and oversight responsibility in the ecosystem’s design, even ahead of its own construction.',
    journeyStages: ['governed-action'],
    contribution:
      'Today, hosts the platform-level brainstorming, documentation and planning surfaces for the whole ecosystem.',
    tensionNote: 'Planned — architecture agreed, not yet built. Shown here as a designed, not a delivered, capability.',
  },
  {
    id: 'skuld',
    name: 'Skuld',
    officialTagline: 'Intelligent Application Layer',
    icon: '/icons/skuld.png',
    description:
      'A causality-driven project timeline: aggregates read-only data from external PM, document and calendar tools, lets humans log the decisions behind changes, and uses AI plus a rules engine to reconcile it — surfacing conflicts rather than silently resolving them.',
    independenceReason:
      'Represents future-state evaluation and cross-tool causal reasoning, with its own independently documented authentication approach.',
    journeyStages: ['outcome'],
    contribution: 'Surfaces conflicts between what different tools and people believe happened, rather than resolving them silently.',
    tensionNote:
      'Skuld’s own blueprint states it uses WorkOS AuthKit directly and is "completely independent from all other monorepo apps," while Syn’s docs list Skuld as a service it serves. This is unresolved in the source material, not a settled fact.',
  },
];

export const getProductEntityById = (id: string): ProductEntity | undefined =>
  productEntities.find((p) => p.id === id);
