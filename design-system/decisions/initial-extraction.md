# Initial extraction — 2026-09-08

## Evidence and scope

Inspected ../index.html, ../new_chat_context.md and asset inventories. This is one
static HTML shell containing inline CSS, JavaScript and multiple interactive states.
The context note is secondary evidence; current source takes precedence. Its links
to other prototypes do not expand this extraction's scope.

The source has a 250px dark sidebar (#1c1c1c), a message list, a light reading pane,
utilities, settings, composer and inline reply surfaces. The system font stack is
-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI, sans-serif. 14px appears
frequently alongside 11–15px metadata/body sizes and 18/24px headings; these are
observations, not yet an approved type scale. The split action uses #2170f4.

## Adopted foundations

Moved the 14 existing :root declarations to tokens/semantics.css with their names
and values unchanged. The actual shell imports tokens.css through a relative URL,
so the import works both under the studio and when served from its existing folder.
These cover reading/search surfaces, two borders, selection, hover/pressed overlays,
4px card radius, 6px compose/search radius, 12px card spacing and 0.97 click scale.
An existing declaration is not evidence that every token has active consumers.
Primitive scales remain deliberately empty until the next review.

## Candidates and discrepancies

Action buttons and split buttons are candidates because the source reuses their
classes. Do not yet register them as supported components: .titan-action-btn is
redeclared later in the document, and optional content, keyboard behavior, focus,
disabled and loading states need review. Whole message rows, composer, navigation
and dock remain screen-owned. SVG assets are mixed named and UUID files; retain
originals and inventory duplicates before choosing an icon interface.

Several neutral/hover shades coexist. Preserve them pending role/cascade review.
No CSS @media rules were found. Fixed pane sizes and hidden overflow require narrow
viewport checks. The context note's layout claims are not browser-verified here.

## Confidence and validation boundary

High confidence: literal CSS values, imports, source structure and asset existence.
Provisional: semantic role generalization, shared spacing and reusable boundaries.
Unknown: full state behavior, accessibility, theme completeness and responsive fit.
Browser access was unavailable during setup. Visual parity, focus order, wrapping,
long/empty content and interaction checks remain pending; no visual approval claimed.

Setup checks: attachment validator passed with zero errors; all 11 studio tests
passed with local-server permissions. A source comparison confirmed the only shell
change is the stylesheet import and relocation of the original 14 root declarations;
all remaining markup, CSS and scripts are byte-for-byte unchanged.

Correction from phase 2a: HTTP checks found the original relative import is blocked
under the studio /app/ mount. See color-typography.md for the canonical URL and
standalone fallback correction. The phase 1 import assumption above was incorrect.
