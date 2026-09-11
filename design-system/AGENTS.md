# Ishant’s shared Titan design system

Read [COMPONENT-REGISTRATION.md](COMPONENT-REGISTRATION.md) for the authoritative
registration, composition, state and preview rules. Read studio.config.json in this directory. Resolve studioRoot relative to that file.
For implementation tasks, read the installed studio’s framework/AGENT-WORKFLOW.md
and framework/CONTRACTS.md once per task, then this folder’s BRIEF.md, relevant
registry entries and topic decisions. Do not reread unchanged material already
loaded in the conversation. For documentation-only tasks, read the affected guidance
and the sources needed to verify it rather than the entire implementation history.
The shared workflow is loaded from the installed studio, not copied.
Titan’s COMPONENT-CHECKLIST.md controls review scope and takes precedence over
blanket full-audit requirements in the shared workflow; other contracts still apply.

The system supports three workflows:
- Enrich it from user-selected reference screens, recording evidence and reusable rules.
- Create new screens that use the shared tokens and components.
- Align existing screens to the system when requested, preserving their functionality.

Reference screens are inputs to the system, not the only screens it may serve.
Do not automatically migrate every new reference screen: extract when asked to
extract, align when asked to align, and implement when asked to build. Apply changes
only within the requested scope. Do not replace another explicitly selected system.
Keep existing screen locations unless the user requests relocation.
Keep this app’s tokens, components, registry, specimens and decisions in this folder.
App-specific instructions here and existing app instructions remain app-owned.
Do not edit studio code to customize this app. Never overwrite unrelated files.

Consult FINDINGS.md when extraction history or a recorded exception is relevant.
Its studio-refresh details are historical, not a live version report. Use the upstream native presentation; do not
restore archived local studio overrides.

This root-level, gitignored content folder serves Ishant’s prototypes across the
workspace. The email shell is one source screen, not the owner of the system.
Read USAGE.md when applying the system to a new screen.

## Mandatory: reuse components unchanged

Follow [the component registration contract](COMPONENT-REGISTRATION.md).
The checklist controls verification scope; do not maintain a second rule set here.

## Mandatory: register clear component boundaries

Follow [the component registration contract](COMPONENT-REGISTRATION.md).
The checklist controls verification scope; do not maintain a second rule set here.

## Required component workflow

For component, token, preview or screen implementation work, follow
[COMPONENT-CHECKLIST.md](COMPONENT-CHECKLIST.md). Select checks by the actual change;
reusing an unchanged component does not trigger a component audit. Small edits do
not require a full spacing/interaction review or a new audit document. New components
and structural/API changes need broader review as defined there. Report performed
checks and verification limitations. This app-owned policy survives studio updates
and is not an additional approval requirement.

Spacing inspection remains core to this prototype library. Building or rearranging
screens requires the checklist’s screen spacing review, including parent-owned gaps
between unchanged components. Preserve accurate component spacing mappings and check
affected mappings when spacing or structure changes; skip unrelated re-audits.

Current DS-connected shell: `../Prototypes/Ishant/design ops/DS-specific shells/TitanEmailShell/`.
The original `../Shells/TitanEmailShell/` has been restored to its pre-DS Git version.
Use the DS-specific copy for ongoing DS work; see decisions/ds-shell-location.md.

## Variant classification

Follow [the component registration contract](COMPONENT-REGISTRATION.md).
The checklist controls verification scope; do not maintain a second rule set here.

## Mandatory: state ownership

Follow [the component registration contract](COMPONENT-REGISTRATION.md).
The checklist controls verification scope; do not maintain a second rule set here.

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

## Mandatory: interaction-unit registration

Follow [the component registration contract](COMPONENT-REGISTRATION.md).
The checklist controls verification scope; do not maintain a second rule set here.

## Mandatory: preview coverage is separate from classification

Follow USAGE.md → Variant preview coverage. Expose meaningful supported configurations
(content presence, discrete sizing, composition constraints) and explicit user requests,
not just API variants. Use representative data values and meaningful combinations.
Do not omit targets because a configuration uses content props, or invent a new API
variant merely because a preview target is needed.
