# First shared action components

Implemented Icon Button, Button and Split Button as native-button contracts with
one shared stylesheet and escaped renderer/mount API. Registered three live specimens.
Only observed sizes/treatments are included. The studio supports optional bounded
previewHeight metadata so these controls do not need oversized frames.

Migrated source: Settings and Read receipts toolbar icons; Reply, Reply all and
Forward footer actions; New email split control. Source screen imports actions.css.
Top-toolbar buttons retain their existing 40px size and image-hover treatment;
other action examples use the observed 32px size. Callback wiring is retained for
Settings, Compose and Reply actions. Read receipts was an unwired prototype action
and remains unwired. The formerly no-op compose secondary trigger is now explicitly
disabled rather than suggesting a working menu. No menu or send behavior was invented.
Existing Send instances and other action families are not yet migrated.

Buttons own internal dimensions/spacing, parents own group gaps. Native disabled,
keyboard activation, focus-visible and optional pressed state are included. The
specimens use real components with local callback demonstrations, not app operations.
Component sources remain app-owned in the root design-system folder; only preview
height support is shared studio tooling.

Validation: attachment checks, renderer escaping/contract/callback tests, and studio
tests. Browser visual and keyboard verification could not be performed without a
connected browser; do not represent these as completed. No commit or push performed.

Component detail views now reuse the starter reference's Preview / Spacing toggle.
Button and split-button padding literals now reference equal existing spacing
primitives; their exact selectors and tokens are registered for the highlights.
Icon buttons use centered fixed-size geometry with zero padding; the inspector
outlines their bounds without inventing an internal padding token.

## Split-segment correction: Half button children

The earlier note here treated the main and secondary segments as internal parts.
That was superseded by USAGE.md's interaction-unit registration policy: the segments
are independently targetable, focusable controls with their own hover treatments, so
an enclosing registration cannot cover them.

Split button is now a composition of two registered Half button instances.
`TitanActions.halfButton({side,label,icon,labelHidden,size,haspopup,expanded,disabled})`
owns each segment's semantics, surface, outer radii, leading divider and hover,
active, focus and disabled treatment; `side` selects the Left/Right variants, and
icon-only, text-only and icon-and-text are content instances rather than variants.
Split button owns only the group arrangement and accessible label, lists
`half-button` as its dependency, and no longer carries per-segment interaction
targets. The composer variant passes the documented `size:'composer'` input. The
DS shell's static New email split was migrated to the same markup; other prototypes
that keep local split markup are reported, not migrated.

Follow-up (explicit user request): Half button outer corner radius increased from the
4px primitive to the existing 6px primitive; joined inner edges stay square. The DS
shell and the App sidebar prototype were migrated to the half-button markup so no
live consumer keeps the retired segment classes.

Disabled halves keep their joined surface and fade only the icon, label and leading
divider. Fading the whole half (as standalone buttons do) breaks the pair into a
solid and a pale segment, which the source never showed.

Follow-up (explicit user request): the DS-connected shells' New email secondary is
now an enabled, unwired prototype trigger with a full-opacity chevron, matching the
original source appearance. This supersedes the earlier note that the former no-op
secondary was explicitly disabled. `secondaryDisabled` remains available on the
renderer for callers that need a genuinely disabled half.

Follow-up (explicit user request): the default and primary Button inline insets read
too wide at 16px. Base `.titan-button` padding is now `--titan-space-4`
`--titan-space-12` with a tighter `--titan-space-8` left inset (left and right are
decoupled). The text-only override keeps symmetric 12px insets. Outlined keeps its
16px insets; Toolbar, Composer and Dark retain their scoped paddings. Registry
spacing mappings updated accordingly.

Follow-up (explicit user request): Half button's active state now adds a subtle
`scale(.97)` press-down on top of the existing active overlay, with a .1s transform
transition; reduced-motion disables that transition. Each half scales about its joined
edge — the left half anchors at its right edge, the right half at its left edge — so a
split pair's seam stays fixed while the outer edge pulls in. The change targets Half
button only; Button and Icon button are unchanged.
