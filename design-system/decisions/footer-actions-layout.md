# Footer action widths and alignment

User requested visible Bug/Feature labels and an icon-only final action for the
three-action layout. Replaced equal flex bases with content-sized bases: labelled
actions share spare space and shrink only under constraint; icon-only buttons keep
their intrinsic icon/inset width. The component enforces the three-action contract.
Icon slots and 20px text line boxes are centered on the same cross axis.

Registered source Bug and Feature artwork in normalized 24px frames and changed
the email shell to shared icon IDs; its old differently sized SVG coordinate frames
were incompatible with the shared fragment renderer. No shell styling overrides.

Verified the actual 250px email sidebar: Bug 96.2px, Feature 120.8px, Settings
33px; both labels fit and icon/text vertical centers match. Verified all three
specimen layouts and spacing inspector mappings (12px block, 8px inline, 4px gap).
Attachment validation, action regression tests and icon tests pass. Extremely
narrow widths and unusually long labels have not been visually reviewed.

Follow-up: the user found the 33px icon-only segment squeezed. It now has a
component-owned 48px minimum width, using twice the existing 24px spacing primitive.
The labelled actions retain content-based sizing and share the remaining width.

Follow-up (explicit user request): the vertical item dividers read almost invisible
against the footer surface (gray-850 #2d2d2d on gray-900 #292929, a 4-level step).
`--titan-footer-actions-divider` was stepped up, then eased back after review to
grey-910 (#373737): visible on the charcoal surface without drawing a hard line.
The horizontal top line (black) and the surface role are unchanged.
