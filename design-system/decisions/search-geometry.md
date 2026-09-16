# Search geometry

Preserved observed dimensions as component-owned custom properties: field height
38px, search icon 16px, filter width 38px, chevron 12px. Width remains parent-owned
and the input flexes. Existing 12px left and 8px icon-to-input spacing are unchanged.

Registered geometry for search-icon vertical centering, chevron centering on both
axes and flexible input width. Inspector measures actual rendered rectangles,
subtracts container borders, and colors alignment space blue; declared spacing
remains yellow. Fluid outline describes the input allocation, not text whitespace.
Calculated free space is not registered as an extra margin token.

53 existing tests and attachment validation pass; browser visual verification pending.
