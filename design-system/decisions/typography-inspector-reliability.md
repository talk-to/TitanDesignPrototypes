# Typography inspector reliability — 2026-09-09

The shared full-page inspector now reports Label, Count and other actual text parts,
not the component root's incidental font. Source details and copied instance context
include part identity, declaration, relevant tokens and inherited provenance.

Verified in browser with the real Sidebar list item and Dropdown trigger renderers:
- Label size 14px and white text resolve to their tokens, including inherited family.
- Count size/weight resolve to tokens; its #c66f6f color correctly remains Literal.
- Browser-controlled normal leading/weight are separated from missing source tracing.
- Dropdown's font shorthand identifies its family, size, weight and leading tokens.
- A mixed shorthand with literal 400 reports Literal weight while its size, family
  and leading remain Tokenized; matching a token's resolved value is not sufficient.

Tests cover inheritance, inline overrides, importance, inherit/unset, fallback,
unknown tokens, inaccessible sheets, complex cascade, defaults, cycles and active
animation. The full suite passed before adding two additional targeted checks;
final check results are reported in the task handoff. No release lock was regenerated.

Limitations are explicit: complex functional selector ranking/layers, inaccessible
stylesheets, animation/transition and native-control inheritance with a competing
ancestor may remain Unable to trace. Generated pseudo text and shadow-root source
tracing are outside this implementation. This change does not certify complete
component tokenization or automatically assess visual consistency. Existing spacing
trace and edit behavior are unchanged.

Browser verification fixture: ../audits/typography-verification.html?ds=true.
Prototype-local yellow derivation markers, S/C shortcuts and copy-button restriction
continue to be owned by the App sidebar prototype.
