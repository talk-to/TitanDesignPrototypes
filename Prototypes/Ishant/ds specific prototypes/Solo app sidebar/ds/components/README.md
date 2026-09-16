# Titan action components

Load `components/actions.css` (it imports the system's tokens) and
`components/actions.js`. Use the shared renderer or the same native markup contract.
Do not paste a separate copy of the styles into a screen.

```js
TitanActions.mount(host, 'button', {
  label: 'Reply', icon: './assets/reply.svg'
}, { main: () => openReply() });

TitanActions.mount(host, 'iconButton', {
  label: 'Settings', icon: './assets/settings.svg', size: 40
}, { main: () => openSettings() });

TitanActions.mount(host, 'splitButton', {
  label: 'New email', secondaryLabel: 'More email actions',
  icon: './assets/compose.svg', secondaryDisabled: true
}, { main: () => openComposer() });
```

`mount` replaces host contents, binds independent callbacks and returns the root.
The pure renderer methods return escaped HTML for static rendering. Icon paths are
image URLs, not arbitrary SVG/HTML strings. Pass actions as functions, not strings.
Native buttons supply Enter/Space activation, focus and disabled behavior. Optional
`pressed` marks an icon toggle; its owner updates the value after activation.

Only current treatments exist: transparent icon actions at 32/40px, quiet labeled
buttons, and primary 38px split actions. Parent layouts own gaps between controls.
The secondary split trigger does not imply an implemented menu; its caller supplies
that behavior or disables it. No fake sending, dropdown contents or rich-text commands
are included in the shared components.

## Messages

Import `components.css`, then load `components/actions.js` before `components/messages.js` (the card reuses Button). Use `TitanMessages.list` for
stacked/wide rows and `TitanMessages.card` for collapsed/expanded received messages.
`TitanMessages.mount(host, 'list' | 'card' | 'row', options, handlers)` renders and
returns a listener cleanup function; call it before replacing/removing a mounted
instance. `bind(host, handlers)` also supports existing matching markup. Callbacks
receive message ID; check/star additionally receive their boolean state. Callers own
selection, expansion, reply workflows and persistence. Strings are escaped; card
paragraphs are plain text. See registry props and message-components.md for limits.

## Search and sidebar items

Import `components.css` and load `components/navigation-input.js`.
`TitanNavigationInput.searchField(options)` and `.sidebarItem(options)` render HTML.
`.mount(host, 'searchField' | 'sidebarItem', options, handlers)` returns cleanup.
Search handlers: `change(value,event)`, `search(value,event)`, `filter(event)`.
Sidebar handler: `activate(event)`. Callers own navigation, results, menus and state.
Labels are required. See the registry for options and spacing contracts.
