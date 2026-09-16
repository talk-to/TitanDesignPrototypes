# Mini calendar and dark Button extraction

User selected Calendar mini-calendar and Add calendar for shared reuse, explicitly
requesting independently usable components with optional host reactions.

Mini calendar reuses dark Icon buttons for month navigation. It owns the date grid,
selected value, visible month and keyboard navigation; host owns page navigation,
fetching, events and week-grid updates. Props/outputs and cleanup documented in
USAGE.md. Date parsing uses UTC date arithmetic to avoid DST drift. One dark design;
date, month and locale are content/configuration, not variants. Existing screen
insets promoted to component roles; divider remains screen-owned. Nested arrows
retain their own interaction previews. Parent date-state previews registered.

Add calendar now renders Button dark variant; its plus asset is registered. Owns
4px block/8px inline insets, 8px icon-label gap and 18px artwork, plus dark-compatible
hover/focus states. No unrelated Button usages changed. Calendar static page actions
remain unconnected; mini calendar local interaction is active as requested.

Validation: 12 targeted tests passed, including leap-year/date validity, empty
selection, disabled state, silent updates and cleanup. Browser verified click and
keyboard date signals and month navigation. On Calendar selection updates the mini
calendar without changing week headers. Measured 16px/12px component insets, reviewed
1280px page layout with no document overflow. Attachment validation passed.

Follow-up (explicit user request): the calendar now owns a fixed width
(`--titan-mini-calendar-width`, 250px) so month changes never resize it. Month arrows
are wrapped in calendar-owned `[data-calendar-nav]` spans instead of rewriting the
Icon button markup, and the date grid composes registered Calendar day instances.
Mini calendar retains the selection value, roving focus and month browsing; Calendar
day owns the day buttons' semantics and visual states. Calendar day has its own
registry entry, preview and interaction target.
