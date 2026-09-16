# Component specimen presentation

## Required gallery integration

The studio overview appends `gallery=1` to each registered preview URL. Its detail
canvas and state previews use separate URLs; do not infer gallery mode from iframe
embedding. `gallery.js` reads that flag and sets `body[data-gallery="true"]`.

Use shared `gallery.css` after local specimen styles and `gallery.js` after the
real renderer has populated the specimen. The adapter reads the matching catalog
entry and wraps its canonical `previewConfigurations` in shared compartments.
Every registered component must use this path, including single-example previews.

```html
<link rel="stylesheet" href="gallery.css">
<script src="gallery.js"></script>
```

## Required arrangement and separators

- Declare `previewLayout.columns` (1 or 2) on each component. Wide compositions,
  data rows, fields and panels use one column; compact comparisons can use two.
- Order `previewConfigurations` deliberately. Pair complementary Left/Right
  configurations on the same row, use consistent icon/text pairing, and keep related
  treatments adjacent. Counts progress from fewer to more; form fields follow their
  product order. Do not sort mechanically by label or registration date.
- Preserve canonical selectors when reordering metadata, especially nth-child selectors.
  The overview and expanded canvas both follow this order and column count.
- All overview cells use the shared hairline separators, caption placement, padding
  and centered content. Do not omit separators or write a private grid treatment.
  A single configuration still receives a compartment boundary.
- Use existing real renderers unchanged. Only specimen wrappers own gallery sizing;
  never crop, scale, restyle or duplicate a component to improve its gallery fit.
- Before registration is complete, verify every configuration at compact and wide
  gallery widths, check that selectors resolve exactly once, check dividers, and
  compare the overview with the expanded canvas. Keep live controls and inspection.

The helper moves existing nodes and listeners. Async renderers must finish before
initializing the adapter. A failed selector is an explicit gallery error and must
be corrected before handoff; do not silently substitute a different example.

## Caption/content policy

Preview captions identify configurations only. Do not display implementation notes,
reuse claims, ownership explanations, renderer names, “standalone” commentary or
instructions to the author in the preview. Put them in registry contracts or usage
documentation. Keep meaningful product sample content and actual interaction feedback.
Instructional foundations/layout guides are documentation surfaces and may explain
their examples; this is not permission to add commentary inside component previews.

All registered component specimens use the shared catalog-driven adapter.

Run `node design-system/specimens/check-gallery.js` from the workspace before
completing a new registration or preview change. This checks adapter coverage,
explicit columns and named configurations. Browser review remains required for
actual selector matches, logical pairing, dividers and clipping.
