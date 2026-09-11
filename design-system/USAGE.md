# Using the shared Titan design system

Reference screens provide evidence for enriching this system. They do not define
its scope. Use the same system to create new prototypes or align existing screens
when requested. Enrichment, new-screen creation, and alignment are separate tasks;
adding a reference does not automatically authorize changing that reference screen.

Run instructions: `../Prototypes/Ishant/commands/start-studio.md`.


## Source of truth

Read `registry.json`, `tokens.css` and its imported files before designing. Read
`BRIEF.md` and relevant `decisions/` for evidence and limits. The studio presents
these definitions; screenshots of the studio are not the underlying specification.

For implementation changes, follow the change-specific checks in
[COMPONENT-CHECKLIST.md](COMPONENT-CHECKLIST.md). Reusing unchanged components
requires screen integration checks, not a repeat of their component audits.

## Mandatory: reuse components unchanged

See [reuse components unchanged](COMPONENT-REGISTRATION.md#mandatory-reuse-components-unchanged) in the mandatory registration contract.

## Mandatory: register clear component boundaries

See [register clear component boundaries](COMPONENT-REGISTRATION.md#mandatory-register-clear-component-boundaries) in the mandatory registration contract.

## Applying the system

- Import this system's `tokens.css` through a path supported by the target app.
  Reference its CSS custom properties instead of copying resolved literals.
- Use existing semantic color roles when their purpose matches. Do not substitute
  a primitive merely because it currently resolves to the same color.
- Use `foundationPresentation.textStyles` to find recorded typography combinations.
  Apply the referenced semantic tokens for each assigned property. Preserve the full
  font fallback stack. A missing property is not a defined system value: inspect
  source evidence or make an explicit local choice without registering a new rule.
- The text-style view remains a draft extraction, not proof of universal acceptance
  or complete adoption. Do not invent additional heading types or variants. Add
  shared types only when supported by user-selected screens or explicit direction.
- Spacing roles currently describe source-owned relationships. Use them only for
  the same purpose; do not use message-header spacing as a universal heading/body
  gap. Use primitive spacing for local arrangements when no shared role is defined.
  Give each gap/inset one owner; avoid doubled margin and gap.
- Reuse radius primitives and the matching registered component implementations
  listed in registry.json. Buttons and Messages are examples, not the complete
  catalog. Keep one-off structure screen-owned; extend shared families only within
  the requested scope and with evidence.
- Before adding tokens, inspect the current definitions. Equal values do not prove
  shared semantics. Record evidence, scope and aliases when extending the system.

## Instances, content slots, variants and states

See [Instances, content slots, variants and states](COMPONENT-REGISTRATION.md#instances-content-slots-variants-and-states) in the mandatory registration contract.

## Mandatory: state ownership and component boundaries

See [state ownership and component boundaries](COMPONENT-REGISTRATION.md#mandatory-state-ownership-and-component-boundaries) in the mandatory registration contract.

## Mandatory: interaction ownership and registration

See [interaction ownership and registration](COMPONENT-REGISTRATION.md#mandatory-interaction-ownership-and-registration) in the mandatory registration contract.

## Derived components

See [Derived components](COMPONENT-REGISTRATION.md#derived-components) in the mandatory registration contract.

## Verification

For every new or rearranged screen, visually review spacing and use the available
inspector to trace insets, gaps and alignment inside and between components. Check
for doubled spacing, wrong token roles and local overrides of component internals.
Screen layout remains screen-owned; it does not need component registration. Where
the inspector lacks coverage, use available rendered geometry/computed styles and
report the limitation. See COMPONENT-CHECKLIST.md for the required spacing review.

Check that imports resolve and inspect the new screen's computed styles and real
interactions when browser access is available. Review hardcoded typography, color,
spacing and radius values for accidental duplication. Record intentional exceptions.
Run attachment validation for registry, token, import or registered-path changes,
and the target app's appropriate checks for implementation changes, as specified
in COMPONENT-CHECKLIST.md. Report any visual checks that could
not be performed. Passing catalog validation alone does not prove screen compliance.

The spacing re-audit establishes shared tight-text (3px), standard icon-label (8px),
compact icon-label (4px), and compact action-group (4px) roles. Reuse them for those
relationships; do not apply tight text spacing to all headings/descriptions. See
`decisions/spacing-reaudit.md` for independent contexts and preserved exceptions.

Current DS-connected shell: `../Prototypes/Ishant/design ops/DS-specific shells/TitanEmailShell/`.
The original `../Shells/TitanEmailShell/` has been restored to its pre-DS Git version.
Use the DS-specific copy for ongoing DS work; see decisions/ds-shell-location.md.

## Card construct

Card is a basic layout construct, not a catalog component. Its default inset
`--titan-card-inset` references `--titan-space-16` in Foundations → Spacing.
The optional `.titan-card` CSS utility applies this inset, surface, border and radius.
It defines no nested-card requirement, content structure or interaction behavior.
Meaningful reusable compositions can be registered when observed or requested.
Import `components/card.css` or the shared `components.css` to use the utility.

## Grouped actions

Use `TitanActions.button({label, icon, variant: 'toolbar'})` for the observed
compact email actions. Use `.titan-action-group` on their parent to apply
`--titan-gap-actions-compact` (4px). The group owns between-action spacing;
buttons own insets and icon-label gaps. Parent controls wrapping or overflow.

## Half button

Split button composes two registered Half button instances: the left half is the
main action and the right half is the trigger for caller-owned menu content.
`TitanActions.halfButton({side, label, icon, labelHidden, size, haspopup, expanded,
disabled})` renders one joined segment and owns its surface, outer radii, leading
divider, insets and hover, active, focus and disabled treatment. `side` selects the
Left or Right geometry; the icon-and-text, text-only and icon-only treatments are
exposed as preview variants in default and composer sizes. `size:'composer'` uses the
observed 32px split geometry. The standalone preview shows each half as an individual
component. Split button owns only the group arrangement and accessible label.

## Selection controls

`TitanSelection.mount(host, kind, options, callbacks)` provides `tabs`, `dropdown`,
and `checkbox`; returns event cleanup. Import `components/selection.css` and
`components/selection.js`. Labels are required. Tabs report selected IDs through
`change`; caller owns panels. Dropdown only invokes `open`; supply the real menu
and keep `aria-expanded` synchronized. Dropdown's `search` variant is the icon-only
chevron filter trigger used by Search field: it owns its hit area, hover, focus and
disabled treatment, and the caller owns the menu. Checkbox reports a boolean through `change`.

Grouped actions is registered as a composed component. Use
`TitanActions.actionGroup({label, items})`; each item is rendered through Button's
observed toolbar variant. The group owns the 4px gap; child Buttons own interactions.
Only icon-and-label grouping is currently demonstrated. Add other variants when
observed or explicitly designed.

## App switcher

The registered chain is Sidebar header → App switcher → Dropdown trigger +
App switcher panel → App grid + Launcher item; App grid composes App tile.
Each registered piece has its own catalog preview and direct dependencies. Section
wrappers within the panel are internal layout, not additional components.

Load `icons/runtime.js`, `components/selection.js`, `components/app-switcher.js`,
then `components/sidebar-header.js`. `sidebar-header.css` imports the required styles.
App-owned content lives separately in `app-switcher-config.js`:
`TitanAppSwitcherOptions('mail')` supplies the shared apps/tools/links and current app.
Mail, Calendar, Contacts and Drive use this configuration with their own selected id.

Render `TitanSidebarHeader.render({logo,appSwitcher:options})` and call
`TitanSidebarHeader.bind(root,{select:id=>...})`; retain its returned cleanup when
removing the header. Without callbacks, opening/dismissal and native buttons work;
selection closes the panel but does not navigate or change the current app.
The host owns those page actions. Escape returns focus to the trigger.

Standalone APIs are `TitanLauncher.appGrid(options)`, `appSwitcherPanel(options)`
and `appSwitcher(options)`; `mount(host,kind,options,{select})` adds listeners and
returns cleanup. `bind` wires existing rendered markup. The panel owns the white
surface and pointer; App switcher owns anchored placement and visibility. Parents
must allow the popover to extend outside their layout region. Grid supports three
columns with a partial final row and does not silently discard extra items.

## Icons

Find registered icons in `icons/catalog.json`; use their named `icons/assets/*.svg`
paths for new usages. Preserve aspect ratio and source colors, particularly app
artwork. The containing component owns slot size, spacing, accessible labeling and
interaction behavior. Decorative images use empty alt text when the control already
has a label. Original source paths are retained in the manifest for usage audits;
connected shell imports now use shared paths. Do not infer a new icon variant from
catalog display size or backing color.

## Email composer

Import `components/composer.css`, then the icon runtime, `actions.js`, `selection.js`
and `composer.js`. `TitanComposer.mount(host, kind, options, callbacks)` returns cleanup.

Email composer directly composes Composer header, Composer field row, Composer tools,
Formatting toolbar and Composer send actions. Each has its own catalog preview and
spacing ownership. The tools row is not Action group: it owns its 8px gaps and uses
unchanged composer Buttons. Header and send actions use unchanged Icon/Split buttons;
the recipient field's Cc/Bcc actions are unchanged composer Buttons too.

Standalone renderer/mount kinds: `composerHeader`, `fieldRow`, `composerTools`,
`formattingToolbar`, `composerSendActions`, `emailComposer`. Header accepts `title`;
field accepts `label`, `value`, `id`, `readOnly`, `recipient`. Full composer accepts
`from`, `title`, `id`, `toId`, `docked`. Omitted size remains the shared 681×640px;
parents constrain available width without overriding internals. Toolbars scroll
horizontally when constrained. No preview-only height changes are allowed.

Callbacks: `action(command,event)`, `minimize(boolean)`, `close()`. Send segments report
`main` and `secondary`; other controls emit named commands. Standalone header emits
window commands without mutating a surrounding composer. Full composer owns minimize
state; the host owns opening, dock placement and focus restoration. The Mail host
makes the closed window inert. Rendering does not implement sending, menu contents,
formatting, Expand or recipient completion. See decisions/composer-composition.md.

## Normalized icon assets

All registered SVGs use a 24×24 viewBox and xMidYMid meet. Use square image slots;
do not compensate by filename or distort width/height independently. The shared
composer, action and launcher renderers consume these assets. Existing icon IDs
and paths remain valid. After atomic file replacement, run
`node design-system/icons/repair-aliases.js` to repair legacy hard links. See
`decisions/icon-normalization.md` for visual checks and pending artwork decisions.

### Monochrome icon colors

Catalog `colorMode: "monochrome"` icons have a shared `#titan-artwork` fragment.
The gallery renders these in neutral gray without a backdrop. Keep multicolor
icons, color controls and branded artwork in their original colors.

With Actions, pass `iconColor: 'currentColor'` to inherit the button's text color,
or a CSS color such as `iconColor: '#2170f4'`. This works on Icon Button, Button,
and Split Button's main icon. Omit the option to preserve the asset's original
appearance. Supply this option only for catalog monochrome assets.

For other components, import `icons/icons.css` and use:

```html
<svg class="titan-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <use href="/design-system/icons/assets/close.svg#titan-artwork"></use>
</svg>
```

Set `color` on the SVG or its parent. The `.titan-icon` class maps inherited color
to `--titan-icon-color`. Inline copied SVGs also accept that CSS custom property.
An SVG loaded through `<img>` cannot inherit page CSS; use the shared fragment
when tinting. Existing image usages retain their original fallback colors.

### Icon size in components

The 24×24 viewBox is an asset coordinate system, not a universal display size.
Use the component’s image canvas: 20px for standard and compact composer controls,
24px for 40px icon buttons, 18px for window controls and sidebar images. Retain
the surrounding hit area and layout slot. Shared artwork carries shape-specific
optical adjustments; avoid adding filename-based size overrides to consumers.
See `decisions/icon-optical-review.md` for the reviewed contexts and limitations.

## Iconography contract

The **Iconography sidebar** documents display sizes, color, hit-area separation
and exceptions. Source of truth: `tokens/iconography.css` and
`decisions/iconography-contract.md`. Selecting an icon previews its variations at 12/16/18/20/24px
in gray, active or inverse contexts; Copy SVG always copies the canonical source.

Use component-purpose size roles when the usage matches. For a standalone icon:

```css
.compact-action .titan-icon {
  --titan-icon-size: var(--titan-icon-size-action);
  color: var(--titan-action-primary);
}
```

The icon inherits this color through the shared monochrome fragment. Its containing
control owns the hit area, spacing, disabled state and accessible label. Keep branded
launcher sizes at their component-owned 28/34px values. Detailed artwork at small
sizes needs visual review; preview availability is not universal size approval.

Select a library tile to inspect it. The sidebar shows actual-size samples and
contextual color choices without changing the library’s comparison size. Copy SVG
and Copy reference are explicit sidebar actions; the tile corner still copies SVG.

## Avatar

Import `components/avatar.css` and `components/avatar.js`. Use
`TitanAvatar.render({initials:'AM', label:'Alex Morgan'})`; use `decorative:true`
when adjacent text already identifies the person. Load avatar.js before messages.js.
Avatar supports `variant: 'default'` (36px, the default) and `variant: 'small'`
(24px, used by Account header). Both retain the same purple surface and typography.
Avatar owns these sizes; consumers select the variant without CSS overrides. Parent
owns external spacing. Photo, status, other colors and interactive variants are not registered.

## Message row and list

`TitanMessages.row(options)` is registered separately as Message row. It owns
summary layout and row actions; `variant: 'wide'` works without a list wrapper.
`TitanMessages.list({messages, variant})` composes rows and owns list scrolling and
outer insets. Row interaction previews live on Message row, linked from Message list.

## Strokes

Foundations → Strokes registers 1px, 1.5px and 2px in `tokens/strokes.css`.
Use `--titan-border-width-default` for ordinary container/control borders and
`--titan-divider-width-default` for ordinary dividing lines. `--titan-focus-ring-width`
remains registered but is currently unused: on explicit user direction shared
components render no visible focus ring (see decisions/focus-treatment.md).
Split-button and composer-field separator widths remain separately scoped roles.
Pair widths with the appropriate existing color role; parent/component owns inset,
placement and surrounding spacing. Do not apply these widths indiscriminately to
SVG artwork or logos.

## Elevation

Elevation composes independent border and shadow recipes into complete treatments.
Use the numbered scale below for increasing depth, or the reusable semantic role
when its purpose matches. The DS-connected shell consumes those role mappings.
Focus rings, inset focus effects, motion and z-index remain separate.

Role classes such as `.titan-elevation-stacked-surface` apply the mapped border
and shadow together. `.titan-elevation-floating-badge-hover` is an explicit held
state; the caller owns when it applies. Side and bottom panels retain their
directional utilities. Classes load through tokens.css. Primitive recipes are
available in `tokens/elevation.css`; the token file records their sources.

### Numbered elevation scale (current)

Use one class `.titan-elevation-0` through `.titan-elevation-4` to set border and
shadow together. Level 0 is flat with an edge; 1 resting surfaces; 2 raised
controls; 3 floating surfaces; 4 prominent overlays. All use the same 1px border
recipe so the progression comes from increasing shadow depth. Numbers do not set
z-index. Remove the old level class when changing levels; do not stack them.

Compact action and stacked surface map to 1, floating badge to 2, badge hover to
3, and tooltip to 4. Existing consumers inherit those mappings through role tokens.
This deliberately normalizes their previous distinct values. For a component-specific change, follow the mandatory unchanged-reuse rule:
consumers may not replace component-owned elevation declarations or attach a utility
to override them. Numbered utilities are available for screen-owned surfaces;
changes to shared component treatments require an explicitly requested variant.

Placement is independent of level. Combine `.titan-elevation-3` with
`.titan-elevation-side` or `.titan-elevation-bottom` for leftward or upward shadows.
Levels 0–4 support both placements; their offset, blur and opacity match the
corresponding floating level. The caller still owns docking and sizing.

Side panel maps to Level 4; bottom/composer panel maps to Level 3. Preserve this
hierarchy when composing screens. Popover remains at Level 3. The side-panel role applies
its border to the leading edge; bottom-panel applies its perimeter border.
Popover uses the Level 3 recipe through filter/drop-shadow to follow its exported
surface shape; edge artwork remains asset-owned, rather than adding a rectangular
border around transparent padding. Its depth is still explicitly Level 3.
The studio connects all roles to numbered levels; raw recipes remain in CSS.

Button supports `variant: 'outlined'` for the observed bordered Help-style action.
Uses shared Button activation, disabled and focus behavior. The default Dropdown
trigger now serves Mail’s All mails and Calendar’s Week; callers still own menus.

Use `TitanActions.button({label: 'New Event', variant: 'primary'})` for an accent-filled primary action. It retains the standard Button sizing and shared focus/disabled behavior.

## Sidebar header

Load `components/sidebar-header.css` and the script chain documented under App switcher.
Use `TitanSidebarHeader.render({logo,appSwitcher:options})` plus `bind` for a working
switcher. Header owns the 64px height, 12px insets, logo placement and external gap;
it does not own child styling or popup behavior. The legacy `{icon,logo,label,expanded}`
form renders only a bare trigger and requires caller wiring. All current DS shells
use the complete composition. App icons remain instance content, not variants.

Sidebar header slots: `icon` supplies the app-trigger asset; `logo` supplies the
brand image asset. These are image-path props, not arbitrary HTML/child-node slots.
The shared header fixes placement and sizes; the current logo accessible name is
Titan. Replacing assets creates instances of the same default component.

Dropdown supports `variant: 'account'` for the full-width dark account control.
Use `TitanSelection.dropdown({label, variant:'account', expanded})` or the existing
`mount` API. Label is instance content; this variant changes surface and layout.
Parent owns width and external spacing. Shared account inset tokens own 8px padding;
long labels truncate visually while retaining their accessible name. The registered
chevron asset replaces the screen's text glyph. Menu content remains caller-owned.

Icon button supports `variant: 'dark'`: 24px target, 16px artwork,
muted inverse foreground, subtle translucent hover/pressed backgrounds and an
inverse focus outline. Use `iconColor:'currentColor'` with registered monochrome
assets. It owns zero padding; its parent owns surrounding gaps. Calendar's month
arrows use this variant; light-toolbar arrows keep their existing appearance.

Use Icon button `variant:'compact'` for 24px controls with 16px artwork on light
surfaces. It retains default colors, focus and activation with no hover scaling.
Calendar uses it for both week arrows. Parent owns gaps; internal padding is zero.

Icon button supports `variant:'toggle'` for quiet controls whose artwork changes with
the caller-owned `pressed` state: pass `icon` for the resting asset and `pressedIcon`
for the pressed asset, plus an explicit `pressed` boolean. It owns a 24px target,
16px artwork, no container in any state, and shared focus/disabled behavior. Message
row's star uses it to fill and unfill in place.


## Variant preview coverage

See [Variant preview coverage](COMPONENT-REGISTRATION.md#variant-preview-coverage) in the mandatory registration contract.

## Component inputs and outputs

See [Component inputs and outputs](COMPONENT-REGISTRATION.md#component-inputs-and-outputs) in the mandatory registration contract.

## Mini calendar

Load `components/mini-calendar.css`, `components/actions.js`, then
`components/mini-calendar.js`. `TitanMiniCalendar.render(props)` produces static
markup; `mount(host, props, callbacks)` adds component-local interaction and returns
`{update(props), destroy()}`. State is internally managed, with silent external
updates supported. Initial props: `value` (YYYY-MM-DD or null), `month` (YYYY-MM),
`locale` (default en-US), `label`, `disabled`. Omitted date/month default to today.
Only a Sunday-first single-date calendar is supported. Locale changes displayed
labels; it does not change week-start or the Gregorian date model. The calendar owns a
fixed 250px width (`--titan-mini-calendar-width`), so changing months never resizes
it. The date grid composes registered Calendar day instances: Mini calendar owns the
selection value, roving tabindex, keyboard movement and visible month, while Calendar
day owns each date button's semantics and hover, selected, focus and disabled
treatment. Month arrows wrap unchanged Icon buttons in calendar-owned
`[data-calendar-nav]` spans.

Outputs are `dateChange({value})` and `monthChange({month})` callbacks, plus bubbling
`titan:dateChange` and `titan:monthChange` CustomEvents with the same detail. Subscribe
through one mechanism to avoid duplicate reactions. Month browsing changes visible
month without selecting a date. Selecting a date updates local value and visible
month, then emits dateChange. Arrow/Home/End/Page keys move focus; Enter/Space select.

```js
const calendar = TitanMiniCalendar.mount(host, {
  value: '2026-09-09', month: '2026-09'
}, {
  dateChange: ({value}) => showWeekContaining(value) // Optional host connection.
});
calendar.update({value: '2026-09-15', month: '2026-09'}); // Silent input update.
// calendar.destroy(); // Detach when removing the host.
```

Calendar's mini calendar is mounted without page callbacks: local controls work,
but the reference week grid remains static. Add calendar uses Button's `dark`
variant with the registered add-calendar icon. It has no page action attached.


## Shared icon IDs

Load `icons/runtime.js` before component scripts. Request catalog IDs, for example
`TitanActions.iconButton({label:'Location',icon:'location'})`. Never construct a
shared asset URL in a consumer. The catalog owns ID → asset mappings; `TitanIcons`
resolves them relative to its own script URL. CommonJS reads catalog.json directly.
Browser renderers stay synchronous using a generated catalog snapshot: run
`node design-system/icons/build-runtime.js` whenever catalog entries/paths change.
The icon runtime test detects a stale snapshot.

Static shell markup uses `<img data-titan-icon="location" alt="">`; the runtime
hydrates it and newly inserted markup. Use `TitanIcons.render(id, color)` for
shared SVG fragments with optional color, or `TitanIcons.resolve(id)` only when
an API needs a URL. Existing custom image paths remain accepted for user images,
logos and decorative artwork. These are intentionally not named DS icons.

Only the current set exists. Future sets should map these same semantic IDs in
the resolver, with the current set as fallback; a later set-change implementation
can refresh marked nodes through `TitanIcons.hydrate(document)`. No switcher or
second set is included. Each preview iframe loads the same runtime. Do not copy
SVG markup into consumers or reintroduce individual asset path decisions.

## Sidebar footer actions

`TitanActions.footerActions({label, items})` supports one to three actions. With
three items, the first two labels are visible and the last is always icon-only;
its required label remains the accessible name. Labelled actions use content-based
widths and share remaining space; icon-only actions reserve at least 48px with centered artwork. Labels ellipsize only when the group's available width is exhausted.
The component owns icon/text centering, insets and dividers. Parent owns placement
and available width. Use shared icon IDs such as `report-bug`, `request-feature`
and `settings`; do not add consumer width or alignment overrides.

## Data list and Data list row

Import `components/data-list.css` and `components/data-list.js` for
`TitanDataList.list({columns, rows, label, head, emptyText})`. The list composes
registered `TitanDataList.row` instances, owns the shared tracks, column header
and empty state. Row owns cells, typography, 66px minimum content height,
separators and hover. Header minimum content height is 62px; borders add to these
heights. These dimensions and internal CSS variables are not consumer options.

For a standalone record, import `components/data-list-row.css` and the same JS,
then call `TitanDataList.row({columns, id, cells})` inside a semantic table host.
Exactly one column has role `key`; others are `control` or `value`. Column width
tracks are a supported layout input. `sharedTracks:true` is for a parent grid
using those same tracks; the list sets it automatically to align auto columns.

Cell slots `{slot:true, text}` accept unchanged child components mounted at
`[data-slot="<id>:<columnKey>"]`; optional text accompanies a key slot. Use unique
row IDs and reserve `head` for header slots. The host owns data, selection and
callbacks. Avatar, Checkbox and Icon button are caller-provided content, not
hardcoded dependencies. Keep screen CSS limited to table width, placement and
scrolling; do not resize slotted children or override row hover.

## Mandatory: layout guidance for screen work

Read [Layout guidelines](layouts/README.md) when building or rearranging DS screens.
The Layout guide lives under Layouts & patterns → Layouts and demonstrates list,
grid, row and footer arrangements. Choose context before defaults: distinguish data rows, menus, navigation, forms,
cards and app grids; consult observed versus provisional guidance. Keep item gaps,
group gaps, surface insets and child internal padding separate. Apply suitable
tokenized defaults through existing
screen code; no recipe class, renderer or import is mandatory. Parent-owned gaps,
outer padding, alignment and columns may change without a variant or extra approval.
This does not allow child internal overrides. Verify spacing, wrapping and minimum
widths. For new registrations, arrangement alone does not justify another component.
Existing Action group and App grid remain supported defaults: inspect and reuse
suitable registered components/compositions FIRST. Consult layout guidelines only
for uncovered parent-owned relationships. Do not bypass or retire existing
components merely because their responsibility includes layout.

## Separate popup surfaces and page-owned coordination

See [Separate popup surfaces and page-owned coordination](COMPONENT-REGISTRATION.md#separate-popup-surfaces-and-page-owned-coordination) in the mandatory registration contract.

## Mandatory: state categories and preview contracts

See [state categories and preview contracts](COMPONENT-REGISTRATION.md#mandatory-state-categories-and-preview-contracts) in the mandatory registration contract.


## Light and dark themes

Use the sun/moon button in the Studio sidebar. The selection persists for this catalog and
applies to foundation role values, component galleries, focused variants,
interaction states, iconography and registered previews. Studio chrome follows the selection using separate Studio-owned colors.

Adopting HTML screens load `theme.js` from the shared design-system directory.
The runtime accepts `?theme=light` or `?theme=dark` only, defaulting to Light.
It loads base tokens and the selected semantic override file. Keep primitives
stable. Theme-responsive surfaces, foregrounds, dividers and state colors use
semantic roles. Intentionally dark navigation/composer headers and inverse text
retain the same values across themes; do not invert them.

New components must demonstrate both themes, including hover/selected/disabled
states. Preserve brand artwork; monochrome icons should inherit a foreground role.

See [THEMES.md](THEMES.md) for the complete theme implementation and validation contract.
