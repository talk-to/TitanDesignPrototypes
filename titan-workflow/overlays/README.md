# Dev Overlay Widget

A small draggable widget for switching between UI options live, so one build can
show several directions in a stakeholder review instead of maintaining several
builds.

**Design branches only.** Never reaches a `feature/` branch.

## Install (done for you by `/design-start`)

```bash
cp -R titan-workflow/overlays/dev-overlay <repo>/src/arch/vanguard/dev-overlay
```

Then one marked block in the app entry — `src/index.js` in nike:

```js
/* TITAN-DEV-OVERLAY:START — design branch only, strip before handoff */
import '@vanguard/dev-overlay';
/* TITAN-DEV-OVERLAY:END */
```

That is the whole footprint: **one folder, one marked block.** Nothing else,
anywhere.

**Why the app entry and not the webpack config.** A dev-only webpack entry would
keep the module out of production bundles entirely, which is tempting. Rejected:
it needs a second edit to `config/paths.js` (Node's `require.resolve` cannot
resolve `.tsx`), it is nike-specific — another repo may not use this webpack
shape at all — and a webpack-config diff inside a design handoff reads as alarming
to a reviewer. Every JS app has an entry module; not every one has this config.

**Why the markers.** Removal becomes deterministic — delete between them, rather
than hunting for an import that may have been moved or reformatted. And
`git grep TITAN-DEV-OVERLAY` is a string that cannot appear for any other reason,
which is what makes the handoff check trustworthy.

**On production bundling.** A static import means that if this block ever
survived handoff, the module would be bundled in production — where it no-ops,
but as a few KB of dead weight. A guarded `require()` would let the bundler drop
it, but nike sets `global-require: 'error'`, so that costs an eslint-disable in a
core entry file. Not worth it: the grep is the real defence, and a one-line diff
carrying a shouting marker comment is hard to miss in review.

## Adding options

Edit `variants.config.ts`. It is the only file a designer touches:

```ts
export const VARIANTS: TVariantGroup[] = [
  {
    key: 'hero',
    label: 'Hero layout',
    options: ['split', 'stacked'],   // first option is the default
    hint: 'Split puts the illustration beside the copy.',
  },
];
```

The control picks itself: 2 options → toggle, 3–4 → tabs, 5+ → dropdown.
Override with `control: 'tabs'` if you want.

Add and remove groups freely as the work goes. An empty list renders nothing, so
a project with no iterations costs nothing.

## Reading a variant — two ways

**1. CSS only — nothing to strip at handoff.** The widget mirrors every
selection onto `<html>`:

```less
html[data-titan-design-variant-hero='stacked'] .hero {
  flex-direction: column;
}
```

The attribute name is deliberately long. `data-v-` was the first choice and was
wrong twice over — it is Vue's scoped-style prefix, and nike already owns a
`data-titan-*` product namespace (`data-titan-email-file-id`). This one cannot
collide with anything.

No `.tsx` is touched, so there is no dead code to collapse later. Use this for
layout, spacing, colour, order, visibility — anything expressible in CSS.

**2. The hook — for structural differences.** A different component or different
copy, which CSS cannot express:

```tsx
import { useVariant } from '@vanguard/dev-overlay';

const hero = useVariant('hero');
return hero === 'stacked' ? <HeroStacked /> : <HeroSplit />;
```

This puts an import and a conditional in a real component file, so handoff has
to collapse it to the winner. Prefer (1) wherever it works.

> **Pending:** which of these to prefer as the default is being confirmed with a
> developer. Both work today; only this recommendation may change.

## Safety

Three independent guards, so a leaked import line still cannot ship anything:

1. `mount()` returns immediately when `process.env.NODE_ENV === 'production'`.
2. It renders nothing when `variants.config.ts` is empty.
3. It never mounts twice (checks for its own container id).

Selections, widget position and collapsed state persist in `localStorage`, so a
reload mid-review loses nothing. Deleting a group from the config also clears its
`<html>` attribute, so a stale selector cannot keep matching after a hot reload. Storage is read defensively — a full, blocked or
malformed store falls back to defaults rather than breaking the app. A stale
selection for a renamed or deleted group is discarded on read.

The styles use **no design-system tokens and no theme variables**, deliberately:
this is a tool sitting on the product, not part of it. It must look identical in
every repo, must not shift with the product's theme, and must never be mistaken
for the UI under review. Class prefix `tdo-`.

## Removal at handoff

`handoff.md` does this, and verifies it:

```bash
rm -rf src/arch/vanguard/dev-overlay
# delete the TITAN-DEV-OVERLAY:START..END block from src/index.js
# --untracked: plain `git grep` skips uncommitted files
git grep -n --untracked "TITAN-DEV-OVERLAY"          # must be empty
git grep -n --untracked "dev-overlay"                # must be empty
git grep -n --untracked "useVariant"                 # must be empty
git grep -n --untracked "data-titan-design-variant"  # must be empty
git grep -n --untracked "__titanDesign"              # must be empty
```

## Files

| File | What |
| --- | --- |
| `variants.config.ts` | **The only file a designer edits.** |
| `variant-store.ts` | State, persistence, the `<html>` attributes, `useVariant`. |
| `index.tsx` | The widget: drag, collapse, controls. Self-mounts on import. |
| `dev-overlay.less` | Chrome. Repo-agnostic plain CSS. |
