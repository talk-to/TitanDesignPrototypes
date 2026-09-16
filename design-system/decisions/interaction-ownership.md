# Interaction ownership audit

Audited all 10 registered components against their renderers and sidebar targets.

- Icon button: owns both size variants and their control states.
- Button: owns its size/style variants. Grouped actions demonstrates layout only.
- Split button: owns both segments; not implemented as nested registered Buttons.
- Message list: current sidebar covers row selection/open focus/hover, not child
  checkbox states. Row star is source-specific. The checkbox is still native local
  markup, not the newly registered Checkbox renderer; do not claim reuse yet.
- Received message: footer uses TitanActions.button. Removed Reply/Forward targets
  and all duplicated Button states. Sidebar now demonstrates collapsed/expanded;
  Live starts collapsed and uses the existing expand callback. No unobserved collapse
  action added. Registered Button dependency.
- Search field: input/filter are internal parts; filter is not the Dropdown renderer.
- Sidebar item: owns selection, navigation activation and control states.
- Tabs: owns selected tab and internal keyboard focus movement.
- Dropdown trigger: owns activation/focus; caller owns menu.
- Checkbox: owns native checked and focus states.

Each entry now records interaction ownership; targets name their owning entry.
Shared DS Starter AGENTS points to the mandatory workflow ownership audit, with
matching portable metadata guidance. App checklist references the same rule.
Tests cover message ownership and reject child-owned targets in this catalog.
Browser visual and interaction verification remains pending.

Update: Message row now composes the registered Checkbox and Icon button unchanged;
the earlier note that its checkbox was still native local markup is superseded.
See `message-row.md` → Follow-up: shared child reuse. Received message now composes
the registered Button and compact Icon button behind external action wrappers; the
earlier note that only its footer used the shared Button is superseded. See
`message-components.md` → Follow-up: shared child reuse in Received message. Split
button now composes two registered Half button children; the earlier private-segment
note is superseded. See `action-components.md` → Split-segment correction.
