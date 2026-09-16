# Solo app sidebar

The app rail, its four swap transitions, and all four real app shells — Mail, Calendar,
Contacts and Drive — in one folder with **no external dependencies**. No design system to
resolve, no build step, no package manager, no CDN. Copy the folder anywhere and open
`index.html`.

Extracted from `../App sidebar/`, which stays wired to the shared design system at the
workspace root. Changes here do not flow back there, and vice versa.

## Running it

Serve the folder with any static server and open the root:

```sh
cd "Solo app sidebar" && python3 -m http.server 8080   # then open http://localhost:8080
```

Opening `index.html` straight off disk (`file://`) mostly works, but Chrome refuses to
load SVG `<use href="…">` fragments from `file://`, so a handful of recoloured icons —
the shell footer buttons, some toolbar glyphs — come out blank. Everything else renders.
Serve it over http and they are all fine.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The app. Rail + view host + demo variant panel. |
| `app-sidebar.css` | Rail, tooltip, more-apps popover, view transitions, skeleton. |
| `app-sidebar.js` | Rail rendering, keyboard nav, app switching, the four swap modes. |
| `shells/mail/` | Full email shell — list, reading pane, composer, settings. |
| `shells/calendar/` | Week-view calendar shell. |
| `shells/contacts/` | Contacts shell. |
| `shells/drive/` | Drive shell. |
| `shells/placeholder.html` | Stand-in screen for Bookings, Backup and Tasks. |
| `ds/` | Vendored copy of the design system runtime the shells need. |

`ds/` holds tokens, themes, components, icons, patterns and layouts — the runtime only.
Docs, specimens, tests and the registry were left behind. It is a **copy**: editing it
changes this folder alone and never touches the workspace design system.

About 1.5 MB in total, roughly half of it the mail shell's image assets.

## Swapping in your own screens

Each app is one entry in the `apps` array at the top of `app-sidebar.js`:

```js
{ id: 'mail', label: 'Mail', icon: 'app-mail', path: 'shells/mail/index.html', shape: 'mail' }
```

- `path` — any URL, loaded in an iframe. Point it at your own screen.
- `icon` — a filename in `ds/icons/assets/`. Change `ICON_BASE` to use your own set.
- `shape` — which skeleton layout to draw while the screen loads: `mail` (list + reading
  pane), `rows`, `calendar`, or `plain`.
- `placeholder: true` — forwards `?app=` and `?icon=` so one generic page can stand in
  for several apps.

The bottom tool buttons are the `tools` array just below it.

## Options

Both are in the on-screen panel and settable from the URL.

**Sidebar style** — `?sidebar=` `grayscale` (default) · `colored` · `colored-all` ·
`top-more` · `centered-more`. Sets `data-sidebar-variant` on `<body>`.

**App swap** — `?transition=`

| Value | Behaviour |
|---|---|
| `spinner` (default) | Slides between apps; centre loader on the **first** swap only. |
| `slide-skeleton` | Slides, with a layout skeleton standing in for the screen, then cross-fades into the content. |
| `skeleton` | No slide. Skeleton appears instantly, then cross-fades and cross-blurs into the content. |
| `instant` | No slide, no skeleton. Centre loader on the **first** swap only, then straight cuts. |

The loader is deliberately once-per-session: it mimics a single cold app load, on the
assumption that a real app preloads afterwards. The skeleton plays on every swap, since
it *is* the fast path.

**Theme** — `?theme=dark`. Forwarded to every shell so the whole app switches together.

## Notes

- The rail builds its own buttons rather than using the design system's icon-button
  component, so the rail itself depends on nothing but `ds/icons/assets/`. The shells
  still use the vendored components, which is why `ds/` is here.
- The studio spacing-inspector hooks (`?ds=true`) were stripped from every shell. They
  pointed at a studio server that will not exist wherever this folder ends up.
- Kept from the original: roving arrow-key/Home/End navigation in the rail, `aria-current`
  on the active app, a live region announcing each swap, `aria-haspopup`/`aria-expanded`
  on the more-apps trigger with Escape to close, and a `prefers-reduced-motion` path that
  drops the slides, blurs and spinner animation.
