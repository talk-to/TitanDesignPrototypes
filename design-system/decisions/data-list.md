# Data list component and Contacts migration

Added shared Data list (`titan-data-list`) for tabular rows with caller-defined
columns. Motivation: Contacts had hand-rolled `.contact-grid`/`.contact-row` while
Mail already had `titan-message-row`, so two list implementations shared nothing.
The abstraction is drawn from existing source, not speculation.

Contract: the list owns column tracks, cell inline insets, row rhythm and card
chrome; the screen owns table width, scrolling, row hover color and slotted
component sizing. Column tracks pass through one `--titan-data-list-columns`
custom property, so column count is data, not a variant. Row/head heights, cell
inset and row gap are exposed as `--titan-data-list-*` properties rather than
elevated into shared constants, since Contacts' 66px/62px are incidental values.

Three cell roles: `control` (intrinsic width, centered slot), `key` (exactly one
required; the record identifier, semibold with ellipsis and a leading slot) and
`value` (plain text, clipped). Cells accept supplied text or an empty slot host
addressed as `[data-slot="<rowId>:<columnKey>"]`, header row id `head`. This keeps
the existing `*-host` + `mount()` convention: Contacts fills key slots with Avatar
and control slots with Selection. Plain text stays text until it has behavior; an
email cell becomes a component when it gains a link, copy or badge, and the list
does not change when it is promoted.

Variants are Plain and Card (bordered row surface); hover is a state. Mail was not
migrated — `titan-message-row` is flex-based with stacked sender-over-subject and
its own `--wide` variants, so conversion is a separate, larger change.

Checks: registered contract with parts, spacing mappings and ownership; attachment
validation passed with no errors; renderer smoke-tested for markup, guards
(exactly-one-key-column), empty state and long-content clipping. Caught and fixed
a header control cell rendering empty text instead of a slot, which left select-all
unmountable. Contacts select-all was rescoped to the head slot, which also repaired
a pre-existing broken `getElementById('select-all-host input')` lookup that made
its indeterminate state dead code.

Limitation: visual review pending — no browser access in this session. Rendered
Contacts layout, card chrome, alignment at narrow widths and the specimen previews
still need inspection with the spacing inspector.

## Button Outlined primary promoted from a Contacts derivation

The Contacts import action was a local, unregistered derivation of Button
Outlined (declared in the shell's derivations.json, tagged with data-derived-*
so the inspector reported it in yellow). Promoted to a registered variant on
request: `outlined-primary` reuses Outlined geometry, hover and active
treatments and adds accent text, icon and border with semibold weight.

The screen now selects the registered variant and owns no button colour: the
local CSS rule, the derivation classes and the data-derivation-* attributes are
removed, and derivations.json records the promotion with no open derivations.
The import icon stays a screen-local asset supplied through the icon slot, which
is instance content, not part of the variant. Shared specimens are label-only,
matching Outlined and Primary, because no registered icon named `import` exists.

Checks: variant added to the renderer whitelist, the gallery specimen and the
interactions target (with the same five states as Outlined, wired so the target
actually renders the variant). Attachment validation and the 56-test suite pass.

Limitation: visual review pending — no browser access. The accent border, text
and icon colour, the hover/active/focus treatments and the Contacts toolbar
rendering still need inspection.

## Sidebar list item: trailing action variant

Contacts needed a clickable info icon at the right of each nav item. A control
cannot nest inside the item's button, so the shell faked it: 44px of extra
right padding on the item plus an absolutely positioned sibling button laid
over it, with the geometry screen-owned and not inspectable.

Added the With trailing action variant. When `action: {icon, label, disabled}`
is supplied the renderer wraps the item in `.titan-sidebar-item-row` and emits
a sibling `.titan-sidebar-item__action` button. The item element stays a button
in both variants; both controls stay separately focusable and keep their own
accessible names. `mount` now binds activate to the item rather than the root,
and the action's click stops propagation so it does not also activate the item,
reported through a new `action` callback.

The row owns the arrangement — item takes the free width, action keeps a 20px
square slot and the end inset — and that inset is registered as a spacing
mapping. Hover colours remain screen-owned, matching how the item's own hover
already worked. Contacts lost 19 lines of CSS, the .nav-entry/.nav-info markup
and the 44px magic padding.

Checks: renderer output verified for both variants; specimen gained a reachable
"With trailing action" sample that reports both callbacks; interactions target
added with the same six states as the default item and wired so the target
actually renders the variant. Suite of 56 tests and attachment validation pass.
The shared specimens use the registered `help` icon because no `info` icon is
registered; Contacts keeps its local info.svg through the icon slot.

Limitation: visual review pending — no browser access. Row alignment, the
action's hit area and hover, focus rings on both controls, and the dark-sidebar
colours still need inspection.
