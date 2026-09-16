# Sidebar header extraction

User-selected Mail sidebar-header and the Calendar top-left area establish two
observed variants. Extracted their layout into one shared renderer and stylesheet;
both screens now render it. Registry includes actual source, two-variant specimen,
Dropdown dependency and header-owned spacing mappings. No header-level action
states are invented. Mail retains its existing menu handlers; Calendar stays static.

Mail owns 12px inline insets, an observed component-scoped 11px gap, and 24px end /
3px top optical logo insets. Calendar uses 8px inline insets and 24px gap, with zero
logo inset. Dropdown retains its own 2px internal padding. Calendar preserves its
24px app-artwork specialization and dark backing. Parent widths remain screen-owned.
Logo artwork remains the existing email-shell asset, passed as a renderer prop.

Checks: attachment validation passed; browser preview rendered both variants at
64px/52px height and 77px/100px logo widths. Mail switcher still opens and updates
aria-expanded. Calendar inspector identifies Sidebar header and its shared sources,
reporting 8px insets and 24px gap. No shared typography applies to this image-only
header. Unchanged Dropdown behavior remains owned by its existing component.

## Single layout revision

User requested the Mail layout as the only shared definition. Removed the Calendar
variant and its special trigger styling. Both consumers use the same 64px header
and 77×20 logo; only the app icon differs. Updated registry spacing selectors and
usage. Specimen now shows two icon instances of the same component.

## Single-example presentation

Removed the two icon examples from the specimen to avoid implying variants.
The gallery now shows one instance. Header inline padding references the existing
--titan-space-12 token directly, replacing the equivalent local alias; both sides
remain 12px. Updated spacing mappings. No consumer dimensions changed.
