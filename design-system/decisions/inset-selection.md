# Inset selection surfaces

User-approved visual direction: selection containers must not touch enclosing side edges; highlights retain their full height.
Use --titan-selection-inset (4px) horizontally, zero vertical inset, and
--titan-selection-radius (4px) for component-owned
background paint. Keep existing hit areas, content alignment, row geometry and state
semantics. Paint using noninteractive internal pseudo-elements; these are not new
interaction units. Focus rings remain a separate accessible treatment.

Applied to Sidebar list item, Message row, Tabs, Calendar day, and hover surfaces on
Data list row and Launcher item. App tile already has a rounded selected container
and external grid spacing. Existing button/toggle contracts remain unchanged.

Contacts and Drive full-width sidebar background overrides were removed so the
shared treatment is visible. These values are shared component tokens, not consumer
layout override hooks. Do not add local overrides to restore edge-to-edge paint.
