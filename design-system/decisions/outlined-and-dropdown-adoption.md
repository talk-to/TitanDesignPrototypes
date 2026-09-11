# Shared toolbar controls

Mail All mails and Calendar Week now use the existing default Dropdown trigger
renderer. No new dropdown sizing variant was added. Their original menus were
not implemented; that remains caller-owned.

Calendar Help uses Button’s new outlined variant: 38px minimum height, 16px inline
insets, default 1px border, base surface, 15px text, 4px radius. The shared Button
owns focus, active, disabled and callback behavior. Parent owns placement. The
original Help action was a placeholder and remains so. Gallery and held-state
previews use the real renderer; spacing metadata excludes outlined from the
base insets and records its own insets/gap.
