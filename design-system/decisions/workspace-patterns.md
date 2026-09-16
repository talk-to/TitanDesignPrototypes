# Layouts and interaction patterns

Registered the observed three-pane workspace and overlay settings panel using the
actual DS shell in embedded previews. Overlay fixture calls the existing toggle
on load; it does not recreate settings content. Tabs separate layouts from interaction
patterns. Source panel is 316px wide, fixed right/full-height, with shadow and a
300ms slide. Toggle and close are implemented; Escape/outside dismissal and focus
management are not. These limitations are recorded rather than invented.

Browser review pending; registry and studio tests run.

Presentation updated to low-fidelity labeled boxes. These diagrams explain region
relationships rather than reproduce email UI. Overlay has only open/close demo
controls; guidance is designer-facing and does not imply unimplemented shell behavior.
