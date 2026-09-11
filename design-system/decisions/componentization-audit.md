# Conservative componentization audit

Source: `Shells/TitanEmailShell/index.html`. This is an extraction recommendation,
not component registration or implementation. Counts below are static HTML elements,
parsed without JavaScript-generated template markup. They are evidence of repetition,
not adoption metrics; selector families may overlap and counts must not be summed.

## First extraction: three controls

### IconButton

Evidence: 19 `.titan-action-btn` elements (17 buttons, 2 divs), 18 `.comp-fmt-btn`
buttons across compose/reply, and 14 `.tile-action-pill` divs in list hover actions.
Primary candidates for the initial migration are the shared 32px action buttons;
28px formatting controls and differently styled list pills need explicit observed
variants, not forced normalization.

Contract: a native button, accessible name, supplied icon, click callback, explicit
size/treatment, disabled and focus-visible behavior. Toggle controls need a defined
pressed state; do not infer toggling from a bold icon. The component owns internal
alignment and hit-area styling; its parent owns action-group gaps. Do not import
application actions, tooltips, dropdown menus or rich-text editing as implicit behavior.
Existing scale-on-hover behavior must be reviewed/preserved deliberately.

### Button (text / icon + text)

Evidence: 6 `.action-opt` controls in the reading toolbar, 3 `.reply-action` controls
in the message footer, and 12 `.comp-feat` controls across compose/reply. These are
all currently divs. Common behavior is an action with a label and optional icon;
feature controls should remain action buttons unless actual toggle behavior is defined.

Contract: native button, text, optional icon, click callback, disabled/focus/pressed
presentation, and only evidenced treatments/densities. Preserve existing distinct
2px/4px icon gaps, 13px/14px type and 4px/5px radius choices until reviewed; never
silently replace them with one visual size. Page-owned loading/business actions do
not become guessed DS features.

### SplitButton

Evidence: 3 `.titan-split-btn` instances: Compose, inline-reply Send and composer Send.
They already share CSS but use inconsistent root elements and split-action semantics.

Contract: one visual group containing two sibling native buttons, separate callbacks
and accessible labels, independent focus/disabled states. Main action and secondary
trigger must not fire each other's handlers. A real attached menu gets its own menu
contract; do not invent scheduling or send options. Inline reply currently wires its
outer Send button to `discardReply()`; treat this as prototype wiring to review, not
production send behavior to standardize.

## Defer

- Navigation item: 14 repeats, but one sidebar context. Useful after button extraction
  or a second navigation context confirms what is genuinely shared.
- Checkbox: 8 static image-based controls in list/header. Needs real checked,
  indeterminate, selection and keyboard contracts; these are not established yet.
- Radio group: 6 rows in settings. The reading-pane behavior is index-based and
  screen-specific; isolate value/selection semantics before extraction.
- Tooltip/menu/popover: one-off or partial implementations do not establish shared
  interaction, focus, dismissal or positioning contracts.
- Mail row, thread stack, reading pane, composer, settings drawer, app switcher:
  domain-specific structures and behavior. Keep screen-owned for now.
- Generic Card, Stack, Divider, Text wrapper and full Toolbar: insufficient benefit
  to justify public components now; tokens/native markup cover their current needs.

## Delivery order when implementation is requested

1. Implement IconButton and migrate a small representative set in the source.
2. Implement Button using the same action foundation, then SplitButton.
3. Register each only after a real shared implementation and working specimens exist.
4. Show actual default, hover, focus, disabled and relevant selected states, plus
   long labels and real icon sizing. Use component-owned internal spacing tokens.
5. Check source interactions and keyboard operation; never claim browser validation
   from static catalog checks. Browser access was unavailable for this source audit.

No components were registered in this audit; no source screen was changed.
