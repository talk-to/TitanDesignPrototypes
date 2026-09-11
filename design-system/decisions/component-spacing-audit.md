# Component audit

Scope: all five registered components, their shared CSS/renderers, source adoption,
all current gallery/detail specimens, and the spacing inspector. Static CSS and
render/interaction contracts audited; browser/computed-layout QA is unavailable.

## Findings corrected

- Button: existing insets and icon gap registered. Received-message footer now uses
  this actual renderer, removing the divergent raw image + text markup and extra
  8px image margin. Source footer already used the shared icon-slot structure.
- Split button: icon gap and both nonzero main-action insets accounted for. Secondary
  segment uses fixed geometry with zero padding; no fictitious gap added.
- Icon button: required icon metadata corrected. 32/40px controls center a 20px image;
  padding is zero, so remaining space is alignment geometry, not a padding token.
- Message list: stacked/wide selectors separated. Wide 21px left inset, 16px right
  inset, 10px controls-to-content margin, 8px checkbox margin, 6px summary margin,
  12px sender-column inset and 4px list insets now have accurate measurements.
  Stacked row insets, 12px controls-to-text gap, 3px control gap and 3px text gap
  accounted for. Existing local values are preserved; no generalized semantics
  inferred from wide-layout exceptions.
- Received message: collapsed insets, header groups, avatar/text gap, sender/recipient
  spacing, body/footer insets, footer action gap and nested Button spacing accounted
  for. Sender bottom margin is removed when recipients are absent. Header actions
  require accessible labels. Component box sizing no longer depends on a page reset.
- Inspector: right-margin bands were unsupported; implemented and regression tested.

## Deliberate boundaries

- Source-only legacy markup includes hover action pills, receipt counts, thread
  metadata and overlap composition. These are retained for source compatibility but
  are not exposed as supported renderer parts. Do not claim they were extracted.
- 160px wide timestamp reservation and 64px stacked sender reservation are text
  exclusion zones for absolutely positioned metadata, not semantic gaps. Row height,
  sender-column width, avatar size, hit areas, borders and line heights are geometry.
- Avatar 1px optical offset and unread-indicator positions remain local geometry.
- Source card 8px external margins are parent/composition spacing. Specimens remove
  them and use their own gallery spacing; they are not component internal gaps.
- Flex space-between may distribute more empty space than its declared minimum gap.
  The inspector measures actual adjacent geometry rather than labelling that entire
  free area with the minimum-gap token.
- Single-line lists preserve their minimum-width/scrolling contract. Narrow-screen
  visual behavior has not been browser verified and is not certified by these checks.

## Verification

Shared renderer tests cover escaping, required labels, variants, nested Button
identity, disabled actions, independent event routing and cleanup. Studio tests cover
catalog validation, presentation, mounting the spacing inspector and margin geometry.
The source retains existing HTML and callbacks while importing shared CSS. This is
not evidence of complete browser interaction coverage or a full source-renderer port.
Future component changes must repeat the spacing/variant audit per AGENTS.md.
