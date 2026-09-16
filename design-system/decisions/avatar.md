# Initials avatar

Extracted from the DS-specific shell's received-message `.msg-avatar.exp-avatar.av-7` and the existing shared message renderer. Registered Avatar (`titan-avatar`) with a shared renderer/CSS. Preserved observed 36px diameter, 14px semibold initials, line-height 1, inverse text and purple #9B51E0. No invented photo, status, interactive or color variants. One/two-initial examples demonstrate content, not distinct interaction states.

Zero internal padding; fixed width/height, no flex shrinking. Parent owns all gaps and the received-message 1px top alignment offset. Size/background custom properties are component controls, not new universal semantic roles. Caller supplies short initials. Decorative avatars alongside sender names are aria-hidden; standalone avatars require an accessible label. Text is escaped.

Received message uses TitanAvatar.render; source shell markup uses the shared class. Browser consumers must load avatar.js before messages.js. Original shell is untouched. DS tests and attachment validation pass; visual/computed-spacing verification remains pending.
