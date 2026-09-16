# Stroke foundations

Observed 1px dropdown/container borders and composer section dividers, 1.5px split-button separators, and 2px focus outlines/composer field dividers. Registered only those three primitive widths in tokens/strokes.css, with separate semantic width aliases for their different purposes. Existing colors and outline offsets remain unchanged. Thickness does not specify surrounding spacing or separator placement.

Actions, selection controls and composer border declarations now consume these aliases. Other legacy rules and SVG drawing geometry are not automatically normalized. The 1px editor inset focus shadow remains a distinct source exception; it is not silently promoted to the 2px outline contract. No separator component is introduced by this step.

Foundations → Strokes shows primitive line samples. Browser visual verification pending; source values preserved and automated checks run.
