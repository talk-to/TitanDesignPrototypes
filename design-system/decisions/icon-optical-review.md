# Icon prominence in actual components — 2026-09-09

## Findings and corrections

The previous normalization enlarged composer image canvases to 24px. With most
artwork filling 20 of those units, these symbols competed with the 14px labels.
Normalizing long-axis bounds also left dense squares/circles heavier than open
marks, and preserved an undersized launcher beaker through obsolete margins.

- Composer Icon Button and feature Button images now use 20px canvases, while their
  28px buttons and 24px label-icon slots remain unchanged. Typical artwork now paints
  approximately 15–17px, with the wide signature slightly larger.
- 40px Icon Button uses a 24px image (normal 32px remains 20px); window controls keep
  18px images inside 24px buttons. The source shell's old max-width clamp is removed
  for shared toolbar icons so the actual shell uses this same geometry.
- Sidebar images increase from 16 to 18px inside the existing 20px slots.
- Launcher beaker now uses its full 24px region. Removed its 3.75px margins around a
  16.5px image; total occupied width/height is unchanged. Registry spacing entries
  and the unused local margin variable were removed. Other footer spacing remains.
- Refined 16 shared assets using uniform scaling around their normalized centers.
  Dense AI Write, Design, Templates, Invoices, Text styling, Bookings and Settings
  are smaller; Italic, Underline, Alignment, Indent, Text color and Link are more
  restrained. Wide Signature, Groups and Compose receive modest enlargement.
  Exact previous/new extents are in icon-optical-adjustments.json. These corrections
  apply to all connected uses; no path shapes, colors or IDs were replaced.
- Window Icon Button specimen now displays against its actual dark surface, since
  a white button on a white specimen could not be visually reviewed.

## Ownership and spacing audit

Image dimensions and internal SVG transforms are geometry. Actions keeps all
existing padding/gap tokens, disabled/pressed/focus states and independent callbacks.
Composer keeps header/feature/send 8px gaps; formatting 6px gap and separator margins;
14px formatting inset; 16px content alignment; field 6px label and 12px Cc/Bcc gaps;
existing 12/16px region insets. More retains its existing 20px button width.
Sidebar keeps 6px block, 24px start, 12px end (8px with count) insets and 8px gaps.
Launcher tool 6/27px insets, 12px icon-label gap, footer 24px inline inset and 8px
content gap remain. Beaker uses zero margin and unchanged 24px occupied geometry.
No new component variants or interaction ownership changes were introduced.

## Browser evidence

Reviewed before/after composer and launcher screenshots. Browser measurements of
all buttons in both specimens matched exactly for width, height, padding and gap.
Reviewed corrected normal/40px/composer/window Icon Button variants, Sidebar item,
Split Button, received-message header/footer actions and Formatting icon gallery.
Reviewed actual DS-connected shell with its composer open: zero broken images;
all 11 send-toolbar Icon Buttons measure 28px with 20px images. Window controls
remain white and all body symbols retain their intended colors. No stretching or
clipping was visible in these reviewed contexts.

29 existing tests and attachment validation pass. Shared alias identity remains
intact. This is a visual/geometry review at the browser's actual desktop size;
full responsive, keyboard and inspector-band certification is not claimed. App
logos retain intentional shape/proportion differences; this is not a redesign of
branded artwork or stroke styles. Alignment/Indent semantic mapping and the
font-based message-list stars remain the previously recorded user decisions.
