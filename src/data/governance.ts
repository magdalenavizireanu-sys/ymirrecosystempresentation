export interface GovernanceNode {
  id: string;
  name: string;
  detail: string;
}

/** The three actors the Ymirr principle treats identically — same entry
 *  point into the governed system, same rules from there on.
 *  Source: messaging.ts `messagingPillars` ("governed-intelligence",
 *  "accountable-execution") and `manifesto` ("Shared accountability"). */
export const governanceInputs: GovernanceNode[] = [
  {
    id: 'human',
    name: 'Human',
    detail: 'Operates under the same identity, permission and audit model as every other participant — no separate track.',
  },
  {
    id: 'ai-agent',
    name: 'AI Agent',
    detail: 'Earns access the same way a person does. No special lane, no reduced accountability.',
  },
  {
    id: 'workflow',
    name: 'Workflow',
    detail: 'Every automated step still needs a declared intent and an authorised actor before it can run.',
  },
];

/** The shared pipeline every actor above passes through — one set of rules,
 *  not one per actor type.
 *  Source: messaging.ts `messagingPillars` ("governed-intelligence" for
 *  Identity/Permissions, "accountable-execution" for Authorisation/Governed
 *  Action/Audit), `manifesto` ("Governance before execution", "Shared
 *  accountability"), and `toneOfVoice` ("Accountable"). */
export const governanceStages: GovernanceNode[] = [
  {
    id: 'identity',
    name: 'Identity',
    detail: 'Resolved the same way regardless of whether the actor is a person or an agent.',
  },
  {
    id: 'permissions',
    name: 'Permissions',
    detail: 'The same permission model applies to every identity type — nothing is granted by default.',
  },
  {
    id: 'authorisation',
    name: 'Authorisation',
    detail: 'A declared intent and an authorised actor are required before any action executes.',
  },
  {
    id: 'governed-action',
    name: 'Governed Action',
    detail: 'Permission is the condition that makes the action legitimate — not a review applied after the fact.',
  },
  {
    id: 'audit',
    name: 'Audit',
    detail: 'Every action leaves a tamper-evident record, not a note someone might have written down.',
  },
  {
    id: 'accountability',
    name: 'Accountability',
    detail: 'Claims about who did what stay grounded in transparency and traceability, for humans and agents alike.',
  },
];

/** Source: messaging.ts `messagingPillars` ("connected-outcomes"). */
export const governanceOutcome: GovernanceNode = {
  id: 'outcome',
  name: 'Coordinated, traceable outcome',
  detail: 'Measured against the purpose that demanded it — a shortfall reopens the loop instead of closing the file.',
};
