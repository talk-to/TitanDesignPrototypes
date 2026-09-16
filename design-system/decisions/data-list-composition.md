# Data list composition

Data list now composes the registered Data list row renderer. The row is a useful
independent boundary (record geometry, cells and hover); header and empty-message
wrappers remain internal to the table. Both have real previews and explicit
ownership. Slots do not imply fixed dependencies: consumers mount their chosen
shared components unchanged.

Removed Contacts/Drive height and hover overrides, and Contacts/specimen Avatar
28px overrides. Drive returns to the standard row/header dimensions and Contacts
to default 36px Avatar; no compact variant was introduced. Drive's raw folder artwork
is styled by its own content wrapper, without targeting list internals.

The structural `sharedTracks` input preserves shared auto-column sizing through
subgrid; standalone rows default to independent tracks. CSS without subgrid keeps
the existing fallback limitation for auto columns. Header cells now expose
columnheader semantics. Row IDs must be unique and must not use reserved `head`.

Validation: attachment validator and three focused renderer tests passed. Browser
review covered standalone row, long text, empty/headerless lists, column alignment,
Contacts/Drive standard sizes and select-all, plus 360px row and 760px hosts. Spacing
mode was opened; resolved spacing and geometry were checked directly.
Screen wrappers were reviewed through rendered geometry, not component bands.

Follow-up (explicit user request): the row's hover fill is now inset on all four
sides (`--titan-selection-inset`) with `--titan-selection-radius`, and animates
quickly into hover (0.2s opacity 0→1 and scale 0.98→1), reversing on unhover.
Reduced motion disables the transition and scale. The row hit area, height and cell
geometry are unchanged.
