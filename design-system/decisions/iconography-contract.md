# Iconography contract — 2026-09-09

The user approved establishing Iconography as a system of shared artwork, display
sizes, color and usage rules. The SVG coordinate system remains 24×24. Neither a
24px display size nor a 24px hit area is implied by that coordinate system.

## Sizes and ownership

`tokens/iconography.css` defines the primitive display sizes 12, 16, 18, 20 and
24px. Component-purpose aliases reference these primitives: indicator, compact,
window, sidebar, message status, action, action-large and supporting. Actions,
Selection, Navigation/Input, Messages and App switcher now consume these aliases.
The reusable `.titan-icon` accepts `--titan-icon-size`, defaulting to the 24px token.

12px is for small indicators/carets; 16px for compact/search/supporting actions;
18px for sidebar/window/status icons; 20px for standard/composer actions; 24px for
larger controls/supporting artwork. This is a usage scale, not a guarantee that
every detailed glyph is readable at every size. The Library can preview all sizes;
12px explicitly calls out that detailed artwork needs review.

App switcher retains local `--titan-icon-size-launcher-trigger:28px` and
`--titan-icon-size-launcher-app:34px` as component-owned branded-artwork exceptions.
No larger universal primitives or unobserved sizes were invented. Slots, hit areas,
padding, gaps, margins, focus/hover/disabled behavior and shared optical adjustments
remain unchanged. Existing action/control dimensions are separate tokens/contracts.

## Presentation and color

The app-owned provider name and page are Iconography. Stable provider ID, route,
manifest identities, Copy SVG behavior and the existing Add icon workflow remain.
Library adds five display-size choices and neutral/active/inverse color previews.
Color choices affect monochrome fragments only; multicolor/branded artwork stays
unchanged. Inverse mode deliberately uses a dark sample surface. It does not add
backing shapes to SVG assets. Copy SVG still copies the canonical source, independent
of preview size/color. Usage shows actual-size examples with visible token names,
existing color roles and concise contract details. Tabs support arrow/Home/End keys.

The shared studio's global sidebar label remains “Icons”: it is hardcoded by the
upstream framework and is not an app-owned customization surface. No framework
files were modified merely to rename this attachment's section. The provider/page
name and contract are Iconography.

## Verification and boundaries

- Existing 29 component tests plus a token-adoption regression test pass. The new
  test resolves role aliases and compares every recorded replaced dimension with
  its pre-token literal, including launcher exceptions.
- Attachment validation passes. `iconography-adoption.json` records changed image
  rules; search-specific dimensions additionally alias the new primitive scale.
- Browser inspected Library and Usage, 16px Active previews, composer and token
  values. Composer button width/height/padding/gap arrays match the previous review;
  its image canvases remain 18px window/20px body and every image loaded.
- Shared styles import the tokens through tokens.css; both image and SVG variants
  use token references. App-switcher exception variables remain local to their
  component roots. Gallery size controls affect only the preview panel.
- The current shared artwork was not redrawn to match the newly supplied live-app
  screenshot. Its capture scale is unknown. Alignment/Indent mapping, font stars,
  full responsive/keyboard coverage and spacing-inspector-band certification remain
  the previously documented boundaries.

Final browser checks: each Library selector produced its exact 12/16/18/20/24px
canvas; Active/Inverse modes rendered correctly; ArrowRight/Home switched tabs;
Copy Archive SVG returned its success feedback. Launcher rendered nine 34px app
images and a 28px trigger with zero broken images. Final total: 30 tests passing.
