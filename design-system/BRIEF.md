# Titan design system brief

Initial source: ../Shells/TitanEmailShell/index.html and its SVG/PNG asset folders. This shell is the
first source of evidence, not proof of rules shared by every Titan product.

Direction: preserve the existing dense desktop email layout, dark navigation,
light reading surfaces, restrained blue actions, compact typography and small radii.

Historical setup scope: attach the studio, inventory the design, and adopt existing
root tokens without value changes. The empty-catalog restriction applied only to
that initial setup; it does not restrict reuse of the components now registered.

Proposed review viewports: 1440×900, 1280×800 and 768×900. Narrow-screen behavior is
unverified; do not claim mobile support. Preserve compose/reply, selection, search,
menus, settings and dock behavior. Use fictional data in new examples.

The original setup excluded themes. Light/Dark themes are now explicitly authorized
and implemented; follow THEMES.md. Do not redesign the shell or normalize unrelated exceptions. Keep original screen and asset paths in place.

Historical foundation passes: phase 2a covered color/type; phase 2b covered
value-preserving spacing extraction. Their component exclusions applied to those
passes, not to later authorized component work. Color/type appearance was accepted;
this does not imply approval of every subsequent state or layout.

## Product scope and browsing

This is the beginning of the broader Titan design system, not a one-screen email
DS. TitanEmailShell was the first reference. Future user-selected screens/features
will enrich the same system; each extraction needs its own evidence and source.
The current attachment path is a storage location, not a product-scope boundary.
Do not relocate content or expand the server filesystem root without a concrete
new source requirement. Selected sections fill the sidebar's remaining workspace;
only Overview retains an introductory header. Avoid repeated source-screen CTAs.

Studio refresh: latest upstream presentation is now authoritative. Read FINDINGS.md
for durable evidence and use the native Foundations view. Prior UI preferences are
context for future work, not permission to reapply archived framework customizations.

Presentation preference: keep visible text minimal. Avoid instructional paragraphs,
implementation disclaimers and redundant counts in routine catalog views. Keep
necessary labels/errors and detailed contracts or review notes on demand.

Latest presentation preference: token names must be visible on each sample. Only
file paths/scope remain under Details. Keep spacing a compact comparable scale and
roundness a simple shape/value sample. Avoid magnified diagrams, status commentary
and component-association guidance in these views. This catalog is still growing.

Foundation presentation is defined by the current registry and installed studio.
The earlier primitives-only preference was followed by role relationship views
for typography, colors, spacing, radius and strokes. Do not remove those views
based on the earlier preference. Keep routine visible copy minimal.

Do not invent typography variants or add proposed styles. Add heading types only
when observed in source screens. Existing primitive sizes do not establish heading
roles. The inferred Medium/Small heading variants were removed.

Show designer-relevant typography information explicitly: full font fallback order,
size with units, named numeric weight and assigned line height. Do not substitute
a vague font name or imply an unassigned property is an established style value.

Current location: workspace-root design-system/, tracked on Titan-design-system
for shared use across prototypes. appRoot is the workspace, and registered
previews use their paths under /app/. Studio tooling remains a separate checkout.

## Current implementation scope

Use `registry.json` for the current component and pattern inventory, and `USAGE.md`
for imports, supported APIs and limitations. Registered families include actions,
messages, inputs/navigation, selection, launcher, composer and avatar. Reuse their
existing implementations for matching contexts. New families or variants require
source evidence and requested scope; registration does not prove full shell adoption.

Foundations include color, typography, spacing, radius, strokes, iconography and
observed elevation roles. Elevation now has a deliberate numbered 0–4 border/shadow scale, mapped
semantic roles, and separately named directional/shape-specific treatments. See `decisions/elevation.md`. Verification is recorded per change; do not
interpret the catalog as blanket visual, accessibility or responsive approval.

Current DS-connected shell: `../Prototypes/Ishant/design ops/DS-specific shells/TitanEmailShell/`.
The original `../Shells/TitanEmailShell/` has been restored to its pre-DS Git version.
Use the DS-specific copy for ongoing DS work; see decisions/ds-shell-location.md.
