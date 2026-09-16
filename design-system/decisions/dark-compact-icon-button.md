# Dark compact Icon button

User requested a dark-compatible month navigation control and smaller artwork.
Added the shared dark-compact variant: 24px target, 16px artwork, inverse foreground,
12% white hover and 18% white pressed surface, no hover scaling, inverse focus ring.
Shared activation and disabled behavior remain intact. Zero internal padding;
parent owns gaps. Removed Calendar's local button-size override and selected this
variant for both month arrows. Other Icon button usages retain existing variants.

Registered gallery and interaction previews. Validation passed; browser verified
24px target, 16px SVG and rgba(255,255,255,.12) hover on the dark preview surface.

## Compact light-surface counterpart

User requested smaller week arrows. Added compact: same 24px target / 16px artwork,
using existing light-surface states. Applied to both week controls; month controls
retain dark-compact. Added gallery/interaction entries. Attachment validation passed;
browser measured both Calendar week controls at 24px with 16px SVGs. No padding change.
