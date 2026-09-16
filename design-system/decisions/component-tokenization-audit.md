# Registered component tokenization audit — 2026-09-09

## Result

All **19 registered components** were reviewed across their **7 shared CSS files**,
registered renderers and live specimens. They are **not uniformly fully tokenized**.
Most primary text and spacing references are already in place. Registration alone
does not certify tokenization, visual accessibility, theme support or inspector accuracy.

This audit made **25 value-preserving substitutions** using existing tokens in
actions.css, selection.css, messages.css, navigation-input.css, app-switcher.css and
composer.css. No new primitive or semantic definitions were invented. Avatar needed
no such substitution. Renderer behavior, spacing ownership and registry contracts
are unchanged; existing specimens consume these same shared styles automatically.

## Per-component findings after fixes

| Registered component | Tokenized parts | Remaining scope / finding |
| --- | --- | --- |
| Icon button | Family, foreground/state colors, icon sizes, radius, control-size custom properties | Window-hover white 14% remains literal; opacity/motion and hit-area geometry are deliberate controls, not missing typography |
| Button | Label size/color/family/weight, insets, gap, radius | 24px line height remains an observed control-specific value; toolbar 5px radius/insets already have local custom properties |
| Split button | Label size/family/color/weight/20px leading, main insets/gap, radius | White 35% separator is still literal; secondary segment widths are geometry |
| Message list | Font family, main text color, wide-list insets; composed row styles | Inherits row gaps below; scrollbar paint/radius remain literal |
| Message row | Sender/subject/preview/time size and primary colors; unread weight; ordinary leading; main spacing | Wide-preview #999 and separator #ccc, hover #f0f0f0 and row borders remain literal; 44px wide leading is alignment geometry; 16px star is a glyph, not a body text style |
| Received message | Sender, recipient, summary, date and body size/color; emphasis; body leading; primary spacing | Card borders and footer rule remain literal; compatibility-only receipt gap, hover-pill paint and optical offsets are separate legacy concerns |
| Search field | Input family/size/color, placeholder color, focus color, insets and icon dimensions | Border/divider #dedede remain literal; inherited/default weight and normal leading are not proof of hardcoding |
| Sidebar list item | Label family/size/inverse color, selected weight, muted color; badge size/weight; main spacing | Badge #c66f6f and selected background #333333 remain literal; label and badge must be inspected separately |
| Tabs | Label size/family/weight/20px leading/color; selected indicator and padding | Control height and underline dimensions are geometry |
| Dropdown trigger | Label font shorthand now tokenizes weight/size/20px leading/family; paint/radius/insets/gap | Composer-specific 6px gap and trigger 2px inset are already scoped controls; other fixed dimensions remain geometry |
| Checkbox | Accent and focus color | Native control with no text part; 14px size and focus outline geometry are not typography failures |
| Grouped actions | Parent's compact action gap; labels owned by shared Buttons | Parent has no independent text style; inherits Button findings |
| App switcher | Font family, composition spacing and observed panel elevation; imports shared trigger, App tile and Launcher item | Child findings below apply; exported background SVG and layout geometry remain local |
| App tile | Label size/weight now tokenized; spacing and artwork size use tokens/custom properties | #707070 label, #f2f2f2 hover and 18px leading remain literal; do not replace with a nearby gray or unrelated text recipe |
| Launcher item | Label size/weight now tokenized; tool/footer spacing, supporting icon dimensions | #707070 label, #f2f2f2 hover, four pastel icon backgrounds and footer border remain literal; 14px tool leading and legacy bold 800 lack matching approved typography roles |
| Composer field row | Label/value/input family/size/colors; spacing and focus color | #ededed separator remains literal; 42px row and 24px input are geometry |
| Formatting toolbar | Parent spacing custom properties; nested shared Dropdown and Icon button styles | #ededed border and #dedede divider remain literal; parent is not the typography owner |
| Email composer | Family/size/colors, editor size/leading, region insets, header paint; corner radius now tokenized | Child separator and button findings apply; normal title/field leading remains deliberate browser/font behavior |
| Avatar | Family/size/weight/inverse color; size and purple background are scoped custom properties | 50% radius and unitless leading 1 are intentional circular/centering geometry; existing purple default is a component token, not an un-tokenized paint property |

## What was fixed

- Literal 400/500/600 font weights now use the existing regular/medium/semibold tokens.
- Ordinary 20px leading now uses the recorded 20px primitive. Wide-row 44px leading
  and Button's 24px leading were not conflated with the body recipe.
- Literal 4px radii now use the existing radius primitive, including the composer's
  two top corners.
- Literal muted #888 text uses the muted text role.
- Launcher 13px labels use compact-control size. Sidebar badge 13px uses the size
  primitive without pretending it is the 12px metadata role.
- Dropdown's font shorthand now references regular weight and 20px leading as well
  as the already-tokenized size and family.

Exact substitutions: [tokenization-fixes.json](../audits/tokenization-fixes.json).

## Outstanding decisions

1. **Finish scoped paint tokens:** launcher label/hover/tool backgrounds, sidebar
   badge, search/composer separators, message hover and wide-preview colors. These
   are genuine remaining literal paint declarations. Preserve their observed values;
   establish source-backed component roles rather than aliasing equal or nearby colors
   across unrelated purposes. The sidebar's selected background is also still literal.
2. **Record remaining text exceptions:** 24px Button, 18px App tile and 14px tool
   leading, plus wide-row alignment and star-glyph sizing. Normal/inherit and browser
   defaults must not be reported as hardcoded without tracing actual text parts.
3. **Fix the inspector verdict:** it currently summarizes the registered root's
   typography. It needs part-aware and inheritance-aware reporting. This audit did
   not modify the shared studio or pretend this issue has been fixed.

## Scope and verification

- Usages inspected: shared specimens, DS-specific TitanEmailShell, App sidebar
  prototype and renderer imports. Legacy compatibility selectors remain in shared
  files; their presence is not a claim of support in every shared renderer.
- Generated declaration inventory covers typography, paint/borders, radius, spacing
  and component custom-property defaults. It is a syntactic inventory, **not a
  compliance percentage**. Token-plus-literal borders may legitimately combine
  tokenized paint with geometric width. SVG artwork, consumer overrides, motion,
  layout dimensions and native-control styles are not scored as text tokenization.
- All 25 substitutions were resolved against existing token definitions and checked
  to equal their previous resolved declarations exactly.
- All **30 component tests pass**. Attachment validation reports **zero errors**,
  with its existing warning that static class counts do not prove computed adoption.
- All 19 registered specimen roots loaded in the browser. Actual descendant text
  styles were collected, including nested child controls; no-text icon/checkbox roots
  were not given a fabricated typography verdict. Example: Sidebar label is 14px
  white, and its badge is 13px semibold #c66f6f—not the outer root's 16px black.
- Browser sampling confirms Button 14px/400/24px, Split button 14px/600/20px,
  Tabs 15px/20px, App tile 13px/500/18px/#707070, and received body 14px/20px.
  These are computed observations cross-checked against CSS, not evidence that every
  property is tokenized merely because it matches a token's value.
- This value-only pass did not change internal spacing, interaction ownership or
  specimen structure. Full responsive/long-content/keyboard/state/spacing-band QA
  was not rerun; this is not certification of complete component compliance.

## Reproduce

Run `python3 design-system/audits/tokenization-audit.py` from the workspace root.
Read [tokenization-inventory.json](../audits/tokenization-inventory.json) for the
source-level record. Open [render-audit.html](../audits/render-audit.html) through
the studio and use **Collect rendered text parts** to sample the real specimens.
