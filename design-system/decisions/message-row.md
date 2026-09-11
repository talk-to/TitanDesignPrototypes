# Message row registration

Registered the existing TitanMessages.row renderer and .titan-message-row as Message
row. No new visual family is introduced. Stacked/wide rendering and native row
callbacks remain shared; standalone wide rows now receive a variant class and the
same wide CSS as list-contained rows. Legacy list selectors preserve source-shell
compatibility. List renderer passes layout variant to its rows.

Moved row anatomy/spacing and interaction targets from Message list to Message row.
List retains wide top/bottom insets, scrolling, and a dependency link to the row.
Checkbox/star remain internal controls as implemented; no unverified shared child
reuse is claimed. Catalog class matching can now identify the selected shell row.

DS tests and attachment validation pass. Browser computed-layout and inspector
verification remain pending.

## Follow-up: shared child reuse

Message row now composes the registered Checkbox and Icon button (Icon toggle
variant) unchanged instead of its private native input and text-glyph star button.
Dependencies updated to ["checkbox","icon-button"]; the row keeps its open button,
layout, insets and callbacks, and toggles the Icon button's documented caller-owned
pressed state. Removed the private `.tile-star` glyph rules and the `.tile-chk input`
override, and stopped the generic row focus outline from targeting composed Icon
buttons. Legacy shell markup and its `.tile-star` styles are unchanged.

## Update: approved Icon toggle variant

The user requested the shared Icon toggle variant on Icon button for artwork toggles
(decisions/icon-toggle.md). The star now uses it with `icon:'star-outline'` and
`pressedIcon:'star'`, so the fill/unfill behavior is restored through the registered
owner. The earlier note about the compact control's shared pressed fill is
superseded. Wide rows may still shift the text column slightly because the controls
slot retains its observed 44px width while the star control is 24px. Browser
computed-layout and inspector verification of the updated row remain pending.

## Follow-up: list-owned between-row gap

Explicit user request: the space between list items is now a list-owned gap,
`--titan-mail-row-gap`, applied as `margin-top` between adjacent
`.titan-message-row` children of `.titan-message-list`. The row's internal block inset
was restored to its original 16px (`--titan-mail-row-inset-block`), so increasing the
gap no longer changes the row's own padding or height. Follow-up: the user reduced the
gap from `--titan-space-8` to `--titan-space-4` (4px). The row's 1px bottom separator
remains hidden from the earlier preview experiment, pending the user's call.
