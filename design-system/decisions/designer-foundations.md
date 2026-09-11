# Visual foundation presentation

User requested a designer-facing presentation with minimal visible text. Foundation
views now separate typography, colors, spacing and roundness. Typography uses actual
size/weight samples and the existing app font; metadata records intended example
roles without changing screen styles. Spacing shows real distances between objects.
Roundness shows actual corner shapes and a magnified detail. Existing 4px/6px radius
controls remain explicitly defined but not adopted in the source shell.

Token names, definitions, source paths and scopes are inside closed Details. Referenced
base values remain under More values. All 67 definitions are retained. App-specific
labels/examples belong to registry.foundationPresentation, not shared hardcoded copy.

Validation passed. The full 20-test suite passed, followed by the presentation tests
after final display refinements. Browser access was unavailable; visual rendering
and pointer/keyboard inspection still require review. No new components extracted.
