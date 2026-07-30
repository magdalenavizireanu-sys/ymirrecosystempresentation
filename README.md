# Ymirr™ Ecosystem — Interactive Presentation

A 10-chapter, single-page interactive presentation of the Ymirr™ ecosystem: what it is, the problem it solves,
how a purpose becomes a governed outcome, and how the core modules, the four independent product entities
(Huginn, Orlog, Wyrd, Skuld) and the Völund Foundation fit together. Built with React + TypeScript + Vite,
animated with Framer Motion, with an interactive 3D hero symbol (react-three-fiber + drei) opening the story.

## 1. Running it

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # type-checks (tsc -b) then produces a production build in dist/
npm run preview   # serves the production build locally
```

No environment variables or external services are required — everything is static content bundled at build time.

> Note on `dist/`: this project lives in a sandbox directory where files cannot be deleted once written, so
> `vite.config.ts` sets `build.emptyOutDir: false`. Each `npm run build` adds new content-hashed asset files
> rather than replacing old ones; `index.html` always points at the latest ones. If you move this project
> somewhere without that restriction, it's safe to delete `dist/` and re-enable `emptyOutDir`.

## 2. Where the content comes from

Every sentence of narrative content is sourced or paraphrased from two files, with no invented functionality,
customers, or metrics:

- `ymirr-ecosystem-brand-narrative.md` — the full brand narrative (positioning, business scenario, messaging
  pillars, module/entity descriptions, the Purpose → Intent → Governed Action → Knowledge → Outcome journey).
- `Ymirr Brand Identity.pdf` — the 13-page visual identity deck (colour palette, typography, iconography,
  tone-of-voice pillars, logo/module icon artwork).

All content lives in `src/data/*.ts`, and each file/field carries a `Source:` comment pointing back to the
originating document and section, for example:

```ts
/** Source: ymirr-ecosystem-brand-narrative.md §12 — Product entities */
```

Anything that isn't confirmed by those two files is explicitly labelled in the UI rather than presented as
fact — see the "Notes on this presentation" disclosure at the bottom of the closing chapter, and the summary
of unverifiable information at the end of this document.

## 3. How to edit the text

Content and presentation are separated. To change what the presentation says, edit the relevant file in
`src/data/` — no JSX/component changes needed:

| File | Controls |
|---|---|
| `data/journey.ts` | The 5 Purpose→Intent→Governed Action→Knowledge→Outcome stages |
| `data/modules.ts` | The core ecosystem modules (Asgard, Bifrost, Hel, Syn, Idavoll, Niu, Heimdall, Hermod, Muninn, Nidavellir, Jarn, etc.) |
| `data/productEntities.ts` | Huginn, Orlog, Wyrd, Skuld |
| `data/foundation.ts` | The Völund Foundation layer |
| `data/comparison.ts` | Project-tracking vs. purpose-tracking comparison panel |
| `data/scenario.ts` | The construction-insurance-renewal illustrative scenario |
| `data/businessValue.ts` | Business value tiles |
| `data/messaging.ts` | Messaging pillars, manifesto, closing statement |
| `data/openQuestions.ts` | The "what remains unverified" list shown in the closing chapter |

Section copy that isn't reusable data (headings, intro paragraphs) lives directly in each file under
`src/sections/*Section.tsx`.

## 4. How to replace icons / visuals

- **Module & product-entity icons**: drop a transparent PNG into `public/icons/` named after the module's `id`
  (see `data/modules.ts` / `data/productEntities.ts`) and set `hasOfficialIcon: true` on that entry.
  `ModuleIcon.tsx` automatically renders the official icon when present, or falls back to a neutral geometric
  marker (from the brand's own square/circle/triangle/diamond "input marker" vocabulary) for modules without one
  yet — currently Niu, ysdr, claude-engine, brainstormer-aggregator and Jarn. The 14 official icons currently in
  place (Asgard, Bifrost, Heimdall, Hel, Hermod, Huginn, Idavoll, Muninn, Nidavellir, Orlog, Skuld, Syn, Volund,
  Wyrd) are the brand-supplied transparent versions, not PDF crops.
- **Logo**: two official SVG assets in `public/brand/`, both taken from the supplied brand master file (no
  redrawing): `ymirr-logo-lockup.svg` (full hexagon + "ymirr" wordmark, 103:32) used wherever the full lockup
  fits, and `ymirr-mark.svg` (the hexagon alone, cropped from the same master) used for compact/icon-only slots
  — favicon, the opening hero's convergence core, the closing chapter's central assembly. `ymirr-mark-192.png`
  is a faithful raster export of `ymirr-mark.svg` kept only for favicon/apple-touch-icon fallback on browsers
  that don't support SVG favicons. `components/Logo.tsx` picks the lockup or the mark based on its
  `withWordmark` prop — pass `withWordmark={false}` anywhere you only want the icon. Replacing either SVG file
  updates every usage at once.
- **Colours, type, spacing**: all design tokens are CSS custom properties in `src/styles/tokens.css`, transcribed
  directly from the brand identity PDF's palette/typography pages. Change a value there and it propagates
  everywhere (nothing is hard-coded in component files).
- **Component-level styling**: `src/styles/components.css` holds the layout/visual rules for every section and
  component (cards, journey flow, ecosystem map, comparison panel, etc.), organised in the same order as the
  10 chapters.

## 5. The interactive 3D hero symbol

`components/HeroSymbol3D.tsx` renders the opening chapter's central Ymirr symbol, loaded from
`public/models/ymirr-symbol.gltf` (a self-contained glTF — its geometry buffer is base64-embedded in the JSON,
so no separate `.bin` file is needed). It's used by `HeroConvergence.tsx`, which also owns the orbiting labels
around it.

- **Loading & centring**: `useGLTF` (drei) loads the model; `CenteredModel` then measures its real bounding box
  with `THREE.Box3` and derives a centering offset + uniform scale on the fly, rather than hard-coding numbers.
  If you swap in a re-exported/rescaled version of the model, it will still centre and fit correctly — no
  numbers to update.
- **Drag-to-rotate**: `drei`'s `<OrbitControls enableZoom={false} enablePan={false}>` — orbits the camera around
  the model (visually identical to spinning the object), with `enableDamping`/`dampingFactor={0.07}` giving the
  release-inertia feel and `rotateSpeed={0.45}` tuned to feel neither too sensitive nor too stiff. It handles
  mouse and touch natively; nothing custom was written for pointer/touch handling. Tune `rotateSpeed` and
  `dampingFactor` to taste.
- **Idle motion**: a slow self-rotation + a barely-visible vertical bob run inside a `useFrame` loop, and pause
  the instant the user starts dragging (`OrbitControls`' `onStart`/`onEnd`), resuming on release.
- **Lighting**: procedural only (`StudioLighting` — a few `<Lightformer>` panels baked into a runtime
  `<Environment>`), deliberately avoiding drei's HDRI presets, which fetch a file from a CDN at runtime. This
  keeps the hero fully self-contained and keeps reflections tinted to the brand's cyan/white rather than
  whatever tone an off-the-shelf preset happens to have. Adjust the `Lightformer` colors/positions to change the
  model's highlights.
- **Reliability**: wrapped in a `Suspense` boundary (loading state → the flat `ymirr-mark.svg`) and a class-based
  `ModelErrorBoundary` (WebGL/context/parse failure → same flat SVG fallback), so the hero is never left blank
  on older browsers or with WebGL disabled.
- **Performance**: the whole `@react-three/fiber`/`@react-three/drei`/`three` stack is code-split into its own
  chunk via `React.lazy()` in `HeroConvergence.tsx` — it loads in parallel with, not instead of, the rest of the
  presentation. `Canvas` is capped at `dpr={[1, 2]}` for a crisp-but-bounded retina render, and the canvas is
  transparent (`alpha: true`) so the existing dark-navy/grid-line hero backdrop is untouched — nothing 3D
  renders as a visible background.
- **Known limitation**: `OrbitControls` only binds mouse/touch/pointer events, so the drag-to-rotate gesture
  itself isn't keyboard-operable. The symbol is marked `role="img"` with a descriptive label rather than
  presented as a false interactive control to assistive tech; it's a supplementary visual, and the actual
  heading, copy and "Begin the story" CTA beside it are fully accessible HTML.

## 6. How to adjust the orbiting hero labels

- `HeroConvergence.tsx` moves the six labels (Purpose, Knowledge, AI Agents, Orchestration, Outcomes,
  Resolution) along one shared ellipse (`ORBIT_RX_PCT`/`ORBIT_RY_PCT`, in % of the hero box) at a slow, shared
  angular speed (`ORBIT_PERIOD_S`, seconds for one full revolution). Each label's starting angle is derived from
  its original static `top`/`left` position, so the composition still resembles the original static layout at
  the moment each label fades in.
- Position is driven by `framer-motion`'s `motionValue()` + `useAnimationFrame`, set imperatively every frame —
  deliberately not through React state/re-renders, which is what keeps the orbit jitter-free. The loop itself is
  gated by an `IntersectionObserver` (skips work while the hero is scrolled out of view) and `useTabVisible`
  (skips work while the tab is backgrounded).
- Orientation stays upright throughout — the per-frame transform only ever sets `x`/`y`, never `rotate`, so the
  labels never turn sideways as they travel.
- The soft pulse (`@keyframes pill-pulse` in `components.css`) lives on a nested inner element so it can never
  fight the orbit's position transform on the outer one; each label's pulse timing is staggered via an inline
  `animation-delay` so the field doesn't beat in unison.
- Under `prefers-reduced-motion`, the orbit and pulse are skipped entirely and each label sits at its original
  static anchor point — the hero remains fully readable, just without the motion.

## 7. How to adjust animations

- `src/hooks/useReducedMotion.ts` detects `prefers-reduced-motion` and is checked by every animated component;
  respect it if you add new motion.
- `components/Reveal.tsx` is the shared "fade/rise into view on scroll" wrapper used at the top of nearly every
  section block — change its `variants` to adjust the default reveal feel globally, or pass a `delay` prop per
  use.
- `components/AnimatedConnector.tsx` draws the animated "purpose signal" travelling along SVG paths between
  modules (native SVG `<animateMotion>`). In `JourneyFlow.tsx` these loops are gated by `useInViewport` +
  `useTabVisible` — the signal only runs while that chapter is on screen and the tab is foregrounded; the same
  pair of hooks is reusable for any other continuous loop you add.
- `components/JourneyFlow.tsx` and `components/ClosingAssembly.tsx` contain the two set-piece animations (the
  looping Purpose→Outcome flow with its loop-back visual, and the modules assembling into the central spine).
- `components/HeroConvergence.tsx` / `components/HeroSymbol3D.tsx` — see sections 5 and 6 above for the hero's
  3D symbol and orbiting labels specifically. The central symbol also has a slow breathing glow behind it
  (`@keyframes core-breathe` in `components.css`), a plain CSS animation automatically neutralised by the global
  `prefers-reduced-motion` rule in `global.css`.
- Global timing/easing values (`--duration-base`, `--ease-standard`, etc.) are in `tokens.css` — change once,
  affects all Framer Motion transitions that reference them via inline style lookups, and all CSS transitions.
- `usePresentationMode.tsx` toggles between guided and free-exploration. Guided sets
  `document.documentElement.dataset.presentationMode = 'guided'`, which `global.css` turns into gentle
  `scroll-snap-type: y proximity` on the chapters (settles near a boundary, never traps the user); explore mode
  clears the attribute back to plain free scroll. Both bypass scroll-snap under reduced motion.

## 8. Structure at a glance

10 chapters, one continuous scroll, each a full-viewport `<section>` rendered by `SectionShell`:

1. Opening — cinematic logo reveal, "From thought to governed reality"
2. The problem — project-tracking vs. purpose-tracking (interactive comparison panel)
3. The Ymirr™ principle — accountability parity across human, AI and workflow actors
4. The purpose journey — Purpose → Intent → Governed Action → Knowledge → Outcome, with per-stage
   expand and an Outcome→Intent loop-back
5. Ecosystem architecture — Völund Foundation → core modules → product entities, as three progressive levels
6. Core ecosystem modules — the operational vertebrae (filterable grid)
7. Ymirr™ product entities — Huginn, Orlog, Wyrd, Skuld, given stronger visual weight than infra modules
8. Real business scenario — an illustrative, explicitly-labelled construction-insurance-renewal walkthrough
9. Business value — mechanism-first value tiles + messaging pillars
10. Closing — the closing line, the module assembly into the central spine, the manifesto, and a disclosure
    of unresolved/unverified information

Reusable building blocks (all in `src/components/`): `ModuleCard`, `ProductEntityCard`, `JourneyFlow`,
`EcosystemMap`, `AnimatedConnector`, `ComparisonPanel`, `BusinessValueGrid`, plus shared primitives
`SectionShell`, `Reveal`, `ModuleIcon`, `ProgressRail`, `Logo`.

Navigation: `ProgressRail` (right-hand dot rail on desktop, top progress bar on mobile) plus standard scroll;
keyboard users can tab to any control and use arrow keys to move between chapters once a rail dot is focused.

## 9. Information that could not be verified from the two source files

These are called out in-app too (Closing chapter → "Notes on this presentation"):

- The "Völund Foundation" is a narrative/branding framing introduced in the narrative doc — Völund itself is
  only documented as a technical compute substrate, not as a formal governance body.
- Niu, ysdr, claude-engine, brainstormer-aggregator and Jarn have no official 3D icon or canonical tagline in
  the brand identity PDF; they use neutral geometric fallback markers instead.
- Jarn is referenced only as Jarl's deterministic counterpart and isn't independently profiled anywhere.
- ysdr's intended audience (internal tool vs. user-facing) is explicitly marked ambiguous in the source material.
- Skuld's documented authentication model (WorkOS AuthKit) sits in unresolved tension with Syn's platform-wide
  auth role — both are presented, flagged, not resolved.
- Wyrd's brand tagline is "Business Operations Platform"; the presentation's journey framing calls it "Business
  Execution" per the user's requested chapter structure — both terms are used, with the official tagline given
  precedence on its card.
- No external, paying customer is evidenced in either source; all documented usage is internal/dogfooding.
- The construction-insurance-renewal scenario (Chapter 8) is explicitly labelled illustrative, built from Wyrd's
  documented first domain — not a verified case study.
- A handful of default Vite scaffold files (`src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`,
  `src/assets/hero.png`, `public/favicon.svg`, `public/icons.svg`, `public/icons/all_icons_check.png`) could not
  be removed due to a sandbox file-deletion restriction, and the original PDF-extracted `public/brand/ymirr-logomark.png`
  is now unused for the same reason. None of these are imported or referenced by any component; they are inert
  and safe to delete manually if you have normal filesystem access.
- `public/models/ymirr-symbol.gltf` was supplied directly as an asset with no accompanying license/provenance
  information; treat its usage rights the same way you'd treat any other supplied brand asset.
- The hero symbol's drag-to-rotate gesture is mouse/touch-only (see §5's "known limitation") — this is a real,
  documented gap, not an oversight.

## 10. Quick static preview

`ymirr-ecosystem-presentation-preview.html` (shipped alongside this project, not inside it) is a single,
fully self-contained HTML file — all CSS, JS, icons and the logo inlined — built via `vite.config.preview.ts`
(uses `vite-plugin-singlefile`, not part of the normal `npm run dev`/`build` scripts) plus a small script that
base64-inlines every `public/icons` and `public/brand` asset into the output. Double-click it to open in any
browser, no install or server needed. Regenerate it after an asset change with:

```bash
npm install --no-save vite-plugin-singlefile
npx vite build --config vite.config.preview.ts
# then re-run the inlining pass — see the project's build history for the exact script,
# or simply base64-inline any new /icons or /brand references left in dist-preview/index.html
```

> This single-file preview pipeline only inlines `public/icons` and `public/brand`. The 3D hero fetches
> `public/models/ymirr-symbol.gltf` separately at runtime (via `useGLTF`), and that fetch is not inlined by the
> above process — a regenerated single-file preview would need `ymirr-symbol.gltf` served alongside it (or the
> loader path swapped for a base64 `data:` URI, which three's loaders do support) to show the 3D symbol. For a
> full, working preview of the 3D hero, use `npm run dev`/`npm run build` + `npm run preview` instead.
