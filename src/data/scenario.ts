import type { ScenarioStep } from './types';

/**
 * Illustrative-only business scenario. Source: ymirr-ecosystem-brand-narrative.md §11,
 * explicitly marked there as "Interpretation — illustrative, not a cited case study,"
 * built from Wyrd's verified first domain (insurance operations for construction
 * companies). This is NOT a documented customer story.
 */
export const scenarioIntro =
  'A construction company using Wyrd needs to renew a commercial insurance policy before it lapses. This walk-through is constructed from verified module responsibilities to make the framework concrete — it is not a documented customer case.';

export const scenarioPurpose =
  '"Policy X renewed before expiry, with no coverage gap and premium within approved budget." Checkable criteria are attached.';

export const scenarioSteps: ScenarioStep[] = [
  {
    stageId: 'purpose',
    title: 'Purpose',
    body: 'The company states the desired end-state in Orlog: renew the policy before expiry, no coverage gap, premium within budget. Checkable criteria are attached from the start.',
    actors: ['Orlog'],
  },
  {
    stageId: 'intent',
    title: 'Intent',
    body: 'The renewal is debated as an Orlog Decision — pricing options, coverage changes and finance objections are recorded as Positions rather than resolved off the record. Bifrost declares the resulting plan as an intent: renew policy X, within budget Y, requiring finance approval.',
    actors: ['Orlog', 'Bifrost'],
  },
  {
    stageId: 'governed-action',
    title: 'Governed action',
    body: 'Wyrd’s policy-lifecycle workflow executes the renewal — request → offer → approval → payment — with its AI agent handling drafting and routine steps. Every step is a Bifrost-routed action, authorized by Syn (the finance approver’s role checked the same way the AI agent’s execution role is checked), running inside an Idavoll-provisioned environment, with credentials supplied by Hel.',
    actors: ['Wyrd', 'Bifrost', 'Syn', 'Idavoll', 'Hel'],
  },
  {
    stageId: 'knowledge',
    title: 'Knowledge',
    body: 'Muninn logs the renewal as a changelog entry; Heimdall’s specification for Wyrd’s policy module stays current if any business rule changed; the Debate and Position from the Intent stage remain attached to the Purpose, explaining why the renewal terms were chosen.',
    actors: ['Muninn', 'Heimdall'],
  },
  {
    stageId: 'outcome',
    title: 'Outcome',
    body: 'Orlog links the Result — policy renewed, effective date confirmed, premium within budget — back to the original Purpose. If the premium exceeded budget or coverage had a gap, that deviation is surfaced immediately rather than discovered at the next audit, and it becomes the next Issue rather than a closed, unexamined ticket.',
    actors: ['Orlog'],
  },
];
