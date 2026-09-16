# Checks by change type

Read [COMPONENT-REGISTRATION.md](COMPONENT-REGISTRATION.md) for definitions and mandatory rules. This checklist specifies verification steps only.

This is Titan’s required review policy. Choose checks from the actual diff and its
consumers, not merely from the fact that a component file was touched. For Titan,
this policy supersedes the installed studio workflow’s blanket requirement to
repeat a full component/spacing audit on every edit. Studio contracts still apply.
This policy is agent guidance, not gallery content or an extra approval step.

## Before changing anything

Read the affected implementation and current contract. Identify whether the change
is local to a screen, shared by consumers, or changes a public API. Use the table
below; combine rows when a change has more than one effect. Expand the review when
a failure, uncertain dependency or wider impact appears.

| Change | Required review |
| --- | --- |
| Documentation only | Check accuracy against current sources and changed links. No component tests. |
| Screen using unchanged components | Check imports, layout at relevant widths, supplied props and connected actions. Perform the screen spacing review below, including between reused components. Check screen-owned accessibility/focus integration. Do not repeat unrelated child component audits. |
| Preview/gallery only | Check affected preview layout, clipping and controls using the real renderer. Check inspector integration only if its wrapper, selectors or controls changed. |
| Visual CSS or token change | Find affected consumers and state overrides. Check resolved values and representative rendered usages, including clipping/contrast where relevant. For value-preserving substitutions, also check equivalence. No unrelated behavior or full spacing audit. |
| Spacing/layout change | Check changed relationships and affected variants at relevant widths with long/optional content. Update and inspect affected anatomy.spacing mappings. Do not re-inventory unchanged spacing. |
| Behavior or accessibility change | Check affected interactions, keyboard/focus, accessible names/states, disabled behavior, callbacks and cleanup as applicable. Run relevant behavior tests and add regression coverage for the bug when useful. |
| New component/composition or structural/API change | Review the complete new or affected contract: supported variants, internal spacing, child ownership, accessibility, interactions, content edge cases, responsiveness and consumer integration. A new variant requires review of that variant plus shared rules it changes, not every unrelated variant. |

A shared token can affect many components. Search usages before choosing representative
checks; cover distinct affected contexts rather than checking only the first match.
A visual change that affects focus visibility or hit areas also needs the relevant
accessibility checks. Structural changes may require broader regression checks.

For screen layout work, first inspect and reuse suitable registered components
and compositions, including Action group and App grid. For uncovered parent layout, consult [layout recipes](layouts/README.md), choose matching
defaults and document local parameter changes. Check parent gaps, padding, wrapping,
columns and child minimum widths without overriding child internals.

## Spacing inspection is a core workflow

Titan is primarily a visual library for prototypes. Accurate spacing inspection
supports its main goal: reused pieces should look consistent in real screens.
Keep the existing inspector and spacing mappings; lighter paperwork does not mean
less accurate spacing or replacing shared components/tokens with approximations.

When building or rearranging a screen:
- Visually review section insets, gaps between components, text/icon alignment and
  spacing at relevant widths, including wrapping and conditional content.
- Use the available spacing inspector to inspect these relationships and trace their
  actual CSS owner and token. Check for doubled margin/gap, an inappropriate token,
  or a screen override changing a shared component's internal spacing.
- Keep parent-owned spacing screen-owned. Use existing semantic roles when their
  purpose matches, otherwise existing primitives. Do not invent a shared component
  or catalog metadata merely to inspect a screen wrapper.
- Where the inspector cannot inspect a screen-level relationship, inspect rendered
  geometry and computed styles with available browser tools and report that coverage
  limitation. Do not imply that the component inspector covers every screen wrapper.

When adding a shared component or changing its spacing/structure, keep its affected
spacing mappings accurate and verify their rendered targets/bands where supported.
New components retain the internal spacing registration requirements below. Unrelated
label, color or callback changes do not require rechecking all spacing mappings.

If browser access is unavailable, check source ownership/token references and report
the visual spacing review as pending. Do not describe source checks as visual review.
Routine spacing corrections need only the normal handoff, not a separate audit file.

## Rules that always apply

- Reuse actual shared renderers, styles and matching tokens. Previews must not copy
  a component implementation. Preserve existing behavior outside the requested change.
- Do not invent variants or elevate incidental source values into shared rules.
- Apply [variant classification](COMPONENT-REGISTRATION.md#instances-content-slots-variants-and-states):
  content/slot substitutions are instances. Variants require supported non-data
  differences; hover/focus/selection and other interaction states remain states.
  Document what each slot accepts and which geometry the component owns.
- Enforce [unchanged reuse](USAGE.md#mandatory-reuse-components-unchanged), including
  nested shared components. Check the consumer CSS cascade and inline/custom-property
  declarations, not just renderer imports. No internal overrides or unrequested
  variants/adaptations; leave mismatches visible and report them.
- Components own internal layout; parents own external placement. Nested controls
  retain their own interaction contracts. Avoid duplicated spacing and state previews.
- Keep registered contracts accurate. Update only metadata made stale by the change:
  selectors, spacing mappings, dependencies, APIs, states or usage as applicable.
- Preserve the established gallery presentation. Do not redesign tooling as a side
  effect of component work. Keep content reachable; do not hide overflow to mask bugs.

## Additional checks for new components and structural changes

- Before extraction or registration, inspect existing whole-component and child
  matches in the catalog and renderers. Reuse suitable existing variants first;
  report visual mismatches for user review. Do not create near-duplicate components
  or new child variants just to reproduce a reference. See the mandatory reuse rule.
- Enforce [clear component boundaries](USAGE.md#mandatory-register-clear-component-boundaries):
  standalone real preview, explicit ownership/API and direct dependencies for each
  registered piece; migrate and verify all affected in-scope consumers.

- Apply COMPONENT-REGISTRATION.md’s mandatory state ownership and component boundary rule: record
  value, control-treatment and action owners for affected stateful controls. State
  alone is not evidence for a new component. Verify parent wiring separately from
  child visual state demonstrations.
- Inspect source evidence and define supported variants, states, optional content,
  child dependencies, parent responsibilities and behavior before registration.
- For new components, record nonzero internal padding, gaps and margins for supported
  variants. For existing components, audit relationships affected by the restructure.
  Map actual selectors/properties to tokens; distinguish geometry and external gaps.
- Exercise representative narrow/wide, long/empty/optional and disabled/selected
  cases where supported. Check keyboard activation, focus and callback ownership.
- Use real renderers in representative gallery and detail previews. Check changed
  spacing-inspector mappings and interaction targets; child state demos stay with
  the child component. Do not invent states to populate the catalog.

## Validation and handoff

- Run attachment validation when registry, token files, imports or registered paths
  change. Run the target app’s appropriate checks when its implementation changes.
- Run tests relevant to changed behavior. Do not add tests that only mirror a trivial
  substitution or repeat the full studio suite for app-content-only changes.
- Run studio checks when changing studio tooling, following that repository’s rules.
- Inspect affected rendered previews/screens when browser access is available. If
  unavailable, finish independent checks and explicitly report visual review pending.
  Source equivalence or catalog validation is not proof of rendered correctness.
- Record new shared design decisions, API changes, substantive audits and unresolved
  limitations in decisions/. Routine edits need a concise handoff listing the change,
  checks performed and limitations; no new audit document is required for each edit.
- Update usage guidance only when usage changes. Do not rewrite unaffected metadata
  or old audit records. Report remaining issues without claiming blanket approval.

- Verify reachable, named targets for variants AND meaningful supported configurations:
  content presence, discrete sizes/densities, composition positions and explicitly
  requested combinations. Follow USAGE.md → Variant preview coverage. Use representative
  arbitrary data values; avoid blind Cartesian expansion. Targets must map to actual
  renderer inputs, remain inspectable and retain Live without invented states. A preview
  target does not automatically create an API variant; classification cannot excuse
  missing requested coverage.

- For input/output components, verify documented event payloads, internal versus
  host-owned state, operation without callbacks, silent prop updates, and cleanup.
  Keep unrelated page reactions optional and host-owned (USAGE.md → Component inputs
  and outputs).

## Interaction registration checks

Apply COMPONENT-REGISTRATION.md's authoritative interaction ownership definitions and decision
procedure. Inventory independent action/state units; verify a registered renderer
and supported contract for each; distinguish whole-owner states from independently
triggered child states; verify value/control/action ownership and actual dependencies.
Context-restricted controls need inspectable previews in their required context.
Do not accept private state targets or catalog labels as proof of child reuse.

## Specimen gallery presentation

For new or changed previews, follow [specimens/README.md](specimens/README.md).
Use the shared gallery stylesheet/helper, handle the studio's `gallery=1` flag,
provide concise configuration captions, review logical configuration order and `previewLayout.columns`, verify consistent compartment separators in every overview cell, and verify compact/wide rendering without
clipping or component overrides. “Preserve established presentation” means this
written contract, not copying an arbitrary specimen's inline CSS. Remove author-facing
implementation commentary from preview captions; retain it in contract/usage docs.

### Complete spacing inspection boundaries

For every affected configuration, verify Spacing mode covers the complete owned
arrangement, including outer wrapper insets and gaps around sibling controls.
Declare owned wrappers in anatomy parts and their padding/gaps in anatomy spacing,
even when the registered class belongs to an inner control. The inspector includes
those declared ancestors automatically; do not use gallery containers as component
ownership boundaries. Inspecting only the primary control does not complete this check.

### One source for outside and expanded previews

The outside canvas card and expanded modal's main variant canvas must display the
same examples from `entry.preview`. Register `previewConfigurations` selecting
those existing examples; do not rebuild them in the interaction specimen. The
right-hand interaction card remains separate. Verify every canonical configuration
appears in both main views with the same columns, content and mounted children,
and that each source selector matches exactly once. Keep live controls functional.

Component specimens demonstrate the registered component and its direct children,
not page-owned relationships. Do not initialize an interaction pattern inside a
component demo merely because a real page connects that component to another
surface. Demonstrate that coordination in the pattern's own specimen and verify
it in page consumers. A trigger can retain its native hover/focus/activation
without opening a popup that the component does not own.

### State categories and demonstrations

Follow COMPONENT-REGISTRATION.md → Mandatory: state categories and preview contracts. For each
state, register category, input/values/default, rendering and value owners,
visible/semantic result, transition request/trigger/output, and demo wiring.
Distinguish transient active from persistent pressed. Do not invent click-anywhere
behavior for supplied state. Standalone Live previews use external studio input
controls; composed Live previews may connect actual registered children through
the documented request/update contract. Child state galleries stay at child owners.
Verify externally supplied updates and child-triggered requests separately. Record
missing studio controls as implementation gaps rather than silently changing the
component contract. Extend the vocabulary explicitly as new cases are established.

Gallery registration gate: run `node design-system/specimens/check-gallery.js`
from the workspace for new registrations or preview changes, alongside attachment
validation. A passing static check does not replace the visual checks above.

## Theme coverage

For new components or color changes, verify Light and Dark in Foundations,
including representative interaction states. Use semantic color roles for changing
surfaces/text/borders; preserve fixed dark-surface treatments. Check light-theme
appearance remains unchanged when making value-preserving substitutions.
