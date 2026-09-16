# Central icon resolution

Shared component APIs now accept catalog IDs. Actions, selection, navigation,
messages, launcher, composer and mini calendar resolve shared icons through
icons/runtime.js. DS specimens and the DS-connected Email/Calendar shells use IDs.
The original email shell’s shared header also requests an ID. Unrelated original
prototype images remain custom paths. No second icon set or toggle was introduced.

catalog.json remains the mapping source. build-runtime.js generates the browser
snapshot for synchronous renderers and file previews; CommonJS reads JSON directly.
A regression test detects stale browser mappings. Runtime URLs are relative to the
runtime script, so consumers do not assume a host or absolute asset directory.

Static images use data-titan-icon; startup and inserted DOM hydration share the
same resolver. Generated image/SVG markup retains IDs for future refresh. Custom
image paths remain accepted. Component CSS retains size, color, layout and hit-area
ownership. A future set implementation belongs in the resolver, with refresh and
iframe synchronization added centrally; consumers keep their semantic IDs.

Verification: 37 DS tests, attached DS validation, and browser checks of Calendar,
Email, composer and launcher. No broken images in those inspected views. Existing
composer image-count test was updated to validate rendered image paths regardless
of data attributes, rather than its stale pre-SVG image count.
