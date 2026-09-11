# Current location

The content moved to workspace-root `design-system/`, gitignored at Ishant’s request.
Historical paths below describe extraction-time locations. The initial source is
`../Shells/TitanEmailShell/index.html`; the shared system serves future prototypes.

# Titan design-system findings — durable handoff

Read this file before enriching the Titan DS. It survives studio updates because it
lives in the app-owned content folder, outside the ds-starter Git checkout.

## Reading this record

This file preserves initial extraction evidence and the studio-refresh snapshot.
Its historical counts, paths and test results are not a current inventory.
Use `registry.json` and its referenced implementations for current registrations,
`USAGE.md` for application guidance, and later topic decisions for subsequent changes.
The catalog now includes components, patterns and icons; the initial empty-catalog
restriction has been superseded. Verification remains specific to each recorded pass.

## Intent and boundaries

This is the growing **Titan design system**, not an email-only or one-screen DS.
TitanEmailShell/index.html is the first reference; further selected screens will
add evidence. The folder location is historical storage, not the product boundary.
Do not impose unproven cross-product rules from one source.

The user accepted the color/typography appearance ("looks fine"). Spacing was
extracted with unchanged values and offered for review; do not infer that every
state or responsive layout was approved. At initial extraction the catalogs were
empty; later authorized passes registered the implementations now in registry.json.

Use the current upstream studio layout. The user prefers a persistent sidebar,
Overview as an optional introduction, and content filling the remaining area with
minimal repeated headers. Do not reapply archived local workbench customizations
or modify shared studio files merely to tailor Titan's presentation.

## Initial extraction snapshot (historical)

- 67 token declarations in three app-owned files, imported by tokens.css.
- 14 original root controls were moved without value changes during setup.
- 116 static color/type declarations across 62 selectors adopted token references.
- 32 static spacing declarations across 25 selectors adopted token references.
- Existing source declaration order, specificity, density, scripts and inline
  behavior were preserved. This is partial adoption, not measured product coverage.
- Every root alias at that checkpoint resolved under the upstream foundation index.
- The shell loads /design-system/tokens.css in the studio, with a one-time relative
  ./app-design-system/tokens.css error fallback for standalone usage. The old
  relative-only path fails under the studio's protected /app/ mount.

Detailed adoption maps: decisions/color-type-adoption.json and
 decisions/spacing-adoption.json. These contain historical before/after hashes and
selector/property replacements; later passes naturally supersede earlier hashes.

## Color evidence and decisions

Primary action blue is #2170f4. Action backgrounds, active indicators and link
text keep separate role aliases even where they share a primitive.
White #fff is used for base surfaces and inverse text. Navigation and composer
header both use #1c1c1c, with separate roles. Observed text values are #1a1a1a
(strong), #333 (primary), #666 (secondary) and #888 (muted).

Actual reading surfaces use #fbfbfb. Legacy --reading-pane-bg is #f9f9fa: retain
both until a deliberate visual decision. Search, selection and hover shades also
have existing distinctions. Preserve #999 wide-view preview, avatar/tool colors,
local gradients, inline styles and SVG colors pending review. #888 metadata contrast
is not approved as accessible merely because its appearance was accepted.

## Typography evidence and decisions

System stack: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif.
No new webfont was introduced. Observed sizes: 11px compact timestamps, 12px metadata,
13px compact actions, 14px body/controls, 15px senders/tabs, 24px thread title.
These are size roles, not a full universal type scale. 400/500/600 weights have
primitive tokens; existing 700/800 weights and an 18px action symbol stay local.

The 20px body line height is adopted only where originally explicit. Keep 44px
wide-row alignment, 24px input alignment and the title's 1.3 line height local.
Wide-view sender is 14px rather than 15px; its timestamp is 12px rather than 11px.
The thread-title role is evidence from this shell, not a cross-product heading rule.

## Spacing evidence and decisions

Observed primitive subset: 4, 8, 12, 16, 20 and 24px. This is not a mandatory grid.
Other optical/control values (including 1, 2, 3, 5, 6, 10, 11 and 14px) remain valid.

Separate relationships: reading-pane inline inset 24px; default mail-row block
inset 16px and inline inset 12px; message inline inset 24px, header block inset 20px,
and header content gap 16px. Equal values do not prove shared ownership.

Keep these exceptions:
- Wide-view mail row padding: 0 16px 0 21px; 160px reserved for actions.
- Collapsed stack: 60px height with -50px overlap; expanded margins stay separate.
- Expanded header: 20px top / 24px sides / 12px bottom.
- Composer and inline reply: distinct 16px / 24px insets, duplicate selectors and
  inline overrides; no unification without reviewing the cascade.
- Existing 8px margins remain on their original owners. Do not add parent gaps that
  double them. Legacy --card-spacing: 12px has not been reassigned to a shared role.

## Shape, motion and remaining evidence

Legacy controls include 4px card radius, 6px compose/search radius, 12px card spacing,
0.97 click scale, 12% white hover overlay and 15% black active overlay on accent.
These were preserved, not expanded into a finished shape or motion system. The
elevation pass now registers observed shadow roles for the shared message action,
thread stack, tooltip, App switcher, side modal and composer window. One-off
shadows, focus effects, z-order and interaction/state contracts remain scoped
exceptions or later work. Action and split-button components have since been
registered; their current contracts live in registry.json and components/actions.*.

## Initial extraction verification boundary (historical)

Source-equivalence comparisons passed for the color/type and spacing substitutions.
The user reviewed appearance; agent browser verification has been unavailable.
Responsive layout, keyboard behavior, long/empty/optional content, computed cascade
and accessibility still need explicit checks. Suggested viewports: 1440×900,
1280×800 and 768×900. Do not claim mobile support or full behavior verification.

## Recorded studio refresh and recovery (historical)

Studio: Prototypes/Ishant/design ops/design system, GitHub ishantperiwal/ds-starter.
Upstream installed at that refresh: e544b39b9272758241f6ba1f9b34798a5ebdaf8b (studio 0.3.0).
All local studio customizations were backed up and stashed before a checked update.
Recovery folder: Prototypes/Ishant/design ops/design-system-recovery/20260908-180857.
Git stash label: Preserve local Titan workbench before e544b39 upstream update.
The archive includes the prior studio files, app content and shell; manifest.json
contains original hashes. No findings depend solely on conversation memory.

The old standalone color/type and spacing presentation pages are retained as
supporting files, but removed from active screen registrations. Use the native
Foundations tab to browse the current tokens. Only actual source screens should
appear as reference screens; never copy sandbox blocks into the Titan catalog.

## Complete token inventory at refresh

Declared values and root-alias resolutions are shown below. They are not a computed
CSS cascade or theme evaluation. This table is a snapshot; CSS files stay authoritative.

| Token | Declared value | Root literal | Source |
| --- | --- | --- | --- |
| `--titan-color-white` | `#fff` | `#fff` | tokens/primitives.css |
| `--titan-color-paper` | `#fbfbfb` | `#fbfbfb` | tokens/primitives.css |
| `--titan-color-ink` | `#1a1a1a` | `#1a1a1a` | tokens/primitives.css |
| `--titan-color-charcoal` | `#1c1c1c` | `#1c1c1c` | tokens/primitives.css |
| `--titan-color-gray-800` | `#333` | `#333` | tokens/primitives.css |
| `--titan-color-gray-600` | `#666` | `#666` | tokens/primitives.css |
| `--titan-color-gray-500` | `#888` | `#888` | tokens/primitives.css |
| `--titan-color-blue` | `#2170f4` | `#2170f4` | tokens/primitives.css |
| `--titan-font-system` | `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif` | `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif` | tokens/primitives.css |
| `--titan-font-size-11` | `11px` | `11px` | tokens/primitives.css |
| `--titan-font-size-12` | `12px` | `12px` | tokens/primitives.css |
| `--titan-font-size-13` | `13px` | `13px` | tokens/primitives.css |
| `--titan-font-size-14` | `14px` | `14px` | tokens/primitives.css |
| `--titan-font-size-15` | `15px` | `15px` | tokens/primitives.css |
| `--titan-font-size-24` | `24px` | `24px` | tokens/primitives.css |
| `--titan-font-weight-regular` | `400` | `400` | tokens/primitives.css |
| `--titan-font-weight-medium` | `500` | `500` | tokens/primitives.css |
| `--titan-font-weight-semibold` | `600` | `600` | tokens/primitives.css |
| `--titan-line-height-20` | `20px` | `20px` | tokens/primitives.css |
| `--click-scale` | `0.97` | `0.97` | tokens/semantics.css |
| `--reading-pane-bg` | `#f9f9fa` | `#f9f9fa` | tokens/semantics.css |
| `--border-color` | `#e8eaed` | `#e8eaed` | tokens/semantics.css |
| `--card-border-color` | `#dedede` | `#dedede` | tokens/semantics.css |
| `--card-border-radius` | `4px` | `4px` | tokens/semantics.css |
| `--card-spacing` | `12px` | `12px` | tokens/semantics.css |
| `--compose-border-radius` | `6px` | `6px` | tokens/semantics.css |
| `--search-bg` | `#f4f4f7` | `#f4f4f7` | tokens/semantics.css |
| `--search-border-radius` | `6px` | `6px` | tokens/semantics.css |
| `--hover-bg` | `#eaeaea` | `#eaeaea` | tokens/semantics.css |
| `--hover-overlay-on-accent` | `rgba(255, 255, 255, 0.12)` | `rgba(255, 255, 255, 0.12)` | tokens/semantics.css |
| `--active-overlay-on-accent` | `rgba(0, 0, 0, 0.15)` | `rgba(0, 0, 0, 0.15)` | tokens/semantics.css |
| `--selected-bg` | `#eff6ff` | `#eff6ff` | tokens/semantics.css |
| `--selected-bg-strong` | `#e0ecfc` | `#e0ecfc` | tokens/semantics.css |
| `--titan-surface-base` | `var(--titan-color-white)` | `#fff` | tokens/semantics.css |
| `--titan-surface-reading` | `var(--titan-color-paper)` | `#fbfbfb` | tokens/semantics.css |
| `--titan-surface-navigation` | `var(--titan-color-charcoal)` | `#1c1c1c` | tokens/semantics.css |
| `--titan-surface-composer-header` | `var(--titan-color-charcoal)` | `#1c1c1c` | tokens/semantics.css |
| `--titan-text-primary` | `var(--titan-color-gray-800)` | `#333` | tokens/semantics.css |
| `--titan-text-strong` | `var(--titan-color-ink)` | `#1a1a1a` | tokens/semantics.css |
| `--titan-text-secondary` | `var(--titan-color-gray-600)` | `#666` | tokens/semantics.css |
| `--titan-text-muted` | `var(--titan-color-gray-500)` | `#888` | tokens/semantics.css |
| `--titan-text-inverse` | `var(--titan-color-white)` | `#fff` | tokens/semantics.css |
| `--titan-action-primary` | `var(--titan-color-blue)` | `#2170f4` | tokens/semantics.css |
| `--titan-indicator-active` | `var(--titan-color-blue)` | `#2170f4` | tokens/semantics.css |
| `--titan-text-link` | `var(--titan-color-blue)` | `#2170f4` | tokens/semantics.css |
| `--titan-font-family-ui` | `var(--titan-font-system)` | `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif` | tokens/semantics.css |
| `--titan-type-body-size` | `var(--titan-font-size-14)` | `14px` | tokens/semantics.css |
| `--titan-type-control-size` | `var(--titan-font-size-14)` | `14px` | tokens/semantics.css |
| `--titan-type-control-compact-size` | `var(--titan-font-size-13)` | `13px` | tokens/semantics.css |
| `--titan-type-sender-size` | `var(--titan-font-size-15)` | `15px` | tokens/semantics.css |
| `--titan-type-tab-size` | `var(--titan-font-size-15)` | `15px` | tokens/semantics.css |
| `--titan-type-meta-size` | `var(--titan-font-size-12)` | `12px` | tokens/semantics.css |
| `--titan-type-meta-small-size` | `var(--titan-font-size-11)` | `11px` | tokens/semantics.css |
| `--titan-type-thread-title-size` | `var(--titan-font-size-24)` | `24px` | tokens/semantics.css |
| `--titan-type-body-line-height` | `var(--titan-line-height-20)` | `20px` | tokens/semantics.css |
| `--titan-space-4` | `4px` | `4px` | tokens/spacing.css |
| `--titan-space-8` | `8px` | `8px` | tokens/spacing.css |
| `--titan-space-12` | `12px` | `12px` | tokens/spacing.css |
| `--titan-space-16` | `16px` | `16px` | tokens/spacing.css |
| `--titan-space-20` | `20px` | `20px` | tokens/spacing.css |
| `--titan-space-24` | `24px` | `24px` | tokens/spacing.css |
| `--titan-reading-pane-inset-inline` | `var(--titan-space-24)` | `24px` | tokens/spacing.css |
| `--titan-mail-row-inset-block` | `var(--titan-space-16)` | `16px` | tokens/spacing.css |
| `--titan-mail-row-inset-inline` | `var(--titan-space-12)` | `12px` | tokens/spacing.css |
| `--titan-message-inset-inline` | `var(--titan-space-24)` | `24px` | tokens/spacing.css |
| `--titan-message-inset-block` | `var(--titan-space-20)` | `20px` | tokens/spacing.css |
| `--titan-message-header-gap` | `var(--titan-space-16)` | `16px` | tokens/spacing.css |

## Designer-facing presentation correction

The user requested a visual catalog, not a developer-facing token inventory.
Typography uses full-line specimens and role names. Spacing uses a compact,
comparable scale; roundness uses simple shapes and values. Token names stay visible
upfront on every sample. File paths and scopes stay inside closed Details. Avoid
magnified diagrams and component-association commentary. Visible copy stays minimal.
App-owned labels/examples live in registry.foundationPresentation;
this metadata does not change actual token values or mean radii are fully adopted.

Current DS-connected shell: `../Prototypes/Ishant/design ops/DS-specific shells/TitanEmailShell/`.
The original `../Shells/TitanEmailShell/` has been restored to its pre-DS Git version.
Use the DS-specific copy for ongoing DS work; see decisions/ds-shell-location.md.
