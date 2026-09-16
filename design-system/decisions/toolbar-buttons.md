# Toolbar buttons

Extracted Archive/Delete/Star/Mark unread/Block/Spam as the toolbar variant of
Button. DS-connected shell now uses native shared button markup; original shell
is untouched. Retained 13px text, 24px icon slot, 16px image, 4px icon gap,
5/8/5/5px insets and 5px radius. The 5px values remain component-owned rather
than inventing a global scale value. Added action-group utility using existing
4px semantic gap. Overflow/more control remains source-owned.

Registered four insets and icon gap; gallery and interactions use shared renderer.
No mail operation callbacks invented. Native button semantics improve keyboard
activation; existing source class hooks retained. Browser verification pending.
