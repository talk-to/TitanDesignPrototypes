# Launcher final support-link inset

Both support links use the same footer renderer and 48px row height with 24px
icons. The exported panel background includes transparent shadow area: its visible
surface ends at y=609.995 of a 626.995 viewBox. At the measured 623px background
height this consumed the former 8px panel bottom padding, making the last row end
at the visible panel edge.

Increased the shared panel's bottom padding from 8px to --titan-space-16 and
registered that relationship in anatomy.spacing. Row geometry, icon artwork,
link gaps and callbacks remain unchanged. The panel grows with its content.
This change is to the shared launcher; the separate legacy shell implementation
was not modified.

Inspected the standalone shared specimen before/after. Both rows measured 48px
before; the new rendered surface has visible space after the final row and no
clipping. All 30 app tests and attachment validation pass. Inspector band and
narrow/long-content browser checks were not repeated for this padding-only change.

## Corrected scope after user clarification

The supporting-link preview spacing was already correct. Restored its original
24px outer inset and removed the unnecessary studio inset override. Adjusted only
the App switcher component panel bottom padding from 16px to --titan-space-12,
with matching anatomy metadata. Support-link row dimensions remain unchanged.
Visually checked the actual App switcher gallery card; attachment validation passed.
