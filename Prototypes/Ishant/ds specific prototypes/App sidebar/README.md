# App sidebar experiment

Open through the Titan studio:

http://localhost:8031/app/Prototypes/Ishant/ds%20specific%20prototypes/App%20sidebar/index.html

This screen-owned prototype places a persistent 56px dark app rail to the left of
the existing navigation. It mirrors the registered 3×3 App Switcher inventory except
for Admin: Mail, Calendar, Contacts, Bookings, Drive, Backup, Tasks and Site. Mail,
Calendar, Contacts and Drive use their real DS-connected shells; Mail uses a copied
shell under `email shell/` with its internal App Switcher removed because the outer
rail now owns app navigation. The other four use a neutral local placeholder.
Previously visited frames are not reloaded, so in-shell state survives app switching.

## Design-system ownership

- Each app starts from the registered Icon button's existing `dark` variant. This
  experiment deliberately uses the renderer-supported 20px artwork input inside
  its local 40px control because it was visually preferred; the canonical DS pairing
  would be 24px artwork for a 40px control. The app-only treatment is isolated under
  `.app-rail-icon-button--local`; it is not a registered component or variant.
- The screen owns the 56px rail, 8px inset, an 8px top-app gap, a 4px tool gap, 40px placement slots,
  40px neutral hover/current backing, tooltip placement, shell routing and
  current-app value. Inactive app artwork is grayscale; hover, active and current
  artwork restores its original color.
- Hover scales a control to 1.1. Press scales it to .9, then returns directly to 1
  without an overshoot or elastic settle. A single solid tooltip stays mounted while
  moving between app and Settings controls at a 6px rail offset, preventing
  cross-fading between labels.
- This local class deliberately contains the unfinalized sizing and artwork-state
  treatment. The shared Icon button implementation, registry and contract remain
  unchanged until explicit approval to register it.
- The fixed-dark rail uses Titan Grey 980 so it reads as a distinct darker band
  beside the normal navigation surface, with a subtle horizontal lift from a 70/30
  Grey 980/Grey 965 blend at the left into Grey 965 at the right. All spacing, color and radius values
  reference existing Titan tokens. The flush rail has no elevation; its right edge
  uses a dedicated 1px right-edge rule with the Grey 830 treatment. The rail itself
  explicitly has no border, radius, outline or shadow on any edge, and its leftmost
  in-page pixel is painted with the rail background to prevent a page-rendered seam.
- App activation and current value are page-owned. Icon button owns focus, hover,
  active and accessible control treatment. Arrow keys, Home and End move focus.
- App switching uses a 180ms directional exit and 260ms directional entrance around
  the existing loading state. Future sidebar variations remain prototype-local and
  will be exposed through a showcase panel rather than registered in the DS.
- The showcase panel uses one dropdown to switch between the prototype variations.
  Site is intentionally excluded from the sidebar app list.
- Full color top + bottom keeps both the app icons and the four bottom product-tool
  icons colored at rest, with their colored containers persistently visible.
- The Centered + more variation vertically centers the app stack, keeps Settings at
  the rail bottom, and moves the four product tools into a dark listbox opened by a
  final More apps icon. Its stack is offset 16px upward from mathematical center for
  optical balance against the bottom Settings control. Top + more offers the same
  listbox structure with the app stack retained at the top. Both remain prototype-only.

Signature Designer, Smart Write AI, Email Designer and Invoice Builder join Settings
in the bottom tool group. They reuse registered icon assets and the same local
grayscale, hover, press and moving-tooltip treatment; destinations remain deliberately
unconnected in this experiment. Their pink, purple, blue and green tone values match
the registered Launcher item's existing treatment. This compact rail uses 24px tool
containers. Signature Designer and Smart Write AI use 20px artwork as local
optical-size exceptions; the other bottom tools retain 16px artwork and all controls
retain the same interaction footprint. At
rest the containers are transparent and the artwork is softened to 72% off-white;
the original tone container and full artwork color return on hover, press or keyboard focus.
The rail remains fixed-dark in both app themes;
the `?theme=dark` query is forwarded to every shell.

Append `?ds=true` to load the shared inspector in the wrapper and forward inspection
mode to every shell frame. Combine parameters as `?theme=dark&ds=true` when needed.

App switching keeps every iframe persistent but presents a simulated loading sequence:
choosing a lower rail app moves the outgoing shell 56px up and brings the incoming
shell up from below; choosing a higher app reverses both movements. The outgoing
shell fades and blurs over 220ms with `cubic-bezier(.8, 0, .9, .9)`; a blank 360ms
loading interval follows; then the incoming shell arrives over 320ms with
`cubic-bezier(.1, .1, .2, 1)`.
Only the latest rapid selection is queued. Reduced-motion mode switches immediately.
