# Titan Recap — Project Memory

**Written 4 Sep 2026.** The single place to pick this prototype up from cold.
`CONTEXT.md` is the chronological build log (sessions 1–15); this file is the
consolidated reference: what exists, how it fits together, what was decided and
why, and what is still open. When they disagree, trust the code, then this file.

---

## 1. What this is

A clickable prototype of **Titan Recap** — a feature that turns a client call
into a ready-to-send follow-up email. Built on top of `Shells/TitanEmailShell`,
inside the Titan design prototypes repo.

**Source documents** (shared in chat, not in the repo):
- Titan Recap PRD
- Titan Recap: Design Plan and Build Spec — Parts 0–10
- Detailed Design Specification (Web) v0.1
- `live-transcription.html` — a reference implementation for the live call

**Figma files used**
| File key | Name | Used for |
|---|---|---|
| `oBXib6lvrsw0E0ZMlNAPA4` | Titan Recap | App switcher, Recap app (list `5185:30595`, detail `5185:31003`), dictation, calendar event modal |
| `SrkLgDdfuPVg1iqPzXqDJj` | Lovable ↔ TITAN | Top toolbar icons |
| `xkGM9y85XHAoyQoonKEy4j` | Tasks | Calendar / Tasks side panel (calendar `10969:118440`, tasks `10981:127738`) |

---

## 2. Files

| File | Lines | What it is |
|---|---|---|
| `index.html` | ~10,100 | **Mail app.** The shell + AI Write + Recap surfaces + dictation journey + Calendar/Tasks side panel |
| `calendar.html` | ~1,740 | **Titan Calendar**, week view |
| `recap.html` | ~2,680 | **Recap app** — notes list and note detail |
| `live-call.html` | ~1,140 | **The call** — Zoom backdrop + live transcription sidebar |
| `drive.html` | ~600 | **Titan Drive** — the Meeting recordings folder, opened by Recap's `Get audio` |
| `CONTEXT.md` | 435 | Chronological build log, sessions 1–15 |
| `BUILD_PLAN.md` | 173 | The original execution plan (partly superseded) |
| `PROJECT_MEMORY.md` | — | This file |

**Asset folders:** `assets/` (67, shell), `composer_assets/` (54),
`ai_write_assets/` (28), `recap_app_assets/` (26), `settings_sidebar_assets/`
(14), `app_switcher_assets/` (10), `calendar_assets/` (8), `meet_assets/` (2).

Everything is committed bytes. **Never reference a Figma asset URL — they expire
in 7 days.**

---

## 3. How the apps connect

Each app is its own browser tab, because each is a separate surface.

```
index.html  (Mail)
  ├─ app switcher ──► calendar.html          (new tab)
  ├─ app switcher ──► recap.html             (new tab)
  ├─ pre-call prompt ──► live-call.html      (new tab)
  └─ side panel · View notes ──► recap.html?note=…&date=…&when=…&dur=…

calendar.html
  ├─ sidebar tile ──► app switcher ──► index.html / recap.html
  └─ past-event modal · View notes ──► recap.html?note=…&date=…&when=…&dur=…

live-call.html
  └─ Done / Leave ──► recap.html?from=call&dur=…&thoughts=…
```

**Hand-off is by URL, not storage** — `file://` origins cannot be relied on for
`localStorage`. It also means the user's typed notes genuinely survive the jump.

`recap.html` has two intake functions, both run at load:
- `intakeFromCall()` — `?from=call`, builds the Northwind note from the live call
- `intakeFromCalendar()` — `?note=`, builds that meeting's note

---

## 4. The end-to-end journey

1. **Dictate** — composer → `Dictate` chip (or the body hint) → simulated
   speech-to-text streams the body word by word, tail word greyed. The dictated
   mail proposes the call ("forty-five minutes this Thursday at 4pm… I'll send
   an invite across with a Zoom link"), which is what the rest of the journey
   picks up. Recipient is seeded (dictation writes bodies, not addresses);
   subject derived on finish.
2. **Smart Write flips to edit mode** — a draft exists, so the AI Write bar
   becomes the refine bar (`aiwAdoptDraft()`).
3. **Send** — nothing pops up. The user opens the Calendar side panel from the
   toolbar drawer themselves.
4. **Create the event** in the panel — clicking an empty slot opens the create
   form on that half-hour; the meeting-link field fills itself with the Zoom
   room on click. `Create event` lands it in the day and toasts.
5. **Open the event, click its Zoom link** (`spJoinRoom()`) — arms capture and
   opens `live-call.html` in its own tab.
6. **In the call** — nudge → transcript streams with speaker colours, partial
   lines, timer, My thoughts.
7. **Done / Leave** → `recap.html?from=call&…` with the real duration and the
   user's typed thoughts.
8. **Back in the mail tab** the **call recap pill** (Figma `5143:22913`) is now
   in the thread; clicking it opens that note. It appears again above the reply
   when a draft is written from the note.

The meeting used to be created *by* a card that appeared after sending (Figma
`5229:16208`), whose capture toggle raised the pre-call prompt directly. The
card is removed and the meeting now goes through the calendar side panel, so
the event exists somewhere the user can see it and the call is joined from the
event itself. **WC1, the pre-call prompt, is orphaned by this** — its markup and
`joinCall()` remain, but nothing opens the prompt any more.

---

## 5. Per-app notes

### `index.html` — Mail

- **Base:** rebased on `SmartWriteAI_Redesign` (3 Sep), so it carries AI Write in
  the composer *and* reply surfaces, the paywall machinery, tooltips, dark mode.
- **Smart Write locked to one flow:** `S.approach = 2`, `S.flow = 'happy'`. The
  prototype-controls widget is deleted. Paywall code remains but is unreachable.
- **Composer feature row:** Track / Design / AI Write / Templates / Dictate /
  Invoices, with only Groups behind the `⋮`. Measured to fit 649px — do not add
  a seventh chip without re-measuring.
- **Recap surfaces (W3/W4/W5/W6):** built, but ⚠️ **orphaned** — the in-thread
  chip that was their only entry point was removed on request. `openRecap()` is
  called from nowhere. Code intact, `renderChip()` guards on null.
- **Side panel** (`#sidePanel`, 285px): Calendar / Tasks tabs, day grid at
  48px/hour, create-event form, event detail. Opens from the drawer toolbar icon.
- **Key globals:** `toggleDictate`, `joinCall`, `toggleSidePanel`, `spOpenEvent`,
  `spNewEvent`, `openRecapApp`, `openCalendarApp`, `aiwAdoptDraft`,
  `window.recapDraftFor`.

### `calendar.html` — Calendar

- Week view, 52px/hour, **one** timezone gutter (Asia/Calcutta).
- `TODAY = Fri 4 Sep 2026`, `NOW_MIN = 14:00` — pinned, not the live clock.
- Past events render faded (`.ev.past`, opacity .42). An **in-progress** event
  counts as *not* past.
- Day-long blocks take their own 22% lane so they cannot crush the rest of a day.
- `Busy` blocks show no time; times appear on hour-plus events only.
- **Past event → full modal** (Figma `5148:10225`) with the Recap card.
  **Upcoming event → light popover** with the capture toggle.

### `recap.html` — Recap app

- 12 seeded notes, each with Summary / My thoughts / Transcript / action items.
  Three `Untitled` notes are deliberately thin (short call, late capture,
  standup) — they give the partial and empty states for free.
- **Details hang off note objects** (`n.detail`), never an index map — deleting a
  note used to misalign every note after it.
- `TASKS` entries store the note object, so task state is per note.
- Row overflow menu: Copy link / Share / Report / Delete, with an **undo window**
  on delete (the design plan asks for undo, not a confirm dialog).
- Share modal in Titan's language, per-note recipients and link setting.

### `live-call.html` — The call

- Zoom backdrop is deliberately **not** Titan-styled; it is another product.
- Voice-over uses browser speech synthesis; falls back to timer pacing when no
  voices exist (otherwise every line waits on a 3–8s guard).
- The transcript's top fade only applies once scrolled.

---

## 6. Decisions that shaped the build

| Decision | Chosen | Why it matters |
|---|---|---|
| Scope | Happy path end-to-end | W7, W9's six states, W10–W12 still unbuilt |
| Calendar | Build a real week view | Became `calendar.html` |
| Capture model | **Fork A, browser-only** | No desktop app anywhere; W2 loses its desktop block, W9 loses "desktop lost", WC1a/WC2a added |
| W5 tone | Route through AI Write's Tone/Length pills | Killed a duplicate control; new components 7 → 6 |
| Composer base | Rebase on SmartWrite | Rather than cherry-picking ~7,400 diff lines |
| Hand-off | URL params | `file://` localStorage is unreliable |
| Identity | `ella@avontech.com` everywhere | Matches the composer's From |

**Cast:** Ella Henderson (the user) at Avontech. Client: Priya Raman, Daniel
Okoye, Meera Shah at Northwind Logistics. Colleagues/calendars: jim, dwight,
pam, michael @avontech.com + "Ella Test". Recap's share directory reuses the
same Office names.

---

## 7. Conventions and traps

**The icon-stretching trap — hit three times.** Figma SVGs often carry their own
intrinsic `width`/`height` plus `preserveAspectRatio="none"`. Forcing them into a
uniform box stretches them (a chevron became a thin arch). **Always read
`width`/`height` off the SVG before sizing it**, and centre the glyph in the box
Figma gives it.

**Other standing rules**
- Commit asset bytes; Figma URLs expire in 7 days.
- Recolour real Titan glyphs (edit the fill) rather than authoring lookalikes.
  Authored glyphs so far: flag (Report), globe, lock, user-plus, blue tick — no
  equivalents exist in the repo.
- No new colour values or type sizes. `#d93025` is the danger red already in use.
- A class-level `display` beats the UA `[hidden]` rule — say `[hidden]{display:none}`
  explicitly.
- Popovers inside `overflow-x: auto` containers get clipped; use fixed position
  off the trigger rect (the tone menu and the row menu both do).
- A toast with a button needs `pointer-events: auto` when shown.
- Flex children need `min-width: 0` or they refuse to shrink (`.reading-pane`
  pushed the side panel off-screen).

**Design-plan rules enforced throughout:** one primary action per screen; no AI
branding on Recap surfaces; no transcript by default; recording state never
colour-alone; nothing sends without an explicit action; error copy names what
happened and gives one next action.

---

## 8. Verification

Every change is checked in real Chrome via Playwright
(`/Users/prabhat.p/.npm/_npx/e41f203b7505f1fb/node_modules/playwright`), not by
eye. Scratch test scripts live in the session scratchpad and cover: the recap
panel, dictation, the app switcher, the calendar (geometry, fading, modal), the
Recap app (all 12 notes, share, delete/undo), the live call, and the side panel.

⚠️ `test2.js` (recap panel) can no longer run — its entry point was the removed
chip. Not a regression; the AI Write coverage moved to the dictation test.

---

## 9. Open items

**Unbuilt from the P0 inventory:** W7 empty state, W9's six degraded states (the
largest remaining chunk — cheap now that the fixture drives rendering), W10
Recent calls (needs a contact panel), W11 Calls list, W12 settings.

**Needs a decision or a design**
- The orphaned recap panel: give it a new entry point, or delete it.
- Tasks tab content in the side panel is **authored** — no Figma exists for it.
- `Report` in the note row menu is odd for your own note; `Rename`/`Duplicate`
  would fit better.
- Authored glyphs should be swapped for real exports when they exist.
- `recap.html` and `live-call.html` are light-only; dark needs its own design.
- Calendar footer rows are 48px where Figma says 55px (pre-existing shell
  deviation, deliberately not changed).
- Body hint is 14px where Figma says 12px (asked for, not drift).

**Carried from the spec, still unanswered:** capture default for recurring
external meetings; EU/India retention default; whether the Smart Write tone model
is good enough for client-facing mail; who owns consent copy review.

**Git:** the whole folder is still **untracked**. Nothing has been committed.
