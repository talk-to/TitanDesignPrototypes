# Interaction previews

All seven components expose an optional Interactions sidebar via registry metadata.
The main gallery shows size/layout variants; pressed/disabled demonstrations move to
the sidebar. Search has no invented hover style. Received-message targets are its
footer actions, not an invented card-wide interaction. Split buttons expose independent
main/dropdown targets. Active (momentary pressing) and pressed (toggle state) differ.

The dedicated specimen calls shared renderers. Held hover/active/focus styles are
aliased from the actual loaded CSS rules in the disposable specimen; no product
styles or tokens are changed. Native disabled, readonly, selected and aria-pressed
states are supplied through existing options/attributes. Live mode uses real event
callbacks with local feedback, never sends mail or performs remote operations.

Changing state recreates the preview to reset prior state. Held controls are removed
from keyboard tab order and pointer activation; Live restores normal interaction.
Sidebar supports Escape, close and outside click, with focus return on explicit close.
The dark sidebar-item surface and component widths remain in the specimen.

Validation: registry/URL checks and studio regression tests. Browser visual, keyboard
and computed-style verification remains pending without a connected browser surface.
