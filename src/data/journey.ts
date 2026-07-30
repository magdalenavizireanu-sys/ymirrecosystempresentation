import type { JourneyStage } from './types';

/**
 * The five-stage Purpose → Intent → Governed Action → Knowledge → Outcome
 * journey. Sourced from ymirr-ecosystem-brand-narrative.md §4, §9 and §10.
 */
export const journeyStages: JourneyStage[] = [
  {
    id: 'purpose',
    index: 1,
    name: 'Purpose',
    brandLabel: 'Purpose',
    summary: 'A business states what it wants to achieve, and why it matters, in a form the ecosystem holds onto.',
    detail:
      'In Orlog’s model, a Purpose is "the team’s desired end-state, with checkable criteria for what ‘achieved’ actually means — the only node allowed to stand on its own." Orlog is the entity responsible for maintaining the meaning of a purpose over time; nothing downstream is permitted to exist without tracing back to one.',
    moduleIds: [],
    productEntityIds: ['orlog'],
    businessValue: 'A durable, checkable definition of success that survives beyond any one ticket or meeting.',
    handoff: 'The purpose is carried forward as the anchor every later Decision, Action and Result must trace back to.',
  },
  {
    id: 'intent',
    index: 2,
    name: 'Intent',
    brandLabel: 'Resolution',
    summary: 'The purpose is translated into a structured, actionable intent — debated openly, not decided quietly.',
    detail:
      'Orlog’s Decisions stage runs "Issue → Debate → Position." Whatever obstructs the purpose is debated in the open, and every stance and dissent is preserved rather than overwritten by the next comment. Bifrost is where a Decision becomes a technically declared intent that both human-facing tools and AI agents can act on identically, with Syn defining who is allowed to act on it.',
    moduleIds: ['bifrost', 'syn'],
    productEntityIds: ['orlog'],
    businessValue: 'Reduced ambiguity — disagreement becomes a recorded asset instead of a liability nobody can reconstruct later.',
    handoff: 'A declared, authorized intent is handed to the modules and entities that carry out Governed Action.',
  },
  {
    id: 'governed-action',
    index: 3,
    name: 'Governed Action',
    brandLabel: 'Orchestration',
    summary: 'The intent becomes coordinated work: humans and AI agents act inside the same permission system, every action authorized and attributed.',
    detail:
      'The agreed plan executes — human or AI agent, side by side — inside a provisioned, attributed environment (Idavoll, built on Völund). Permissions are applied and decisions authorized through Syn; every action is routed and tracked through Bifrost; secrets required along the way come from Hel. Wyrd typically carries out the business-level work, with its AI agents held to the same authorization checks as any human user.',
    moduleIds: ['bifrost', 'syn', 'hel', 'idavoll', 'niu', 'nidavellir', 'claude-engine', 'asgard', 'volund'],
    productEntityIds: ['wyrd', 'huginn'],
    businessValue: 'Coordinated execution with no uncontrolled or unattributed action — speed without losing control.',
    handoff: 'Every action leaves evidence behind, which becomes the raw material for the Knowledge stage.',
  },
  {
    id: 'knowledge',
    index: 4,
    name: 'Knowledge',
    brandLabel: 'Knowledge',
    summary: 'Every action generates evidence that becomes reusable organizational memory — explainable, not just logged.',
    detail:
      'Muninn turns commits, merge requests and operational events into readable, attributed changelog entries. Heimdall keeps a live, queryable specification current as the system changes. Hermod keeps human-readable documentation in sync with the same underlying system. Decisions remain explainable because Orlog never discarded the Debate that produced them — and Muninn is a planned evidence feed directly back into Orlog.',
    moduleIds: ['muninn', 'heimdall', 'hermod', 'ysdr', 'brainstormer-aggregator'],
    productEntityIds: [],
    businessValue: 'Institutional memory that outlives individual employees, chats or closed tickets.',
    handoff: 'Accumulated knowledge becomes available to the next Decision the moment an Outcome falls short.',
  },
  {
    id: 'outcome',
    index: 5,
    name: 'Outcome',
    brandLabel: 'Outcomes',
    summary: 'The result is measured against the original purpose — a shortfall reopens the loop instead of closing a ticket.',
    detail:
      'Orlog’s Outcomes stage closes the loop: "Result → fulfills Purpose." The tangible output is explicitly linked back to the purpose it was meant to serve. A friction-cost model (people blocked × time open × purpose weight) and structural bandaid-fix detection surface deviations rather than letting a quick patch pass as a real fix. An outcome that falls short spawns the next Issue — the graph loops back into Decisions instead of dead-ending in a status column.',
    moduleIds: ['muninn', 'bifrost'],
    productEntityIds: ['orlog', 'skuld'],
    businessValue: 'A measurable, closed-loop connection between what was intended and what actually happened.',
    handoff: 'A shortfall becomes the next Issue, feeding back into Intent with everything already learned still attached.',
  },
];

export const getStageById = (id: string) => journeyStages.find((s) => s.id === id);
