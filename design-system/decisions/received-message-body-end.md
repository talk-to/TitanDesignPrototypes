# Received-message body end marker

Every expanded Received message ends its body with a compact outlined three-dot
marker. It is static, decorative, and excluded from accessibility navigation until
an interaction is defined; it does not imply a working show-more action.

The marker uses semantic surface, border, and accent tokens, with 16px separation
from body content. The Received message owns this spacing.

The catalog exposes Expanded without footer using the existing `actions: []`
configuration. No new renderer variant is needed. Collapsed messages remain
unchanged, and the regular Expanded preview retains its action footer.
