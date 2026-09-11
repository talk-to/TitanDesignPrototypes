# Color and typography — phase 2a

## Decision

The user authorized proceeding with colors and typography, keeping component
extraction conservative. This pass names existing values and adopts them in selected
static CSS. It does not alter the visual direction or complete all of phase 2.

## Evidence and ownership

The source shell repeats #2170f4 in compose/send backgrounds, active tab/unread
indicators and composer link hover. These get separate action, indicator and link
roles, backed by one observed primitive. #fff is split into surface and inverse-text
roles. Navigation and composer header both use #1c1c1c but retain separate roles.
Text roles use #1a1a1a, #333, #666 and #888 only at reviewed selectors.

14px is used for body and controls, 15px for sender/tab roles, 13px for compact
actions, 12px for metadata, 11px for compact timestamps and 24px for the thread title.
These are observed size roles, not a universal modular scale. Existing 400/500/600
weights receive primitive tokens. Existing 700/800 weights and the 18px action-more
symbol stay local. The system font stack is unchanged at body, settings modal and
composer. Existing inherited/native control font behavior is not reset.

The body line-height role replaces only explicit 20px body/preview declarations.
44px row alignment, 24px input alignment, unitless title line height and all other
line-height exceptions stay local. Font-size tokens are not full typography presets.

## Important distinctions

- Actual reading surfaces use #fbfbfb, including the unchanged sticky-header fade.
  Legacy --reading-pane-bg remains #f9f9fa. Do not alias these until a visual decision.
- Wide-view sender is 14px rather than 15px; its 44px line height is layout-owned.
  Wide-view timestamps use 12px rather than compact 11px.
- #888 metadata may need a future contrast change. Preserving source values is not
  evidence of accessibility compliance; no automatic color correction was made.
- #999 wide-view preview, varied hover shades, avatar/brand/tool colors, gradients,
  inline styles and JavaScript-generated styles remain outside this extraction.
- --titan-type-thread-title-size is shell-specific evidence, not a cross-app heading
  standard. Roles can evolve independently even when backed by one primitive today.
- Root aliases resolve at their declaration scope; no theme or descendant override
  behavior is promised. Existing legacy tokens remain unchanged.

## Adoption and specimen

116 declarations across 62 selectors now consume app-owned primitives/roles.
color-type-adoption.json records every selector, property, previous spelling and
token, plus before/after hashes. Source substitutions preserve declaration order,
specificity and existing overrides. No spacing, layout, HTML structure, script or
component contract changed. The stylesheet link correction below is the only
integration change. Components/compositions remain empty.

specimens/foundations.html imports the actual tokens and shows palette roles,
typography samples, source uses, partial-adoption scope and review notes. Its layout
CSS is specimen-owned. It does not duplicate an extracted component implementation.

## Verification

A reverse-substitution comparison, including reversal of the stylesheet link
correction below, reproduces the pre-pass shell byte-for-byte.
Each new token resolves to the previous declaration value (short/long hex spellings
are treated as equivalent). This verifies source equivalence, not browser rendering.
Browser discovery returned no connected browsers or apps, so screenshots, computed
styles, visual comparison, keyboard checks and narrow layout review remain pending.

## Next review

Review the source shell and foundation specimen visually before changing values.
Review muted text contrast and the two reading surface values. Then take spacing
as a separate pass. Do not proceed to component extraction automatically.

## Stylesheet integration correction

HTTP checks found that the phase 1 relative import returned 404 in the studio:
/app/app-design-system/* is intentionally excluded by its file-serving policy.
The shell now uses /design-system/tokens.css. A one-time onerror handler falls back
to ./app-design-system/tokens.css for standalone/file-based use and clears itself to
avoid a retry loop. Existing application scripts are untouched. This corrects the
initial-extraction note's assumption that the relative import worked in both mounts.
The canonical studio CSS chain is HTTP-verified; browser fallback behavior still
requires visual review. The shared studio checkout was not modified.

Final source validation: zero attachment-validator errors. All 116 migrated
declarations resolve to equivalent original values, with no missing token references
or cycles. Reversing token substitutions plus the documented stylesheet link fix
reproduces the pre-pass source exactly. Visual verification remains pending.

User review: the user said the result "looks fine" and accepted colors/typography
as the baseline before authorizing spacing. This does not close the outstanding
accessibility, responsive and interaction checks above.
