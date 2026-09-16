# Email composer composition review

User requested the Email composer audit findings be fixed. The full composer now
composes registered Composer header, Composer field row, Composer tools, Formatting
toolbar and Composer send actions. Header/tools/send each have a real renderer,
standalone preview, direct dependencies and their own CSS and spacing mappings.
Body editing and the fields-region wrapper remain owned by Email composer.

Removed the false Action group class/dependency; the new Composer tools owns its
8px gaps and imports unchanged composer Buttons. Named commands are stored on
external wrappers, leaving rendered child markup intact. Header icons and send
controls use unchanged Icon/Split buttons. Removed ancestor focus overrides and
Formatting toolbar's forced 20px More button width. The preview uses the standard
681×640 size. Standalone header emits commands without mutating a parent window.

Mail uses the same renderer. Its host owns placement, opening, inert state and focus
restoration; shared component/pattern own surface, sizing and motion. Removed the
old docked-composer style block; retained the independent inline-reply artwork sizes.
The inline reply remains a separate, unmigrated composition. Sending, formatting,
menus and Expand remain host-owned operations, not implemented by this prototype.

Verified Mail opening, minimize/restore with preserved subject text, close and focus
restoration. Verified standalone header/tools/send previews and spacing inspector.
Verified a 360px parent with long title/sender: title truncates, sender wraps, rows
scroll horizontally while preserving child sizes. Catalog validation and 15 relevant
composer/actions/icon-runtime tests pass, including command routing and cleanup.

Follow-up (user-requested registration correction): Composer field row's Cc/Bcc were
private hand-rolled buttons with local styling, unlike the rest of the composer. They
now render as unchanged composer Button instances inside `data-command` wrappers, and
the private `.titan-composer-field__extras button` rules are gone. The registry gained
`button` as a direct dependency and now documents the row's Input, Read-only value and
Extras parts plus its value/control/action ownership. Visual review: the quiet text
actions become 28px transparent Buttons with 16px side padding and the shared hover
fill, widening and slightly raising the To row versus the reference; reported for user
review. A quieter registered text action would require an explicit new registration.
