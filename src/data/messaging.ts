import type { MessagingPillar } from './types';

export const brandTagline = 'From thought to governed reality.';

/** Verbatim, brand strategy input report + Ymirr Brand Identity.pdf "Brand Purpose" page. */
export const oneSentenceDefinition =
  'Ymirr™ is a governed operations ecosystem that turns organisational purpose into coordinated, accountable outcomes by giving human participants and AI agents the same rules, permissions, and audit trail.';

export const positioningStatement =
  'Ymirr™ is not a tool for building software — it is a system for resolving purposes into governed outcomes. Built on a shared foundation of identity, secrets, environments and knowledge infrastructure, Ymirr™ connects human participants and AI agents under one set of rules, so every workflow, decision and action stays traceable to the purpose that demanded it — from first intent through to measured result.';

/** Verbatim from Ymirr Brand Identity.pdf, "Brand Purpose" page. */
export const brandPurposeQuote =
  'Let the organisations resolve real business purposes into outcomes by giving workflows, AI agents and people the same rules, permissions and accountability.';
export const missionQuote =
  'Replace fragmented automation and untraceable work with one governed system where every action, human or AI, answers to the same operational rules.';
export const visionQuote =
  'A future in which any enterprise purpose can be resolved through coordinated people, intelligent agents and scalable systems.';
export const brandPromiseQuote = 'Every purpose remains connected to the actions, decisions and outcomes that resolved it.';

/** Ecosystem manifesto — original writing, grounded in the narrative's principles (§16). */
export const manifesto = [
  { title: 'Purpose before activity.', body: 'Work that cannot name the purpose it serves is not yet ready to begin.' },
  { title: 'Intent before automation.', body: 'An agent — human or AI — should never act on an ambiguity it was never given the chance to resolve.' },
  { title: 'Governance before execution.', body: 'Permission is not a formality applied after the fact. It is the condition that makes an action legitimate in the first place.' },
  { title: 'Knowledge as infrastructure.', body: 'A decision that cannot be explained later was never really made — it was guessed, and then forgotten.' },
  { title: 'Outcomes as the only real measure.', body: 'A status is not a result. A task closed is not a purpose fulfilled. We measure what mattered, not what moved.' },
  { title: 'Shared accountability.', body: 'A human and an AI agent operating under the same rules are not a compromise. They are the whole point.' },
  { title: 'Technology in service of purpose.', body: 'We do not build systems that act for their own sake. We build systems that make sure action never forgets why it started.' },
];

/** Tone-of-voice pillars, verbatim labels from Ymirr Brand Identity.pdf "Tone of Voice" page. */
export const toneOfVoice = [
  { name: 'Purposeful', body: 'Communicates the reason behind every action.' },
  { name: 'Precise', body: 'Uses clear, structured and deliberate language.' },
  { name: 'Composed', body: 'Speaks with calm confidence, without hype.' },
  { name: 'Insightful', body: 'Connects purpose, intelligence, action and outcomes.' },
  { name: 'Accountable', body: 'Makes credible claims grounded in transparency and traceability.' },
  { name: 'Human', body: 'Keeps advanced technology accessible and centred on human responsibility.' },
];

export const closingStatement =
  'Ymirr™ is not a tool for building software. It is a system for resolving purposes into governed outcomes.';

export const messagingPillars: MessagingPillar[] = [
  {
    id: 'purpose-driven',
    name: 'Purpose-Driven Operations',
    coreIdea: 'Work must trace back to a stated purpose, always.',
    explanation:
      'Orlog makes it structurally impossible for work to exist without a Purpose node behind it; an outcome is only meaningful in relation to what it was meant to achieve.',
    evidence: 'Orlog’s Purpose → Decisions → Actions → Outcomes graph; "orphan work is rejected — everything anchors upstream."',
    headline: 'Every action should know why it exists.',
    supportingMessage:
      'Ymirr™ doesn’t track tasks. It tracks the purpose behind them — so nothing gets built, approved, or shipped without a reason someone can still explain a year later.',
  },
  {
    id: 'governed-intelligence',
    name: 'Governed Intelligence',
    coreIdea: 'AI agents operate under the same rules as human participants — no special lane, no reduced accountability.',
    explanation:
      'Syn resolves identity and permissions identically for humans and agents; Wyrd’s own copy explicitly rejects "AI-powered" framing in favour of earned, governed access.',
    evidence: '"The AI does not have a special lane. It earns its access the same way everyone else does."',
    headline: 'Your AI agents don’t get a shortcut.',
    supportingMessage:
      'Every agent in the Ymirr™ ecosystem is checked, authorized and audited the same way your employees are — because accountability shouldn’t depend on who, or what, is doing the work.',
  },
  {
    id: 'accountable-execution',
    name: 'Accountable Execution',
    coreIdea: 'Every action is authorized, attributed and tracked before it happens — not reviewed after the fact.',
    explanation: 'Bifrost requires a declared intent and an authorized actor before any action executes; nothing runs anonymously.',
    evidence: 'Bifrost’s intent model, pluggable authorizer and audit ports; Hel’s Merkle-anchored audit log.',
    headline: 'Control isn’t a review step. It’s the architecture.',
    supportingMessage:
      'In Ymirr™, an action that isn’t authorized simply doesn’t happen — so oversight isn’t something your team performs afterward, it’s something the system enforces the whole time.',
  },
  {
    id: 'organisational-memory',
    name: 'Organisational Memory',
    coreIdea: 'Every action leaves evidence that becomes reusable, explainable knowledge.',
    explanation: 'Muninn converts operational activity into readable changelog entries; Heimdall and Hermod keep specifications and documentation current instead of stale.',
    evidence: 'Muninn’s AI-enriched changelog pipeline; Heimdall’s live, queryable specification model.',
    headline: 'Nothing your team learns should disappear when they do.',
    supportingMessage:
      'Every decision, every change, every reason behind the work becomes part of the record automatically — so your organisation’s memory doesn’t depend on who’s still around to remember it.',
  },
  {
    id: 'connected-outcomes',
    name: 'Connected Outcomes',
    coreIdea: 'Results are explicitly measured against the purpose that demanded them — and a shortfall reopens the loop instead of closing the file.',
    explanation:
      'Orlog’s Outcomes stage links every Result back to its originating Purpose; a friction-cost model and structural bandaid-fix detection surface deviations rather than letting them pass.',
    evidence: '"An outcome that falls short spawns the next issue — the graph loops back into decisions instead of dead-ending in a status column."',
    headline: 'Done is not the same as achieved.',
    supportingMessage:
      'Ymirr™ doesn’t stop measuring when a task is marked complete. It checks the result against the purpose that started it — and if it fell short, that becomes the next thing worth solving.',
  },
];
