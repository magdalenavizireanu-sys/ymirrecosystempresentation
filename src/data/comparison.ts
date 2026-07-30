import type { ComparisonRow } from './types';

/** Source: ymirr-ecosystem-brand-narrative.md §10 / the Orlog — Purpose Tracking case study. */
export const comparisonRows: ComparisonRow[] = [
  {
    ticketConcept: 'A task, carrying a status.',
    dimension: 'Root record',
    purposeConcept: 'A purpose, carrying achievement criteria.',
  },
  {
    ticketConcept: 'Tickets can exist with no stated reason.',
    dimension: 'Standalone work',
    purposeConcept: 'Orphan work is rejected — everything anchors upstream.',
  },
  {
    ticketConcept: 'Disagreement gets buried in comments, or edited away.',
    dimension: 'Disagreement',
    purposeConcept: 'Preserved forever as a Position — dissent never disappears.',
  },
  {
    ticketConcept: 'A status flips to "Done."',
    dimension: 'What "done" means',
    purposeConcept: 'A Result is explicitly linked back to the purpose it fulfills.',
  },
  {
    ticketConcept: 'Invisible — a blocked ticket is just a colour.',
    dimension: 'Cost of delay',
    purposeConcept: 'Modelled: people blocked × time open × purpose weight.',
  },
  {
    ticketConcept: 'A quick patch looks identical to a real fix.',
    dimension: 'Quality of a fix',
    purposeConcept: 'Bandaid fixes are structurally detected.',
  },
];

export const projectTrackingFlow = ['Task', 'Owner', 'Deadline', 'Done'];
export const purposeTrackingFlow = ['Purpose', 'Intent', 'Decision', 'Governed Action', 'Knowledge', 'Outcome'];
