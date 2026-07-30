import type { EcosystemModule } from './types';

/**
 * The Völund Foundation — the ecosystem's compute substrate.
 * Official tagline "Isolated Execution Environments" is transcribed from
 * Ymirr Brand Identity.pdf. Framing it as a governance-style "Foundation" is
 * a strategic narrative device proposed in ymirr-ecosystem-brand-narrative.md §8,
 * not a documented organisational structure — see the validation note below
 * and the "Open questions" chapter for the full caveat.
 */
export const volund: EcosystemModule = {
  id: 'volund',
  name: 'Völund',
  officialTagline: 'Isolated Execution Environments',
  tier: 'foundation',
  hasOfficialIcon: true,
  icon: '/icons/volund.png',
  shortRole:
    'The ecosystem’s foundational compute layer — an on-demand, isolated-machine engine, coordinated over NATS, that everything above it ultimately runs on.',
  problem:
    'AI coding agents and human developers both need real, isolated compute to execute in — not a shared or simulated shell.',
  contribution:
    'Idavoll is built directly on Völund; Skuld, Bifrost, Orlog, Wyrd and Heimdall all consume it beneath the surface. Nothing executes without, ultimately, running somewhere.',
  journeyStages: ['governed-action'],
  connectsTo: ['idavoll', 'skuld', 'bifrost', 'orlog', 'wyrd', 'heimdall'],
  needsValidation: true,
  validationNote:
    'Verified as a technical compute substrate only. Calling it "the Völund Foundation" in the sense of a governance body with open standards, membership or stewardship is a brand proposal, not a documented fact — see §22 of the narrative.',
};
