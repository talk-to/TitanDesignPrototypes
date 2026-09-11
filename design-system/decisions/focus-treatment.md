# Focus treatment: visible ring removed

Explicit user request: remove the unwanted blue focus ring across all components.
This supersedes the previous per-component `:focus-visible` outlines.

- `tokens.css` now carries the shared base rule `:focus,:focus-visible{outline:none}`,
  which also suppresses native browser focus outlines anywhere the shared tokens load.
- Removed the component-level ring declarations: actions (Button, Icon button, dark
  variants, Half button, Footer actions), Selection (Tab, Dropdown trigger, Checkbox),
  Composer field input and editor inset ring, Composer header title, Account header,
  Calendar day, Navigation search field and Sidebar item (including the row wrapper
  ring), Message row/card buttons, and App-switcher tiles.
- TitanCalendar, TitanDrive and Titan Contacts shell CSS no longer add their own
  `button/input:focus-visible` outline. TitanEmailShell had none.
- `--titan-focus-ring-width` stays registered in Foundations → Strokes but is
  currently unused. Focus still moves and is announced; it is only visually invisible,
  so keyboard-only users lose a visible focus indicator. Restoring a discreet shared
  indicator later would be a new explicit request.
- Scope: shared components and DS-connected shells. Studio tooling and non-DS
  prototypes keep their own focus styles.
- Specimen Focus demos no longer hand-paint a ring: Composer field focuses the input
  and Mini calendar focuses the date. The shared held-state copiers read the real
  stylesheets, so they inherit the suppression instead of a stale fixture copy.

Verification: forced `:focus`/`:focus-visible` computed styles were checked in
headless Chrome across representative specimens (Composer field and header, Button,
Half button, Checkbox, Calendar day, Sidebar item, Search field, Message row, Account
header, Footer actions); outline style resolves to `none` and the Composer editor has
no focus box-shadow.
