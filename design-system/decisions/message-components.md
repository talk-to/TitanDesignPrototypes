# Message components

User-authorized extraction from TitanEmailShell: second-pane message list and
third-pane received message card. This supersedes their deferral in the initial
componentization audit. Composer, thread-stack overlap and pane layout stay local.

## Observed variants

- Message list: stacked rows and 44px single-line rows (the source's wide-view mode).
  Unread and selected are observed source states. The shared renderer additionally
  makes the existing selection/star affordances native, operable controls.
- Received message: collapsed sender/summary and expanded sender/recipients/body/footer.
  These are two representations, not new heading or spacing roles.

Shared CSS was extracted from the source, preserving existing selectors and values.
The source now imports messages.css and has public component root classes. Its
existing HTML, callbacks, dynamic insertion, resize, refresh and thread-stack logic
remain in place; it does not use the new renderer. The renderer supplies escaped
content, native controls and caller-owned callbacks for new consumers and specimens.

The reusable list owns row geometry and scrolling; the parent chooses its height
and layout variant. Single-line rows have a 640px minimum width in the renderer and
scroll horizontally in smaller containers. The existing shell's wide-view behavior
is preserved separately. The renderer's star remains reachable without hovering;
its checkbox and star do not also open a message. Selection and data remain caller-owned.

Cards accept plain-text paragraphs, optional avatar/recipients/header actions/footer.
No arbitrary HTML body injection or implicit email operations. Collapsed activation
requests expansion; caller supplies state. Rich email rendering/sanitization, receipts,
attachment rendering and business actions are not part of this initial renderer.
Existing source markup retains those supplied regions through the shared CSS.

Catalog: All / Buttons / Messages; gallery cards align to equal-height rows within
each category. Real component variants lead; contracts remain in the floating detail.
The starter owns category filtering and gallery layout; Titan owns component content.

Validation: renderer escaping, variants, event routing and cleanup tests; studio
presentation tests and attachment validation. Browser visual/keyboard QA was not
available because no browser surface is connected. Do not treat static checks as
visual approval.

Preview refinement: removed the specimen-only border, rounded corners and overflow
clipping around message-list examples. Component-owned row separators and received
message card borders remain intact.

## Follow-up: shared child reuse in Received message

Received message no longer renders private header icon buttons or rewrites child
markup. Header actions compose the registered compact Icon button unchanged and
footer actions compose the registered Button unchanged; both sit inside
`.titan-message-card__action` wrappers that carry `data-message-action` for routing,
so rendered child markup stays intact. The `.expanded-header .titan-avatar` reach-in
was replaced by a card-owned `.exp-avatar` wrapper, and the card focus outline no
longer targets composed Icon/Button children. Dependencies updated to
["button","avatar","icon-button"]; stale footer-button spacing mappings were removed
so Button keeps its own registered spacing. Legacy shell `.exp-icon` markup and
styles are unchanged.

Visible mismatch to review: header action icons now use Icon button's shared compact
treatment (24px target, hover container, shared focus ring) instead of the source's
containerless `.exp-icon`; disabled opacity is the shared .45 rather than .4. Browser
computed-layout and interaction verification remain pending.
