# Titan design-system enrichment

Work in small reviewable passes. Each pass records evidence, decisions, remaining
gaps and verification. Catalog size is not a success measure.

| Step | Scope | Exit checkpoint |
| --- | --- | --- |
| 1. Connect and baseline | Attach existing shell, register its preview, move existing root controls unchanged, record inventory. | Source/import validation passes; visual baseline review pending. |
| 2. Foundations | Review color roles, typography, spacing, radii, borders, elevation and motion. Add only scales supported by evidence; migrate one property family at a time. | Foundation specimens and shell match at desktop/narrow widths; exceptions documented. |
| 3. States and assets | Inventory icons; document hover, pressed, selected, focus, disabled, loading and empty states where applicable. | Original assets mapped; keyboard and state gaps explicit; no invented states marked supported. |
| 4. A few primitives | Start with action/icon button, then basic/split action only if the existing uses support a common contract. One family per pass. | Real shared implementation adopted by shell, states/anatomy/specimen verified, no duplicated preview implementation. |
| 5. Repeated patterns | Consider menu rows, navigation items and message rows after comparing multiple actual uses. | Shared behavior and optional parts established; screen arrangement remains local. |
| 6. Broader adoption | Apply to a second selected Titan screen and refine only proven common contracts. | Both screens preserve appearance/behavior; ownership and exceptions stay clear. |

## Current position

The table describes the original enrichment sequence, not a list of unstarted work.
The current registry includes shared components, icons and workspace/docking patterns.
Foundations include observed elevation roles; see `decisions/elevation.md` for scope
and verification. Composer is already registered, and settings/workspace arrangements
have pattern entries. Registration does not establish complete source adoption.

Further work should follow the requested screen or gap. Broader reuse and remaining
visual, accessibility and responsive checks need evidence from actual consumers.
Some motion is implemented in the docking pattern; no complete shared motion or
theme system is implied. Do not automatically execute all roadmap phases.

The e544b39 studio refresh is a historical checkpoint, not a statement of current
checkout cleanliness or version. See `decisions/upstream-refresh.md` for that record.
Use the installed studio workflow and current app-owned registry for ongoing work.
