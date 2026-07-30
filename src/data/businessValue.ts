import type { BusinessValueItem } from './types';

/** Source: ymirr-ecosystem-brand-narrative.md §12 and §19 — each mechanism
 *  is paraphrased from the narrative, not asserted without explanation.
 *  `problem` is the current-state absence of that same mechanism (the
 *  narrative's own §19 framing: disconnected tools, ungoverned AI access,
 *  decisions without traceability, "done" without proof of value) —
 *  restated per item rather than a separate, uncited claim. */
export const businessValueItems: BusinessValueItem[] = [
  {
    id: 'alignment',
    title: 'Alignment between strategy and execution',
    problem: 'Execution can quietly drift from strategy when nothing structurally forces an action back to the intent — or the intent back to the purpose — that justified it.',
    mechanism:
      'Bifrost requires every action to trace back to a declared intent, and Orlog requires every intent to trace back to a stated purpose — execution cannot silently drift from strategy because the chain is enforced by the architecture, not by review meetings.',
    moduleIds: ['bifrost', 'orlog'],
  },
  {
    id: 'governed-ai',
    title: 'Governed AI adoption',
    problem: 'AI agents are often granted access through a separate process from human permissions, so "the same rules for everyone" stays a policy statement instead of a technical guarantee.',
    mechanism:
      'Syn resolves permissions through a single access-check API regardless of whether the caller is a person or an agent, so "the same rules for everyone" is a technical property, not a policy statement.',
    moduleIds: ['syn'],
  },
  {
    id: 'accountable-execution',
    title: 'Accountable execution',
    problem: 'Actions can execute without a clearly authorized actor attached, leaving oversight to happen after the fact, if at all.',
    mechanism:
      'Every action routed through Bifrost carries an authorized actor. Nothing executes anonymously or by default.',
    moduleIds: ['bifrost'],
  },
  {
    id: 'traceable-decisions',
    title: 'Traceable decisions',
    problem: 'Disagreement and rationale get buried in comments or edited away, so a decision can’t be reconstructed once the people who made it move on.',
    mechanism:
      'Orlog preserves every Position taken during a Debate, so a decision can be explained months later without relying on anyone’s memory of a meeting.',
    moduleIds: ['orlog'],
  },
  {
    id: 'reusable-knowledge',
    title: 'Reusable organisational knowledge',
    problem: 'Commits, code structure and documentation drift apart, so knowledge about the system lives in people’s heads rather than anywhere searchable.',
    mechanism:
      'Muninn, Heimdall and Hermod each turn a different kind of activity — commits, code structure, documentation — into a searchable, current asset instead of tribal knowledge.',
    moduleIds: ['muninn', 'heimdall', 'hermod'],
  },
  {
    id: 'lower-fragmentation',
    title: 'Lower operational fragmentation',
    problem: 'Every new project reassembles its own secrets, deployment and UI scaffolding from scratch — duplicated work that also duplicates the chance of a mistake.',
    mechanism:
      'Asgard, Niu and Nidavellir remove the need for every new project to reassemble its own secrets, deployment and UI scaffolding from scratch.',
    moduleIds: ['asgard', 'niu', 'nidavellir'],
  },
  {
    id: 'cross-system-coordination',
    title: 'Better cross-system coordination',
    problem: 'Conflicts between what different tools and people believe happened are discovered manually, if at all.',
    mechanism:
      'Skuld’s read-only aggregation across external PM, document and calendar tools surfaces conflicts between systems instead of leaving them to be discovered manually.',
    moduleIds: ['skuld'],
  },
  {
    id: 'measurable-outcomes',
    title: 'Measurable outcomes',
    problem: 'A task closing is treated as proof the work succeeded, with no structural check against the purpose it was meant to serve.',
    mechanism:
      'Orlog’s Result-to-Purpose linkage is explicit and structural — a real answer to "did this actually work?", not a status column.',
    moduleIds: ['orlog'],
  },
];
