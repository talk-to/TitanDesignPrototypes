# Icon toggle variant

The user requested an Icon button variant that fills and unfills in place, reusing
the earlier Message row star behavior as a shared treatment: "it should become its
own new variant, which is called an icon toggle, and we could add more toggles
later." This is the explicit request the variant rule requires.

Contract: `TitanActions.iconButton({variant:'toggle', icon, pressedIcon, pressed})`.
`icon` is the resting asset and `pressedIcon` the toggled asset; both are required
and accept registered icon IDs or custom image paths. `pressed` must be an explicit
boolean; the caller owns the value and updates it through the documented
`aria-pressed` input. The size is fixed at 24px with 16px artwork and `size` is
rejected. The variant paints no container in default, hover, active or pressed
states: resting artwork uses `--titan-text-muted`, pressed artwork uses
`--titan-action-primary`. Focus, disabled and activation remain the shared Icon
button behavior. This is a control-treatment variant at the existing owner, not a
new component.

Assets: `icons/assets/star-outline.svg` was added from the shell's tile-star source
(`1e1696aa-5b8d-4409-97fd-4ce5c85c5ae5.svg`), normalized to the shared 24px canvas
with the `#titan-artwork` fragment and `--titan-icon-color` stroke. The existing
`star` asset supplies the filled state. The catalog registers `star-outline` and the
browser snapshot was rebuilt with `icons/build-runtime.js`.

Message row: the star now uses the variant with `icon:'star-outline'` and
`pressedIcon:'star'`, restoring fill/unfill through the registered owner. The row
wrapper keeps only event routing and placement; it carries no star styling. The
registry records the variant target and the message-row dependency on Icon button.

Verification: `tests/actions.test.js` covers the required artworks, explicit pressed
state, fixed size, both artwork classes and asset references; `tests/messages.test.js`
covers row composition; icon and icon-runtime tests cover the new asset and snapshot.
Attachment validation runs with no errors. Browser computed-layout, hover/pressed
rendering and inspector verification remain pending.

Not included: sizes other than 24px, hover/active treatment changes, multi-state
toggles and toggles in other components. Add them when observed or requested.
