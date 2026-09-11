# Monochrome colors — 2026-09-09

User requested consistent gray gallery previews and multiple color usages for all
monochrome artwork. Replaced dark gallery backdrops with tintable SVG fragments.
50 canonical interface icons (52 catalog entries including aliases) now expose
`#titan-artwork` and `--titan-icon-color`. Paint defaults preserve existing image
usages, including white composer window icons. No path, transform, spacing, mask,
or silhouette was changed. Branded artwork, Edit's baked white circle/blue pencil,
Text color's three colors and the app switcher artwork retain their colors.

Gallery uses currentColor mapped to the shared paint property. Copy SVG continues
to read the canonical file, now containing the tintable markup. External-use
fragments carry root fill/stroke settings so open paths remain open. Masks and
clip definitions were not recolored. Color variants share one SVG, not duplicates.

Actions supports optional iconColor on Icon Button, Button and Split Button's main
icon; currentColor inherits the control color. Existing default <img> paths and
behavior remain. SVG icon slots reuse the identical existing image selectors and
sizes. No padding, gap, margin, button dimensions, handlers or ownership changed.
The existing component spacing audit remains applicable. Use the optional color
only with catalog monochrome assets; arbitrary image assets remain supported.

Browser screenshots verified the Controls gallery without backdrops and four
actual shared Icon Buttons in gray, blue and white. Composer was visually checked
again to confirm its original white header and gray body icons. The color specimen
uses the real Actions renderer. Unit/attachment checks were run. Full keyboard,
responsive and spacing-inspector-band coverage was not repeated for this paint-only
change. See specimens/icon-colors.html and USAGE.md for usage.
