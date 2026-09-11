# Re-audit of spacing relationships

Source: `Shells/TitanEmailShell/index.html`. Static review covered 105 gap/margin
declarations and 14 inline styles containing gap/margin. Duplicate stylesheet rules
were inspected separately and are not counted as independent design contexts.
Full inventory and exact substitutions: `spacing-reaudit.json`.

## Adopted relationships

| Semantic token | Primitive | Evidence | Scope |
| --- | --- | --- | --- |
| `--titan-gap-text-tight` | `--titan-space-3` | `.tile-content` gap; `.exp-sender` bottom margin | Dense text stacks: sender/subject/preview and sender/recipient metadata |
| `--titan-gap-icon-label` | `--titan-space-8` | `.compose-main-btn`, `.nav-item`, `.footer-link-content`, `.side-modal-radio-label` | Standard icon or selection indicator beside a label |
| `--titan-gap-icon-label-compact` | `--titan-space-4` | `.action-opt`, `.comp-feat` (two declarations) | Compact icon-label actions and feature controls |
| `--titan-gap-actions-compact` | `--titan-space-4` | `.toolbar-icons`, `.tile-hover-actions`, `.email-action-bar`, `.comp-send-icons` (two declarations) | Tight horizontal action groups |

The original sender-to-recipient margin is **3px**, not the preview's invented 4px.
Added the observed 3px primitive rather than normalizing the screen to a 4px grid.
These are distances between layout boxes; visible glyph separation also includes
font metrics and line height. The new text-gap preview measures the CSS gap.

## Relationships kept separate

- Profile name/email uses 2px; app-switcher icon/caption also uses 2px but has a
  different structure. Neither establishes a universal title/supporting-text role.
- `.powered-by` and `.tile-icons` use 3px for branding and icon stacks; these were
  not conflated with the compact text role merely because their values match.
- `.side-modal-section-title` has 4px bottom margin **plus** its parent's 8px gap;
  the inter-item distance is not simply a 4px title-to-content rule.
- Format toolbars and smaller footer controls use 6px. These remain distinct from
  4px action clusters and 8px icon-label spacing; no normalization was made.
- Wide-view text-stack gap is explicitly 0. Its existing override remains intact.
- Negative collapsed-stack overlap, inline reply overrides, and positional offsets
  remain source-owned. Repeated declarations alone do not prove reusable semantics.
- General heading/description, paragraph, and section-spacing rules still need
  more evidence; no such roles were invented in this audit.

## Preview correction

The 16px `--titan-message-header-gap` belongs to a horizontal sender/summary layout
in collapsed thread rows. Its former avatar/name/metadata example was misleading.
It now shows sender and summary. The expanded header's avatar gap remains 12px
in the actual source. The new 3px text role has a separate name/metadata example.
Mail-row inset examples reference the 3px text-gap role. The shared studio no longer
invents a default 4px gap between every line of its illustrative text.

## Verification

14 declarations across 12 unique selectors were replaced, preserving each original
property owner, cascade and resolved distance. Reversing only those substitutions
reproduces the pre-audit source byte-for-byte; hashes are in the JSON record.
The attached registry and token graph validate. Browser visual verification remains
unavailable; this is a source audit, not a claim of computed-layout verification.
