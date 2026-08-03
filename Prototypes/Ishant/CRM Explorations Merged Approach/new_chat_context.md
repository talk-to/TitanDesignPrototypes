# Merged Approach — New Chat Context

**Last verified:** 2026-08-03 · **branch:** `CRM-Explorations-Merged-Approach`

Written to the conventions in 📄 [how_to_write_new_chat_context.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/how_to_write_new_chat_context.md).

---

## 1. What this is

The **Merged Approach** synthesises Usha's pipeline-centric thread markers with Ishant's decoupled `crm_app/` drawer. It is a Titan Mail client with a CRM layer inside it, plus a separate standalone CRM page.

**Open `index.html` first** — that is the real prototype. `crm.html` is a second, largely independent page reached from it.

> ⚠️ **The design has moved ahead of the code.** The current thinking lives on the tldraw canvas (§7); the drawer in `index.html` still has the older Activity/Upcoming structure. Do not read this folder's code as the intended design.

---

## 2. File map

| File | Size | Purpose | Status |
|---|---|---|---|
| `index.html` | ~7,180 lines | Titan Mail client + inlined CRM drawer. The main prototype. | **live** |
| `crm.html` | ~5,650 lines | Standalone full-page CRM. Effectively kanban-only. | **live**, mostly stubs |
| `crm_app/crm_app.js` | 637 lines | `CrmApp` IIFE — drawer state, drill-in nav, pipeline ribbon. | **live** (index.html only) |
| `crm_app/crm_app.css` | 744 lines | Titan tokens + `crm-*` drawer rules. | **live** (index.html only) |
| `crm_app/crm_sidebar.html` | 910 lines | Extracted drawer template. | ⚠️ **dead duplicate** — see §5.1 |
| `personas/joanna.js` | — | Persona data, loaded via `?u=joanna`. Only persona that exists. | **live** |
| `PRD.md` | 692 lines | Product requirements. Recovered from `main` — see §5.9. | reference |
| `Titan CRM Prd.tldraw` | ~300 KB | Entity map + sidebar design. **Not readable as a file.** | reference |
| `CANVAS-GUIDE.md` | — | How to read the canvas. **Read before touching it.** | reference |
| `usha_approach_analysis.md` | — | Analysis of Usha's pipeline markers. | reference |

`crm_app/` is wired to **`index.html` only** (`index.html:29` stylesheet, `:7175` script). `crm.html` has **zero** `crm_app` references — it is self-contained.

---

## 3. Architecture — `index.html`

```
┌──────────────┬─────────────────┬──────────────────────┬─────────────────┐
│ Left nav     │ Middle panel    │ Reading pane         │ CRM drawer      │
│ .sidebar     │ .email-list     │ .reading-pane        │ #crmSidebar     │
│ 2887–3082    │ 3171–3466       │ 3473–3906            │ 4045–4958       │
│              │                 │                      │                 │
│ 2 accounts   │ tabs 3146       │ action bar 3476      │ pipeline ribbon │
│ folders      │ tiles           │ 3 thread views:      │ hero + tabs     │
│ footer       │ resizer 3468    │  linked   3522       │ 9 view pages    │
│              │                 │  unlinked 3658       │                 │
│              │                 │  other    3712       │                 │
│              │                 │ reply box 3719       │                 │
└──────────────┴─────────────────┴──────────────────────┴─────────────────┘
```

| Region | Lines |
|---|---|
| Persona loader (`?u=<id>`) | 9–25 |
| `crm_app.css` link | 29 |
| Main `<style>` | 30–2878 |
| Top toolbar | 3084–3139 |
| Legacy inline `#crm-panel` — **orphaned** | 3909–4040 |
| CRM drawer `#crmSidebarContainer` | 4045–4958 |
| App switcher / pipeline dropdown / composer | 5092–5488 |
| Main `<script>` | 6061–7021 |
| Settings modal | 7023–7174 |
| `crm_app.js` script tag | 7175 |

---

## 4. Key flows

### Linking an email to a record

1. Pipeline pill on a tile (3192, 3228…) or the reading-pane **Pipeline** button (3508) → `openPipelinePicker(event)` (6475)
2. → `selectPipelineOption` (6528) — single-select radio; clicking the active one clears it
3. → `renderPipelineLabel(host, key)` (6441) writes `data-pipeline` / `data-stage` and a `.pipeline-label` chip
4. → if newly linked, `openCrmForEmail` (6657) / `openCrmForThreadHeader` (6681)
5. → `setCrmRecord(rec)` (6584) → `CrmApp.updateContext(rec)` (`crm_app.js:474`) → `openCrmPanel()` (6576)

`openCrmForLinked()` (6642) opens the pre-seeded demo record (Ryan Walker · Neo partnerships).

### Drawer navigation (`crm_app.js`)

`openDrawer` (16) / `closeDrawer` (23) / `drillInto` (30) / `goBack` (35) / `goHome` (43) / `switchTab` (48) / `renderView` (62), with a `navHistory` stack. `openFullView` (186) navigates to `crm.html`.

### Pipeline stage ribbon

`CrmApp.renderPipelineChevronBar(key, activeStage)` (`crm_app.js:384`) renders chevrons from `PIPELINE_STAGES`, shaded by `pipeShade()` (418). Only the active chevron shows its label; the rest get a JS tooltip (`#crmPipeTooltip`, ~595–636). Click → `setPipelineStage` (209) or `selectStage` (462), which writes `data-stage` back onto the email label.

---

## 5. ⚠️ Traps

### 5.1 `crm_sidebar.html` is a dead duplicate — edit the inline copy

`crm_app.js:580-598` mounts it via `fetch`, but **only `if (!document.getElementById('crmSidebar'))`**. `index.html:4046` already contains that node, so the fetch never fires. The two are byte-identical except four trailing `</div>`s in `index.html`.

**Edit `index.html:4048-4956`.** Editing `crm_sidebar.html` changes nothing, and the copies silently drift.

### 5.2 Two CRM panels, one orphaned

The inline `#crm-panel` (3909–4040) is superseded — `openCrmPanel()` (6576) explicitly strips its `.open` class, and `toggleCrmPanel()` (6398) has no callers. Its Notes / AI Summary / Fields markup is unreachable.

Worse: **`crm_app.js` still writes into it.** `renderStageLabel` (404) targets `#crm-ps-text` and `#crm-pipeline-stage`; `buildStageMenu` / `toggleStageMenu` (426/438) target `#crm-stage-menu` — all exist **only** inside the dead panel. `outsideStageMenu` (450) looks for `#crmPsWrap`, which exists nowhere.

### 5.3 Two conflicting `PIPELINES` datasets

| Source | Pipelines | Stages |
|---|---|---|
| `index.html:6416` | `sales: 'Neo partnerships'`, onboarding, hiring | 6: Lead → Closed (`:6553`) |
| `crm_app.js:369` | Sales Pipeline, onboarding, partnerships, investors, renewals | 5: New → Closed (`:376`) |

The drawer ribbon uses `crm_app.js`; email labels use `index.html`. A stage set on a label may not exist in the ribbon, and `renderStageLabel` (410) hardcodes the name back to "Neo Partnerships".

### 5.4 The iteration system is dead

CSS exists for `body[data-iteration="2|3|4"]` (5042/5054/5061), but **nothing ever sets the attribute** — `<body>` (2881) has none and no JS writes one. Also `index.html:5059` is a **broken rule**: `body[data-iteration="3"]` has no declaration block, so it swallows the next selector.

The live variant mechanism is **personas**, not iterations.

### 5.5 Stubs and dead functions

- No-ops / no callers: `addActivity` (6746), `triggerRefresh` (6087), `sweepSidebarNav` (6138), `toggleCrmSidebar` (`crm_app.js:565`)
- `generateAiSummary` (6408) only reveals pre-written static text
- `logActivityPrompt` (`crm_app.js:166`) uses a native `prompt()`
- Search input is `readonly` (3107)
- Hidden but preserved (`display:none`): drawer nav header (4050), contact chips (4128), Overview tab + page (4170, 4305)
- `crm_app.js` `selectEllaEmail` (238) / `selectPromoLead` (270) / `selectPotentialPromo` (318) reference ids (`expSenderText`, `expandedBodyContent`…) not found in `index.html` — leftovers from another host page. ⚠️ *Unverified.*
- `#thread-view-other` (3714) states outright that only the Ryan Walker and Emma Clarke threads are wired

### 5.6 `crm.html` is nearly all stub

One view — the kanban board (`renderBoard` 5013, `renderCard` 5112). **Drag-and-drop is genuinely implemented** (5115–5117 dragstart, 5048–5056 per-column drop → mutates `card.stage`). Everything else alerts:

- List view toggle → `alert('Prototype only…')` (3274)
- Add opportunity (3265), every `cardAction` (5000)
- `Contacts` (3171) and `Organizations` (3177) nav items have **no onclick**

The New Pipeline wizard *is* built (`openNewPipeline` 5250 → `npCreate` 5416), including drag-reorderable stages (5319–5347). Leftover email-client JS (`selectEmailTile` 4825, `openReplyBox` 4788) is dead copy-over.

### 5.7 Vocabulary conflict

`crm.html:3177` says **`Organizations`**; `PRD.md` says **Companies**; the search placeholder (3232) says "contacts, companies, deals"; CSS uses `.kanban-card-company`. Unreconciled.

### 5.8 There is no record page anywhere

Neither file has a page for a single contact / company / work item. `openFullView()` lands on `crm.html`'s kanban root with no deep link, and `cardAction`'s "View the opportunity" alerts. This matters because the designed sidebar's **Open in CRM** and any see-all both need that page to exist.

### 5.9 `PRD.md` was recovered from `main`, and merging `main` will conflict

`PRD.md` was originally added by commit `816e7e1`, which is on **`main` only**. This branch is **15 commits behind main** and never received it, so the file silently vanished from disk on checkout. It has since been restored here from main's blob (byte-identical, 692 lines), so all `PRD.md:NNN` citations in this doc and in `CANVAS-GUIDE.md` are valid against the local copy.

⚠️ **Merging `main` will need care.** Main still has this entire folder at the original path `Prototypes/Ishant/CRM Explorations/Merged Approach/`, while this branch moved and renamed it to `Prototypes/Ishant/CRM Explorations Merged Approach/`. Expect rename/add conflicts, and a second `PRD.md` arriving at the old path.

---

## 6. Product decisions already made

From the tldraw canvas. **Do not re-litigate** — see `CANVAS-GUIDE.md` §6 for the full list with reasoning.

- **Work Items** are one object named per business. *Deal is one of its names*, not the thing it must not be.
- **One task object** with an **optional** time: set → reminder, unset → to-do. There is **no Follow-up type** — following up is the *outcome* of the system working, not a category.
- **Tasks are intentions; activities are what happened.** An activity is any interaction — email, call, meeting, file, stage move. `PRD.md` conflates the two.
- **Timeline is the activity stream.** Notes are written *against* an interaction and render inline in it; standing facts are pinned above it. Hence **no Notes tab**.
- **Meetings stay Calendar-owned** and surface in the timeline, not as tasks.
- **Sidebar = fixed header + tabs.** Identity, work item and next task due never go behind a tab. Tabs replaced accordions (fixed height, no scroll-within-scroll).
- **Tags** are chips in the header, not a block or nav item.
- **Kanban, Pipelines, Forms and automations are out of scope for the sidebar** — a pipeline is configuration, a board is a workspace.

---

## 7. Where design and code diverge

**This is the most important section for a new chat.** None of the canvas design is implemented yet.

| Concern | Designed (canvas) | Built (`index.html`) |
|---|---|---|
| Drawer tabs | Tasks · Timeline · Files (3), with a proposal to drop to Timeline · Files | **Activity · Upcoming** (Overview hidden) — 4168–4173 |
| Notes | Inline in the timeline, against an interaction | Separate `crmView-all-notes` page (4353) |
| Tasks | One object, optional time | `crmView-all-tasks` (4719) + `addTask` (`crm_app.js:150`) |
| Activities vs tasks | Separate concepts | Conflated, as in the PRD |
| Fixed header | Identity + work item + next task due | Hero + ribbon; no due-task surface |
| Record page | Required by "Open in CRM" | Does not exist (§5.8) |

**Undecided and unimplemented:** the latest proposal is a **note composer in the fixed header** replacing the follow-up block, tasks authored inside notes, and two tabs (Timeline, Files). The open objection is that nothing would then tell you that you owe this person something — and "reduce missed follow-ups" is the PRD's first stated goal.

---

## 8. Open questions

1. **Which work item shows when a contact has several?** The model is one-to-many; the sidebar renders one. Options: a switcher in the work strip, default to most recently active, or ask once and remember. The hardest open question.
2. **Does the work strip use the workspace's own word?** `PRD.md:343` only says the name "may evolve". If a bakery reads the literal words "Work Items", the neutral-naming argument collapses.
3. **The full-CRM record page is undefined** (§5.8).
4. **`PRD.md:442-452` still lists five activity types** as peers (Reminder, Meeting, Call, Follow-up, Task), contradicting §6. The PRD is the copy readable when the tldraw app is shut, so it is the one that will mislead.
5. **Organizations vs Companies** (§5.7).

---

## 9. Related docs

- 📘 [CANVAS-GUIDE.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations%20Merged%20Approach/CANVAS-GUIDE.md) — how to read the tldraw canvas. **Required before touching it.**
- 📄 [PRD.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations%20Merged%20Approach/PRD.md) — product requirements
- 📄 [usha_approach_analysis.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations%20Merged%20Approach/usha_approach_analysis.md) — Usha's pipeline markers
- 📘 [Parent new_chat_context.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/new_chat_context.md) — base Titan shell. ⚠️ Its §4 claim that `crm_sidebar.html` is fetched at runtime is **stale** (§5.1).
- 📋 [todos.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/todos.md) — roadmap
