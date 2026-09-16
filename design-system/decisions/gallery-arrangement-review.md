# Component gallery arrangement review

Reviewed 2026-09-12. Scope: specimen arrangement and shared gallery dividers only; component implementations and states are unchanged.

All 31 registered components use the shared adapter. Its 75 configuration selectors were resolved in the browser; every gallery cell has a 1px divider. A registration gate now checks integration, explicit column counts and named configurations.

| Component | Columns | Configuration order |
| --- | --- | --- |
| Icon button | 2 | Default · 32px → Default · 40px → Compact → Composer → Dark → Dark quiet → Icon toggle → Icon toggle · On |
| Button | 2 | Default · With icon → Default · Label only → Primary · With icon → Primary → Outlined primary · With icon → Outlined primary → Outlined → Toolbar → Dark → Composer |
| Split button | 1 | Default → Composer |
| Half button | 2 | Icon and text · Left → Text and icon · Right → Text only · Left → Text only · Right → Icon only · Left → Icon only · Right → Composer · Left → Composer · Right |
| Message list | 1 | Stacked → Single line |
| Message row | 1 | Stacked → Single line |
| Received message | 1 | Collapsed → Expanded |
| Search field | 1 | With filters → Search only |
| Sidebar list item | 1 | Default → With count → With trailing action |
| Tabs | 1 | Default |
| Dropdown trigger | 2 | Default → Composer → Account → Account light → App switcher → Search filters |
| Checkbox | 2 | Default → Large |
| Grouped actions | 1 | Default |
| App switcher panel | 1 | Default |
| App grid | 1 | Default |
| App tile | 1 | Default |
| Launcher item | 1 | Tool → Supporting link |
| Composer field row | 1 | From → To → Subject |
| Formatting toolbar | 1 | Default |
| Composer header | 1 | Default |
| Composer tools | 1 | Default |
| Composer send actions | 1 | Default |
| Email composer | 1 | Default |
| Avatar | 2 | Default · 36px → Small · 24px |
| Sidebar header | 1 | Default |
| Mini calendar | 1 | Default |
| Calendar day | 1 | Default |
| Data list row | 1 | Default |
| Data list | 1 | With header → Two columns, no header → Empty state |
| Sidebar footer actions | 1 | One action → Two actions → Three actions, last icon-only |
| Account header | 1 | Default |

The Half button pairs Left and Right by content and size. Button pairs icon-bearing and text-only versions of shared treatments, then keeps the remaining specialized treatments together. Icon button pairs sizes, compact controls, dark treatments, and toggle values. Wide controls/compositions stay in one column. Footer actions progress from one to three.

Browser checks: all overview adapters and cell borders; source horizontal overflow across all components; Half button overview and expanded layout pairing. The data-list specimen wrapper was widened to its measured intrinsic content width to remove gallery-induced overflow. No component-internal CSS was changed.
