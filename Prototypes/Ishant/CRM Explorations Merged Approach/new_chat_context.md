# Merged Approach — New Chat Context

**Last verified:** 2026-08-10 · **branch:** `CRM-Explorations-Merged-Approach`

Written to the conventions in 📄 [how_to_write_new_chat_context.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/how_to_write_new_chat_context.md).

---

## 1. What this is

A CRM with **two surfaces over one data core**:

| Surface | Open | For |
|---|---|---|
| **Sidebar** | `index.html` | never leaving the inbox. Thread-scoped. |
| **Full app** | `crm.html` | browsing — lists, record pages, deep links. |

The mail shell is the stock base Titan Email Shell, untouched apart from five wiring lines. All CRM behaviour lives in `crm/`.

**Open `index.html` first.** The panel starts open; the red person icon at `index.html:2854` toggles it. Clicking each of the six inbox tiles shows a different CRM scenario. Reach the full app via **app switcher → CRM** (`:3662`) or the **⤢** button in the sidebar's top bar, which deep-links to the record you're on.

> ⚠️ **This folder was reset on 2026-08-10.** The previous prototype — `crm.html`, `crm_app/`, `personas/`, `PRD.md`, `CANVAS-GUIDE.md`, `usha_approach_analysis.md`, `Titan CRM Prd.tldraw` — was deleted and the base shell pasted in fresh. Everything is recoverable from git at `004f4ee`. **Do not treat that old code as the intended design; it was superseded, not paused.** See §6.

---

## 2. File map

| File | Lines | Purpose | Status |
|---|---|---|---|
| `index.html` | 5,068 | Base Titan Mail shell + 5 CRM wiring lines | **live** |
| `crm.html` | 62 | Full app page — top bar, nav host, script block. No view markup. | **live** |
| `crm/crm_data.js` | 441 | **SHARED** query layer. Pure functions, no DOM. | **live** |
| `crm/data/*.js` | 864 | **SHARED** mock dataset, 7 files | **live** |
| `crm/crm_sidebar.js` | 952 | Sidebar — page stack, 7 renderers, actions, shell wiring | **live** |
| `crm/crm_sidebar.css` | 840 | Sidebar — panel shell + `crm-*` rules | **live** |
| `crm/crm_full.js` | 609 | Full app — hash router, 7 routes | **live** |
| `crm/crm_full.css` | 457 | Full app — `f-*` rules | **live** |
| `crm/check_data.js` | 133 | Node validator — asserts the rules, not just integrity | **live**, run it |
| `crm/DATA-MODEL.md` | — | Entities, rules, email attachment, decisions + why | reference |
| `crm/README.md` | — | Architecture, load order, how to extend | reference |
| `new_chat_context.md` | — | this file | reference |

**There is no view markup in either `.html` file, on purpose** — see §5.1. `crm/` holds no HTML at all.

---

## 3. Architecture

### `crm.html` — the full app

```
┌──────────────┬──────────────────────────────────────────────┐
│ Left nav     │ Main                                         │
│ #fNav        │ #fMain                                       │
│              │                                              │
│ RECORDS      │ hash-routed, 7 routes:                       │
│  Opportunities│  #/opportunities  grouped BY PIPELINE       │
│  Contacts    │  #/contacts       #/companies                │
│  Companies   │  #/pipeline/<id>  filtered list              │
│ PIPELINES    │  #/opportunity|contact|company/<id>          │
│  one per     │      → 2-col record: timeline + right rail   │
│  pipeline    │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

Both pages hold **no view markup** — `crm.html` is 62 lines of top bar and two empty divs.

### `index.html` — the mail shell + sidebar

```
┌──────────────┬─────────────────┬──────────────────────┬─────────────────┐
│ Left nav     │ Middle panel    │ Reading pane         │ CRM sidebar     │
│ .sidebar     │ #middlePanel    │ .reading-pane        │ #crmSidebar     │
│ 2623         │ 2886            │ 3124                 │ 3490            │
│              │                 │                      │                 │
│ stock shell  │ .email-list     │ .thread-title 3168   │ EMPTY in HTML — │
│ untouched    │   2914          │ (only this updates   │ all markup from │
│              │ 6 .email-tile   │  on thread select)   │ crm_sidebar.js  │
│              │ 2917…3089       │                      │ width 0 → 344px │
└──────────────┴─────────────────┴──────────────────────┴─────────────────┘
```

The panel is an **in-flow flex child of `.content-area`** — it *squeezes* the reading pane, it does not overlay it.

### The only five edits to `index.html`

| What | Line |
|---|---|
| `crm_sidebar.css` stylesheet link | 8 |
| Toolbar toggle button `#crmToggleBtn` | 2854 |
| `<div id="crmSidebar"></div>` — deliberately empty | 3490 |
| App-switcher CRM item → `crm.html` | 3662 |
| 9 script tags, data → queries → UI | 5058–5066 |

`crm.html` loads the **same** seven data files and `crm_data.js`, then `crm_full.js` instead of `crm_sidebar.js`.

**Script order matters.** `data/*.js` → `crm_data.js` → `crm_sidebar.js`.

### Why `.js` data files and not `.json`

`fetch()` on a local `.json` fails under `file://` (Chrome blocks it cross-origin), and these prototypes get opened by double-clicking. Each data file is a script assigning onto `window.CRM`.

---

## 4. Key flows

### Thread selection drives everything

`wireEmailList()` (`crm_sidebar.js:888`) maps `CRM.threads` onto the shell's six existing `.email-tile` nodes, rewriting **only their text nodes** so all shell chrome (checkboxes, stars, hover actions) survives. It clones the last tile if there are more threads than tiles.

Click → `setThread(id)` (`:151`) → `CrmData.rootScenario(id)` (`crm_data.js:400`) → resets the nav stack.

### Navigation — page stack with a scenario-dependent root

`push` (`:119`) / `pop` (`:120`), `stack[0]` is the root. Back walks up and **stops at root** — it can never escape into another thread's pages. `render()` (`:643`) redraws the whole panel from `PAGES` (`:620`).

Seven pages: `pageOpportunities` (`:318`), `pageParticipants` (`:345`), `pageContact` (`:384`), `pageCompany` (`:432`), `pageOpportunity` (`:473`), `pageOppContacts` (`:555`), `pageOppCompanies` (`:582`).

```
ROOT depends on the thread — CrmData.rootScenario()

 has opportunities  ─▶ 'opportunities'  list          (6 in the wireframes)
       └─▶ opportunity  name + inline stage  (1)
               ├─▶ Associated Contacts  (2) ─▶ contact record (5)
               └─▶ Associated Companies (3) ─▶ company record

 >1 counterparty, none linked ─▶ 'participants'  (4)
 exactly 1 counterparty       ─▶ 'contact'       (5)
```

### Actions — all mutate `window.CRM` in memory, nothing persists

| Action | Line | Note |
|---|---|---|
| `setStage` | `:698` | writes `stageId` **and logs a real `stage_change` activity** |
| `saveNote` | — | writes into the timeline, not a separate store |
| `linkThread` / `linkContact` | `:732` / `:742` | append to `links.js` arrays only |
| `createContact` / `createCompany` | `:758` / `:780` | a candidate address becomes a record |
| `addOpportunity` | `:817` | ⚠️ uses `window.prompt` — placeholder |
| `newActivity` | `:866` | ⚠️ **toasts only**, no composer |
| `narrowTo` | `:737` | files a shared-thread message to one deal — the **only** way an activity gets an explicit `opportunityId` at runtime |

A reload restores the authored dataset.

---

## 5. ⚠️ Traps

### 5.1 There is deliberately no `crm_sidebar.html`

The previous prototype had one, fetched at runtime behind `if (!document.getElementById('crmSidebar'))` — a guard that never passed because the markup was already inlined. Edits to it changed nothing while the inline copy silently drifted.

**All markup is generated in `crm_sidebar.js`.** If you find yourself creating an HTML partial here, you are re-introducing that bug.

### 5.2 The clock is pinned

`CrmData.NOW = 2026-08-10T11:00` (`crm_data.js:24`). The mock data is static, so "now" must be too — otherwise Upcoming quietly empties as real time passes and the prototype stops demonstrating the time split.

**Consequence:** a new activity dated "next week" in real terms may land in Older. Date against `NOW`, or move `NOW`. It is the **only** place to change it.

### 5.3 A null `opportunityId` is meaningful, not missing data

`contactId` is required; `opportunityId` is an **override**. `null` means one of two things, both intentional:

- no `threadId` either → "happened with this person, attached to no deal" (the cold-inquiry threads)
- has a `threadId` → **belongs to every opportunity that thread is linked to**

`act_045` is the second case on purpose — it appears in both Third Wave deals and is the only demo of the shared-thread rule. **Do not "fix" the nulls.**

### 5.4 Two shell mismatches, left alone on purpose

- the left rail still reads `ella.henderson@avontechl…`, not Maya
- the reading pane's message bodies are still the shell's dummy thread; **only `.thread-title` (3168) updates** on select

Both are cosmetic. They were left to avoid churning mail-client markup, not overlooked.

### 5.5 `check_data.js` asserts design rules, not just integrity

Run `node crm/check_data.js` after **any** data edit. It fails if `ct_ayesha` or `ct_devang` ever appear in an Associated Contacts list — the no-inheritance tripwires. A green run means the model still holds, not merely that ids resolve.

### 5.6 A new opportunity with no `links.js` row is nearly invisible

It shows only under "Add this thread to other opportunities". `opp_hearth_wholesale` does this deliberately; doing it by accident looks like a rendering bug.

### 5.7 Both surfaces must load the same core

`index.html` and `crm.html` each carry their own script block. If you add a data file, **add it to both** — otherwise one surface silently sees a smaller dataset. `crm/README.md` §5 has the canonical order.

Corollary: never write a query in `crm_full.js` or `crm_sidebar.js`. It belongs in `crm_data.js` where both can reach it. Two query layers is exactly how the previous prototype ended up with two conflicting `PIPELINES` datasets.

### 5.8 Merging `main` will conflict

`main` still has the old folder at `Prototypes/Ishant/CRM Explorations/Merged Approach/`, while this branch moved it to `Prototypes/Ishant/CRM Explorations Merged Approach/`. Expect rename/add conflicts, plus deleted files (`crm.html`, `crm_app/`, `PRD.md`) arriving back.

---

## 6. Decisions already made

Full reasoning in 📄 [crm/DATA-MODEL.md](crm/DATA-MODEL.md) §2 and §7. **Do not re-litigate.**

- **Pipeline is a template; Opportunity is the instance.** A template can't hold contacts — only a run through it can. Four pipelines exist with deliberately unalike shapes (Wholesale ends in an ongoing *Active*, Gifting is transactional and ends at *Paid*, Sourcing runs outbound, Hiring is about a person with no company). That difference is the argument for templates over one global status field.

- **Association is never inherited.** Linking a company does not link its contacts. Structural, not conventional: `links.js` keeps separate arrays, so a nested shape can't make inheritance the default.

- **Contacts own all activity; companies own none.** An activity has no company field. A company's feed is the union of its contacts', computed. This is what lets `companyId` be safely nullable — 5 of 9 contacts have none.

- **Upcoming vs Older is a TIME split on one collection**, not a type split. So "new Activity" means log *or* schedule via one path, a meeting crosses the divider by itself, and a record with nothing scheduled simply has no Upcoming section.

- **A thread may belong to many opportunities.** Hence the panel roots at a **list**, and there is no header switcher — back goes to the list instead.

- **Records are born from threads.** Threads store `{name, email}` and never reference contact ids; matching is a query and a miss is a **candidate**. That is the mechanism behind every `+`.

- **Free-mail domains never resolve to a company** (`FREE_MAIL`, `crm_data.js:29`). One rule instead of nine hand-authored exceptions.

- **Commerce dates are tasks**, not new kinds — *quote expires Friday*, *payment due the 20th*. Keeps one task object with an optional time.

- **Files are a lens, not a kind.** The Files tab filters activities carrying attachments, so it cannot drift from the timeline.

- **Arriving mail attaches by arity, not cleverness** (`classifyIncoming`, `crm_data.js:367`). RFC 5322 `References` makes thread identity a lookup rather than a guess; then 0 candidates → nothing, 1 → silent, 2+ → suggest. A new thread is never silent, because a contact match says *who*, not *which deal*.

- **A message on a shared thread goes into every linked deal**, marked "Also in N other deals" with one-tap narrowing. Splitting it would show half a conversation in each. Ignoring the prompt is the expected resting state, not a chore.

- **Timeline generous, staleness strict.** `daysSinceLastActivity()` (`crm_data.js:327`) counts explicit activity only, so shared-thread traffic can't make a dead deal look alive.

- **Email never auto-advances a stage.** Attribution is inferable; intent is not.

### The business

**Ember & Oak Coffee Roasters** — Maya Rao, founder, being inquired *at*. Chosen because inbound inquiry is genuinely her main channel, and because it naturally produces both contact shapes (a café owner with a company, a bride on Gmail without one).

---

## 7. Where design and code diverge

| Concern | Designed | Built |
|---|---|---|
| Stage control | below the opportunity name, changeable there | ✅ built (`:439`), native `<select>` overlay |
| "Add an opportunity" | designed picker flow | ⚠️ `window.prompt` (`:758`) |
| "new Activity" | authoring an intention | ⚠️ toast only (`:807`) |
| Full CRM app | lists, record pages, deep links | ✅ built — `crm.html`, 7 routes |
| Kanban board | a pipeline as a board | ⬜ not built — the list groups by pipeline instead |
| Creating records in the full app | "New opportunity" | ⚠️ toasts — creation is inbox-first for now |
| Account B | the café owner running his own Supplier Selection pipeline, Ember & Oak as one of three vendors — same components, inverted role | ⬜ not written |

`crm_data.js` is kept separate from any renderer **specifically** so the fullscreen CRM reuses the same queries. The old prototype kept two conflicting `PIPELINES` datasets, one in the shell and one in the drawer, and they drifted.

---

## 8. Open questions

1. **Does Associated Companies get an "Add from this thread" section?** Not drawn in the wireframes. `addableCompaniesFromThread()` exists and the page currently renders it — confirm or remove.
2. **Panel 1's two nav boxes** currently show first-name + overflow count (`Rohan`, `Third Wave Bandra`). Counts only, or names inline? Affects header height.
3. **Does an opportunity ever change pipeline?** Not modelled. A lead that becomes a hire is currently "close one, open another".
4. **Does the full app need a kanban board?** The opportunity list groups by pipeline, which is the same information without the horizontal scroll. A board is a workspace; worth deciding whether it earns its place.
5. **Where do records get created?** Today creation is inbox-first — the full app's "New opportunity" only toasts. That may be right (records are born from threads) or may be a gap for records with no email yet.

---

## 9. Related docs

- 📘 [crm/DATA-MODEL.md](crm/DATA-MODEL.md) — the model, the 4 rules, decisions and reasoning. **Read before touching data.**
- 📘 [crm/README.md](crm/README.md) — folder architecture, load order, query reference, how to extend
- 📄 [how_to_write_new_chat_context.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/how_to_write_new_chat_context.md) — conventions for this file
- 📁 `../CRM Explorations/` — the base Titan shell and the **previous** CRM approach (`crm_app/`). Superseded; useful only for the drawer CSS mechanic.
- 📋 [todos.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/todos.md) — roadmap
