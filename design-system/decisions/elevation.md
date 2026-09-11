# Elevation role pass

## Scope and source

This pass uses the DS-connected `Prototypes/Ishant/design ops/DS-specific shells/TitanEmailShell/index.html` as the primary source. The original `Shells/TitanEmailShell/index.html` was cross-checked for source fidelity. Shared Messages and App switcher styles were included where the same observed treatment is owned by a registered implementation.

Elevation means visual depth created by `box-shadow` or `drop-shadow`. Focus rings, editor inset focus effects, borders, transitions and `z-index` remain separate concerns. The result is an observed role inventory, not a numeric elevation ladder.

## Registered roles

| Token | Observed source/context | Value |
| --- | --- | --- |
| `--titan-elevation-message-action` | Message-row action pill | `0 1px 0.5px rgba(0, 0, 0, 0.05)` |
| `--titan-elevation-stack-card` | Collapsed thread stack card | `0 1px 2px rgba(0, 0, 0, 0.02)` |
| `--titan-elevation-stack-pill` | Collapsed thread stack count pill | `0 1px 3px rgba(0, 0, 0, 0.06)` |
| `--titan-elevation-stack-pill-hover` | Thread stack count pill hover | `0 2px 4px rgba(0, 0, 0, 0.08)` |
| `--titan-elevation-tooltip` | Sidebar tooltip | `0 2px 10px rgba(0, 0, 0, 0.35)` |
| `--titan-elevation-app-switcher` | Registered App switcher panel | `0 3px 8px #0001` |
| `--titan-elevation-side-modal` | Settings side modal | `-4px 0 24px rgba(0, 0, 0, 0.15)` |
| `--titan-elevation-composer-window` | Bottom-docked composer window | `0 -4px 32px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.09)` |

The composer value intentionally preserves its observed compound shadow, including
the one-pixel boundary ring. It is not a replacement for the separate focus-ring
contract.

## Adoption

The shared Message row and App switcher now consume their registered roles. The
DS-connected shell consumes the roles for the tooltip, thread stack, settings modal
and composer window. The original shell remains unchanged.

## Intentional exclusions

The reply-card inline shadow, side-modal edit-button shadow, workspace-pattern
illustrative shadow and ripple/editor focus shadows remain local. They are either
one-off source geometry, low-fidelity fixture styling or interaction effects without
enough independent evidence for a shared elevation role.

No `z-index` scale or modal scrim token was introduced. Those require separate
evidence and behavior review.

## Verification

Token import resolution, registry validation and source-equivalence checks are run
after implementation. Browser visual review at 1440×900, 1280×800 and 768×900
remains a required follow-up when browser inspection is available.

## Primitive foundation

Added a user-requested recipe layer and primitive-to-role studio view. All eight
existing values are preserved exactly. Downward recipes, the filter/drop-shadow
recipe, and directional left/up recipes remain distinct: consolidating these
would change existing product appearance. Names describe geometry/treatment rather
than component purpose or a claimed universal height ladder. Roles remain the
consumer API. Future roles may reuse these recipes; current one-to-one mappings
reflect the distinct observed values rather than proof of broad adoption.

## Reusable role names

The source screen provides evidence rather than a restriction on reuse. Active
role names now describe purpose; their shadow recipes and rendered values are
unchanged. Existing consumers and the catalog have migrated. The earlier table
above records historical extraction names.

- `message-action` → `compact-action`
- `stack-card` → `stacked-surface`
- `stack-pill-hover` → `floating-badge-hover`
- `stack-pill` → `floating-badge`
- `app-switcher` → `popover`
- `side-modal` → `side-panel`
- `composer-window` → `bottom-panel`

Tooltip retains its existing name. Popover preserves filter/drop-shadow semantics;
Side panel remains right-docked and Bottom panel remains bottom-docked. These are
initial reusable contracts, not claims of adoption across independent screens.
Source-specific evidence stays in catalog Details. Borders and surfaces remain
separate component-owned properties.

## Combined elevation treatment

Elevation now composes the observed border with its shadow. Border recipes remain
independent tokens, with role aliases and optional catalog `border` references.
Compact action, stacked surface and floating badge (including hover) consume the
paired values. Utility classes expose each complete treatment for new consumers.
All values preserve the observed implementation. Docked side-panel semantic
samples span the sample viewport height. These remain purpose-based treatments,
not an invented numeric ladder.

## Numbered levels 0–4

User requested an explicit increasing scale for instructions such as “one level
higher.” Levels are deliberate new design decisions rather than extracted claims:
0 none, 1 0/1/3 at 6%, 2 0/2/4 at 8%, 3 0/4/12 at 12%, 4 0/8/24 at 18%.
Each uses a 1px #dedede border. Compact action/stacked surface map to 1; floating
badge maps to 2 and hover 3; tooltip maps to 4. This supersedes earlier unchanged-
value statements for those consumers. Role names remain stable. Directional panels
and the shaped, asset-backed popover stay outside the scale. Earlier notes describe
historical states. This scale controls appearance, not stacking order or modality.

Verification for numbered levels: attachment and studio validation pass; studio
test suite passes, including a new level/role alias rendering test. Browser review
confirmed the level map, shared Level 1 links, and resolved shell action/stack
borders and shadows. Earlier source fidelity claims do not apply to normalized
level values.

## Stroke foundation and overview navigation

The shared level border uses `--titan-border-width-default`, which aliases
`--titan-stroke-1`; its resolved thickness remains 1px. The studio now has a
clickable isometric level overview with keyboard navigation. The stack illustrates
level order, not literal physical spacing or z-index.

## Placement independent of level

Side panel, bottom panel and popover now map to Level 3. Side/bottom variants
use the same offset magnitude, blur and opacity as floating levels, changing only
direction. Added all 0–4 placement recipes and class combinations. This supersedes
the earlier exclusion of these roles from the scale and changes their appearance.
Popover keeps shape-following filtering and asset-owned edging. The shell’s panel
roles now consume the Level 3 directional aliases and border tokens.

## Panel hierarchy correction

User-defined hierarchy: Side panel is Level 4, above the Level 3 bottom/composer
panel. Popover remains unchanged at Level 3. The side-panel alias now resolves to
the Level 4 directional shadow and border. This supersedes its earlier Level 3
mapping. Existing shell z-indices already place Settings (9999) above Composer
(600), so no stacking-order change is needed.
