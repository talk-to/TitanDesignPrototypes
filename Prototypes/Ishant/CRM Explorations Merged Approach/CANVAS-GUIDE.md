# Titan CRM canvas — how to read it, and how we work on it

Companion to `Titan CRM Prd.tldraw` in this folder. Point a new chat at this file first.

The canvas gives `PRD.md` a visual form and now holds design decisions that exist **nowhere else** — the per-entity UI ideas and the sidebar structure are not in `PRD.md`.

---

## 1. The file is not readable as a file

`Titan CRM Prd.tldraw` is a ZIP wrapping an encrypted `db.sqlite`.

- **Never** `Read` or `grep` it. You get binary noise.
- The only way in is the tldraw Desktop local HTTP API, and **only while the app is running with this file open**.
- App closed → zero access. `PRD.md` is the fallback, and it is missing everything listed in §6.

In git it is an opaque binary: diffs show `0 insertions(+), 0 deletions(-)`. Commit messages have to carry the meaning, and conflicts on it cannot be hand-merged.

---

## 2. Getting access

Load the `tldraw-offline` skill. Port and token live in
`~/Library/Application Support/tldraw/server.json` (re-read them every call — env vars do not survive between Bash calls).

```bash
sh "$HOME/skills/tldraw-offline/tq" POST /api/search '{"code":"return await api.getDocs()"}'
```

**The document id is not stable.** It changed mid-session when the file was saved (`tldr:untitled:…` → `tldr:file:…`), and a stale id returns `Document not found`. Always discover it and **match on `name === "Titan CRM Prd"`** — never assume the only open document is the right one.

The id is just `tldr:file:` + base64 of the absolute path, so **it changes whenever the file moves** — it has already changed twice (this folder left `CRM Explorations/`, then was renamed). Prefer discovering it; only fall back to this literal:

```
tldr:file:L1VzZXJzL2lzaGFudC5wL0RvY3VtZW50cy9UaXRhbiBEZXNpZ24gR2l0L1Byb3RvdHlwZXMvSXNoYW50L0NSTSBFeHBsb3JhdGlvbnMgTWVyZ2VkIEFwcHJvYWNoL1RpdGFuIENSTSBQcmQudGxkcmF3
```

---

## 3. What is on the canvas

Two pages. Shapes are `text`, `geo` and `arrow` — **no shape carries its own label**; every label is a separate `text` shape sitting on top. Association comes from ids and meta, not geometry, so keep the naming conventions below.

### Page 1 — `Titan CRM entities` (~230 shapes)

Six bands, top to bottom, plus a horizontal strip of 14 detail panels.

| Band | Contents |
|---|---|
| 1 Where it starts | Titan Email, Titan Forms |
| 2 Who you are dealing with | Contacts, Companies |
| 3 The work, and how it moves | Work Items → Pipelines → Kanban Board |
| 4 The context that makes it useful | Notes, Tags, **Tasks**, Files, Timeline |
| 5 The rest of Titan, plugged in | Titan Calendar → Timeline, Titan Drive → Files |
| 6 The rules that connect them | three deterministic automations + the AI constraint |

**Keys** (used in ids and meta): `email` `forms` `contacts` `companies` `work` `pipelines` `kanban` `notes` `tags` `activities` `files` `timeline` `calendar` `drive`

> **Trap:** the key `activities` still appears in every id and meta value, but the box **displays as "Tasks"**. Do not rename the ids to match — the document script and every panel link key off `activities`.

**Id conventions**

| Pattern | What it is |
|---|---|
| `crm-<key>` | the hub box (`geo`), carries `meta.crmLink` |
| `crm-t-<key>` / `crm-d-<key>` | its title / detail text |
| `crm-chev-<key>` | the `›` affordance |
| `crm-band-<y>` | band label |
| `crm-rule-*` | band 6 automation cards |
| `panel-<key>` | detail panel (`geo`), carries `meta.crmPanel` |
| `panel-title-<key>` | panel heading |
| `panel-l-<key>-<SECTION>` / `panel-b-<key>-<SECTION>` | section label / body |
| `panel-back-<key>` / `panel-backt-<key>` | "Back to chart" button, carries `meta.crmBack` |

`<SECTION>` is `WHATITIS`, `EXAMPLES`, or `IDEASFORTHEUI`. On `email` / `forms` / `calendar` / `drive` the third section **reads** "SUGGESTED ADDITIONS" (their UI already exists) but the **id is still `IDEASFORTHEUI`**.

**Panels are one horizontal row** — all at `y = 2450`, `x = 90 + i*1000`, each `900 × 720`, in band order. Horizontal on purpose: a panel that grows taller extends into empty space instead of shoving 13 others out of alignment.

### Page 2 — `Sidebar structure` (~69 shapes)

Two sidebar mockups (`W = 380`) plus a traceability gutter, a principle note, and an open-questions box.

- **Left, `sb-a*`** — LINKED state: fixed header (identity `220`, work+stage `330`, next task due `426`), tab bar `504`, tab body `548–844`, footer `844`.
- **Middle, `sb-b*`** — UNLINKED state, same total height on purpose.
- Tabs: `sb-{a|b}-tab1..3` = Tasks · Timeline · Files, `x = col + 6 + i*126`, `w = 118`. Active underline is `sb-a-tabactive` (currently under Timeline). There is deliberately **no Notes tab** — see §6.
- **Right, `sb-open*`** — still-open questions and a DECIDED block. Read this before proposing anything; it records *why*, not just what.

Meta keys: `sidebarBlock`, `band`, `region` (`fixed`), `tab`, `active`, `state` (`unlinked`).

---

## 4. The document script

`script/main.js` in the app working dir (find it via `POST /api/doc/:id/script-workspace`).

Click a hub box → camera flies to its panel. Click "Back to chart" → back to the map. Wiring is `meta.crmLink` ↔ `meta.crmPanel`, never labels or coordinates.

Three non-obvious things — do not "simplify" these away:

1. **Listens on `pointer_up`, not `pointer_down`.** While the pointer is down the select tool owns the interaction and cancels the camera animation.
2. **`animateTo` has an instant fallback** after `DURATION + 150ms`. Animated `zoomToBounds` never advances when the window is backgrounded (`requestAnimationFrame` is throttled) — verified to happen outside the script too. Without the fallback, navigation silently does nothing in headless testing.
3. **6px drag slop.** Otherwise dragging a box to rearrange the map also navigates.

Page 2 has no `crmLink`/`crmPanel`, so it is inert by design.

After editing, poll `GET /api/doc/:id/script-status` until `state: "applied"` before testing. Clicking during `pending` tests nothing.

---

## 5. Working rules

- **Always `helpers.getLints()` before finishing**, and fix `overlapping-text`. This has caught real bugs every single time — long strings wrap and spill into the next block.
- Text shapes use `autoSize: false` with an explicit `w`. Budget **~38 characters per line** at `size: "s"` in a 348px column — 44 already wraps. Overrun silently collides with the next block.
- **Touching bounds count as overlapping.** Leave a gap between adjacent text shapes (this is why tabs are `w: 84` at a 92px pitch).
- `helpers.saveDoc()` to persist. Safe now the file has a path; it would have opened a dialog while untitled.
- Arrows: **only** `helpers.createArrowBetweenShapes` so both ends are really bound. Never raw arrow shapes.
- `/exec` has a request timeout — do not chain several 1.5s animated clicks in one call. Split them.
- Send code via `--data-binary @file`, not an inline shell string. Inline bodies get mangled (a `[[a],[b]]` literal produced `Unexpected token ']'`).
- Before any bulk delete, assert every id matches your own prefix and abort if anything else is present.

---

## 6. Decisions already made — do not re-litigate

- **Work Items** are one object named per business. *Deal is one of its names*, not the thing it must not be.
- **One task object** with an **optional** time: set → reminder, unset → to-do. There is **no Follow-up type** — following up is the outcome of the system working.
- **Tasks are intentions; activities are what happened.** The PRD conflated the two under "Activities". An **activity is any interaction** with the customer — email sent or received, call exchanged, meeting held, file shared, stage moved.
- **Timeline is the activity stream.** Not a passive history log — it *is* the list of interactions.
- **Notes are not a peer of the timeline.** A note is written *against* the interaction it describes, so it appears **inline in the stream**. A standing fact that belongs to no single interaction (a preference, a constraint) is **pinned above** the stream. This is why there is no Notes tab.
- **Meetings** stay Calendar-owned and surface in the **Timeline**, not as tasks.
- **Sidebar = fixed header + 3 tabs** (Tasks · Timeline · Files). Identity, work item and next task due never go behind a tab. Tabs replaced accordions (fixed height, no scroll-within-scroll, the stream gets the whole body).
- Each tab owns its own action; there is no generic button row.
- **Tags** are chips in the header, not a block or a nav item.
- **Kanban, Pipelines, Forms and automations are out of scope for the sidebar.** A pipeline is configuration, a board is a workspace.
- Prefer **Companies** over "Organizations" (`PRD.md` wording).

---

## 7. Open, and worth resolving

1. **Which work item shows when a contact has several?** Page 1 draws Contacts → Work Items as one arrow, but it is one-to-many. The hardest open question.
2. **Does the work strip use the workspace's own word?** `PRD.md:343` only says the name "may evolve". If a bakery reads the literal words "Work Items", the neutral-naming argument collapses.
3. **The full-CRM record page is undefined.** "Open in CRM" and any see-all from a tab both land there; it is specified nowhere.
4. **`PRD.md:442-452` still lists five activity types** (Reminder, Meeting, Call, Follow-up, Task) as peers. The canvas and the PRD now contradict each other, and the PRD is the copy that is readable when the app is shut.
5. **`crm.html` still says "Organizations"** where `PRD.md` says Companies.
