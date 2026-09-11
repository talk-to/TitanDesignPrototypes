# Layout guidelines

Find the interactive **Layout guide** under **Layouts & patterns → Layouts**.
Lists and grids are alternate arrangements in one guide, not separate components.
These are design guidelines, not required CSS classes, imports or runtime utilities.
Implement them with the screen's existing layout mechanism and Titan spacing tokens.

## Choose context before spacing

There is no universal list gap. Choose the content relationship and enclosing
surface first. Prefer a matching existing composite component unchanged; its
internal gaps are not overridable just because this guide discusses layouts.
The values below guide new parent-owned arrangements, not retroactive restyling.

| Context | Item gap | Group/section gap | Added outer inset | Evidence / status |
| --- | --- | --- | --- | --- |
| Full-page data/message rows | 0 | Separate section decision | 0 added around the list; page gutters separate | Observed contiguous rows in Message list and Data list |
| Dropdown/menu entries | `--titan-space-4` | `--titan-space-16` starting point | Preserve menu-surface contract; no extra inset by default | 4px observed in launcher tools; not a universal menu standard |
| Sidebar navigation | `--titan-space-8` | `--titan-space-16` starting point | 0 extra around already-padded items | 8px observed in Contacts; group gap is provisional |
| Settings/form groups | `--titan-space-12` between independent fields | `--titan-space-24` | 0 extra inside an already-padded surface | Provisional; composer’s contiguous fields are a distinct existing contract |
| Independent cards/content | `--titan-space-16` | `--titan-space-24` | Surrounding page/surface owns inset | Provisional; Card’s 16px internal padding is NOT evidence for its external gap |
| App-entry grid | `--titan-space-16` rows and columns | Surface contract | `--titan-space-16` inline, 8px bottom in launcher | Observed in App grid; panel owns top inset |
| Horizontal controls / footer actions | `--titan-space-8` starting point, 4px for tight groups | Context-dependent | Surface contract | Guideline; compact action gap has an existing semantic token |

Observed means supported by the inspected implementation, not universal across
Titan products. Provisional values are explicit first-use recommendations; verify
against the new screen and adjust with existing tokens. No new component variant
or extra approval is needed for parent-owned spacing choices. If an unknown context
appears, record the choice and evidence rather than pretending a universal rule exists.

### Source evidence

- `components/messages.css`: `.email-list`/`.email-tile` and Message list renderer:
  contiguous rows; row owns block/inline padding. Wide list has its own 4px block inset.
- `components/data-list.css`: shared grid tracks and column gap; no row gap.
  Its 12px column gap is not a vertical-list default.
- `components/app-switcher.css`: `.app-switcher-tools` uses 4px between entries;
  `.app-switcher-content` uses 16px between sections. App grid/rows use 16px gaps,
  16px inline inset and 8px bottom inset. Do not generalize legacy tool-item internal
  padding into a new menu-surface rule.
- `../Prototypes/Ishant/design ops/DS-specific shells/Titan Contacts/contacts.css`:
  `.contacts-nav` uses 8px. Sidebar item owns its internal padding.
- `components/composer.css`: adjacent field rows have their own internal padding
  and dividers. This does not establish a universal form-list spacing rule.

Use 0 for flush relationships, otherwise the existing 4, 8, 12, 16, 20 and 24px
Titan spacing tokens. Select semantic roles when they match. Gap between siblings,
gap between groups, container inset and item-internal padding are different
relationships. Never substitute one for another just because the pixels match.

## Layout contract

The parent owns gap, outer padding, alignment, wrapping, column count and available
space within the child's documented sizing contract. Default added outer padding is
zero; choose a spacing token when the surrounding surface needs an inset. The grid
example starts at three columns; choose columns or responsive breakpoints to suit
available width and the children's minimum widths. Footer alignment does not imply
viewport docking. A visual grid does not imply ARIA grid behavior.

These parent-owned choices can freely change without new variants or approval.
Do not use them to override child hit areas, icon sizes, typography, internal padding,
colors or states. A list item's icon-to-label spacing belongs to that component;
the gap between list items belongs to the parent. Avoid doubled child margin and
parent gap. If content cannot fit, wrap, reduce columns or scroll instead of clipping
or shrinking controls. Keep source/focus order meaningful and use semantic lists
when appropriate. The guide's examples are illustrative arrangements, not new controls.

## Required for DS screen work

Consult this guide alongside components and tokens whenever creating or rearranging
a DS screen. Choose context first, check the evidence/status above, then apply suitable defaults through existing screen code; describe meaningful
deviations in the screen's contract when useful. There is no required layout renderer,
class name, or import. Check gaps, outer padding, alignment, wrapping, long content
and minimum widths as part of the screen spacing review.

## Priority: existing components before layout guidance

Before creating a new screen or feature, inspect registered components and
compositions for the whole and its meaningful parts. Action group and App grid
remain supported registered defaults: use them unchanged when their contracts fit.
Their existence provides a reuse option before assembling a new arrangement.

Consult this layout guide for parent-owned relationships not covered by a suitable
existing component. Layout guidelines neither deprecate existing components nor
permit overriding their internals. Do not bypass a suitable existing component to
rebuild its arrangement from a guideline, and do not remove a registration merely
because some of its behavior is layout. A new layout-only arrangement does not
automatically need another component registration. Report mismatches and follow
explicit user direction before changing shared contracts or retiring components.
