# Search field and sidebar list item

Source: TitanEmailShell's .search-bar and .nav-item families. Both are now registered
with shared CSS, escaped native-control renderers and live specimens. Source CSS was
extracted into components/navigation-input.css, leaving source HTML/callbacks intact.
The source search remains a readonly prototype; the reusable search supports input
and explicit search/filter callbacks. No search results service or filter menu was
invented. Account headers and collapsible account groups were not extracted.

Spacing audit: search uses 12px left icon margin and 8px icon/input separation.
Its 38px control, 16px icon and 38px filter slot are fixed geometry, not padding.
Source 575px width stays page-owned; shared field is fluid with a shrinking input.
Sidebar uses 6px vertical inset, 24px left inset, 12px right inset (8px with count),
8px icon/label/count gaps and 4px count insets. All are registered with matching
selectors and tokens; the 6px exception stays component-owned. Icon slot is 20px,
image maximum 16px; item is 32px tall. Zero padding and centered free space are not
invented semantic gaps. No new global scale values were introduced.

Selected, count, muted and disabled remain independent. Muted actions are operable.
Native buttons provide keyboard activation; callers own navigation, expanded state
and persistence. The source retains its existing static markup. Specimens use the
actual renderers. Long labels truncate without widening the item; search input shrinks.

Follow-up (explicit user request): in the With trailing action variant the row now
carries the item's focus ring (2px inset blue) so focus wraps the whole row like the
selection fill, and the disabled state disables both the item and the trailing action
so the whole composition fades. The nested Icon button keeps its own registered focus
treatment when focused directly.

Follow-up (explicit user request): the sidebar item's hover/selected fill uses an 8px
inline inset through the component-scoped
`--titan-sidebar-item-selection-inset-inline`, leaving more space at the left and
right edges than the shared 4px selection inset. The shared
`--titan-selection-inset` token is unchanged.

Validation: attachment check and renderer tests for escaping, accessibility labels,
optional filter, disabled/readonly states, zero counts, independent callbacks and
cleanup. Browser/computed-style, keyboard and narrow viewport verification remains
pending because no browser surface is connected; do not claim visual approval.

Follow-up (explicit user request): the search field's fallback icon no longer renders
a caret-down glyph; the component owns the registered `search` asset as its default
(icon remains an optional content override). The filter chevron is no longer a private
button: it is an unchanged Dropdown trigger instance using a new registered `search`
variant (icon-only, control-height, hover fill, disabled support) with its own catalog
preview target and geometry. Search field lists Dropdown trigger as a dependency, its
private filter interaction target moved to the trigger owner, and the local
`.search-dropdown` CSS and `filterIcon` prop were removed. The DS-connected
TitanEmailShell and the App sidebar prototype static triggers were migrated to the
registered markup. Verified in headless Chrome: search-only renders the registered
search asset (no caret), the trigger resolves 38×38 with the #eaeaea hover fill, filter
activation routes, the selection preview selector matches once, and both static
consumers hydrate the chevron and keep the 38px hover treatment.
