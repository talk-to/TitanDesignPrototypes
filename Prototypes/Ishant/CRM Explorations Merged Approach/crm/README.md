# `crm/` — the CRM component: sidebar + full app

**Verified:** 2026-08-10 · branch `CRM-Explorations-Merged-Approach`

**Two surfaces over one data core.** A sidebar that slides into the Titan Mail shell, and a standalone full app. Read 📄 [DATA-MODEL.md](DATA-MODEL.md) first — everything here renders from that model, and the four rules plus §6 (email attachment) are load-bearing.

---

## 1. Two surfaces, one core

| Surface | File | For |
|---|---|---|
| **Sidebar** | `index.html` + `crm_sidebar.*` | never leaving the inbox. Thread-scoped, narrow, one thing at a time. |
| **Full app** | `crm.html` + `crm_full.*` | browsing. Lists, real record pages, deep links. |

Both load the **same `crm_data.js` and `data/`**. No second query layer, no second copy of the rules — so the two can never disagree about what the data means. The old prototype kept two conflicting `PIPELINES` datasets, one in the shell and one in the drawer, and they silently drifted.

Reaching the full app: **app switcher → CRM** (`index.html:3662`), or the **⤢ button in the sidebar's top bar**, which deep-links to whatever record you were looking at.

---

## 2. Current state

| Piece | Status |
|---|---|
| Data model + mock dataset | ✅ built, validated |
| `crm_data.js` query layer | ✅ built, validated |
| Sidebar — 7 pages | ✅ live in `index.html` |
| Full app — 7 routes | ✅ live in `crm.html` |
| App-switcher entry + deep link from sidebar | ✅ live |

**Open `index.html`.** The panel starts open; the red person icon in the top-right toolbar toggles it. The six inbox tiles are driven by `CRM.threads`, so clicking each one shows a different root scenario.

Working end to end: page stack with back, inline stage change (which logs a real `stage_change` activity), note composer writing into the timeline, Notes/Files tabs, task checkboxes, search filters, and every `+` — linking, and creating contacts and companies from thread addresses.

Not built: the "new Activity" composer (toasts instead), and `addOpportunity()` uses `window.prompt` for pipeline and name rather than a designed flow.

**Two cosmetic mismatches in the shell**, left alone deliberately to avoid churning mail-client markup:
- the left rail still reads `ella.henderson@avontechl…` rather than Maya
- the reading pane's message bodies are still the shell's dummy thread; only the thread title updates on select

---

## 3. Files

```
crm/
  README.md            ← this file
  DATA-MODEL.md        entities, the rules, decisions and why
  check_data.js        validator — run it after any data edit

  crm_data.js          SHARED query layer. Pure functions, no DOM.
  data/                SHARED dataset

  crm_sidebar.css      sidebar — panel shell + crm-* rules
  crm_sidebar.js       sidebar — page stack, 7 renderers, actions
  crm_full.css         full app — f-* rules
  crm_full.js          full app — hash router, 7 routes

  data/
    pipelines.js       stage templates — 4 pipelines
    companies.js       4 companies. Own no activity.
    contacts.js        9 contacts. companyId nullable — 3 are null.
    opportunities.js   6 opportunities. pipelineId + stageId is the state.
    links.js           the explicit edges. Most important file here.
    activities.js      45 activities. contactId required; opportunityId is an
                       OVERRIDE, not the primary attribution (DATA-MODEL §6.3).
    accounts/
      maya.js          account owner + 6 threads
```

**There is no `.html` file in here, on purpose.** The previous prototype had a `crm_sidebar.html` fetched at runtime behind an `if (!document.getElementById(...))` that never fired — so edits to it changed nothing while an inline duplicate in `index.html` silently drifted. Every page here renders from data in JS, so there is no second copy to drift.

---

## 4. Why `.js` data files and not `.json`

**`fetch()` on a local `.json` fails under `file://`** — Chrome blocks it as a cross-origin request. These prototypes get opened by double-clicking, so JSON files would break the moment you did that.

So each data file is a script that assigns onto a global:

```js
window.CRM = window.CRM || {};
window.CRM.contacts = [ /* … */ ];
```

Reads like JSON, loads as a script, no build step, works offline from the filesystem.

---

## 5. Load order

`crm_data.js` reads `window.CRM.*` at call time, but the data files must be present before any query runs. Wire it in this order:

```html
<link rel="stylesheet" href="crm/crm_sidebar.css">
...
<script src="crm/data/pipelines.js"></script>
<script src="crm/data/companies.js"></script>
<script src="crm/data/contacts.js"></script>
<script src="crm/data/opportunities.js"></script>
<script src="crm/data/links.js"></script>
<script src="crm/data/activities.js"></script>
<script src="crm/data/accounts/maya.js"></script>   <!-- swap per ?u= -->
<script src="crm/crm_data.js"></script>
<script src="crm/crm_sidebar.js"></script>
```

`crm.html` is identical up to `crm_data.js`, then loads `crm_full.js` instead.

`index.html` needs exactly four additions of its own: the stylesheet link (`:8`), the toolbar button (`:2854`), one empty container div (`:3490`), and this script block (`:5051-5059`). No markup.

---

## 6. The full app — `crm.html`

**Hash routing, so every record has a URL:**

```
#/opportunities              #/opportunity/opp_tw_wholesale
#/contacts                   #/contact/ct_rohan
#/companies                  #/company/co_thirdwave
#/pipeline/pl_wholesale
```

That is what makes the sidebar's ⤢ button land on the *record* rather than a root page — the gap that made the previous prototype's "Open in CRM" useless (it dumped you on a kanban root with no deep link).

**Left nav** — Opportunities, Contacts, Companies under *Records*; each pipeline under *Pipelines*, filtering the opportunity list. Pipelines are grouped separately on purpose: a pipeline is **configuration**, not a record.

**The opportunity list is grouped by pipeline, never flat.** A flat list with one Stage column would put *Trial shift* next to *Quote sent* as though they were comparable. They are not — stage names only mean something inside their own pipeline.

**Record pages** are a two-column layout: timeline on the left, related records in a right rail (next due, contacts, companies, threads, files). The company page prints `not on a deal` next to anyone whose company is linked but who isn't — Rule 1 made visible rather than merely documented.

---

## 7. Panel mechanics

Carried over from `Prototypes/Ishant/CRM Explorations` — the pattern the wireframes assume.

**It is not an overlay.** `#crmSidebar` is an **in-flow flex child of `.content-area`**, animating `width: 0 → 344px`, so it squeezes the reading pane rather than covering it.

```css
#crmSidebar      { width: 0; opacity: 0; overflow: hidden;
                   transition: width .28s cubic-bezier(.22,1,.36,1),
                               opacity .2s ease; }
#crmSidebar.open { width: 344px; opacity: 1;
                   border-left: 1px solid var(--crm-border); }
```

Toggled by `#crmToggleBtn` (`index.html:2854`) — the red person-plus-badge SVG carried over from the previous prototype.

---

## 8. Navigation — a page stack with a scenario-dependent root

The sidebar is **navigable pages**, not one scrolling panel. Back walks up the stack and **stops at root** — it never escapes into a page that wasn't reachable in this scenario.

```
ROOT depends on the thread (see DATA-MODEL §5)

'opportunities'  Add an opportunity
                 Active Opportunities for this thread     ─┐
                 Add this thread to other opportunities    │
                        │                                  │
                        └─▶ OPPORTUNITY  name + stage ◀─────┘  inline stage change
                                ├─▶ Associated Contacts ─▶ contact record
                                └─▶ Associated Companies ─▶ company record

'participants'   companies from this thread  +
                 people from this thread     +
                        └─▶ contact record

'contact'        the record itself, with "Add an opportunity"
```

`CrmData.rootScenario(threadId)` returns which one. One stack implementation, three entry points.

**The recurring primitive at every depth is "from this thread."** Attach a thread to an opportunity, a contact to an opportunity, a company to an opportunity — same pattern, three levels. That's why it's worth building generically instead of as five bespoke screens.

---

## 9. The query layer

`window.CrmData` — pure, no DOM, no state. Full list in the file's return block. The ones that carry the design:

| Function | Why it matters |
|---|---|
| `rootScenario(threadId)` | which page the panel opens on |
| `opportunitiesForThread(id)` | many-per-thread, hence the list root |
| `opportunitiesNotOnThread(id)` | "add this thread to other opportunities" |
| `contactsForOpportunity(id)` | reads link arrays **only** — never infers from company |
| `resolveAddress(participant)` | address → record, or **candidate** |
| `addableContactsFromThread(t, o)` | the `+` rows |
| `splitByTime(activities)` | Upcoming / Older |
| `classifyIncoming(msg)` | **what to do with arriving mail** — `none` / `auto` / `suggest` |
| `threadForMessage(refs)` | RFC 5322 header lookup — deterministic thread identity |
| `isInherited(activity)` | in this feed by thread membership, nobody has narrowed it |
| `activitiesForCompany(id)` | union of its contacts — companies store nothing |
| `activitiesForOpportunity(id, {strict})` | generous by default, strict for signals |
| `nextDue(id)` / `daysSinceLastActivity(id)` | what you owe, and whether a deal has gone quiet |

---

## 10. Extending the data

**Run `node crm/check_data.js` after every data edit.** It checks referential integrity across all files and asserts the four rules — including the two no-inheritance tripwires.

| To add | Do this |
|---|---|
| A pipeline | append to `data/pipelines.js`. Nothing else. |
| An opportunity | append to `opportunities.js` **and** add a row to `links.js` |
| A contact | append to `contacts.js`. `companyId: null` is fine and common. |
| A thread | append to `accounts/maya.js`. Participants are `{name, email}` — **do not reference contact ids** |
| An activity | append to `activities.js`. `contactId` required. On emails set `threadId` + `messageId`; `opportunityId` null means "belongs to every deal on that thread" — see DATA-MODEL §6.3 |
| An account | new file in `data/accounts/`, loaded via `?u=<id>` |

Three things that will bite:

- **A new opportunity with no `links.js` row** is invisible everywhere except "add this thread to other opportunities". That's legitimate (`opp_hearth_wholesale` does it deliberately) but easy to do by accident.
- **A null `opportunityId` on an email is meaningful, not missing data.** It means nobody has narrowed the message to one deal, so it shows in every deal its thread is linked to. Filling them all in would break the demo of §6.3.
- **Upcoming/Older is relative to `CrmData.NOW`** (pinned to `2026-08-10T11:00`). A new activity dated "next week" in real terms may land in Older. Date against `NOW`, or move `NOW`.

---

## 11. Related

- 📄 [DATA-MODEL.md](DATA-MODEL.md) — the model, the rules, the reasoning
- 📄 [../new_chat_context.md](../new_chat_context.md) — folder-level context for a fresh session
- 📁 `../../CRM Explorations/crm_app/` — the previous approach. Superseded; useful only for the drawer CSS mechanic.
