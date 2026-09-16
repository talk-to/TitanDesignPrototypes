# Iconography sidebar — 2026-09-09

User requested a sidebar for variations and size guidance. Replaced the separate
Library/Usage tabs and global size/color dropdowns with a contextual right sidebar.
Selecting a library tile opens its name, category, actual-size preview, five size
samples, contextual color choices, token labels, usage guidance and explicit Copy
SVG / Copy reference actions. The grid remains a consistent 24px comparison view.
Tile-corner Copy SVG remains available. Selection and variation controls are native
buttons with pressed-state semantics; changing an icon preserves the selected size
and color preference. Multicolor artwork disables color controls and retains its
palette. An icon's review note appears only when recorded in its catalog metadata.

The sidebar sticks within the page; long contract details can scroll. At widths
below 700px it stacks above the grid to keep both regions reachable. Removed the
obsolete tab/global-preview CSS and JavaScript. Shared assets, component sizes,
tokens, callbacks and Add icon workflow were not changed.

Browser verification: selected Close, chose 16px and Inverse; selected preview
measured 16px with white color while grid stayed 24px. Both sidebar copy actions
returned the selected Close success feedback. Selecting Edit disabled tint controls
and retained original artwork. Screenshots inspected initial and scrolled sidebar
states. Existing tests and attachment validation run. Narrow-layout screenshot
verification was not performed; the responsive rule is not a mobile certification.

## Vertical size list refinement

Removed the dedicated large preview and size-selection buttons. The widened 360px
sidebar now shows color toggles above a vertical list ordered 24, 20, 18, 16, 12px.
Each row pairs the actual-size artwork with its pixel size and token name. Color
changes affect every monochrome sample; inverse uses a dark sample surface, while
branded artwork retains its palette. Responsive stacking begins at 820px.

Visually checked the updated desktop layout in the browser with Gray, Active and
Inverse: all five samples render, tokens fit beside them, and the library retains
its neutral 24px comparison view. JavaScript syntax check passed. No shared assets,
component geometry or copy handlers changed. Narrow viewport was not visually tested.

Tile click now copies the icon reference while selecting it in the sidebar; the
corner copy control copies the shared SVG. Initial selection and filter rerenders
call selection directly so they do not write to the clipboard. Accessible tile
labels describe reference copying. Browser clicks on Close and its corner copy
control returned “Copied Close reference” and “Copied Close SVG” respectively;
sidebar selection remained Close. JavaScript syntax check passed.

## Copy feedback visibility

Added local pending/success/failure feedback to the clicked tile, corner copy icon,
and sidebar copy buttons. The existing bottom live-region toast remains for
announcements; local feedback is visible when the embedded document's bottom is
outside the parent viewport. Sidebar actions now call the same copy functions
with their originating control, rather than forwarding a synthetic corner click.

Browser screenshots verified reference and SVG confirmations on the tile and
sidebar. OS clipboard readback after copying Close SVG exactly matched the shared
SVG source. Both JavaScript syntax checks passed. Tile clicks still copy references;
corner and sidebar Copy SVG controls copy SVG, as previously requested.

## Sticky sidebar in the embedded studio

The studio auto-height iframe scrolls with the outer workbench, so provider-only
CSS sticky positioning did not follow that outer viewport. The app-owned provider
now reads the embedding frame position on parent scroll/resize and updates its
sticky offset and visible-height limit. No studio framework files were changed.
Listeners and observer are removed on pagehide. Standalone CSS sticky remains the
fallback. Stacking now begins below 680px so the 760px-wide studio content retains
the sidebar beside the grid.

Visually verified inside the actual studio at 1024px width: after scrolling from
Mail actions down to Formatting, the sidebar remained 12px below the viewport top.
Clicking Bold updated the visible sidebar and showed reference-copy feedback.
JavaScript syntax check passed. Narrow stacked mode remains intentionally nonsticky.

## Multi-icon prompt references

Shift-click toggles a catalog ID in a deduplicated selection, separate from the
sidebar's current icon. Checked tiles and a compact animated bottom-center panel
show the selection count, Copy references, and Clear. Escape clears the selection.
Ordinary tile clicks retain single-reference copy and clear bulk selection; corner
copy controls continue copying SVG. Selection persists across search/category
renders, including hidden selected results. Batch copy includes each selected
icon's name, stable ID and canonical asset path in one prompt context.

The floating panel tracks the visible embedding viewport and frame resizes, bounded
by the gallery frame; animation respects reduced motion. Browser checks verified
Bold + Italic selection and OS clipboard readback with exactly both references;
Archive + Block selection across separate search results; Shift-click removal;
Clear hiding the panel; screenshots after scrolling and filtering. JavaScript
syntax and attachment validation passed. Narrow viewport and keyboard Shift+Enter
were not separately browser-tested.

## Import dialog viewport centering

The native dialog was centering within the auto-height iframe, which could be
thousands of pixels tall. The provider now positions its modal using the parent
viewport center translated into frame coordinates, constrains height to the visible
viewport minus 32px, and scrolls its contents when necessary. Horizontal centering
is clamped inside the frame on narrow layouts. Parent scrolling/resizing recomputes
the position while open. Standalone mode centers in its own viewport.

Browser screenshots checked the entire form centered at the same visible position
for filtered and full-length catalogs. Keyboard Close and reopening worked; the
form's submit action was not invoked. Syntax and attachment checks passed. Narrow
viewport resizing was not visually tested.
