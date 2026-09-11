# Component registration contract

This is Titan's authoritative source for registering, composing and changing
components. Read it before component registration or structural/API changes.
User instructions take precedence. Existing implementations are not exceptions to
these rules; record gaps rather than silently redefining the contract.

AGENTS.md and run-ds.md are entry points. USAGE.md covers consumption and existing
component APIs. COMPONENT-CHECKLIST.md is the proportional verification companion;
it links here rather than defining a competing registration policy.

Start with reuse and boundaries, classify inputs and states, then define the preview
contract. The standalone external state-control rule is under **State categories
and preview contracts → Standalone and composed demonstrations**. Documentation
requirements do not imply that missing studio tooling has already been implemented.

## Contents

- [reuse components unchanged](#mandatory-reuse-components-unchanged)
- [register clear component boundaries](#mandatory-register-clear-component-boundaries)
- [Instances, content slots, variants and states](#instances-content-slots-variants-and-states)
- [interaction ownership and registration](#mandatory-interaction-ownership-and-registration)
- [state ownership and component boundaries](#mandatory-state-ownership-and-component-boundaries)
- [state categories and preview contracts](#mandatory-state-categories-and-preview-contracts)
- [Separate popup surfaces and page-owned coordination](#separate-popup-surfaces-and-page-owned-coordination)
- [Component inputs and outputs](#component-inputs-and-outputs)
- [Variant preview coverage](#variant-preview-coverage)
- [Derived components](#derived-components)

## Mandatory: reuse components unchanged

Before capturing, extracting, registering or building a component, layout or
screen, inspect the catalog and matching renderers for both the whole and its
meaningful parts. Identify existing components already used and existing components
and variants that can serve those parts. Prefer composing those implementations
unchanged before defining anything new. A source reference is evidence of intent,
not a requirement to reproduce every visual difference with a new component.

Use the existing variant that fits the part's purpose and interaction contract,
even if its appearance differs slightly from the reference. For example, use an
existing Button variant inside a new composition before proposing another button
or button variant. Render the composition with that existing choice and report any
visible mismatch; let the user review it and explicitly request a new variant later.
Do not create a near-duplicate component to bypass the variant rule. Define a new
component only for a responsibility the existing catalog does not already cover;
a request to capture or register a parent does not authorize new child variants.

Consumers, including other shared components, must use shared components as-is.
Supply documented content and state inputs, connect documented outputs and select
existing registered variants only. Do not override component-owned appearance, dimensions, typography,
internal spacing or behavior through descendant selectors, inline styles, custom
properties, wrappers, transforms or copied implementations. Parents own external
placement and gaps, and available space within the child's documented layout contract.
A CSS variable or legacy customization hook is not permission to restyle a child.

If the component does not fit, render it unchanged and report the visible discrepancy.
Do not silently compensate, change the shared default, create a local adaptation,
add a variant or amend the contract to legitimize an override. A new variant or
specialization requires an explicit user request; classify it using USAGE.md’s
state ownership and component boundary rule, then expose the approved contract
and preview before consumers use it.
Ordinary requests to build, align or reuse a screen do not authorize new variants.
This rule supersedes older adaptation/customization allowances and historical
catalog notes. Existing violations outside the task are reported, not silently migrated.

## Mandatory: register clear component boundaries

Before registering a new component or restructuring a composition, identify its
single design responsibility and direct children. Register meaningful independently
inspectable/reusable pieces (for example a grid or complete popover panel), not every
wrapper. Keep simple section/list wrappers internal when they have no separate contract.
Every registered component must have a real reusable renderer, a standalone preview,
owned styling/spacing and behavior documented, explicit content inputs and semantic
outputs, and a `dependencies` list of actual direct registered children (empty for leaves).
Compose those real children unchanged; do not copy their markup or override internals.
Parent registration must distinguish its own layout/behavior from child responsibilities.
Show child state demonstrations at the child owner, not repeated at every ancestor.

Registration is incomplete until supported variants are inspectable, affected spacing
mappings are accurate, and the actual in-scope consumers use the registered implementation.
Search initializers and usages; replace parallel in-scope markup, styling and event wiring
when consolidating a component. Verify previews and real consumers, and report any
remaining legacy paths. A catalog entry alone is not proof of implementation reuse.
Follow COMPONENT-CHECKLIST.md for proportional checks. These rules do not authorize
unrequested variants, unrelated migrations, or registration of every DOM wrapper.

## Instances, content slots, variants and states

A variant qualifies only when a supported non-data aspect of the component changes:
its layout, structure, sizing, visual treatment or interaction contract. A non-data
change is necessary, not sufficient: it still needs evidence and an intentional
shared contract. Hover, focus, pressed, selected, expanded and disabled are states,
not separate variants merely because they change appearance.

Changing supplied text, labels, counts, dates, avatars, icons, logos or other content
inside the same layout creates another instance, not a variant. Icon and logo areas
are content slots: the component owns their geometry, alignment and rendering rules;
the caller supplies supported assets through props. Asset color or shape differences
alone do not create variants. Optional content already supported by the contract is
an instance configuration unless it selects a separately defined non-data treatment.

Contract classification and preview coverage are separate decisions. Arbitrary
content-value substitutions do not create API variants. Use representative values
within each supported configuration, not one example for the entire component.
Content presence/absence, documented sizes, and other supported configurations
can require distinct preview targets without requiring new API variants. Follow
Variant preview coverage below. Do not use instance classification to omit a
requested configuration. Extra data examples may be shown as examples, not falsely
labelled as distinct structural contracts.

## Mandatory: interaction ownership and registration

This section is the authoritative registration policy for interactive UI in this DS.
Apply the definitions and decision procedure below to every component. Examples do
not introduce exceptions. Earlier descriptions allowing private interactive parts
are superseded; existing implementations remain migration gaps until corrected.

### Definitions

- **Interaction unit:** an element or region that can be independently targeted by
  pointer, keyboard or another supported input, and either performs a semantic
  action or has an interaction state independently of its containing component.
  A separately targetable hover treatment counts even without a click action.
- **Component definition:** a registered contract and reusable implementation that
  owns a defined presentation/arrangement and interface, and the semantics and
  treatment of any interaction unit it implements. A presentational component
  can accept supplied state without defining a hit area.
- **Instance:** one use of a component definition. Multiple interaction units may
  be instances of the same definition; each does not require a new catalog ID.
- **Composition:** an owner that arranges or coordinates registered instances. It
  may also have its own interaction unit, provided that unit is separately identifiable.
- **Internal part:** implementation structure with no independent semantic action,
  focus target or independently triggered interaction state. Internal parts may
  render an owner's state without becoming independent interaction units.

Independence concerns the user-facing contract, not DOM node count, listener count,
event bubbling or the presence of a CSS pseudo-class. Evaluate the behavior rather
than using technical implementation details to evade this boundary.

### Invariants

1. Every interaction unit MUST be implemented by a registered component instance.
   An enclosing registration does not cover independently interactive descendants.
2. Each unit has exactly one registered control owner. That owner defines its
   accessible semantics, supported visual states and control interface. A parent
   must not privately implement or restyle the unit's control treatment.
3. Direct-interaction states describe the owner's own control area. Supplied states
   describe its presentation or arrangement without requiring a hit area. Neither
   may substitute for registered owners of independently targeted descendants.
   Follow the state categories and preview contract below.
4. Multiple state dimensions can coexist on one unit. State count does not determine
   component count. Descendants that only render the same owner's state remain parts.
5. Value ownership, control ownership and action handling must be documented
   separately. Caller-owned state values and callbacks do not remove the requirement
   for a registered control owner. Use documented inputs/outputs, not private mutation.
6. A composition lists the actual registered child definitions it renders. Shared
   child state demonstrations live at their owners; parent Live previews preserve
   usable children and parent integration checks remain required.
7. Registration does not require standalone product use or multiple consumers.
   A composition-only contract must specify its required context and have a real,
   independently inspectable preview in that context. A catalog label without a
   corresponding reusable renderer and actual consumer integration is insufficient.

### Required decision procedure

1. Identify each independently targetable action or state region in the proposed
   behavior. Distinguish it from noninteractive rendering parts and whole-owner states.
2. Search registered definitions and supported variants for each unit and for the
   composition as a whole. Reuse a fitting implementation unchanged. Content and
   supplied value changes create instances, not new definitions or variants.
3. If no supported contract fits, state the uncovered responsibility or mismatch.
   A change within an existing owner's responsibility may require an approved
   variant/API extension; a distinct uncovered responsibility requires a registered
   definition. Do not create near-duplicates or keep a private control to avoid this
   decision. Classification does not itself authorize changing a shared contract;
   follow the existing explicit-approval rule for new variants or specialization.
4. Document unit boundaries, required context, semantics, state/value/action owners,
   supported states and outputs. Assign joining geometry, borders and spacing to
   one explicit owner; composition must not override child internals.
5. Implement through registered renderers, expose supported states at their owners,
   and verify actual dependency usage, keyboard/pointer behavior, disabled behavior,
   callbacks and inspection. Metadata alone is not evidence of compliance.

If ownership cannot be established from the contract, record the missing decision
rather than silently treating a section as internal. Existing violations outside
scope are reported; this policy does not authorize unrelated migrations.

### Illustrations, not exceptions

- Repeated action regions can reuse one Button definition as several instances.
- One toggling icon can reuse a supported Icon button contract; its supplied value
  does not imply a new component definition.
- Independently interactive segments require registered child instances even if
  their geometry is meaningful only when joined. Their preview may supply that context.
- Text or artwork that changes together with its owner, with no independent action
  or state trigger, remains an internal rendering part.

The previously requested split-segment variant correction remains explicitly
authorized. That authorization does not extend to unrelated new variants.

## Mandatory: state ownership and component boundaries

Having state does not by itself justify a new component or variant. Application
values such as `starred`, `checked` and `selected` are data that drive UI state;
do not claim that a control has no state merely because its value is caller-owned.
For each stateful control, distinguish these responsibilities explicitly:

- **Value ownership:** who stores the current value and supplies the next value.
- **Control ownership:** which registered component defines the control (the owner
  itself or a registered child), renders the value and its accessible semantics, and its supported hover, focus, active, pressed and disabled treatment.
- **Action ownership:** who handles activation, updates the value and emits the
  domain callback. State whether this is controlled by the caller or managed by the
  component; do not describe both as the same owner without explaining the boundary.

Passing documented state inputs and handling documented outputs is unchanged reuse,
not an override. Update state only through the child's documented interface (including
DOM attributes only where explicitly supported). Do not modify private child markup,
CSS, assets or event handling to achieve a different treatment. Distinguish transient
pointer/key activation (`active`) from persistent toggle selection (`aria-pressed`).

Choose the boundary in this order:

1. Reuse an existing component unchanged when its contract covers the responsibility.
   Changing its label, icon or supplied state value creates an instance, not a new
   component or variant. A visual mismatch remains visible for user review.
2. An explicitly requested change to the same component's supported treatment may
   justify a registered variant or API extension at that owner. Do not automatically
   classify new behavior as a variant; first check whether it is a distinct responsibility.
3. Register a separate component only for a meaningful independent responsibility
   that existing components do not cover. It may compose existing children unchanged.
   Document its API, ownership, dependencies and standalone preview. Multiple existing
   consumers are useful evidence, not a prerequisite. State, domain naming, or a single
   usage neither requires nor forbids a component on its own. Ordinary capture/reuse
   requests do not authorize changing child contracts or creating near-duplicates.

**Message-row example:** a star rendered with Icon button's supported `icon`, `label`
and `pressed` inputs remains an Icon button instance. The caller's `starred` value
maps to `aria-pressed`; the row routes the star action and callback. Icon button owns
its control semantics and visual state treatment. Do not register Star solely because
it toggles. An outline/filled asset request must be assessed against supported content
inputs first; it is not automatically a new variant, API or component.

Show reusable child visual state demonstrations under the child owner. The parent may
still display those states naturally in its Live preview and must test domain wiring,
state propagation, keyboard activation, disabled handling and callbacks where relevant.
Do not duplicate child state galleries or suppress parent integration checks.

## Mandatory: state categories and preview contracts

Classify a state by what it describes, separately from what causes it to change.
A component can respond to an input without being a clickable interaction unit.
A state transition does not by itself create a variant, a new component, or an
interaction pattern. Independently targetable controls still require registered
owners; reuse suitable existing controls unchanged.

### State categories

| Category | Meaning | Established examples |
| --- | --- | --- |
| Direct interaction | Interaction with the registered owner's own control area | hover, active, focus/focus-visible |
| Supplied state | A documented input whose value is supplied independently of where the update originates | expanded/collapsed, selected, checked, pressed toggle value, disabled |

Hover and active belong to the owner's control area, not a private section of a
parent. Focus belongs to the actual focusable owner; a parent does not acquire a
focus state just because a child is focused. Active means being pressed right now.
Pressed, when used for a persistent toggle (including aria-pressed), means its
on/off value and belongs to supplied state. Use explicit terminology in labels and
contracts; do not conflate active and pressed.

Supplied state may change rendering, visibility within the component, arrangement,
or availability. It does not imply a pointer hit area or a click-anywhere action.
A caller can update it from a registered child button, a separate control, page
logic or application data. Do not invent activation behavior just to demonstrate
that input. A whole-owner state describes the owner's presentation or arrangement;
it need not paint every descendant or require clicking the whole owner.

### Required registration contract

For each supported state dimension, document:

1. Category, input name, allowed values and default. Record combinations and
   constraints where multiple dimensions can coexist.
2. Rendering owner and visible/semantic result. Specify relevant accessibility
   attributes and which registered control or surface owns them.
3. Value owner. Supplied inputs are caller-controlled unless an explicit contract
   documents an internally managed value and its synchronization behavior.
4. Transition requests: registered trigger owner, supported activation, output
   callback/event and payload. A request is not an implicit mutation of the input.
   A purely presentational component may have no transition output or trigger.
5. Preview wiring: which controls are studio tooling, which are registered product
   children, and how the demo caller supplies the updated value. Reuse the public
   renderer/update interface; do not restyle children or mutate private internals.

### Standalone and composed demonstrations

A standalone component with supplied state has an external, clearly named control
in the interaction card's Live area. That studio control supplies its documented
input; it is not rendered inside the component, included in its dependencies or
counted as a product variant. Also show the supported states individually for
inspection. For example, a collapsed/expanded selector supplies `expanded` to a
standalone stack. The stack itself need not respond to clicks.

A registered composition may contain that stack plus a registered Button. Its Live
demo uses the actual child button: activation emits a transition request, the demo
caller updates the value, and the stack receives the new input. The button's hover,
active and focus galleries remain at Button; the stack's supplied states remain
at the stack. The parent demonstrates their documented connection, without
copying all child state galleries. The page may supply the same state from another
control without changing the stack contract.

Ordinary in-flow disclosure can remain a composed component: expansion naturally
moves later page content. A separate floating interactive surface follows the
separate-popup rule instead: register trigger and popup independently and document
the page-initialized coordination as an interaction pattern. Component specimens
may exercise their documented composition contract; they must not attach unrelated
page-owned patterns merely to make a trigger do something.

### Extending the vocabulary

These are the current categories, not an exhaustive list of state names. When a
new state is needed, document its meaning, owner, value source, transition and
preview before adding it. Prefer an existing category; introduce a new category
only when those distinctions cannot describe it, with an explicit rationale.
Do not infer unsupported states from CSS conventions or populate empty state lists
for presentation. Update this contract and the registration checklist together.

This section defines the required preview behavior; it does not claim every
existing studio control or component already implements it. Record implementation
gaps explicitly when registering or reviewing affected components.

## Separate popup surfaces and page-owned coordination

A separately appearing interactive surface is registered independently from the
control that reveals it. The trigger owns its control states; the popup component
owns its surface and composes registered child controls. The consuming page owns
visibility, placement, dismissal, focus transfer/return and domain actions. A
reusable interaction pattern may implement that coordination when explicitly
initialized by the page. Do not register the trigger-plus-popup arrangement as
one component or treat the popup as the trigger's hover/pressed/selected state.
This surface-boundary rule does not turn ordinary in-flow disclosure into a new
variant or remove the existing requirement to register independent controls.

App switcher is now such a pattern under Layouts & patterns → Interactions.
Load patterns/app-switcher.js and patterns/app-switcher.css, supply its render()
output in Sidebar header's trusted trigger content slot, and call the pattern's
bind() from the page. Dropdown trigger and App switcher panel remain components.

## Component inputs and outputs

Interactive components own their whole-control semantics and visual state. Any
independently interactive nested controls must be registered child instances. They accept
explicit props and emit documented semantic callbacks/events. They must not query
or mutate unrelated page elements, navigate, fetch data, or assume a specific host.
The host optionally connects outputs to page reactions. A component can remain
fully usable locally with no external callback. Prop updates must not emit user
interaction events; expose cleanup for registered listeners. Document payloads,
state ownership and whether state is controlled or internally managed.

## Variant preview coverage

A preview target exposes a supported configuration; it does not automatically
create a new component definition or API variant. Contract classification must not
be used to collapse required preview coverage.

Provide named, individually reachable and inspectable targets for:

- Each registered variant.
- Supported content-presence configurations that change structure, geometry,
  available controls, accessible naming requirements or usage constraints.
- Documented discrete size/density choices and composition positions whose supported
  treatment differs. Continuous dimensions use representative boundaries and controls,
  not an infinite target list.
- Configurations explicitly requested by the user. Implement and expose the request;
  do not silently omit it because it could be described as an instance. If the request
  explicitly calls for API variants, follow that instruction rather than substituting
  preview-only targets without explaining and resolving the difference.

Cover each meaningful supported dimension and combinations with distinct treatment
or constraints. Do not generate the Cartesian product of all props unless those
combinations are separately meaningful or explicitly requested. Arbitrary text,
dates, counts or icon-asset substitutions within one configuration need representative
values, not one target per value. Unsupported combinations must not appear as supported.

Targets must route to real renderers using documented inputs. In this studio,
`interactions.targets` supplies the selectable preview configurations and associated
state previews, even when a target is not a distinct API variant. Use accurate names
and document that mapping; a studio label does not establish contract classification.
Targets must be reachable through the component preview/navigation controls. Targets
without owner-level interaction states use `states:[]` and `previewOnly:true`; retain
Live and inspection. Do not invent states or duplicate registered child state galleries.
Interaction states remain states; do not create variants solely to inspect them.

Illustration: icon-only, text-only and icon-with-text change content presence, unlike
swapping one icon asset for another. If supported for leading and trailing grouped
controls, expose each meaningful position/treatment combination (and every combination
explicitly requested), with correct accessible names and required composition context.
This illustrates the coverage rule; it is not a component-specific exception.

Icon button now has one `dark` treatment, shared by window and navigation usages.
Use `iconSize:18` for composer window icons and `iconSize:16` (default) for month
arrows. Legacy `window` and `dark-compact` inputs normalize to this renderer for
compatibility; they are not separately cataloged variants. Existing composer and
Calendar usages have migrated. The supported iconSize values are 16, 18, 20, 24;
the dark treatment honors this token-backed artwork size independently of its
24px control size.

## Derived components

Changes to an existing shared component require an explicit user request. Until then,
reuse it unchanged and report mismatches. Content substitution is an instance;
combining unchanged controls is a composition. Neither permits internal overrides.
For an approved specialization, use the boundary decision above: a variant belongs
at the existing owner only when it retains that responsibility; a genuinely separate
responsibility may warrant a registered composed component. Update its contract and
preview before consumers use the approved change.
