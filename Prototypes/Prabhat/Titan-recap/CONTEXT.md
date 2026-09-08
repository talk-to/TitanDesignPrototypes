# Titan-recap — Working Context

> **Start with [PROJECT_MEMORY.md](PROJECT_MEMORY.md)** — the consolidated reference
> (architecture, flows, decisions, conventions, open items). This file is the
> chronological build log behind it.

Running log for this prototype, so context survives across sessions.

- **Prototype:** `index.html` (mail app) → `live-call.html` (the call) → `recap.html` (the Recap app), plus `calendar.html` (Titan Calendar). Each opens in its own tab, as each is a separate surface.
- **Base:** `Prototypes/Prabhat/SmartWriteAI_Redesign` (rebased 3 Sep 2026) — which is itself the shell plus the AI Write composer work. Includes `ai_write_assets/`. Each prototype folder holds its own complete copy; no shared/linked assets.
- **Shell architecture reference:** `new_chat_context.md` (copied from the shell)
- **Build plan:** `BUILD_PLAN.md`
- **Source docs:** Titan Recap PRD + Design Plan and Build Spec + Detailed Design Specification (Web) v0.1 — shared in chat 3 Sep 2026
- **Sessions covered:** 3 Sep 2026 →
- **Git status:** folder is **untracked** — nothing committed yet

---

## 1. Setup — 3 Sep 2026

Created the project and pulled in the current `Shells/TitanEmailShell`. Confirmed the local shell matches `origin/main` (the unpulled `main` commits don't touch `Shells/TitanEmailShell`), so this is the latest shell.

Nothing built on top yet.

## 2. Planning — 3 Sep 2026

Read the Design Plan and the Web Spec, surveyed the shell, and wrote `BUILD_PLAN.md`.

**Three decisions locked:**

- **Scope:** happy path end-to-end, 12 of the 21 P0 web surfaces. W7, W9's degraded states, W10, W11, W12 deferred.
- **Calendar:** build a real week view as the trigger surface, reached from the app switcher's existing Calendar entry.
- **Capture model:** **Fork A, browser-only.** No desktop app. This deletes W2's desktop-requirement block and W9's "desktop lost" state, and adds WC1a/WC2a browser share-permission surfaces. See `BUILD_PLAN.md` §0 for the full delta against the specs as written.

**Shell gaps found:** no calendar view, no toast system, no top-chrome status area, no contact/profile panel, no dark mode. The recap panel extends the existing 316px `.side-modal` to 440px; W5 reuses `#composer-window` wholesale.

Nothing built yet. Session 1 is the hero pair — W3, W4, W5, W6.

## 3. Session 1 — hero pair built, 3 Sep 2026

Built **W3, W4, W5, W6** into `index.html` (168KB → 200KB). Entry point: the recap chip in the open thread. No design references existed for these four, so the visuals are derived from the shell's own tokens — treat them as a first pass for design review, not as settled.

**What's there**

- **W3 recap panel** — 440px, extends the `.side-modal` pattern. 72px header (avatar, contact names, `Dashboard v2 roadmap · Jun 10 · 32 min`), scrolling body, 64px footer with `Draft follow-up email` + quiet `View transcript`. Transcript expands in place below the content; never navigates away. Decisions section is omitted entirely when the array is empty.
- **W4 inline edit** — same screen, no mode toggle. Summary, decisions and step text are `contenteditable`; owner chip opens a participant menu; `+ Add` on section hover; delete on row hover; `Saved` micro-state in the footer; `RECAP.edited` flips on first change.
- **W6 recap chip** — sits between the Jun 9 stack and the Jun 12 expanded message, its real chronological position. Left rule, no card, lighter and smaller than a message. Gains a `Follow-up sent` line once the draft is sent.
- **W5 follow-up draft** — reuses `#composer-window`. Recipient chips, `Sending as a reply in this thread`, derived subject, body under 150 words, collapsed `From your call notes` reference strip, `Adjust tone` (Shorter / Warmer / More formal) at the far end of the format bar. Regeneration warning appears in the tone menu only when the body has been hand-edited. Send is the shell's own button; nothing sends without it.

**Architecture as planned:** one `RECAP` fixture drives every surface, one `STRINGS` table holds all copy, `track()` logs the analytics events (`recap_opened`, `recap_edited`, `recap_transcript_viewed`, `followup_drafted`, `followup_tone_changed`, `followup_sent`, `followup_sent_without_edits`). The capture simulator is Session 3 work and is not built yet.

**Corrections and findings from the build**

- **Spec correction to the plan:** W3's footer carries the primary action *plus* a quiet `View transcript` link. `BUILD_PLAN.md` originally said primary-only; fixed there too.
- **Owner attribution leads the row rather than trailing it.** Trailing put the chip mid-sentence whenever a step wrapped to two lines ("...by Friday (draft `Sarah` first)"). Leading also gives a scannable You / You / Sarah column. Deviation from the obvious reading of the spec, made for legibility — worth a look in review.
- **Eng-relevant:** `.comp-format-bar` has `overflow-x: auto`, so any popover anchored inside it is clipped and unclickable. The tone menu had to become `position: fixed`, positioned from the button rect — same approach the owner menu uses.
- **The reference strip is capped at 116px.** The composer is a fixed 640px; with the 132px body floor, 116px is the exact remaining budget. Anything larger pushes the Send bar out of the window. Real constraint for whoever builds this.

**Verified in Chrome** (Playwright, 1600×950): chip → panel → edit a step → change owner → add a step → expand transcript → draft → expand reference strip → change tone → send → chip shows `Follow-up sent`. No console errors. The shell's plain `New email` composer is unaffected — chips, context line, reference strip and tone control are all torn down on send.

Still uncommitted.

## 4. Composer rebased on SmartWriteAI_Redesign — 3 Sep 2026

Pulled the composer work across from `SmartWriteAI_Redesign`. Rather than cherry-picking ~7,400 changed lines, **SmartWrite's `index.html` became the new base** and the Session 1 Recap work was re-applied on top. `ai_write_assets/` (28 files) and `assets/help-filled.svg` copied over; all other asset folders were already byte-identical. File is now ~9,000 lines.

**What came across:** AI Write in the composer *and* the reply surfaces (the single relocatable instance with its `HOSTS` map), the prompt/refine bar, Tone / Length / language menus, the paywall flow and upgrade modal, the `data-tip` tooltip system, the formatting-bar toggle, and dark mode.

### W5 now routes tone through AI Write, and my bespoke control is gone

SmartWrite's refine bar already has **Tone** (Professional / Casual / Friendly) and **Length** (Long / Short) pills — the same job as the `Adjust tone` control built in Session 1. Two mechanisms for one task in a single composer, and W5's spec says "reuse, do not reinvent", so the bespoke one was deleted (CSS, markup and handlers). Recap's new-component count drops from 7 to 6.

**The hazard this exposed:** `pickOption()` → `generate(label)` overwrites the body with `DRAFTS[label]`, AI Write's canned design-workshop email. Left alone, picking "Casual" on a recap follow-up would have destroyed the recap draft and replaced it with unrelated copy.

Two hooks resolve it, both small and both leaving AI Write's own flows untouched:

- **`window.recapDraftFor(key)`** — `generate()` consults it before reaching for `DRAFTS`. It returns recap copy while a follow-up draft is live and `null` otherwise, so AI Write's own generations are unaffected. Verified both ways.
- **`window.aiwAdoptDraft()`** — the recap follow-up arrives *already written*, so AI Write opens in its post-generation state: refine bar showing, pills live, `Describe your change` placeholder. No credit is spent, because nothing was generated. It also resets tone/length/language, since without that a new draft inherited a previous session's `Short`/`ES` while displaying English prose.

Recap draft copy is now keyed to AI Write's own labels (`Professional`, `Casual`, `Friendly`, `Long`, `Short`) plus authored **ES / FR / PT** bodies so every menu option lands somewhere — the same principle SmartWrite applied to its own menus. The translations are written out in full rather than derived; the fixture holds English only.

**Dropped:** the "you've edited this draft, changing tone will rewrite it" warning. AI Write's undo/redo already covers that loss, and a warning on top of working undo is friction.

### Other findings

- **Pre-existing bug, fixed:** the recap panel's close button used `composer_assets/ic-close.svg`, which is `fill="white"` — built for the composer's dark header and **invisible on the panel's white one** since Session 1. Now uses `settings_sidebar_assets/close.svg` (`#888888`), the same asset the settings drawer uses.
- **Dark mode:** 38 `body.dark .recap*` rules added for the panel, chip, reference strip and recipient chips, using the ported palette (`#333` panel, `#1f1f20` sunken, `#4a4a4a` rules, `#f2f2f2` / `#bdbdbd` / `#6f6f6f` text, `#3b3b3b` hover). No new values. Header icons follow the shell's `brightness(1.15)` convention rather than inverting, which darkened these greys instead of lifting them.
- **Reference strip** now mounts above `.comp-body-area` (the new wrapper holding the body *and* the AI Write bar) instead of directly above `#comp-body`.

**Verified in Chrome, both themes:** recap flow; draft → refine bar docked with pills live; Professional / Short / Español each refining the *recap* draft with no workshop-email leak; undo; reference strip open with the Send bar and AI Write bar both still visible; send; AI Write's own prompt→generate flow still producing its own draft; reply-surface docking and `discardReply()` teardown; and the recap flow still working after a reply session. No console errors.

Still uncommitted.

## 5. Smart Write trimmed to one flow, Recap app built from Figma — 3 Sep 2026

### Smart Write: one flow only

- Prototype-controls widget (bottom-left) **removed** — markup, CSS, and the `aiwSetFlow` / `aiwSetApproach` / `aiwSetCredits` setters and `renderNote()` that only existed to drive it.
- `S.approach` locked to **2** (pills keep their category name — `Tone` / `Length` / `EN`; menus have no header and no checkmark) and `S.flow` stays **happy** (no credits chip, no banner, no nudge, no upgrade modal).
- The paywall markup, CSS and assets are still in the file but are now **unreachable** — nothing can set `flow` to `paywall`. Left in place rather than deleted speculatively; say the word and it goes.

### App switcher: Recap tile

Figma node `5127:12576`. Compared the shell's existing switcher against it — the shell was already built from this same design (same asset filenames, same 268px panel, same rows). **The only delta was position 8: `Site` → `Recap`.** So the switcher was not rebuilt; the one tile was swapped, with `app_switcher_assets/grid_icons/recap.svg` downloaded from the design (Figma draws Tasks and Recap as a 30px glyph inside the 40px tile, unlike the component-based tiles that fill it — hence `.app-icon-recap`).

Clicking Recap calls `openRecapApp()` → `window.open('recap.html', '_blank')`, so it opens in a real browser tab, matching the design's own framing (the Figma shows a second browser tab at `app.titan.email/recap`).

### The Recap app — `recap.html`

Figma node `5143:22300`, built as a **separate document** because it genuinely opens in a new tab; a single-file prototype cannot do that honestly. 12 assets committed to `recap_app_assets/` rather than referencing the 7-day Figma URLs.

Geometry verified against the design at 1440×900: nav 68px, notes list 740px at x=136, overview card 400px at x=904 (28px gutter), rows 52px, search 400px, card `#eff5ff` / radius 8 / padding 24, mention `#7a5dc7`.

- **Nav bar** (`5143:22470`): `#1d2133`, tab-switch pill with the Recap mark and caret, partner logo, `Recap`, Feedback / Help, account switcher (`admin@kicknrun.xyz`), Powered by Titan.
- **Toolbar** (`5143:22527`): `My Notes` 28px semibold, `New note` primary, 400px search — search filters the list live.
- **Notes list** (`5143:22318`): 12 rows with the Figma's titles, dates and sizes.
- **Overview card** (`5143:22463`): **follows hover** — hovering any row swaps the card and moves the active row highlight, defaulting to the first note as in the design. Click also selects, so it survives the pointer leaving.

Two deliberate departures from the Figma frame, both because it is a presentation artboard rather than UI: the **mock browser bar is not redrawn** (the real tab supplies that chrome; the page just sets `<title>Titan Recap</title>` and the Recap favicon), and the nav's right edge **is not clipped** the way the 1440px artboard clips `Powered by TITAN`.

### Findings

- **Bug caught in test:** `openRecapApp()` was first inserted inside the `initAppSwitcher` IIFE, so the tile's inline `onclick` could not reach it — clicking Recap threw. Now exposed as `window.openRecapApp` from inside that scope, where `closeAppSwitcher()` is visible.
- **Bug caught in review:** both nav carets export at their true glyph size (8.1×4.8 and 10×5) and carry `preserveAspectRatio="none"`. Sizing them to fill their 16px/24px Figma boxes stretched them into a giant white chevron and triangle. They are now sized to the glyph and centred in the box. **Worth remembering for any future Figma icon import in this repo.**
- **Authored content:** only the first note's overview is specified in Figma. The other 11 are authored, following the same shape.
- `recap.html` is **light-only** — the Figma is the light variant, and a new tab does not inherit `body.dark`. A dark Recap app needs its own design.

Still uncommitted.

## 6. Note detail screen + Tasks interaction — 3 Sep 2026

Figma node `5150:24824`, built into `recap.html` as a second view (`#viewList` / `#viewDetail`) rather than a third file — it is the same app at the same URL.

**Reached by** clicking the `Partner Logo SVG Sizing Issue` row, or `Open Note` on its overview card. Back button returns to the list. `document.title` follows the open note.

**Matches the design** (verified at 1440×900): back button at x=88 hanging 48px left of the 136px body gutter, title at x=142, tabs 740px at x=136 with a 1px `#dedede` rule, action card 400px at x=904, 28px gutter. Card is white on `#dedede` at radius 12 with a `0 4px 10px rgba(0,0,0,0.04)` shadow. Six action items in five owner groups, each preceded by a rule, exactly as Figma groups them.

**Tabs.** `Summary` is verbatim from the design — five sections, Speaker names bolded, 14px/1.6. The other two are **not in the Figma**, so their content is authored against the summary's facts:

- **My thoughts** — the user's own jotting, `contenteditable` so it behaves like a real notes field. Four short paragraphs that read as opinion, not summary.
- **Transcript** — 16 speaker turns with timestamps, consistent with everything the summary asserts (1641×1641 view box, seven apps, missing QA creds for names.it.all, 30px light/dark SVGs, Alex on links, Rina/Shweta on partner info, the max-width guard, top-10 cred coverage expiring every 3–6 months).

### Action items → Tasks

Clicking a row sends it to Tasks: the box ticks, the text greys, and a bottom-centre toast says **`Added to tasks`**. `Add all to Tasks` adds every pending item at once (`N action items added to tasks`) and then disables itself.

**Design gap worth knowing:** Figma's two card variants at `904,271` are *not* unchecked/checked. `ic-check.svg`'s path is `M4 9H14M9 4V14` — **a plus, not a tick**. So the resting checkbox carries a grey `+` (the add affordance, which is what the screenshot shows), and **there is no checked state in the design**. The ticked state is therefore authored: filled `#2170f4`, white tick drawn in CSS rather than exported, since fabricating an asset file would imply a design that does not exist. Worth confirming with the designer.

**Adding is idempotent** — a second click neither duplicates the task nor re-toasts, and added rows carry `aria-disabled`. Nothing in the ask required this; it prevents a demo from silently creating six copies of the same task.

**`TASKS` is an in-memory array.** There is no Tasks surface in this prototype for items to land in, so that array is the destination. It persists across list/detail navigation within the tab.

**Other notes are not built out.** Clicking any other row (or its `Open Note`) shows `This note isn't built out in this prototype yet` rather than opening an empty shell or inventing content.

**Verified in Chrome:** open from row and from `Open Note`; geometry against Figma; all three tabs; My thoughts accepts typing; single add (toast + tick + `TASKS` length 1); second click adds nothing; add-all reaching 6 of 6 with the button disabling; back navigation; other-note guard; and the list view, hover overview and search all still working. No console errors, no missing assets.

Still uncommitted.

## 7. Content for all 12 notes + row overflow menu — 3 Sep 2026

### Every note now opens with real content

`DETAIL` (one note) became **`NOTE_DETAILS`, keyed 0–11**, and the "this note isn't built out" guard is gone. Each note carries a Summary, My thoughts, Transcript and action items, written to its own title:

| # | Note | Summary | Thoughts | Turns | Actions |
|---|---|---|---|---|---|
| 0 | Partner Logo SVG Sizing Issue | 5 | 4 | 16 | 6 |
| 1 | AI Labeling Feature Rollout | 4 | 3 | 15 | 4 |
| 2 | HTML Design Review Dark Mode Fixes | 3 | 3 | 13 | 4 |
| 3 | Wispr Upgrade Button UI | 3 | 2 | 9 | 3 |
| 4 | Untitled | 1 | 1 | 4 | **0** |
| 5 | AI Prompt Bar UI Design | 3 | 2 | 12 | 3 |
| 6 | Info Icon for Policy Update | 3 | 2 | 9 | 3 |
| 7 | Ultra Plan Copy Review | 3 | 2 | 10 | 3 |
| 8 | Untitled | 2 | 2 | 6 | 1 |
| 9 | Custom GPT Integration Flow | 3 | 2 | 10 | 3 |
| 10 | Tasks Retro | 3 | 2 | 12 | 3 |
| 11 | Untitled | 1 | 1 | 4 | **0** |

Only note 0 is from Figma. The rest is authored, and **each note's content matches the overview text already written on its card** — no contradictions between the list and the detail.

The three `Untitled` notes deliberately stay thin, because their card overviews already said so: note 4 is a short agenda-less call (nothing decided, **no action items**), note 8 started capturing four minutes late (its transcript opens mid-sentence and its one action item is to get the missing minutes from Priya), note 11 is a standup. That gives the prototype the partial and empty states for free rather than making twelve identical notes.

**Empty action-items state** — authored, since the design has none: `No action items in this note.` with `Add all to Tasks` disabled, rather than an empty card.

### Row overflow menu

The `⋯` on each row now opens a menu matching the reference: rounded 12px card, icon + label rows, `Copy link` / `Share` / `Report` / `Delete` with Delete in `#d93025` (already the prototype's danger red — no new value). Fixed-position at the document root so a row can never clip it, right-aligned to the button, and **flips above the button when there is no room below** (verified on the last row). Closes on outside click or Escape, and does not open the note.

- **Copy link** copies `app.titan.email/recap/notes/N` → `Link copied`
- **Share** → `Sharing is not built out in this prototype` (honest rather than a fake success)
- **Report** → `Reported`
- **Delete** removes the row and offers **Undo** in the toast for 6 seconds — the design plan's state matrix asks for "confirmation, undo window" here, not a blocking confirm dialog. Undo restores the note to its original position.

**Icons:** `Copy link`, `Share` and `Delete` are real Titan glyphs recoloured (geometry untouched — `#2170F4`→`#333333`, and the composer's trash to `#d93025`). **The flag for `Report` is authored** — there is no flag glyph anywhere in this repo. Swap in a real export when one exists.

### Two bugs found and fixed while testing

- **`NOTE_DETAILS` keyed by index was wrong.** Deleting a note left every note after it showing the previous note's content. Details now hang off the note objects (`n.detail`), and `TASKS` entries store the note object rather than its index, so delete and undo can't misalign anything. Verified explicitly: after deleting a note, opening the row below shows its own summary.
- **The toast had `pointer-events: none`**, which made the new Undo button unclickable — for real users, not just the test. `.toast.show` now takes pointer events.

**Task state is per note** — adding an item on one note does not mark it on another. Verified.

### Worth raising

`Report` on your own meeting note is odd — you would report content someone shared with you, not your own recording. It is implemented as asked, but `Rename` or `Duplicate` would fit this surface better.

Still uncommitted.

## 8. Share modal — 3 Sep 2026

Built from the five reference states, in **Titan's design language rather than the reference's**: `#2170f4` primary Share button (the reference uses a neutral dark one), `#dedede` / `#ebebeb` rules, 4px controls on an 8px surface, `#f4f4f7` chips and hovers, SF Pro type. Overlay is `rgba(0,0,0,0.45)`.

**Opens from both Share entry points** — the row overflow menu (which previously only toasted "not built out") and the detail screen's Share button.

### States, matching the reference

1. **Rest** — `Share notes`, recipient field with `Search people or emails`, Share disabled, owner row, link-access row with `Copy link`.
2. **Typing** — a suggestion list appears. An address not in the directory offers `Add <email>` with a person-plus icon; a name resolves against a small directory drawn from the notes themselves (Alex, Rina, Shweta, Pam, Dwight, Angela, Oscar, Kevin, Jim, Priya), since the placeholder promises "people **or** emails".
3. **Access dropdown** — `Anyone with the link` / `Only people invited`, tick on the current one, globe and lock icons, and the trigger takes a blue outline while open (the reference outlines it dark).
4. **Chip** — picked recipients become chips with an initial avatar and an ×.
5. **Shared** — invitees become rows reading `Invite pending` with role `Viewer` and an × to revoke. Field clears, Share disables, toast confirms.

**Copy differs by access setting:** `Can view summary. Invite for transcript access.` for link access; `Only the people you invite can open this note.` for invited-only (authored — the reference only shows the first).

### Behaviour

- **Share is live as soon as a valid address is typed**, before it becomes a chip — matching reference state 2, where the button is already dark. Pressing Share sweeps up a typed-but-unchipped address.
- **Guards:** the owner cannot be invited, an already-invited person is not offered again, and a person already sitting as a chip is not offered twice. All three verified.
- **Keyboard:** ↑/↓ through suggestions, Enter to add (or to share when the field is empty and chips exist), Backspace on an empty field removes the last chip.
- **Escape unwinds one layer at a time** — suggestion list, then access menu, then the modal. Scrim click also closes; clicks inside do not.
- **State is per note**, stored on the note object as `note.share = { access, people }`, so each note keeps its own recipients and link setting. Verified: invites on note 0 do not appear on note 3, and note 0's `Only people invited` setting survives navigating away and back.
- Multiple chips share in one action (`2 invites sent`).

### Notes

- **Owner row uses the app's signed-in account** — `Prabhat (you)` / `admin@kicknrun.xyz`, the address in the Recap nav bar. The reference screenshot shows a personal Gmail address; using the app's own identity keeps the prototype internally consistent.
- **Four glyphs are authored** — globe, lock, user-plus and the blue tick. No globe, lock or user-plus exists anywhere in this repo. They are drawn to the existing lucide spec exactly (18px box, 1.5px stroke, round caps, `#333333`), so they sit with the Figma-exported set. The caret is Titan's real `composer_assets/ic-caret.svg`. Swap in real exports when they exist.
- **`hideSuggest()` now clears the list DOM**, not just the open class, so no stale suggestions linger behind a closed dropdown.

**Verified in Chrome:** all five states; typed-address enabling; typed-address commit; the three duplicate guards; keyboard add and backspace; Escape layering; scrim click; per-note isolation; revoke; copy link; and both entry points. No console errors, no missing assets. Regression across the mail app, the notes list, all 12 note details, the row menu and delete/undo all still pass.

Still uncommitted.

## 9. App switcher drawer fixes — 3 Sep 2026

### Footer was spilling out of the painted box

The drawer, its background and its content each carried a hardcoded height that no longer matched the content: `.app-switcher-dropdown` was `587px`, `.app-switcher-content` was pinned `absolute` at `height: 568px` with `padding: 8px 0 1px`, and `.app-switcher-footer` was `96px`. The real content needed 614px, so the last footer row ended **19px below the drawer box and 2px past the painted background** — which is why the "See more @ Titan Labs" icon and text looked like they were escaping.

Fixed by letting the content set the height instead of fighting it:

- `.app-switcher-dropdown` — fixed `height` removed
- `.app-switcher-content` — now `position: relative`, no fixed height, `padding: 27px 0 8px` (19px clears the notch at the top of the painted shape, 8px keeps the last row off the bottom edge)
- `.app-switcher-bg` — fixed `298 × 605` removed so the insets alone size it, and the painted shape grows with the content
- `.app-switcher-footer` — fixed `96px` removed

Measured after: drawer 614px, last footer row ends 8px inside the box, in **both themes** and at 720px viewport height as well as 950px.

Left alone deliberately: the footer rows are 48px, where Figma `5127:12889` specifies 55px. That is a pre-existing shell deviation, not part of this bug, so it was not silently changed.

### Tab-switch state while the drawer is open

The report was that the trigger "stays in hover state" while the drawer is open. Measuring it showed the opposite — `#333333` only while the pointer was physically on the button, clearing the moment it moved into the drawer. The shell's `initAppSwitcher` was already adding and removing an `.active` class on the trigger, but **no rule ever styled it**.

Confirmed the intent and styled `.active` to match hover, so the trigger stays lit for exactly as long as the drawer is open and drops back when it closes:

```
.tab-switch:hover, .tab-switch.active            { background: #333333; }
body.dark .tab-switch:hover, .tab-switch.active  { background: #4a4a4a; }
```

Verified in both themes: transparent when closed, lit while open regardless of pointer position, transparent again after close, with the class correctly removed.

Still uncommitted.

## 10. End-to-end journey: dictate → meeting → call → notes — 4 Sep 2026

The journey now runs across three files, each a real tab because each is a separate surface.

### 1. Dictate in the composer — `index.html`

From Figma `5150:24057`. Two things were added, both matching the design:

- **`Dictate` chip** in the features row (`5150:24213`) — 24px mic, `Dictate` at 14px `#333`, same chip geometry as its neighbours. Lights blue when active.
- **Body hint** (`5150:24230`) — `|Start typing or Dictate (fn + Ctrl)` at 12px, `#666` with the action in `#2170f4`. Shown only while the body is untouched, and it is a real button.

**A problem the Figma solved for us:** with `Dictate` added, the shell's seven chips overflowed the row and clipped the new chip by 9px — the one chip this journey depends on. Figma's own row keeps five chips visible and puts the rest behind a `⋮` at the end (`5150:24217`), so `Invoices` and `Groups` moved into that overflow. The row no longer scrolls. Measured: `scrollWidth` 658 → 649 against a 649px row.

**The dictation itself** is simulated — no speech recognition. Text streams in word by word with the tail word greyed (`.dict-interim`) until the next lands, so it reads as being transcribed rather than pasted. A `Listening` strip sits above the body with a pulsing dot, a waveform and `Stop`. Dictation writes the **body**; the recipient is seeded when it starts (dictation does not address an email) and the subject is derived on completion.

### 2. Meeting set up

Sending the dictated mail opens a card: `Discovery call — Northwind Logistics · Thursday, 10 Sep · 4:00–4:45 pm · Zoom`, carrying **C1 from the design plan** — `Take notes on this call`, **off by default**, with the sub-label switching to "Attendees will see a note in the invite" when armed. Arming it is what makes **WC1**, the pre-call prompt, appear: `Ready to take notes on Discovery call` / `Join call` / `Not this time`. So two surfaces the build plan had scheduled for Session 3 now exist, driven by this journey rather than built speculatively.

### 3. The call — `live-call.html`

Interactions follow `live-transcription.html`; **every Titan surface is restyled to the prototype's tokens** — `#2170f4` primary, `#333`/`#888` text, `#dedede`/`#ebebeb` rules, 4px controls on 8px surfaces, `#f9f9fa` wells. The Zoom window behind is deliberately **not** Titan-styled: it is another product, recreated in CSS as a backdrop.

Ported and working: pre-call nudge with its 10s countdown, sidebar slide-in, traffic lights (close and minimise both go to the pill, maximise widens), minimised pill with a live waveform, transcript feed with greyed partial lines, per-speaker colours (`#2170f4` / `#0e8f7e` / `#7a5dc7`), timestamps, running timer, pause/resume, collapse, `My thoughts` with Enter-to-commit and editable rows, notes dock/undock, both resizers, gear menu with 18 languages, kebab menu with two toggles, and the browser speech-synthesis voice-over with a mute toggle.

**Two fixes to the reference's behaviour:**

- **The top fade mask washed out the first line** whenever the feed was not scrolled — it only makes sense as a scroll effect. Now applied via a `.scrolled` class once `scrollTop > 4`.
- **With no installed voices, `onend` never fires**, so every line waited on the 3–8s guard timeout and the call crawled. Now falls back to timer pacing unless a real voice exists.

Also dropped the Recap app mark from the `My thoughts` header — the product mark is an identity, not a list bullet.

### 4. Notes page — `recap.html?from=call`

`Done` (or `Leave`) ends the call and opens the notes page in a new tab, **carrying the real duration and whatever the user typed in My thoughts** via the query string. The note is prepended to the list and its detail opens directly, with:

- **Summary** — three sections written from the call
- **Transcript** — the same 24 turns the user just watched being captured
- **My thoughts** — exactly what they typed during the call, or an honest "You did not add any thoughts during this call."
- **Action items** — four, in three owner groups

The hand-off is a URL rather than storage because `file://` origins cannot be relied on for `localStorage`; it also means the typed notes genuinely survive the transition rather than being faked.

**Verified in Chrome, end to end:** Dictate chip and hint against the Figma spec, dictation streaming and completing, send → meeting card, capture off by default → arm → pre-call prompt, `Join call` opening `live-call.html`, the call's transcript/notes/pause/pill/menus/dock, `Done` opening `recap.html` with duration and thoughts in the URL, and the notes page showing all four surfaces with the note first in a 13-note list. No console errors, no missing assets. Every earlier flow — recap panel, AI Write, Approach 2, app switcher, share modal, note details, delete/undo — still passes.

Still uncommitted.

## 11. Titan Calendar — 4 Sep 2026

`calendar.html`, built from the two screenshots, opened by the **Calendar** tile in the app switcher (`openCalendarApp()` → new tab, same pattern as Recap). Tokens come from the mail shell so the two apps read as one product: `#1c1c1c` sidebar, `#2170f4` primary, `#333`/`#888` text, `#e8eaed` rules.

**Sidebar** — app-switch tile with the calendar icon, Titan logo, mini month (September 2026, today boxed, adjacent-month days greyed, ‹ › stepping), `Accounts (3)`, the account select, six calendars with their own coloured checkboxes (blue / orange / green / amber / pink / red), `Add calendar`, and the Bug / Feature footer from the shell. Verified the mini grid against the real calendar: first row `30 31 1 2 3 4 5`, last row `27 28 29 30 1 2 3`.

**Top bar** — `New Event`, `Today`, ‹ ›, the range label, gear, `Week ▾`, `Help`.

**Grid** — 52px per hour, 24 rows, scrolled to 9 AM on open. **Two timezone gutters**: the grid is anchored to the account's timezone (Asia/Calcutta) and the left gutter is Asia/Dubai, 1h30 behind — which is why its labels read `:30`. Verified: row 10 shows `7:30 AM` against `9 AM`. Today's column carries the blue top border and the `#f5f9ff` tint, and the red now-line renders **only** in that column, following the real clock and refreshing every 30s.

**Today is pinned to Fri 4 Sep 2026** so the week matches the screenshots and the rest of the prototype's fixtures; only the now-line's position tracks the live clock.

**Events** are per-calendar coloured, outlined by default, filled for `Busy`. Two layout rules came out of comparing against the screenshots:

- **A day-long block must not squeeze the whole day.** First pass let the 11:00–21:00 Hackathon block join the overlap cluster, which compressed every afternoon event on Wednesday into 1/6 of the column. Those blocks now take their own 22% lane down the left and are excluded from the clustering, so the rest of the day lays out among itself — 15.6% each for the five-way 1 PM cluster, matching the reference's proportions.
- **Times only where they earn the room** — shown on hour-plus events only, and never on a `Busy` block, which carries no detail. That matches the screenshots, where `Busy` and the 30-minute stand-ups show a title alone.

**Interactions:** week stepping, `Today`, mini-month stepping, clicking a mini date jumps that week, toggling a calendar off removes its events (verified 32 → 23), and clicking an event opens a popover with its title, time, calendar — and **the Recap capture toggle (C1)**, off by default, so a call can be armed from the calendar as well as from the post-send card. Escape or an outside click closes it.

**Verified in Chrome at 1512×950:** opens from the switcher in a new tab; chrome, gutters and headers against the screenshots; event geometry (9:15 event at 481px = 9.25 × 52; the 10-hour block at 518px); overlap widths; now-line confined to today; all the navigation and toggles. No console errors, no missing assets. Every earlier flow still passes.

Still uncommitted.

## 12. Calendar revisions — 4 Sep 2026

Five changes to `calendar.html`:

1. **Second timezone gutter removed.** The grid now runs in one timezone, `Asia/Calcutta GMT+05:30`, and the grid template dropped from two gutter columns to one. The `TZ_OFFSET_MIN` constant and the Dubai labels are gone entirely — no dead code left behind.
2. **Now marker pinned to 2:00 pm** on today's column, matching the screenshot: red 2px line with the dot on the left edge. It is a fixed `NOW_MIN` rather than the live clock, so the screen is the same every time it is opened; the 30-second interval that used to move it was removed.
3. **Past events render faded** (`.ev.past`, `opacity: .42`, lifting to `.7` on hover). "Past" is measured against Fri 4 at 2:00 pm, so it covers whole earlier days *and* today's finished events. Verified: 27 events on Sun–Thu all faded; today's `Stand up 12:45–13:15` faded; today's `Ignite 2026 12:00–19:30`, `Ignite 2026 — floor` and `Sync 17:00` at full colour; Saturday's event at full colour.
   **One judgment call:** the two Ignite blocks *started* before 2 pm but run until 7:30 pm, so they are treated as **not** past — an in-progress event has not happened yet. Fading them would have said the opposite.
4. **The sidebar tile now opens the app switcher** rather than jumping straight to mail. It is the same component as the mail app's — same markup, CSS and assets — so the two are identical rather than a lookalike. `Mail` and `Recap` open in new tabs, `Calendar` is marked as the current app in blue and just closes the panel, and the tile stays lit while it is open (the `.active` rule the mail app was missing until §9). Outside click and Escape both close it.
5. **Identities match the mail app**: account select and first calendar are `ella@avontech.com` (the composer's From), with `sajal@`, `ninad@`, `shreya@`, `david@avontech.com` and `Ella Test` replacing the titan.email names. The `Anjali & prabhat.titan 1:1` event became `Ninad & Ella 1:1`. No `titan.email` string remains in the sidebar.

**Verified in Chrome at 1512×950:** one gutter reading `9 AM` on row 10; the marker at 728px (14 × 52) in the Fri column only; the past/future split across all 32 events; the switcher opening from the tile with Mail and Recap both launching; the renamed identities; and every earlier calendar behaviour still working — event geometry (481px, 518px), overlap widths, calendar toggling (32 → 23), week and month navigation, and the event popover with its capture toggle. No console errors, no missing assets. All other apps unaffected.

Still uncommitted.

## 13. Calendar: checkmarks, names, past-event modal — 4 Sep 2026

**Checkmarks fixed.** The tick was two rotated pseudo-elements positioned by hand, which sat low and left in the box. It is now a centred SVG polyline inside a flex-centred box, so it stays true at any size. Measured: 0.0px offset from the box centre on both axes for all six, every tick fully inside its box.

**Names are Office characters**, Ella kept: `ella@avontech.com`, `jim@`, `Ella Test`, `dwight@`, `pam@`, `michael@avontech.com`. The `Ninad & Ella 1:1` event became `Dwight & Ella 1:1`. These are the same people as the share directory in `recap.html`, so the two apps agree.

**Past events open the full detail modal** (Figma `5148:10225`); upcoming ones keep the light popover with the capture toggle. That split is the right one — a finished event has notes to read, an upcoming one has nothing yet but can be armed.

The modal carries, in Figma's order: title and close, the **Titan Recap card** on `#f5f8fe` with the mark, the summary and `View notes ↗`, then date / time / repeat, location, the Zoom link with Meeting ID and Passcode, and a collapsible guest list with roles — closing with `Delete` / `Edit` / `Going` (split button with its caret). Scrim click and Escape both dismiss it, and Escape prefers the modal over the popover.

**`View notes` opens `recap.html` in a new tab**, since the notes live in the Recap app.

**The blurb is per event, not one generic sentence.** Figma's copy is a placeholder ("The conversation covered the main agenda points…"), so each event gets an opening line about that actual meeting, with the Figma sentence kept as the fallback for anything unmapped. A `Busy` block says plainly that there is nothing to write up.

**The icon-stretching trap caught us again** — worth remembering, this is the third time. Several of these exports carry their own intrinsic size plus `preserveAspectRatio="none"`: the chevron is 11.2 × 6.6, the guests glyph 16 × 10.2, the clock 16 × 16, the recap mark 14.1 × 14.1 — while location and conference genuinely are 24 × 24. Forcing them all into a 24px box stretched the chevron into a thin arch. Each now renders at its own size, centred in the box Figma gives it. **Always check `width`/`height` on a Figma SVG before sizing it.**

**Verified in Chrome:** tick centring; the renamed calendars and account; a past event opening the modal while an upcoming one opens the popover; every field and the guest collapse; `View notes` opening `recap.html`; Escape and scrim dismissal; and all the earlier calendar behaviour — single gutter, marker at 728px, past/future fading, event geometry, overlap widths, calendar toggling, navigation, and the app switcher. No console errors, no missing assets. Other apps unaffected.

Still uncommitted.

## 14. Meeting notes, Saturday events, composer tidy-up — 4 Sep 2026

### `View notes` opens that meeting's own note

It was landing on the notes list. It now passes the event through — `recap.html?note=<title>&date=…&when=…&dur=…` — and `intakeFromCalendar()` builds that meeting's detail page in the same Summary / Transcript / My thoughts shape as every other note, prepends it to the list and opens it directly.

**Eight meetings have full write-ups** (Ignite 2026, Hackathon — build week, Design review, Demo - Prj-Text Editor, Titan onboarding, Dwight & Ella 1:1, Team catch-up, Northwind Logistics — scope walkthrough): grouped summary sections, 7–10 transcript turns, authored thoughts and action items.

**Ten short meetings get honestly thin notes** (stand-ups, Design sync, Daily triage, Sync, Weekly wrap, `(No Title)`, `Busy`) — one line of what was captured, no transcript, and the empty action-items state. Padding a stand-up into a full write-up would have been the wrong kind of thorough.

Anything not in either list still opens, falling back to the Figma placeholder line rather than inventing a summary.

**Bug found by probing rather than assuming:** the first pass silently failed with `esc is not defined` — that helper exists in `index.html` and `calendar.html` but never existed in `recap.html`. The page loaded, the detail just never opened. Added a local `esc()`.

### Saturday now has meetings

Seven events added to Sat 5 Sep: `Ignite 2026 — closing` (on two calendars), `Northwind Logistics — scope walkthrough`, `Busy`, `Interface audit kick-off` (two calendars), `Pam & Ella 1:1`, `Weekly wrap`. All render at full colour, since tomorrow is in the future.

### Mail app

- **In-thread recap chip removed.** ⚠️ It was the only entry point to `openRecap()`, so the **W3 recap panel, W4 inline edit and the W5 follow-up draft are now unreachable from the mail app**. The code is intact and `renderChip()` guards on a missing element, so nothing throws — but that chain needs a new entry point if it is still wanted. The Recap app covers the same ground now.
- **Body hint 12px → 14px** (Figma specified 12px; 14px was asked for, so it is a deliberate departure — noted here so it does not read as drift).
- **Invoices back in the feature row.** Order is now Track / Design / AI Write / Templates / Dictate / Invoices, with only Groups behind the `⋮`. Measured: `scrollWidth` 649 against a 649px row, so nothing scrolls and Dictate stays in view.
- **Finishing dictation puts Smart Write into edit mode.** There is a draft on screen, so the bar switches from `Try writing with AI - describe your email` to the refine bar — `Describe your change` with the Tone / Length / language pills and undo/redo live. It reuses `aiwAdoptDraft()`, the same hook the recap follow-up uses, so the two arrive at one state rather than two.

**Verified in Chrome:** chip gone with the thread intact; the feature row not scrolling; the 14px hint; dictation ending in the refine bar; `View notes` opening the right note with its own summary, 9 transcript turns and thoughts; a thin meeting showing one line and the empty action state; a `Busy` block opening coherently; the plain notes list still loading 12 rows; Saturday's events all future-coloured. Every other flow still passes. No console errors, no missing assets.

Still uncommitted.

## 15. Meeting card, toolbar icons, Calendar/Tasks side panel — 4 Sep 2026

### Meeting card rebuilt (Figma `5229:16208`)

442px wide, led by the notes illustration (exported as one SVG rather than the 20+ vector fragments Figma offers), then the calendar icon with `Discovery call - Northwind Logistics` at 18px bold, the date line, a rule, and `Take notes on this call` / `Titan will summarise the call afterwards` with a 46×24 toggle. Still off by default (C1).

### Toolbar icons (Figma `5205:4962`)

Three became five: Read Receipts, **the drawer** (new), an action icon (new), Settings, Help — all real exports from that file, replacing the older assets.

### Calendar / Tasks side panel (Figma `10969:118440` and siblings)

The drawer icon opens a 285px panel inside the content area. Built from the four Figma states:

- **Calendar tab** — month label with day stepping, a week strip with the selected day highlighted, `GMT +05:30`, and a 24-hour day grid at 48px/hour with events, overlap splitting and the blue now-line. Same day model as `calendar.html` (today is Fri 4 Sep 2026, "now" is 2pm), so past and upcoming agree across the two apps.
- **Past event → Recap-led detail** (`10969:122238`): the Titan Recap card with the meeting's own blurb and `View notes ↗`, then date, meeting link, location and guests, footed by `Delete / Edit / Going`. `View notes` opens that meeting's own note in the Recap app, via the same query the calendar uses.
- **Upcoming event → booking detail** (`10969:120230`): no Recap card — there is nothing to read yet — and a `Cancel / Reschedule / Email guest` footer.
- **Create event** (`10969:119271`): title with a colour picker, date, from/to times, invitees, meeting link, description, calendar, and two reminders, footed by `Advanced options` and `Create event`. Creating one adds it to the day and re-renders.
- **Tasks tab** — grouped Today / This week / Later with tickable rows. ⚠️ **Authored**: none of the five Figma frames shows the Tasks tab's contents, so its content and layout are mine, in Titan's language. Worth replacing when a design exists.

**Bug found and fixed:** `.reading-pane` had no `min-width`, so flex refused to shrink it and the new panel was pushed off the right edge entirely. It only showed up once something else competed for the row.

### Note on test coverage

`test2.js` — the suite that drove the W3 recap panel — can no longer run, because its entry point was the in-thread chip removed in §14. That is expected, not a regression; the AI Write refine-bar behaviour it also covered is now exercised by the dictation test. The recap panel itself remains unreachable from the mail app.

**Verified in Chrome:** five toolbar icons all loading; the panel opening to 285px with the reading pane shrinking to fit; events, overlap and the now-line; a past event showing the Recap card and `View notes` opening the right note; an upcoming event showing the booking footer; the create form adding an event; the Tasks tab ticking; the panel closing; and the new meeting card at 442px with its illustration. No console errors, no missing assets. The calendar app, Recap app and dictation journey all still pass.

Still uncommitted.

---

## Session 16 — Toolbar icons re-exported, side panel rebuilt to Figma `10969:118440`

### Toolbar icons

The five icons were sized by a blanket `max-width/max-height: 20px` with `width: auto`, which is exactly the trap this project keeps hitting: the Figma exports all carry `preserveAspectRatio="none"` plus their own intrinsic box, so `auto` renders them at whatever size the file happens to declare. Re-exported all five from `10969:118584` and sized each one explicitly:

| Icon | Export | Rendered |
|---|---|---|
| Read receipts | bare glyph | 18 × 13.905 |
| Calendar and Tasks (drawer) | bare glyph | 16 × 15.712 |
| Add to Titan | 40px tile, padding baked in | 40 × 40 |
| Settings | bare glyph | 16 × 16 |
| Help | 40px tile, padding baked in | 40 × 40 |

Figma is inconsistent here — three export as bare glyphs and two as full 40px tiles — so there is no single rule to apply. The `.toolbar-icon-help { 14px }` override written in an earlier session is gone; it was compensating for the same mis-sizing.

### Side panel

- **It now overlays the webmail** instead of displacing it. `.content-area` is the positioning parent; the panel is `position: absolute; right: 0` at 286px and slides in on `transform`. The reading pane keeps its width (measured: 747px with the panel both open and closed), matching the reference screenshot where the action bar's "Mark unre…" disappears *behind* the panel.
- **Geometry matched to Figma**: header 16px sides with the blue rule 8px below the label and the selected label in `#333` (not blue — Figma marks selection with the rule alone); month row 12/12/6 with the label in `#2170f4` and the four controls grouped 4px / 12px apart; week strip of seven 40px columns, 12px weekday over a 28 × 24 date pill; 48px gutter and 48px hour rows, event column 238px.
- **Now-marker width fixed.** It was `left: 48px` *inside* `.sp-events`, which is itself already inset 48px — so it started 96px in and stopped 8px short. Now `left: 0; right: 0` within that container: 238px, flush to both edges of the event column, with Figma's 6.32px dot.
- **Event tiles** follow Figma's amber tile (`#f5a623` bar / `#fff3ca` fill / `#714c0c` ink): a 3px leading bar, tinted fill, and label ink drawn from the same hue. Each calendar gained an `ink` tone.
- `September 2026` → `Sep 2026`.
- Prev, next, open-in-calendar and new-event now use the real exports (`sp-prev`, `sp-next`, `sp-newwindow`, `sp-calendar`) in 24px boxes, each sized to its own glyph.

**Bug found and fixed:** `.sp-sheet` was an absolute child of `.sp-grid`, a scroll container — so the event detail and create form scrolled away with the hour rows and appeared blank once the grid had been scrolled. The sheet is now a sibling inside a new `.sp-body` wrapper, with `z-index: 10` to sit above the now-marker. This was pre-existing and only surfaced because the grid now auto-scrolls to the working day.

**Verified in Chrome** at 1440 × 900: all five toolbar glyphs at their Figma sizes, light and dark; the panel overlaying without reflowing the reading pane; panel 286px, event column 238px, now-line 238px flush; the past-event detail, upcoming-event detail, create form and Tasks tab all rendering. No console errors.

Still uncommitted.

---

## Session 17 — Tooltips unclipped, detail sheet matched to Figma, grid rules, click-to-create

### Tooltips

The toolbar tooltips were a `.tt::after` at `z-index: 400`, but `.main-area` is `overflow: hidden`, so they were clipped at the toolbar's bottom edge — a stacking order can't escape a clip. Replaced with a single `#ttip` element on `<body>`, `position: fixed`, positioned from the button's viewport rect on hover. All five read correctly now, and it works for any `.tt[data-tip]` anywhere in the shell.

### Past-event detail (Figma `10969:122381` / `10969:122389`)

Rebuilt against the design rather than approximated. What was wrong and is now right:

- **Guests were expanded inline.** Figma collapses them to the count with a chevron on the right; the avatar list is behind it. Added the toggle.
- **The calendar row was missing entirely** — Figma's last row names the calendar the event sits on ("Marina Agueryo"). `SP_CALS` gained `who`/`mail`, so an event now names its own owner and draws its guest list from it.
- **Hand-drawn SVGs replaced by the real exports**: clock, video, location, guests, calendar, chevron, the Recap mark and the external-link glyph. Each sized to its own box (24×23 for the clock, 16×10.182 for guests, 11.304×6.585 for the chevron) — same trap as always.
- **Type and spacing**: rows 18px apart, 12px inset; title 20px semibold; card `#f5f8fe` at radius 6 with a 16px heading and 14px/1.3 body; date 14px `#333` over 13px `#888`; guests 14px `#4a4a4a` over 12px `#7f7f7f`; Delete is `#888` (it read as a primary action before), buttons 36px.

Why there was a gap in the first place: the earlier pass built this sheet from the panel-level metadata, which gives frame boxes but not fills, type or colour. Pulling `get_design_context` on the body frame gives all three — that is the call that makes it exact, and it is what I should have done then.

### Grid rules

Figma runs a vertical rule down the gutter's edge for the full height of the day; ours had only horizontals, which is what made the grid look unfinished. Added it as a `border-left` on `.sp-row-cell` (stacking the cells gives it full height without another element), closed the timezone cell with its own rule, and moved the event layer 1px clear of it.

### Click an empty slot to create

Clicking anywhere in the grid opens the create sheet prefilled with that half-hour — the click Y maps to minutes, snapped down to :00 or :30, with a 30-minute default. Event clicks `stopPropagation()` so they still open the detail instead. `Create event` now lands on the chosen slot rather than the hardcoded 11:00.

**Verified in Chrome:** all five tooltips rendering unclipped below the toolbar; the detail sheet against the Figma render, guests collapsing and expanding; the vertical rule; a click at 3:30 PM prefilling `3:30 PM → 4:00 PM` and creating the event in the right band. All four pages load with no console errors and no missing assets, light and dark.

**Fixed along the way:** the Figma calendar export paints a solid white 24×24 base behind its glyph — invisible on Figma's canvas, a white block in dark mode. Stripped it; the outline reads on both.

Still uncommitted.

---

## Session 18 — Create-event form rebuilt to Figma `10969:121339`, as a modal

### It is a modal, not an in-panel sheet

Figma dims everything behind the create form, including the panel's own tabs and month row. An absolutely-positioned box inside the panel can never cover them, so the sheet now goes `position: fixed`, anchored to the panel's live rect from just under the month row to the panel's bottom, over a `.sp-scrim` at 45% black.

**The trap:** `.side-panel` is `position: absolute; z-index: 60`, which makes it a stacking context — a descendant at `z-index: 3000` is still resolved *inside* 60 and painted under a scrim at 2900. The first attempt dimmed the modal along with everything else. The sheet is now moved to `<body>` while modal and put back into `.sp-body` on close; the scrim lives on `<body>` for the same reason. The detail sheet is unchanged — it stays in the panel with no scrim, which is what its Figma frame shows.

### Icons

Every icon in the form was hand-drawn and none matched. Replaced with the ten real exports (clock, add-guests, conference, description, calendar, email reminder, alarm, the colour dot and both dropdown carets), each sized to its own box: 24×23 for the clock, 15.983×15.027 for the mail reminder, 25.067×24 for the wide caret.

**Fixed a mistake I made in the previous session:** I stripped a `<rect width="24" height="24" fill="white"/>` from `cf-alarm.svg` on the assumption it was a painted background, as it had been in `ev-calendar.svg`. It was the `<clipPath>`'s own region, inside `<defs>` — removing it clipped the entire icon away and the alarm row rendered blank. The rule is now: only strip a white rect that is a *rendered* element; one inside `<defs>` is geometry.

### Form and CTAs

Rows 20px apart on a 12px inset with a 24px icon column and a 12px gutter; 36px fields at radius 4 with `#dedede` borders and 14px text; the title row carries Figma's 1px × 28 caret rule before the placeholder, with the colour picker beside it; both reminders sit in 178px fields rather than spanning the width; the description field is 34px.

CTA widths were inconsistent because `.sp-btn` applied one padding to all three. Now to Figma: quiet buttons `8px` all round, outlined and primary `8px 20px` at radius 5, all 36px tall (`box-sizing: border-box` — without it the outlined Edit came out 2px taller than its neighbours). The create footer is `Advanced options` as a plain link opposite a `10px 12px` radius-4 `Create event`. `.sp-link-btn` had no rule at all and was rendering with the UA's default button border.

**Verified in Chrome:** the modal above its scrim with the panel dimmed behind; all ten icons rendering; detail CTAs at 60/68/80 × 36 against Figma's 61/67/81; the full lifecycle — click a slot at 4 PM, prefill `4:00 PM → 4:30 PM`, create, sheet returns to the panel, scrim hides, event lands in the right band. All four pages clean, light and dark.

Still uncommitted.

### Session 18b — three corrections

- **Scrim confined to the sidebar.** It was `inset: 0` over the whole window; it is now sized to the panel's rect in `spSheetModal` (measured 1154, 64, 286 × 836 — exactly the panel), so the webmail behind stays live while the panel's own tabs and month row dim behind the modal.
- **Two carets in the title field.** Figma draws the text cursor as a 1px × 28 rule, and I had built it as an element — so with a real `<input>` behind it the focused field showed two. Removed; the input's own caret is the one Figma was depicting.
- **Meeting link fills itself on click.** The field starts `readonly` so the click always lands on the handler rather than placing a cursor, drops in `https://us04web.zoom.us/j/73437400003`, then becomes editable.

---

## Session 19 — Toast, upcoming-event detail (Figma `10976:123572`), more past meetings

### Toast lives in the panel

`Event created` now appears at the bottom of the sidebar, not the window — dark `#3c4043` with Figma's green check, a dismiss ×, and a 4s auto-hide. Anchored inside the panel (measured 1167, 840, 261 × 44 within a panel at 1154, 64, 286 × 836), because it confirms something that happened in the sidebar and should not read as app-wide.

### Upcoming detail rebuilt

The two detail states share the head and diverge after the location row, so the tail is now built per state rather than from one shared block:

| | Past (`10969:122389`) | Upcoming (`10976:123572`) |
|---|---|---|
| Recap card | yes | no |
| Guests | collapsed behind the chevron | **expanded**, each with the account-circle + green check badge, name over role |
| Tail row | the calendar it sat on | **Booked by / Guest Timezone / Note** |
| CTAs | Delete / Edit / Going | Cancel / Reschedule (96) / Email guest (96) |

Guest rows now carry Figma's `Going` avatar — 16px gap, 14px `#333` name over a 12px `#888` role. The booking block is 11px between groups, 14px `#4a4a4a` label over 12px lines. `Email guest` was being clipped because all three buttons sized from their padding; Reschedule and Email guest are now pinned at Figma's 96px.

**Note on the `Going` icon:** its node export drags in the whole ancestor chain (a `#F5F5F5` canvas rect, a 1440×900 `#FBFBFB` page, two panel rects) — the same failure as the back-arrow export in session 17. Composed instead from its four exported vector layers at their own Figma insets: person 20×20 at 8.33%, badge oval 9×9 and check 8×8 in the bottom-right quadrant. The path data is verbatim; only the placement is mine.

### Past-detail polish

The room link now carries its passcode and clamps to two lines with an ellipsis, as Figma shows it, and the CTA row is inset 12px like every other row in the sheet.

### More meetings on the day

Four past meetings added to Fri 4 Sep between 7am and 1pm — Northwind weekly check-in (7:00), Design review — invoice flow (8:00), Jim & Ella 1:1 (9:30), Ignite dry run (10:30) — across three calendars, each with its own Recap blurb so the detail sheet reads properly for all of them.

**Verified in Chrome:** the toast inside the panel; the upcoming detail against the Figma render, guests expanded with badges and the booking block; the past detail still collapsed with its Recap card; all four new events faded as past and opening their own detail. All four pages clean, light and dark, no missing assets.

Still uncommitted.

### Session 19b — the scrim belongs to every sheet, not just create

I had read `Rectangle 26217` (286 × 757, sitting between the day grid and the sheet in each frame) as the panel's border and skipped it. It is the scrim: `get_design_context` on `10969:122380` returns `bg-[rgba(0,0,0,0.4)]`. It is present in the past-detail frame, the upcoming frame and the create frame alike — dimming the panel is part of the sheet pattern, not something specific to the create form.

So all three sheet states now go modal over the dimmed panel. They differ only in where the top edge sits, which is the one thing the frames genuinely disagree on:

- **create** — top at the month row's bottom, covering the week strip (Figma y=110)
- **detail**, past and upcoming — top 4px under the date pills, so the week strip's own bottom padding sits behind the sheet (Figma y=148; ours lands at 154 from the panel top, our week strip being marginally taller)

Scrim corrected from my invented `0.45` to Figma's `0.4`. The footer's `space-between` moved from `.modal` to a new `.create` class, so a detail sheet keeps its right-aligned CTAs.

**Verified:** detail — scrim 1154, 64, 286 × 836 (the whole panel), sheet at y=218; create — sheet at y=162; both on `<body>`, both returning to `.sp-body` with the scrim hidden on close, and the toast still firing after a create.

**Lesson for this file:** a bare `<rounded-rectangle>` sibling in the frame metadata is worth a `get_design_context` call before dismissing it — the metadata gives no fill, so "border" and "scrim" look identical there. That is the second time metadata alone has cost a round trip on this panel.

---

## Session 20 — The journey re-stitched through the calendar side panel

The meeting used to be created *by* the card that appeared after sending: its capture toggle raised the pre-call prompt directly, and no event ever existed anywhere the user could see. The flow now runs through the side panel.

**Dictate → send → add to calendar → create → join → Zoom**

1. Dictate and send. The dictated mail already proposed the call — "forty-five minutes this Thursday at 4pm… I'll send an invite across with a Zoom link" — so nothing in the copy needed to change.
2. The meeting card (Figma `5229:16208`) keeps its illustration and the C1 capture toggle, but its headline is now `You proposed Thursday, 10 Sep` and it carries a primary **Add to calendar**. It hands the meeting on rather than being the meeting.
3. `meetAddToCalendar()` opens the panel, moves it to Thu 10 Sep 2026 — the day the mail proposed — and pre-fills the create form: title, 4:00–4:45 PM, `priya.raman@northwind.co`, the Zoom room. The user still presses Create event themselves.
4. Saving it lands the event in the day, fires the in-panel toast, and then raises WC1, the pre-call prompt. `SP.journeyEvent` is what separates this event from an ad-hoc one, so creating any other event just toasts and stops.
5. `Join call` → `live-call.html`, and everything downstream is unchanged.

Two adjustments the stitch needed: the pre-call prompt now shifts to `right: 322px` when the panel is open, since at 380px wide it otherwise lands on top of the sidebar; and the pre-filled title is scrolled home, because a value longer than the 190px field otherwise shows its tail.

**Verified end to end in one Chrome run:** composer opens, dictation streams, send raises the card, `Add to calendar` opens the panel on Sep 2026 with all five fields pre-filled, `Create event` puts `Discovery call — Northwind Logistics` in the day, the toast fires, the pre-call prompt follows, and `Join call` opens `live-call.html`. No console errors, no missing assets, and the sheet/scrim states from session 19b still behave.

Still uncommitted.

### Session 20b — meeting card removed, call joined from the event

- **Meeting card gone** (Figma `5229:16208`) — markup, styles and `closeMeetCard` / `toggleCapture` / `meetAddToCalendar` all removed. Sending a dictated mail now just clears the composer. The `SP.journeyEvent` flag went with it, so every created event behaves the same.
- **Detail footer gap 12px → 4px.** Note this is a deliberate departure from Figma `10969:122441`, which specifies 12; the 4px comes from the shipped CSS.
- **The Zoom link joins the call.** Clicking `.sp-room` in either detail state closes the sheet, arms capture and opens `live-call.html` — this is now the only way into the call from the mail app.

⚠️ **WC1, the pre-call prompt, is orphaned.** Its markup and `joinCall()` are still there (the room link calls `joinCall()`), but nothing opens the prompt any more — the meeting card's capture toggle was its only trigger. It is the second orphaned surface in this file, alongside the W3 recap panel. Left in place rather than deleted so it can be re-hooked.

**Verified:** card absent on load and after send; dictate → send clean; create an event in the panel, open it, footer gap computed 4px with buttons 62/96/96, click the Zoom link → sheet closes and `live-call.html` opens. All four pages clean, light and dark.

---

## Session 21 — Nudge redesigned (Figma `10979:124400`), call audio fixed

### Nudge

Moved from bottom-**left** to bottom-right (`right: 20px`, clear of the Zoom control bar) and rebuilt to the Figma frame: 342px, white, radius 4, 20px padding, 16px between blocks; a 20px mark in a 22px box beside a 16px semibold title over 14px/1.3 `#666` body; actions indented 32px so they line up under the copy. `Not now` is now an **outlined** button (`#2170f4` border and label), not a ghost. The countdown is a 4px bar along the card's bottom edge, `#d9d9d9` track with a `#2170f4` fill — previously a 3px bar inside the padding. Copy follows Figma: *"Add Titan Recap to this call"*.

### Audio

Three separate problems, all fixed:

**Voice selection was the cause of the bad audio.** `getVoices()` returns novelty voices first on macOS, and the old code took `pool[0..2]` off the top of the list — which is Albert, Bad News and Bells. Voices are now scored by name against the good general-purpose set (Samantha, Alex, Daniel, Karen, Moira, the Google and Microsoft voices), novelty voices are rejected outright by pattern, non-English is excluded and local voices are preferred (remote ones stall on first use and never fire `onboundary`). Against a stubbed macOS voice list the picker now returns **Samantha / Alex / Daniel** for the three speakers.

**The transcript did not match the audio.** The line was committed in `speak()`'s completion callback, so you heard a whole sentence while the screen showed a frozen four-word partial, then the full line snapped in. `speak()` now drives the reveal: a timer paces it from the utterance's own rate (~14 chars/sec ÷ rate) and `onboundary`, where the voice fires it, snaps the cursor to the true word — including the word being spoken, not just the ones before it. The muted path runs the same reveal on a timer, so the behaviour is identical with the sound off.

**Pace.** Rates 0.97–1.05 → 1.12–1.18, and the beat between turns 600–1000ms → 260–480ms. The `onend` guard was `max(3000, len × 95)`, far longer than any line takes; it is now derived from the same chars-per-second estimate plus 1.6s.

**Verified in Chrome:** nudge at 1078, 664, 342 × 132 — right edge 20px off a 1440px viewport — with both buttons 36px tall and the timer 342 × 4; the partial growing 8 → 14 → 20 → 24 → 30 characters across successive frames as the line is spoken. Voice scoring tested against a stubbed 22-voice macOS list. All four pages clean.

Still uncommitted.

### Session 21b — transcript panel to 380px and restyled in Titan's language

**Width** 460 → **380** (min 340, max 720; maximised 720 → 560, which is proportionate at the new base).

**What was un-Titan about it, and what changed:**

- **macOS traffic lights.** Three coloured discs in a centred title bar — a second OS window sitting on Zoom. Replaced with the brand on the left and three `.ibtn` icon buttons (minimise, maximise, close) on the right, on a 44px bar.
- **A card inside a card.** The transcript sat in a `#f9f9fa` well with its own 1px border and 8px radius, inside a white 8px-radius panel. Flattened to a section on rules, the way Titan separates regions.
- **Run-on transcript lines.** `Speaker 1  00:03  Thanks for making time…` as one paragraph wrapped the name away from its words at 380px. A turn is now a header row — an 18px initial chip in the speaker's colour, the name, and the timestamp pushed right — over the text, indented 24px to the chip's edge. `TRANSCRIPT` became a 12px uppercase section label rather than a 14px heading competing with the meeting title.
- **Tokens.** Timestamps `#b3b3b8` → `#888888`; `Done` pinned to Titan's 32px control height (it had inherited the nudge's larger Figma padding when I restyled `.btn-primary` earlier in the session).

**Two bugs found while testing the states:**

- Collapsing left the card at full height with a dead gap under the transcript. The v-resizer writes an inline `flex-basis`, which outranks `.tcard.collapsed { flex: 0 0 auto }`. The basis is now parked in a data attribute while collapsed and restored on expand.
- The 26px top fade mask ate most of the 96px collapsed box, washing the visible line out. Mask off when collapsed.

**Verified:** 380 default / 560 maximised / minimise → pill → restore / collapse → expand, all clean; transcript streaming with the new line structure. All four pages clean.

Still uncommitted.

---

## Session 22 — Recap app relaid out, and Draft a reply wired into the mail app

Figma `oBXib6lvrsw0E0ZMlNAPA4`: list `5185:30595`, detail `5185:31003`.

### Notes list

The column geometry already matched (740px list, 400px card, 28px apart, 24px card padding), so the changes were the toolbar:

- **Search before New note**, not after.
- Search **400px → 250px**, and the toolbar constrained to the list column (`#viewList .page-toolbar { width: 742px }`) — it was spanning the full page, which put the search box out over the card column.
- Toolbar gap 28 → 16.

### Note detail

`Copy` is gone; the actions are now **Share** (outlined, 18px `lucide/share-2`) and **Draft a reply** (primary `#2170f4`, radius 5, 16px `lucide/reply`, 10/16/18 padding), 16px apart — Figma `5185:31205`.

### Draft a reply → the mail app

Clicking it opens `index.html?draftReply=…` in a new tab carrying the note's title, when, overview and its first four action items (HTML stripped from all of them — the overview holds `<span class="mention">` markup). The mail app's `intakeDraftReply()` re-titles the open thread, sets the recipient and `Re:` subject, opens the reply composer and writes the response from the meeting itself: thanks with the day, the summary, then the agreed items as bullets.

**`aiwAdoptDraft()` had `S.host = 'composer'` hardcoded**, so adopting a draft in the reply moved AI Write's shell into the composer and the reply's own bar went dead. It now takes a host name, defaulting to `'composer'` — every existing call is unaffected, and the reply passes `'reply'`. The refine bar (Describe your change / Tone / Length / EN / undo / thumbs) now hosts in the reply box, which is the correct post-generation state for a draft that arrived already written.

**Verified end to end in Chrome:** open a note → Draft a reply → the mail app opens with the thread re-titled `Partner Logo SVG Sizing Issue`, subject `Re: …`, recipient Priya Raman, and a body carrying the summary and four bullets; AI Write's refine bar present inside `#reply-box-card`. Both Recap pages checked against the Figma renders. All four pages clean, and the calendar/side-panel and live-call states from sessions 19–21 still pass.

Still uncommitted.

### Session 22b — Recap alignment measured against Figma, share modal copy

Measured every element against the Figma frames rather than reading the guides by eye. Every **x** already matched (content 136, back button 88, title 142, right column 904, list 740, card 400); two things did not:

- **The note card started level with the first row, not the toolbar.** Figma puts the card at y=195 — the same line as `My Notes` — while the list starts at 271. The toolbar and list are now a `.list-col`, with the card as the second column of `.page-body`, so the card's top lines up with the toolbar. This is what the horizontal guide running right from the toolbar was marking.
- **The detail actions were right-aligned to the page edge (x=1053) instead of starting on the card's left edge.** Figma has Share at 905 and Draft a reply at 1017. `.detail-actions` is now 400px wide like the card beside it, which puts Share at 904 and Draft a reply at 1017 exactly.

Two 2px corrections fell out of the measurements: `.list-col` is 740 not 742 (Figma's toolbar frame is 742 but its rows are 740, and the card's 28px gap is measured off the rows), and Share's left padding is 14 not 12 — that 2px is what put Draft a reply at 1017.

Controls were also coming out 42px tall against Figma's 40 — `.search-notes` and `.btn-outline` were sizing content-box despite the global `* { box-sizing: border-box }`, because they set `width`/`padding` without a height. Both are now pinned to 40.

**Share modal:** owner renamed Prabhat → Ella (the `ME` fixture, so it follows through to the chips and suggestions), and `Invite for transcript access.` dropped from the access hint in both the markup and the `setAccess` copy table.

**Verified:** list card at 904/116 level with the toolbar; detail Share 904 and Draft a reply 1017, both 40 tall; share modal reading `Ella (you)` / `Can view summary.`; the Draft-a-reply hand-off still lands its draft in the mail app. All four pages clean.

---

## Session 23 — Tasks tab built to Figma `10981:127738`

The Tasks tab was authored back in session 15 because no design existed. It does now, so it has been rebuilt.

**The design draws the panel at 334px; the sidebar stays 286px** — everything else is to spec, so the text column is 234px instead of 282 and titles and descriptions wrap sooner. The two-line clamp on the description holds either way.

### Toolbar (`10981:125235`)

`+ Add a task` in 15px medium `#2170f4` on the left, open-in-new and a kebab on the right, 16/12 padding on a `#dedede` rule.

### The four row states

| State | Background | Padding | What changes |
|---|---|---|---|
| Default (`125245`) | white | 14/12 | title 15px medium, description 14px clamped to two lines, one due-date chip |
| Hover (`124507`) | `#f0f0f0` | 14/12 | — |
| Selected (`124485`) | `#f4f8ff` | 16/12 | chip borders darken to `#b1b1b1`, a mail chip appears, and a trash sits at the row's right |
| Edit (`124467`) | `#e6efff` | 16/12 | `Title` / `Add details` placeholders, and a `Today` chip beside a calendar-picker chip |

Chips are Titan pills: white, 1px edge, 100px radius, 6/10 padding, a 12px glyph and 14px label.

### Interactions

- **Add a task** opens the edit row at the top of the list; Enter or ⇧-less Enter in either field commits, Escape discards, and an empty title just closes it. A committed task lands at the top and toasts.
- **Clicking a row** opens it (selected); clicking it again closes it. Only one row is open at a time.
- **The checkbox** is separate from the row click — `stopPropagation`, so ticking never also opens the row. Done rows strike through and grey out.
- **The trash** appears only on the open row and deletes with a toast.

**The Figma trash icon is an empty vector** — `lucide/trash-2` (`10981:124505`) has a `<g id="Vector">` with no geometry, and both the layer export and the node export come back hollow. Substituted the composer's own delete glyph (`composer_assets/figma-ic-delete.svg`, 13.394 × 16), which is a real Titan export and reads correctly at this size. Worth fixing in the design file.

`Open Tasks` and the kebab are drawn but inert — there is no Tasks app to open and no menu in the design.

**Verified in Chrome:** panel still 286px, toolbar 57px against Figma's 56, rows 129 against 128; add → task at the top with a toast; tick → struck through; select → trash → delete. Light and dark, no console errors, no missing assets, and the calendar tab and every other surface still pass.

Still uncommitted.

---

## Session 24 — Call recap pill in the thread (Figma `5143:22710` / `5143:22913`)

A recap chip was removed from the thread back in session 14. This is its replacement, and it is a different component: `Call_Recap_V2_Frosted_Pill` — a full-width frosted panel, not the old inline chip.

`rgba(33,112,244,0.05)` on a `rgba(33,112,244,0.17)` edge at radius 4, 14/22 padding, a 30px Recap mark in a 34px box (4px down, so it meets the heading's cap height), then the heading in 14px semibold `#2170f4` and the body in 15px regular `#333`, 6px apart.

### Where it appears

- **After a call.** The call runs in its own tab, so the mail app cannot be told directly. It watches for coming back to the front — `visibilitychange` *and* `focus`, since a tab switch fires the first and a window switch only fires the second — and shows the pill if `MEETING.joined` is set. Guarded by `MEETING.recapShown` so it lands once.
- **Above the reply**, when a draft is written from that note. `intakeDraftReply()` calls the same `showRecapPill()` with the note's own title, day and overview, so the pill and the draft below it say the same thing. The pill is a sibling immediately before `#reply-box-card` in the thread, which puts it above the reply in both cases.

### Clicking it

Opens `recap.html?note=…&when=…&dur=…` in a new tab — the same query `spViewNotes()` already uses from the calendar, so the Recap app's existing `intakeFromCalendar()` picks it up with no new intake.

The heading composes from whatever it is given: `Call recap • Thu 10 Sep • 45 min` after a call, `Call recap • Friday` from a note that carries no duration.

**Verified in Chrome:** the pill above the reply on the draft path with the note's own copy, positioned before `#reply-box-card` in document order; the pill appearing after a call once the window regains focus; clicking it opening `recap.html?note=Partner+Logo+SVG+Sizing+Issue&when=Friday`. Light and dark. All four pages clean, and the Tasks tab, side panel, calendar and Recap pages all still pass.

Still uncommitted.

---

## Session 25 — Names, the upcoming-event modal, and Titan Drive

### Names

The shell's senders were Indian names; they are now Marcus Webb, Claire Dubois, Nadia Kovač and Theo. `ishantp@titan.email` in the reply's From became `ella@avontech.com`, the reply recipient became Marcus Webb, and the calendar's `ishantp` calendar id became `michael` — it already displayed as `michael@avontech.com`, so the id was the last trace.

### Upcoming events open the dialog (Figma `5239:36082`)

Both states now use the same modal; before, only past events did and upcoming ones got a light popover. They differ only in the block under the title:

- **past** → the Titan Recap card with `View notes`
- **upcoming** → **C1, the capture toggle**

⚠️ Figma's upcoming frame has no capture toggle. I kept it because the light popover was its only home in the calendar, and dropping it would have orphaned a P0 surface. It sits in the same slot the Recap card occupies, which reads as the same question — what Titan does with this call. Worth confirming.

The guest tally also differs: `3 going, 1 awaiting response` on a finished event, Figma's `1 going, 1 not going, 1 maybe, 1 awaiting response` on an upcoming one.

### Titan Drive (`drive.html`)

Built from the supplied Drive shell, with two deliberate changes:

- **The mock browser bar is dropped.** The real tab supplies that chrome, and every other app here does the same — it is a standing convention in this project, recorded in PROJECT_MEMORY.
- **Icons live in `drive_assets/`** rather than 25 inline data URIs, so the file stays readable. The 23 glyphs were decoded out of the shell unchanged.

Three of them were multi-layer in the original and are composed here from their own layers at the shell's inset values: the audio glyph (page + speaker), doc and pdf. For doc and pdf I kept the page and its folded corner and dropped the inner decoration — at 20px in a list row it is not legible, and the colour plus the fold is what identifies the type.

Beyond the shell: rows render from a `FILES` fixture so the two folders stay in step, clicking a recording opens a small player, and the one this journey produced (`Northwind Logistics — Discovery Call.mp3`) is tinted and offers `Open notes` back into Recap.

### Get audio

`Get audio` sits under `Share` in a note's overflow menu and opens `drive.html?folder=recordings`, landing straight on the folder rather than at the Drive root.

**Verified in Chrome:** no Indian names left anywhere in the shell; an upcoming event opening the dialog with the capture row and no Recap card, a past one with the Recap card and no capture row; `Get audio` opening `drive.html?folder=recordings`; Drive landing on the folder with all eight recordings, and the player opening on a click. All five pages clean, no missing assets.

Still uncommitted.

### Session 25b — capture toggle removed, dictation owns the composer

- **The capture toggle is out of the calendar's upcoming-event modal**, so that modal now matches Figma `5239:36082` exactly. Its markup, styles and handler are gone.
  ⚠️ **C1 is now unreachable from the calendar.** `armed[]` and the toast copy are still there, but nothing sets them — the meeting card that used to carry the toggle was removed in session 20b, and this was its last home. It is the third orphaned surface, after WC1 and the W3 recap panel.
- **Dictation takes the composer's surface while it runs.** `aiwHide()` puts the prompt bar away without touching its state; `stopDictate()` hands the surface back in whatever state the body warrants — the refine bar if anything was said, the resting prompt if the body is empty (Escape or a stop before the first word).

That restore moved out of `dictateStep`'s completion branch and into `stopDictate`, so a manual stop mid-dictation gets the refine bar too, not just a run that finishes.

**Verified in Chrome:** composer open → bar visible at 59px in its prompt state; dictating → bar 0px, listening strip up; stopped → bar back at 59px reading `Describe your change`. The upcoming modal opens with no capture row and the past one still leads with its Recap card. All five pages clean.

---

## Session 26 — Tab-switch bug, panel close button, note timestamps

### The Calendar → Tasks → Calendar break

`.sp-tasks { display: flex }` outranks the UA's `[hidden] { display: none }`, so once the Tasks pane had been shown, `hidden` could never put it away again. Going back to Calendar rendered the grid *and* left the task list underneath it, squashing the day.

**This is the third time this exact trap has bitten this project** — `.dict-bar` in session 12, `.sp-guest-list` guarded pre-emptively in 19, and now `.sp-tasks`. The rule: any element toggled with `hidden` that also carries a `display` needs its own `[hidden] { display: none }`.

Both panes now hide the same way — `hidden` on each, with a guard rule for each — rather than `display` on one and `hidden` on the other, which is what let them disagree.

### Close button

24px close in the header, right-aligned (Figma `5242:36260`), calling `toggleSidePanel()`. Measured 24 × 24, 15px off the panel's right edge; Figma's own frame puts it at 12 inside a `pr-16` header, so its absolute placement overlaps its padding — 15 sits between the two.

### Note timestamps

Every row read `455 KB` — a file size on what is a record of a call. The column now carries the capture time (`5:01 pm`, `2:18 pm`, …), and the fixture's `size` field was renamed `time` so it reads honestly. The card beside the list already said `Friday • 5:01 pm`, so the first row now agrees with it.

**Verified in Chrome:** calendar → tasks → calendar → tasks → calendar, exactly one pane visible at every step; the close button closing the panel; no `455 KB` anywhere in the Recap app. All five pages clean.

Still uncommitted.

---

## Session 27 — Composer hint caret, and recording a note from the Recap app

### The caret in the composer hint

`Start typing or Dictate` carried a drawn `|` in front of it — a cursor sitting in a field nobody had clicked. Removed, with its light and dark rules; the real caret appears where it belongs, when the body is clicked.

### New note records

`New note` opens the recording panel — the same 380px surface as the call sidebar, but with nothing attached to it:

- **The title starts empty and takes focus.** It is a `contenteditable` line with an `Untitled note` placeholder, not a label, because on a note taken outside a call there is no meeting to name it after.
- **The transcript streams** from a 12-line fixture, revealed a few characters at a time with the partial line greyed and a caret, matching how the call sidebar reads.
- **Pause** stops the clock, the wave and the stream, and swaps to a play glyph. **Close** abandons the capture.
- **My thoughts** takes typed notes on Enter, as it does in the call.
- **Done** turns what was captured into a note: a summary with *What was discussed*, *Next Steps* and *Decisions Made*, the transcript as recorded, the thoughts that were typed, and three action items. The note goes to the top of the list and its detail page opens.

Everything is built inside `recap.html` rather than reusing `live-call.html`, which carries the Zoom backdrop — wrong furniture for a note with no call behind it.

**Verified in Chrome:** panel opening with an empty, focused title; four lines streamed in the first six seconds with the timer at 00:06; a typed thought landing under My thoughts; Done closing the panel, putting `Migration status check` at the top of the list, and opening its detail with all three summary headings, three action items, the thought on the My thoughts tab and the transcript on its own. All five pages clean.

Still uncommitted.

### Session 27b — icons

- **Get audio** in the note row menu was the full-colour green audio *file* glyph copied from Drive, among four monochrome line icons. Replaced with the speaker vector lifted out of that same Drive export, recoloured to `#333333` and boxed to its own glyph at 18 × 17.54 — a real export, not a redraw. It is a **filled** speaker, so it reads heavier than the lucide line icons beside it; the only speaker vector in the project is that one. Swappable in one file if a line-weight export turns up.
- **Dictate** in the composer now uses Figma's own mic (`5246:36477`, `5150:24057`), 11.381 × 16.523. It is taller than it is wide, so it needs its own rule — the row's generic `max-width/max-height: 18px` with `width: auto` would have let it render at whatever the file declared.

Note for later: Figma orders that row `… Templates · Invoices · Dictate`; ours reads `… Templates · Dictate · Invoices`. Not changed — the ask was the icon.

---

## Session 28 — The panel closes after a call, and the recap pill lives in Sent

- **Coming back from a call closes the side panel.** It was open because that is where the Zoom link was clicked; once the call is over it has nothing to say, so `recapAfterCall()` closes it before raising the pill.
- **The recap pill only ever appears in a Sent thread.** It was landing in whatever thread happened to be open, which was an inbox one. A recap hangs off the mail that set the call up, and that mail is in Sent.

The shell has no folder switching — the nav items are static markup — so raising the pill now moves the view instead: Sent takes the nav selection, and the open thread becomes the sent mail. `To: Priya Raman` in the list, `Ella Henderson → To: Priya Raman` on the message, and the subject the mail was sent under.

Relabelling alone would have left inbox copy sitting under Ella's name, so the body is replaced too — with `DICTATION` verbatim on the after-call path, since that is literally the mail that was sent, and a short line referencing the meeting on the draft-reply path.

**Verified in Chrome:** open the panel, join a call, come back — panel closed, Sent selected, thread reading `Discovery call — Thursday 4pm?` from Ella to Priya with the dictated mail as its body and the pill beneath it. The draft-reply path lands in Sent the same way. All five pages clean.

Still uncommitted.

---

## Session 29 — The Recap tab gets the app switcher

`.nav-tab-switch` in the Recap app was decoration: a chevron next to the mic mark that did nothing, so Recap was a dead end — you could reach it from Mail but not leave it.

The switcher already exists in `index.html`, so it moved across rather than being rebuilt: 293 lines of CSS and 144 of markup, verbatim, plus a trimmed IIFE for toggle / click-outside / Escape. Only the anchor changed — `top: 60px; left: 12px`, under this app's dark top nav rather than the mail app's — and the tile handlers, which point at where you'd be going *from* Recap: Mail → `openMailApp()`, Calendar → `openCalendarApp()`, Drive → `openDriveApp()`, each a new tab. Recap's own tile just closes the sheet, since you are already there.

Wiring Drive turned up that the **mail app's** switcher had no Drive handler either — that tile predates `drive.html`, which only arrived in session 26. Added there too.

Contacts, Bookings, Backup, Tasks, Site and Admin stay inert in both switchers. Those apps don't exist in this prototype; making them look clickable would be a lie about the build.

**Verified in Chrome:** closed at rest, opens on click, nine tiles, the four real ones open `index.html` / `calendar.html` / `drive.html`, Recap closes it. Full sweep across all five pages plus `drive.html` — no console errors, no missing assets, tooltips and dark mode unchanged.

Still uncommitted.

---

## Session 30 — Action items reach the mail app's Tasks list

**Tooltip.** The checkbox on an action row now says `Add to tasks` on hover. It uses the mail app's body-level `#ttip` rather than a `::after`, because the action card would clip a label at its own edge — same reason the toolbar needed it. The tooltip is only on rows that are still addable; a ticked box has nothing left to offer. Rows re-render on every add, so a capture-phase click listener drops the label rather than leaving it hanging over a box that just changed state.

**The hand-off.** Adding an item — one row or `Add all` — now puts it on the mail app's Tasks list. Recap and Mail are separate tabs, so the queue travels through `localStorage` under `titan-recap-tasks`, and Chromium shares one store across the prototype's `file://` pages. That also buys the live path: the `storage` event fires in an already-open mail tab, so a task added in Recap appears in the sidebar without a reload. `?tasks=` on `openMailApp()` is the fallback for a setup that refuses `file://` storage outright.

The queue is append-only. What stops a task landing twice is `tkSeen` on the mail side, keyed on an id Recap stamps from note title + text — so a second mail tab still ingests the whole set, and re-pulling is a no-op. Each task arrives as `Recap · <note title>` in the description, due Today.

Earlier sessions treated `file://` storage as unreliable and used URL params. Re-tested here: in Chromium it works, cross-page and with events. The URL path is kept underneath rather than trusted alone.

**Add all to Tasks** now follows Figma `5236:35317` — the borderless variant. The node has two cards stacked at the same coordinates; the visible one is the second, so it's the one built: no border, gap 4, and its own inset plus (`4→12`, saved as `ic-plus-blue-sm.svg`) rather than the full-bleed one the bordered variant carries. It reads as a link beside the card title instead of a second button competing with **Draft a reply**.

Type then went to **14px / 500** on Prabhat's call, over Figma's 12px semibold — the design file's size looked undersized next to the 18px card title once the border was gone. 141 × 32, still clear of the 400px card.

**Verified in Chrome:** tooltip shows and is absent once added; adding one item, then all six, puts 6 tasks on a 7-task list with no duplicate of the first; a re-pull adds nothing; the Tasks pane renders all 13. Button measures 130 × 32, borderless, gap 4. All five pages clean.

Still uncommitted.

---

## Session 31 — Onboarding, five frames from Figma 5274:19895

Five steps in the mail app: the nudge on the webmail → permissions → voice set-up → reading → done. Frames 3 and 4 are the same card in two states, so they share markup; step 4 is step 3 with the quote reading and the waveform live.

**Geometry, measured against the Figma frames** (all cards centre horizontally, and vertically in the region the scrim covers):

| Step | Figma | Built |
|---|---|---|
| 1 nudge | 370 × 442 | 370 × 442.38 |
| 2 permissions | 446 × 402.00 | 446 × 402.39 |
| 3/4 voice | 434 × 436.77 | 434 × 436.36 |
| 5 done | 442 × 219 | 442 × 219.50 |

Four things had to be read off the metadata rather than the generated code to land those:

- The nudge's blue header is **227** tall, so it keeps a 12px bottom padding under the illustration — the illustration is not flush to the white body.
- The permission row is **64**, not 66: Figma strokes it on the inside, so a real 1px border overshoots. It is an `inset` box-shadow instead.
- The quote is a **sibling** of the title block (5274:17070, gap 24), not a third child of it — as a child it inherited the 6px gap on top of its own 24 and ran 6px long.
- Step 5's icon box is **63.72 × 55.14**, and there are 36px under the copy, not 40.

**Assets.** Eight SVGs in `onboarding_assets/`, all real exports. Every one arrived with the usual ancestor junk — a canvas rect at the node's own size, the 8203×1258 page rect and its 0.1-alpha border, a 1440×900 shell fill — stripped by a small cleaner that only drops a rect matching the SVG's own dimensions and paths whose first coordinate is three digits negative. The nudge illustration is one 21 KB export of the whole 338×162 frame; hand-assembling its ~40 masked vectors was never on. Its own `#5692F6` layer is kept, since that is the card's header, not ancestor chrome.

**Two additions, neither in the design file:**

- Clicking **Allow** greys the label to `Allowed`. The file has no granted state, and a button that does nothing on click reads as broken. Continue is not gated on it — that would be inventing flow.
- The waveform is byte-identical between frames 3 and 4, so the design does not distinguish at-rest from recording. Step 4 gets a gentle `scaleY` pulse; a frozen waveform under "read this aloud" reads as a bug.

The read-so-far highlight is per-word points along the `#0057e6` → `#666` ramp Figma draws as one gradient across the run — same result, and it survives a re-render.

**The toggle.** A pill bottom-left, just clear of the 250px sidebar, that runs the flow on its own. Off at load, so it never collides with the dictate → meeting → call journey. Toggling off, the close X on any step, and Escape all end it and reset the permission labels, so it can be walked repeatedly.

**Not done:** no dark variant — Figma has none for this section, and the cards would need a palette invented for them. They stay light over the dark shell.

**The nudge copy is wrong in the design file**: "You just restored that email. Make sure you never lose it again with Email Backup." That is Email Backup's nudge, not Recap's. Built verbatim as asked; it wants one line of Recap copy.

**Verified in Chrome:** every step's width and height against the table above, both Allow buttons, the reading highlight and live waveform, the auto-close on step 5 (2.4s), the flow walked twice with permissions resetting, toggle-off and Escape mid-flow, and the read timer stopping when the card closes mid-read. All five pages plus `drive.html` clean, and the Recap → Tasks bridge still passes.

Still uncommitted.

---

## Session 32 — The client's view of a shared note (Figma 5285:20612)

A sixth page, `share.html`: what a recipient opens when the link to a note is copied and sent to them. No sign-in, no app chrome — the Recap nav with nothing to click, the **sender's** branding, and the note on Figma's `#154698` ground, which is the giveaway that this is a public page and not the app.

**Geometry, every number matched to the frame** (Figma coordinates less the 80px mock browser bar, which this prototype drops as `drive.html` already does):

| | Figma | Built |
|---|---|---|
| nav | 1440 × 68 | 1440 × 68 |
| branding card | 64, 92 · 1312 × 80 | same |
| note card | 64, 192 · 1312 | same |
| title row | 88, 212 · 1264 × 36 | same |
| body panel | 88, 268 · 1264 | same |
| note text | 350, 308 · 740 | same |
| social icons | 1286, 118 · 66 × 28 | same |

The note text is 740 wide — Figma insets it 262px inside the 1264 panel, which is the same measure the note reads at inside the app; built as a centred 740 column rather than 262px of padding, so it holds up under 1440.

**The link carries the note.** There is no server behind any of this and a recipient has no account to look the note up in, so `copyShareLink()` and the row menu's **Copy link** now raise `Link copied` with an **Open as recipient** action that opens `share.html` with the note's title, date, summary and the sender's branding as query params — the same hand-off the rest of the prototype uses. The page has the design's own note built in as its default, so opening it cold still shows something.

**Sender branding.** Figma names the 48px mark layer "Demo Logo" and draws it as four coloured quadrants, so it is drawn in CSS at the file's own colours rather than exported, and the account it belongs to is ours: **Avontech Labs**, *Shared by Ella*. The design file says "Square" / "Shared by Sachin" — a real company's name against an Indian first name, both of which the prototype has already moved away from.

Two real exports in `share_assets/` (the Facebook and globe circles), cleaned of the usual ancestor junk — the page rect in those two carried the `#154698` fill, which is where the ground colour was confirmed.

**Alongside the onboarding.** The bottom-left control is now a stack: the `Onboarding` switch and a `Shared note` button. The second is an arrow, not a switch — it opens a page, which is a one-shot, and a switch would imply a state it does not have.

**Verified in Chrome:** the table above at 1440, no sideways scroll at 900, the toast action opening the page with the right note carried (checked against a different row than the default, so the params are actually doing the work), both pills, and the onboarding still opening from the first. All six pages clean.

Still uncommitted.

---

## Session 33 — Notes as a mail folder (Figma 5287:23686)

The other answer to where notes live: not a separate app, a folder in the mail nav. Same list and overview card, inside this shell. A `notes-view` class on `<body>` swaps the middle panel and reading pane for the notes list, and `New email` + search for `New note` + `Search notes`; the nav, toolbar icons and side panel are untouched.

**Geometry against the frame** (Figma coordinates less the 79px mock browser bar):

| | Figma | Built |
|---|---|---|
| New note | 266, 12 · 121 × 40 | 266, 12 · 120 × 40 |
| Search notes | 403, 12 · 350 × 40 | 402, 12 · 350 × 40 |
| "My Notes" row | 270, 84 · 36 tall | 270, 84 |
| list | 270, 152 · 740 | same |
| row | 52 tall, 32px type icon, name at 52, date at 688, time at 832 | same |
| overview card | 1034, 152 · 382 × 280 | 1034, 152 · 382 × 284 |

The card is **382** here, not the Recap app's 400 — the mail shell's content area is narrower — and it is the only measurement that differs by more than a pixel, running 4px long because the overview text wraps to its own height rather than Figma's fixed frame.

**Two deliberate departures from the file:**

- The size column reads **capture times**, not `455 KB`. Figma still has the KB; session 27 replaced them across the notes listing at Prabhat's request, so this follows the build.
- The selected nav row uses this shell's own active style, not Figma's `#484872` band, so Notes looks like every other folder in the nav rather than a special case.

**The row menu** carries only actions the prototype already has — Open note, Copy link, Get audio. The note detail itself is not rebuilt here: a folder in the mail nav is a way *in*, so **Open Note** and the row's Open hand off to `recap.html?open=<i>`, and **New note** to `recap.html?new=1`, which now starts the recorder.

`?open=` rather than `?note=` for a reason worth writing down: **the calendar app already sends `?note=`, as a note _title_**, and `intakeFromCalendar()` unshifts a note for whatever it finds. A numeric `?note=2` therefore created a note called "2" and shifted every index by one — so `?note=2` opened note 1. Caught it because the deep-link test asserted the title, not just that a detail view appeared.

The notes fixture is a **copy** of the Recap app's (titles, dates, times, overviews) since each page here is self-contained. If one changes, change both.

**Alongside the others.** The bottom-left stack is now three: `Onboarding`, `Shared note`, `Notes folder`. This one is a switch, since it is in-page state — on selects the folder, off returns to Inbox.

**Verified in Chrome:** the table above, all 12 rows, row selection driving the card, search filtering to 3 on "untitled", the row menu and its Drive hand-off, Open Note landing on the right note in the app (the bug above), New note opening the recorder, the side panel still overlaying at 286px, dark mode, and the pill's on/off state. All six pages clean, and onboarding, the shared-note page and the Recap → Tasks bridge all still pass.

Still uncommitted.

---

## Session 33b — Onboarding, last modal copy

Step 5's line is now **"Titan Recap can now dictate, transcribe and summarize your calls."** — the file was re-read at `5274:17506` and the copy had changed since session 31 ("…will now transcribe and summarize your calls automatically"). It names dictation, which the flow's own step 3 and 4 are about, so it reads better than what it replaced. Same two lines, so the card still measures 442 × 219.5 against Figma's 442 × 219.

Still uncommitted.
