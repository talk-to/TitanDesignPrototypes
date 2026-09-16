# Variant preview separators

Added subtle full-width row rules and a full-height center rule to the action
specimen's gallery variants (Icon button and Button, as shown in the user's
reference). Split button's single-column variants use horizontal rules only.
The specimen owns the full-width grid and 20px/24px cell insets; actual shared
component padding, icon sizes, callbacks, and inspector metadata are unchanged.
At widths below 300px, variants stack and the center rule is removed. No studio
framework code was modified.

Visually inspected the loaded Icon button and Button cards in the actual studio:
dividers meet the preview edges, captions align with their controls, and controls
remain unclipped. Attachment check returned no errors. This was a specimen-only
presentation change; component behavior and narrow-mode interactions were not
retested.
