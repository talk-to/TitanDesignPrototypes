# Shared icon normalization — 2026-09-09

## Scope and ownership

Normalized the 45 original catalog icons and 25 additional SVG entries observed in
registered component renderers/specimens: 70 stable IDs, 68 canonical SVG files.
Original IDs/src paths remain unchanged. Composer Delete and Filter Caret are
compatibility aliases of Delete and Caret Down. Delete exports differed only by
subpixel export rounding (normalized raster difference 0.0038%); distinct colors,
brands, outlined/filled controls and chevron geometry remain separate.

Every SVG has a 24×24 viewBox and xMidYMid meet. Painted bounds were measured at
960px including alpha, then transformed uniformly without rewriting path geometry,
colors, masks, filters or gradients. Most artwork spans 20 units; dense signs,
Bold and punctuation span 18–18.5; the wide signature brand spans 21. Reply and
Forward have a 0.25-unit vertical optical correction. Geometry is recorded in
icon-normalization-geometry.json. White window controls now have dark gallery backing.
Titan Labs bakes the established 180-degree orientation into the shared asset;
removed its gallery/component rotation so Copy SVG matches the visible orientation.

Component renderers and specimens now use icons/assets. Inline search/chevron/caret
SVGs use external shared artwork fragments, preserving inherited currentColor.
The DS-connected shell uses /design-system URLs with relative file fallback.
The original Shells/TitanEmailShell and unrelated prototype artwork are untouched.
86 duplicate file paths remain as compatibility links, listed in
icon-normalization-aliases.json. Shell paths are hard links to the canonical file
because the studio blocks cross-mount symlinks; DS-internal paths are symlinks.
All 86 legacy HTTP URLs were checked successfully. Connected renderers reference
the canonical URLs directly, so edits propagate independently of legacy paths.
When replacing assets atomically, run `node design-system/icons/repair-aliases.js`
to restore legacy hard-link identity; in-place writes propagate automatically.

## Component audit

Actions retain 32/40px normal hit areas, 28px composer controls, 24px window controls,
32px composer Send height and existing segment widths. More retains its existing
20px button width. Parent spacing, callbacks, focus and disabled rules are unchanged.
Image canvases: normal icon buttons 20px; labeled Button 20px inside its existing
24px slot; composer controls/features 24px; window controls 18px. The shared inline
carets use 12px square SVG canvases inside unchanged parent controls.

Removed Underline 12×15, More 4×15, Link 21px, Reminder/Alignment/List/Indent 32px,
and Drive/Bookings 24px compensation rules from composer.css. App tiles retain
38px slots with a common 34px image; tool icons retain 28px backing slots with a
common 24px image. Preserved branded proportions, tones, parent gaps and insets.
No new spacing semantics or component families were introduced.

Existing spacing inventory remains authoritative: composer header/content inset
16px; header actions/feature/send gaps 8px; fields top 12px and rows block 8px;
field label gap 6px; Cc/Bcc gap 12px; editor insets 12px/16px; formatting inset 14px,
gap and separator margins 6px; send inset 12px/16px. Controls own internal slots;
parents own between-control spacing. Existing Button padding tokens, launcher
2/6/27px exceptions, footer beaker margins and all interaction ownership remain.

## Verification actually performed

- Browser screenshots inspected across every gallery category, composer specimen,
  actual docked shell composer, Buttons, Search, received-message actions and full
  app switcher. No stretching or clipping observed in these reviewed views.
- All 70 gallery images and all 29 composer images loaded. Shell image scan found
  zero broken images after correcting protected /app/design-system routes.
- Copy Archive SVG clicked and pasted into the search field: copied markup has the
  normalized 24×24 viewBox, meet attribute and shared transform. Field cleared after.
- Actual shell compose opening, minimize/restore and Close checked. Existing unit
  coverage checks independent split callbacks, disabled behavior and cleanup.
- Composer computed geometry: 681px width; formatting gap 6px; send gap 8px; square
  image canvases. A temporary 768×900 viewport request was made, but the screenshot
  surface did not visibly resize; this is not claimed as narrow-view visual coverage.
- Attachment check passed; 28 component/regression tests passed before handoff.
  Tests cover stable canvases, live aliases, every composer image and external-use IDs.

This is not complete keyboard, spacing-inspector-band or responsive certification.
No product sending/formatting operations were invoked or added. Existing Unicode
star toggles in Message list and screen-owned inline-reply artwork remain outside
the SVG migration pending the review below; unused unique historical composer
exports are retained, not silently registered as supported variants.

## Decisions needed

1. Alignment/Indent: current `align` shows an indent arrow and lines; `indent` shows
   plain alignment lines. Both original IDs and action mappings are retained. Confirm
   whether to swap these usages or provide replacement artwork.
2. Message-list starred/unstarred states currently use the font glyphs ★/☆, which
   differ from the registered solid Star icon. Choose approved filled/outline SVG
   artwork before replacing these glyphs. They retain existing appearance/behavior.

The misleading figma-ic-link.svg filename is resolved without guessing: its actual
vertical dots map to More; figma-ic-more.svg is the observed chain-link artwork and
maps to Link. These commands were already mapped this way before this normalization.
