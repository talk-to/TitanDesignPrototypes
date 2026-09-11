# Account Dropdown variant

User-selected Calendar account-picker extracted into the existing Dropdown renderer
as `variant: account`. It differs in non-data treatment: dark surface, full width,
space-between label/chevron and 8px control insets. Account text is a content slot,
not a separate variant. Uses the registered chevron-down asset and shared native
button focus/activation. Caller owns menus; Calendar remains static.

Removed screen-owned account-picker CSS and markup. Existing Calendar spacing aliases
remain for compatibility, referencing the promoted Dropdown role tokens. Generic
Dropdown spacing mappings resolve the account variant's local inset aliases. Added
label anatomy and specimen. Existing default/app/composer rendering is unchanged.

Validation passed. Browser verified 36px height, 8px padding, dark appearance and
visible focus; Enter invoked the specimen's open callback. Calendar inspector
identifies Dropdown trigger and shared sources, including Account label slot.
