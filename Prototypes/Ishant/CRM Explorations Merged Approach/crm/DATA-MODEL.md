# CRM Data Model

**Status:** settled · **Verified:** 2026-08-10 · run `node crm/check_data.js` to re-verify

This is the model the sidebar renders. Every rule here was decided deliberately; §8 records the reasoning so it isn't re-litigated.

---

## 1. Entities

| Entity | What it is | Owns |
|---|---|---|
| **Pipeline** | A **template**. An ordered stage list defining a process. | stages, nothing else |
| **Opportunity** | One **live run** through one pipeline, parked at one stage. | `pipelineId` + `stageId` |
| **Contact** | A person. `companyId` is **nullable**. | **all activity** |
| **Company** | An alias for a business, and a bucket for contacts. | **nothing** |
| **Thread** | An email thread as the mail client knows it: subject + addresses. | nothing |
| **Activity** | One thing that happened or will happen. | — |
| **Link** | The explicit edges joining an opportunity to threads/contacts/companies. | — |

```
Pipeline ──template──▶ Opportunity ──▶ current stage
                            │
                            │  (links.js — explicit edges only)
                            ├──▶ threads    0..n
                            ├──▶ contacts   0..n
                            └──▶ companies  0..n

Contact ──owns──▶ Activity          Contact ──▶ Company  (0..1, org grouping)
Company ──owns──▶ nothing           Company ──▶ Contacts (0..n)
```

---

## 2. The four rules

### Rule 1 — Association is never inherited

Linking **Acme Corp** to an opportunity does **not** link Acme's contacts. Every contact is joined on purpose, one at a time.

This is structural, not a convention: `links.js` keeps `contactIds` and `companyIds` as **separate arrays**. A nested shape would have made inheritance the default.

Two records exist purely as tripwires:

| Contact | At company | Company linked to | Contact linked? |
|---|---|---|---|
| `ct_ayesha` | `co_thirdwave` | `opp_tw_wholesale` | **no** |
| `ct_devang` | `co_lumen` | `opp_lumen_gifting` | **no** |

If either ever appears in an Associated Contacts list, the query layer has started inferring edges. `check_data.js` asserts both.

### Rule 2 — Contacts own all activity; companies own none

An activity has a required `contactId` and **no company field**. A company's feed is the *union of its contacts' feeds*, computed in `activitiesForCompany()`, never stored.

This is what makes `companyId` safely nullable. A private individual on Gmail has no company, so no company could have owned their activity — the earlier "activities always belong to a company" phrasing would have forced inventing a fake personal company per individual.

### Rule 3 — Upcoming vs Older is a **time** split on one collection

There is no separate tasks collection. One `activities` array; `at` in the future renders under **Upcoming**, in the past under **Older**.

Consequences worth knowing:

- **"New Activity" means log *or* schedule.** Past date → Older, future date → Upcoming. One authoring path.
- **A meeting crosses the divider by itself** as time passes. No migration, no state change.
- **A record with nothing scheduled simply has no Upcoming section** — which is why the contact record page (panel 5) shows only "Older Activity" without being a different component.

`kind` still exists, but drives the icon and phrasing only — never the split.

### Rule 4 — A thread may belong to many opportunities

`th_wholesale` is on both `opp_tw_wholesale` (supply) and `opp_tw_gifting` (hamper co-brand). Same contact, same thread, two deals — and their explicitly-narrowed feeds stay distinct.

This is why the panel **roots at a list** rather than a record, and why there is no header switcher. It is also the source of the hardest problem in the model — what to do with a *new* message on a shared thread. See §6.3.

---

## 3. Activity kinds — 7, three automatic

| Kind | Source | Extra fields |
|---|---|---|
| `email` | **auto** — from linked threads | `direction: 'in'\|'out'`, `messageId`, `references`, `threadId`, `attachments?` |
| `stage_change` | **auto** | `from`, `to` (stage ids) |
| `scheduled_send` | **auto** — Titan send-later | — |
| `task` | authored | `done: bool` |
| `call` | authored | `durationMins` |
| `note` | authored | `body` |
| `meeting` | authored via Calendar (Calendar stays owner) | `durationMins` |

**`stage_change` is the highest-value kind and costs nothing to populate.** "Moved to *Pricing agreed* — 7 days ago" is the line that says a deal has gone quiet, and it's the only record of how a deal actually travelled. Without it, a stage is a status with no history.

**Files are not a kind.** An attachment is a property of the activity that carried it; the Files tab is `filesFrom(activities)` — a lens, never a second copy, so it cannot drift.

**Commerce dates are tasks.** *Quote expires Friday*, *payment due the 20th*, *order dispatches Thursday* — all `task` with a due `at`. Keeps "one task object, optional time" instead of growing a kind per business.

---

## 4. Address resolution — records are born from threads

Threads store only what a mail client actually knows: `{ name, email }`. They **do not reference contact ids**. Matching an address to a record is a query, and a **miss is a candidate** — a record we could create.

That indirection is what makes "people from this thread" a genuine proposal rather than a lookup of records we already had. It's the mechanism behind every `+` in the wireframes.

`resolveAddress()` returns:

| Field | Meaning |
|---|---|
| `contact` | existing record, or `null` |
| `isCandidate` | true when no record exists |
| `company` | resolved from the contact's `companyId`, else from domain |
| `companyIsCandidate` | true when the domain is real but unknown to us |

**Free-mail domains never resolve to a company** — `gmail.com`, `outlook.com`, `icloud.com` and friends (`FREE_MAIL` in `crm_data.js`). One rule, and "a contact may or may not have a company" becomes true without anyone hand-authoring exceptions.

`th_cafe` exercises all three outcomes at once:

| Participant | Contact | Company |
|---|---|---|
| Farah Sheikh | known | none (Gmail) |
| Nikhil Rane | **candidate** | **candidate** — `versovacoffee.in` is in no data file |
| Dia Kapoor | **candidate** | none (Gmail) |

---

## 5. Root scenario — where the panel opens

The nav stack's **root depends on the thread**. Back walks up and stops at root; it never escapes into a page that wasn't reachable in this scenario.

```
opportunitiesForThread(thread).length > 0
        └─▶ 'opportunities'   opportunity list          (panel 6)
counterparties(thread).length > 1
        └─▶ 'participants'    people + companies found  (panel 4)
otherwise
        └─▶ 'contact'         that contact's record     (panel 5)
```

Note the split is by **participant count**, not by whether we already know them. A sole counterparty who isn't a record yet falls back to `participants` with one row — there's nothing to show but the offer to create them.

| Thread | Counterparties | Opportunities | Root |
|---|---|---|---|
| `th_wholesale` | Rohan, Ayesha | 2 | `opportunities` |
| `th_gifting` | Priya, Devang | 1 | `opportunities` |
| `th_sourcing` | Carlos | 1 | `opportunities` |
| `th_hiring` | Tara | 1 | `opportunities` |
| `th_wedding` | Sneha | **0** | `contact` |
| `th_cafe` | Farah, Nikhil, Dia | **0** | `participants` |

---

## 6. Email attachment — what happens when mail arrives

The CRM lives inside a mail client, so the central question is: *a new message lands — which deal does it belong to?*

### 6.1 Thread identity is given, not inferred

Every email carries `Message-ID`, `In-Reply-To` and `References` (RFC 5322). `References` holds the message's **entire ancestry**, appended to on every reply. So:

```
① Rohan   Message-ID: <tw-001@thirdwave>   References: —
② Maya    Message-ID: <eo-001@emberandoak> References: <tw-001@thirdwave>
③ Rohan   Message-ID: <tw-002@thirdwave>   References: <tw-001@thirdwave> <eo-001@emberandoak>
```

`threadForMessage(references)` walks that list backwards looking for a `messageId` we already store. **This is a lookup, not a heuristic** — the sender's own mail client wrote the ids for us. Subject changes don't matter.

Email activities therefore carry `messageId` and `references`. `check_data.js` asserts every id is unique and every reference resolves.

**Where it breaks** — forwards start a fresh Message-ID with no ancestry; composing new instead of replying gives no `References`; some clients mangle the headers; Gmail layers its own subject/participant matching on top. All of these land you in "unknown thread", which is handled below, not guessed at.

### 6.2 Arity decides — not cleverness

`classifyIncoming(msg)` returns a mode. The strength comes from **counting candidates**, not from matching well:

| Candidates | Mode | Behaviour |
|---|---|---|
| 0 | `none` | nothing to attach to. Panel 4/5. **Not a failure — the correct answer.** |
| 1 | `auto` | file it silently. There is nothing to be wrong about. |
| 2+ | `suggest` | **never guess.** Show the list, one tap decides. |

Two paths reach it:

- **Reply into a known thread** (`basis: 'references'`) — candidates are that thread's opportunities. One deal → silent. This is most traffic on a live deal, and it's why the sidebar keeps up without nagging.
- **New thread from a known contact** (`basis: 'contact'`) — candidates are that contact's opportunities. **Never `auto`, even at one candidate**: a contact match tells you *who*, not *which deal*. It gets confirmed, not assumed.

Note this is the same shape as `rootScenario()` (§5). The disambiguation UI already existed before the attribution problem did.

### 6.3 The shared-thread case

One thread can serve two deals (Rule 4). Even with perfect header matching, a new message in `th_wholesale` is ambiguous — supply, or hampers?

**It goes into both.** `opportunityId` on an activity is an **override, not the primary attribution**:

| | Means |
|---|---|
| `links.threadIds` | **default membership** — everything in this conversation belongs to this deal |
| `activity.opportunityId` | an **optional narrowing** — "actually, this one is only about hampers" |

So `activitiesForOpportunity(id)` = *explicitly narrowed to it* **plus** *un-narrowed activities from its linked threads*. `isInherited(a)` flags the second kind, which renders as **"Also in 1 other deal · Only this one"**.

Why both rather than a split: splitting shows **half a conversation** in each deal. Rohan's hamper reply says "as I mentioned, Tuesday delivery works" — that context lives in a wholesale email. Duplicating tells the truth twice; splitting makes both feeds incoherent.

Why not guess the busiest deal: when a guess is wrong nobody notices. The message just silently sits under the wrong deal.

**Ignoring the prompt is safe and expected.** People skim inboxes. The un-narrowed state is designed to be the resting state, not a pending chore — narrowing is optional cleanup. `act_045` in the dataset is exactly this case, left un-narrowed on purpose.

### 6.4 Generous timeline, strict staleness

The cost of "both" is that a busy wholesale thread would refresh the hamper deal's clock, making a dead deal look alive. Since *reduce missed follow-ups* is the point, that's not acceptable.

So `daysSinceLastActivity()` counts **strict** activity only — `activitiesForOpportunity(id, {strict: true})`, explicit ids alone. Shared-thread traffic shows in the feed and is invisible to the signal.

Same data, two deliberately different reads: *show me everything relevant* vs *has anyone actually moved this forward*. They pull in opposite directions, and that's fine as long as it's on purpose.

### 6.5 Two rules that don't bend

- **Email never auto-advances a stage.** Attribution is inferable; intent is not. `stage_change` stays authored.
- **Precision over recall.** A missing email costs one tap. A *wrongly attached* one costs trust in the timeline — and a timeline you can't trust as a record is not a product. When uncertain: suggest, never attach.

### 6.6 Known gaps

- **Second addresses.** Rohan writes from his phone at `rohanm@gmail.com` → no contact match → `resolveAddress()` offers to create a duplicate Rohan. Needs contact merge, or at minimum a "same person?" nudge.
- **Shared domains.** Fine for `thirdwavebandra.com`. Wrong for coworking addresses, agencies, `notifications@shopify.com`.
- **Sent mail** needs the same treatment as received, and is the half that gets forgotten.
- **Nudging good behaviour.** Users starting a fresh thread per topic avoids §6.3 entirely. Rather than expecting it, offer *"start a new thread for this"* when a second opportunity is opened on a thread. Note this only helps outbound — **you cannot manage what the other party replies to**, and inbound is where the shared-thread case actually arises.

---

## 7. The dataset — Ember & Oak Coffee Roasters

Logged-in user **Maya Rao**, founder. She *runs* the business and is the one being inquired at.

### Pipelines — four deliberately unalike shapes

| Pipeline | Stages | Shape |
|---|---|---|
| **Wholesale Accounts** | Inquiry → Samples sent → Tasting → Pricing agreed → First order → Active | ends in an **ongoing relationship**, not a close |
| **Corporate Gifting** | Inquiry → Requirements → Quote sent → Approved → Dispatched → Paid | **transactional**, ends at Paid |
| **Green Coffee Sourcing** | Sourced → Samples requested → Cupping → Contracted | runs **outbound** — Maya is the buyer |
| **Hiring** | Applied → Screened → Trial shift → Offer → Joined | about a **person with no company** |

Four shapes this different are the argument for pipelines being templates rather than one global status field.

### Opportunities

| Id | Pipeline @ stage | Notes |
|---|---|---|
| `opp_tw_wholesale` | Wholesale @ Pricing agreed | shares `th_wholesale` |
| `opp_tw_gifting` | Gifting @ Requirements | shares `th_wholesale` — **Rule 4** |
| `opp_lumen_gifting` | Gifting @ Quote sent | has a payment-due task |
| `opp_finca_sourcing` | Sourcing @ Cupping | outbound |
| `opp_tara_hiring` | Hiring @ Trial shift | `companyIds: []` |
| `opp_hearth_wholesale` | Wholesale @ Inquiry | **no threads** — populates "add this thread to other opportunities" on every thread |

### Contacts — 5 of 9 have no company

`ct_sneha`, `ct_tara`, `ct_farah` have `companyId: null` by nature (individual, candidate, individual). `ct_ayesha` and `ct_devang` have companies but no opportunity links — the Rule 1 tripwires.

### Pinned clock

`CrmData.NOW = 2026-08-10T11:00`. The mock data is static, so "now" must be too — otherwise Upcoming quietly empties as real time passes and the prototype stops demonstrating Rule 3. **Change it in `crm_data.js` only.**

---

## 8. Decisions and why

Recorded so they aren't reopened.

1. **Pipeline is a template, opportunity is the instance.** A template can't hold contacts; only a run through it can.
2. **Separate link arrays, not nested objects** — Rule 1 has to be structurally impossible to violate, not merely discouraged.
3. **`opportunityId` on activity is nullable, `contactId` is not.** Contact is the owner (Rule 2); the opportunity is optional context. Without the nullable side, a cold inquiry couldn't exist before someone opened a deal — and that's precisely the panel-4/5 scenario.
4. **`opportunityId` had to exist at all.** Rohan has two opportunities; deriving a deal's feed from its contacts alone would show both deals the same 17 activities.
5. **Time split over type split** (Rule 3) — reconciles "new Activity" as one authoring path with panel 5 having no Upcoming section, and lets a meeting cross the divider for free.
6. **Free-mail domain list over a per-contact flag** — one rule beats nine hand-authored exceptions, and it keeps working as contacts are added.
7. **Threads store addresses, not contact ids** — records are born from threads (§4). Storing ids would have presumed the record already existed, which defeats the whole `+` affordance.
8. **`crm_data.js` is separate from any renderer** — the fullscreen CRM will import the same queries. The old prototype kept two conflicting `PIPELINES` datasets, one in the shell and one in the drawer, and they silently drifted.
9. **`opportunityId` demoted to an override** (§6.3). Originally it was the primary attribution, which worked only because a human had hand-sorted every email. Nothing could reproduce that automatically, so thread membership became the default and the explicit id became the exception.
10. **Both feeds, not a split, on a shared thread** — a split shows half a conversation in each deal, with replies to context that was filtered out.
11. **Staleness computed strictly while the timeline stays generous** (§6.4) — otherwise shared-thread traffic keeps a dead deal looking alive, defeating the one signal the product exists to provide.
12. **`auto` mode only on a header-matched thread with exactly one deal.** A contact match tells you *who*, never *which deal*, so new threads always get confirmed even at one candidate.

---

## 9. Open, not blocking

- **Does an opportunity ever change pipeline?** Not modelled. A lead that becomes a hire is currently "close one, open another."
- **Does panel 3 (Associated Companies) get an "Add from this thread" section?** Not drawn in the wireframe. `addableCompaniesFromThread()` exists either way.
- **Panel 1's two boxes** — counts only, or names inline? Affects header height.
- **Account B** — the café owner running his own *Supplier Selection* pipeline with Ember & Oak as one of three vendors. Same components, inverted role. Not yet written.
