# Dark theme surface layering

The dark theme keeps `--titan-surface-navigation` fixed at charcoal `#1f1f20`
in both themes (navigation and brand colors do not theme). That made the dark
content base `night-10` resolve to the same `#1f1f20`, so the navigation sidebar
merged with the toolbar and middle pane.

Explicit user direction: keep the navigation color as-is; make the middle pane and
the reading pane progressively a little darker. Two supplemental dark steps were
added to the palette (no close grey in the supplied palette), with night aliases:

- `--titan-color-grey-965` / `--titan-color-night-15`: `#1a1a1a`.
- `--titan-color-grey-990` / `--titan-color-night-25`: `#0f0f0f`.

`themes/dark.css` now layers:

- Navigation: `#1f1f20` (unchanged, fixed).
- Content base (`--titan-surface-base`, toolbar/middle/composer surfaces):
  `night-15` = `#1a1a1a`.
- Reading surface (`--titan-surface-reading`, message cards/reading pane):
  `night-25` = `#0f0f0f`.

No existing palette values changed and the light theme is unchanged. The legacy
`--reading-pane-bg` stays a separate documented value.
