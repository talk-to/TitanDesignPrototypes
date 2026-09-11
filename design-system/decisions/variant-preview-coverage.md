# Variant preview coverage and dark Icon button consolidation

Added Account Dropdown, stacked/wide Message row and Message list, and composer
field-mode targets. Live-only targets keep empty states and previewOnly metadata;
no child interaction duplication. Message collapsed/expanded remain states.
Existing studio already supports tabs with empty state lists; no tooling edit needed.

Unified Window and Dark compact as Dark. Icon-size option retains composer 18px
and calendar 16px artwork with one 24px control and dark-compatible state treatment.
Legacy variant names normalize to Dark for compatibility. Shared consumers migrated.

Checks: 15 targeted action/selection/composer/interaction tests passed. Browser
verified Account tab/state previews, Message list Wide Live-only tab with dependency
link, and three composer Dark controls retaining 18px SVGs. Attachment validation
passed before final documentation updates. Prior decision notes describe history.
