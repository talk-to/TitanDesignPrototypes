# Light and dark theme contract

Read this file before changing colors, theme behavior, or theme-aware previews.
These rules apply to any model or contributor working on Titan.

## Switching and persistence

The Studio sidebar sun/moon button switches Light/Dark from any section. In the
collapsed sidebar it replaces the T. Do not restore a separate Foundations picker.
Studio stores the selection per catalog (`studio-theme:` plus the catalog base URL)
and includes `theme=light` or `theme=dark` in preview URLs. An explicit URL theme
wins over the saved selection. Components, interaction frames, icons, patterns and
registered screens must all honor that parameter.

Standalone app previews load `theme.js` from this folder. It accepts only `light`
and `dark`, defaults to Light, loads tokens.css and then the approved theme file.
It does not read the Studio preference itself. Do not construct arbitrary theme
stylesheet URLs from user input. Use the existing runtime.

## Color ownership

- Primitives in tokens/primitives.css have stable values in both themes. Never
  invert or redefine a primitive to implement a theme.
- Semantic roles in tokens/semantics.css describe surfaces, foregrounds and states.
  Light uses their default values. themes/dark.css overrides responsive roles.
- Preserve the doubled `:root:root` specificity in dark.css. Component styles can
  import base tokens later; ordinary `:root` overrides would then be reset.
- Do not put application theme rules in DS Starter. Studio styling uses its own
  `--studio-*` variables and `data-preview-color-scheme`; the sidebar toggle
  coordinates its appearance with the preview theme without importing app CSS.
- Color roles in Foundations are primitive-first: swatch/key/value on the left,
  separate Semantic uses · Light and Semantic uses · Dark columns on the right.
  Show the complete primitive palette in both themes. Slightly fade the inactive
  theme column without hiding its mappings; repeat shared uses in both columns. Keep headings outside sorted
  rows. Group primitives in named family containers using colorFamily metadata. The
  color wheel filters hue families; the center selects Neutrals, and clicking the selected segment again restores All.
  Order colors by the number of unique semantic roles using them across themes,
  highest first; break ties light to dark by colorOrder. Preserve both theme-use columns. New colors need
  these presentation fields; missing metadata falls under Other colors.

## Fixed dark treatments

The dark sidebar, composer header, inverse foregrounds, dedicated dark and
 dark-quiet controls, and their dark specimen backing surfaces retain their
existing treatment in both themes. A component's `dark` variant is a surface
context, not the application's theme. Do not switch variants merely because the
global theme changed. Preserve brand artwork and its intentional colors.

Elevated surfaces that are intentionally dark in both themes use the explicit
`.titan-elevation-native-dark` context with their elevation level or role class.
It retains the default 1px stroke width and shadow level while replacing the light
edge with `--titan-border-elevation-native-dark`. Do not apply it based only on the
global Dark theme; responsive surfaces continue to use their theme-aware roles.

Responsive content surfaces (reading pane, cards, inputs) change along with their
text, border, hover and selected roles. Pair foregrounds with backgrounds; never
change only one and assume contrast remains readable.

Icon button pressing/pressed surfaces use `--titan-icon-button-pressed-surface`.
Light aliases `--selected-bg`; Dark aliases `--titan-color-night-130` (#28486d).
Dedicated dark controls keep `--titan-icon-button-dark-pressed`; quiet/toggle
variants preserve their own behavior. Do not brighten all selected surfaces to
change one control's state.

## Adding or updating components and screens

1. Reuse existing semantic roles when their purpose matches. Create a role when
   the treatment has distinct ownership; provide its Light default and Dark value.
2. Keep fixed dark contexts separate from theme-responsive surfaces. Use inherited
   foreground roles for monochrome icons rather than relying on fixed light fills.
3. Ensure the specimen, interaction fixture and registered screen load theme.js.
   Under Studio use the served `/design-system/` path where needed; existing shell
   integrations include a relative fallback for standalone use.
4. Review both themes: default, hover, pressing, pressed/selected, disabled and
   focus where supported. Check labels, icons, outlines, menus and empty regions.
5. For Studio changes inspect headers, footers, buttons, selection highlights,
   canvas fades and empty panel space too. All must use coordinated foreground
   and surface colors. Do not fade unrelated labels until they are unreadable.

## Verification

Run `node --test design-system/tests/*.test.js` from the workspace root for app
changes. themes.test.js checks fixed dark roles, responsive surfaces and primary/
secondary text contrast. Run the gallery check when specimens change:
`node design-system/specimens/check-gallery.js`.

For Studio logic changes run its `npm test`; integration tests require local server
access. Use `node studio.js check --config <path-to-studio.config.json>` from the
Studio checkout to validate the attached catalog. Verify real browser rendering
and toggle both directions. Tests do not establish whole-product contrast or
coverage of every hardcoded asset. Report any remaining limitations.

Do not restart an already-running Studio. Theme work does not authorize a push;
follow the user's current Git instructions.

Registered color roles must resolve through primitive references in both themes.
Do not leave a direct Light hex value paired with a Dark primitive alias: the
cross-theme table must trace both. Reuse an existing exact-value primitive where
possible. For value-preserving cleanup, verify resolved colors before and after.

Launcher icon backing tints are fixed asset artwork treatments in app-switcher.css.
They are not semantic theme roles or palette primitives and must not change with theme.

## Preferred Figma palette

The 48 colors from the user-supplied `colorVariables` file are canonical. See
[the palette mapping](decisions/figma-color-palette.md) for source names, compatibility
aliases, replacements and the two supplemental navy colors. Prefer these supplied
values for new roles. Do not generate approximate shades when a supplied color fits.
Unused source colors remain registered primitives; do not invent semantic uses.

The app switcher panel uses `--titan-launcher-surface` (Light white, Dark grey-910),
with `--titan-launcher-divider` for its outline, pointer and separators. These are
CSS surfaces, never SVG backgrounds. Legacy background/divider image props are ignored;
app and tool artwork remains unchanged.

Selected app tiles use `--titan-launcher-selected-surface`: the shared selected
surface in Light and Figma blue-600 (#154698) in Dark. This role is launcher-only.
