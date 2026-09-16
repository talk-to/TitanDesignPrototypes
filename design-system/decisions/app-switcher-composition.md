# App switcher composition and registration

The user requested mandatory component-boundary rules and consolidation of the
App switcher wherever the shared system uses it. AGENTS.md, USAGE.md, the component
checklist and run-ds.md now require explicit responsibility, real standalone previews,
owned styling/API, direct dependencies and verified in-scope consumers.

Registered graph:
Sidebar header → App switcher → Dropdown trigger + App switcher panel.
App switcher panel → App grid + Launcher item. App grid → App tile.
Tools/links wrappers remain internal layout; they do not have independent contracts.

The existing app-switcher module exports each renderer; no file-per-component rule
is needed. Panel and grid own their own spacing mappings. Panel surface assets now
live with the shared component. App-owned options live in app-switcher-config.js.
Leaf roots carry their scope so standalone previews do not rely on parent styling.
The trigger accepts a documented controls id; App switcher does not rewrite its markup.

Mail's duplicate markup, CSS and opening script were removed. Mail, Calendar, Contacts
and Drive now initialize the same full composition with their current app selected.
Contacts/Drive permit the popover outside their sidebar; no child CSS overrides were
added. Existing independent non-DS shells and archived reference copies are unchanged.
Selection emits an id and closes the panel; navigation remains host-owned.

Verification: all four real shells opened and showed nine tiles, tools and links;
selected app matched each host. Escape and selection return focus to the trigger.
Tests cover outside dismissal, toggle, selection callbacks, listener cleanup, more
than nine grid items, partial rows, safe content, and standalone surface defaults.
Grid and panel catalog previews and spacing inspector mappings were visually checked.
Attachment validation and 12 relevant launcher/selection/icon-runtime tests pass.
Observed desktop 1280×720 layouts are verified. Shorter viewports, unusually long
labels and arbitrary placement near viewport edges are not fully reviewed.

Follow-up (explicit user request): the app grid's 8px bottom inset was removed so the
panel content gap (`--titan-space-16`) is the single owner of section spacing; the
grid's side insets and row gaps are unchanged.

Follow-up (explicit user request): the catalog pattern was named after the feature and
read as implementation-specific. The entry is now Anchored popover disclosure
(id `anchored-popover`, category Interaction Patterns): it documents the general
trigger + floating panel + page-owned coordination contract, with the App switcher
kept as the reference implementation and preview. The studio keeps old
`#patterns/app-switcher` links working through a route alias.
