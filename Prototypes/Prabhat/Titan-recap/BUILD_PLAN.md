# Titan Recap — Prototype Build Plan

> ⚠️ Written before the build started; **partly superseded**. For what actually
> exists see [PROJECT_MEMORY.md](PROJECT_MEMORY.md).

Execution plan for building Titan Recap into this prototype, derived from the Design Plan and the Web Spec v0.1. Scope of this document is the **clickable web prototype**, not eng implementation.

---

## 0. Locked decisions

Three were decided at kickoff (3 Sep 2026):

| Area | Locked to | Consequence |
|---|---|---|
| Scope | **Happy path end-to-end** — 12 surfaces | W7, W9's six states, W10, W11, W12 are out of this pass |
| Calendar | **Real week view** | Largest net-new chunk; reusable by other prototypes |
| Capture model | **Fork A, browser-only** | No desktop app anywhere; adds WC1a/WC2a; changes W2 and W9 |

Carried from the Web Spec as-is: monetization bundled into the premium AI tier (so no paywall in this pass), English with Hinglish tolerance, transcript kept / audio discarded / 90-day retention.

### What Fork A changes versus the specs as written

The specs are written desktop-app-primary and mark the fork inline. The prototype takes the fork, so these deltas are authoritative here:

- **W2** — the desktop-app requirement block is **deleted**. `enable.desktopMissing`, "Get the desktop app", and "I'll do this later" do not exist. Replaced by the browser-support notice: *"Call notes work in Chrome for meetings you join in your browser."* The supported cases are listed plainly on this screen, per the spec's instruction not to let the user find out at call time.
- **WC1a / WC2a** are **added** — the browser capture-permission surfaces. WC1a is the tab-and-audio-share request at capture start; WC2a is the capturing indicator in its browser-permission-derived form.
- **W9** — "Desktop lost mid-call" is **deleted** along with `capture.desktopLost`. Two Fork A failure modes replace it: share denied at the prompt, and audio not shared (right tab, "Share tab audio" left unchecked) — which is the same user-visible outcome as no-speech and should reuse that copy block.
- **Analytics** — `recap_desktop_missing_shown` is dropped. `recap_capture_failed` gains `reason: share_denied | no_tab_audio`.
- **Per-meeting friction becomes a designed moment, not a footnote.** Every armed call requires picking a tab and ticking an audio box. WC1 is where that either works or the feature dies, so it gets more design attention than the spec's weighting implies.

---

## 1. What the shell already provides

Surveyed `index.html` (5,033 lines) before planning. Reuse, do not rebuild:

| Need | Existing asset |
|---|---|
| Recap panel container | `.side-modal` — fixed right, 316px, `translateX` transition, `.open` class. Extend to 440px |
| Follow-up draft (W5) | `#composer-window` + `openComposer()`; since 3 Sep the composer is SmartWrite's, so **AI Write's refine bar supplies Tone / Length / language** |
| Recap chip placement (W6) | `.thread-stack` / `.stack-card` / `.expanded-tile` inside `.thread-content` |
| Screen switching | App switcher (`#app-switcher`) already lists a Calendar entry — wire it to the new week view |
| Settings host | `#settingsModal` side-modal, if W12 is added in a later pass |
| Reply surface | `#reply-box-card`, `openReplyBox()` — relevant if the follow-up ever drafts as an inline reply |

**Genuine gaps — net-new construction:**

1. **No calendar view of any kind.** The whole week grid, event blocks, and event detail popover are new.
2. **No toast or notification system.** WC1 pre-call prompt and the recap-ready toast both need it. Build one small toast host; both use it.
3. **No top-chrome status area.** WC2's persistent capturing indicator needs a home adjacent to the account controls.
4. **No contact/profile panel.** Only matters when W10 comes into scope — flagged so it isn't a surprise later.
5. **No dark mode in this shell.** Not in scope; keep every new token light-only so a later dark pass is a single sweep.

---

## 2. Architecture

One `index.html`, per the folder convention. Four additions to keep 12 surfaces from turning into spaghetti:

**A screen router.** A small `showScreen('mail' | 'calendar')` toggling a class on `.content-area`. The calendar is a sibling screen, not a modal. Everything else in the feature is a panel, popover, or toast layered over whichever screen is active.

**A single recap fixture.** One `RECAP` object matching the Web Spec's Recap object field-for-field — `id, eventId, contactIds[], title, startedAt, duration, summary, decisions[], nextSteps[{text, owner}], transcript, confidence, status, edited, followUpSent`. Every surface renders from it; nothing hardcodes copy that belongs to the fixture. `status` and `confidence` are the switches that drive W8 and, later, all of W9 — so the state matrix costs almost nothing to add in a later pass if the fixture is honoured now.

**An externalized string table.** A `STRINGS` object keyed exactly as the spec's Section 13 list (`intro.headline`, `enable.point1`, `recap.lowConfidence`, …). Worth doing in a prototype, not just in production: it makes the copy reviewable as a set, which is how the spec says to catch tonal drift. Fork A's replacement strings go under the same keys; deleted desktop strings are removed rather than left dangling.

**Six new components** (Part 7's set of seven, less the tone control — AI Write's refine bar owns tone since the 3 Sep composer rebase):

1. Recap panel container
2. Recap chip (thread inline)
3. Editable list item with owner attribution (next steps)
4. Capturing indicator (persistent)
5. Processing block with time estimate
6. Degraded-state block (one component reused across partial / poor audio / no speech)
7. Consent prompt (inline, non-blocking)

~~Tone control~~ — dropped. AI Write's Tone / Length pills do this job; see `CONTEXT.md` §4.

Everything else is reuse or extension: compose window, recipient chips, thread list item, side panel container, buttons, form controls, settings rows, avatar unchanged; calendar event card, thread timeline (accepting a non-message item type), and notification patterns extended.

**A capture simulator.** No real `getDisplayMedia`. A timer-driven state machine — `armed → prompting → capturing → paused → processing → ready` — with a hidden prototype control to jump states and to force `confidence` and `status`, so a reviewer can see any state without waiting or faking a call.

---

## 3. Build order

Sequenced so something is reviewable after every session, and so the two screens carrying 75% of the product's value are built before anything that merely leads to them.

### Session 1 — The hero pair (W3, W4, W5, W6) — ✅ built 3 Sep 2026

The Design Plan's Option B, and the right first move: these are needed for a credible validation test anyway, so building them first is not speculative.

- **W3 recap panel (read)** — 440px, extended from `.side-modal`. 72px fixed header (avatar / contact names / `Q3 planning · Tue 3 Feb · 32 min` / overflow menu), scrolling body, 64px fixed footer holding the primary `Draft follow-up email` plus a quiet `View transcript` text link that expands the transcript **below, in place** — never navigating away, never a second pane. 24px section spacing. Summary is prose, no heading. Decisions section omitted entirely when empty — never rendered as an empty header. Next steps carry a quiet owner chip, not a colored badge.
- **W4 inline edit** — the same screen, not a mode. Click-to-edit on summary, decision items, next-step text; owner chip opens a participant menu; `+ Add` on section hover; 32px minimum hit area per line; autosave with a brief `Saved` micro-state; `edited = true` on first change.
- **W6 recap chip in thread** — inline in `.thread-stack` in chronological position, visibly not a message (left rule, lighter, smaller, reduced padding). Two lines: `Call recap · {date} · {duration}`, then the truncated first sentence. Click opens W3 with thread scroll position preserved.
- **W5 follow-up draft** — `#composer-window` prefilled. Recipient chips, the quiet thread-context line beneath the subject, derived subject, body under 150 words, signature. Collapsed `From your call notes` reference strip at the top of the body area. Tone control (`Shorter` / `Warmer` / `More formal`) placed low near the formatting toolbar, nowhere near Send. Regeneration warning if the body was hand-edited.

*Gate:* open the thread → click the chip → read the recap → edit a next step → draft → send. If that motion feels heavy, nothing later fixes it, and it is cheap to fix now.

### Session 2 — Calendar week view (C1, C2, W1)

- **Week grid** reached from the app switcher's Calendar entry. Event blocks, one seeded video call ("Q3 planning" with Priya) plus filler so the grid reads as real.
- **Event detail popover** with the C1 toggle row: `Take notes on this call`, sub-label when on, and the secondary `Let attendees know in the invite` row defaulting on. Toggle appears only on events with a conference link or more than one invitee. Default off. `Every time` as a secondary option on recurring events.
- **C2 armed indicator** in the grid and agenda list — legible at the smallest block size, carrying shape or text, never color alone.
- **W1 intro card**, both variants (top of calendar week view, top of inbox list). Inline, dismissible via `×` only, animates out without leaving a gap. No modal, no illustration, no video, and the word "AI" appears nowhere on it.

*Gate:* the calendar must not become a product. If it starts growing month view, mini-calendar, or event creation, it has exceeded its job as a trigger surface.

### Session 3 — Enable and capture chain (W2, WC1, WC1a, WC2, WC2a, W8)

- **W2 enable panel** — 440px side panel. Three plain lines of what happens, calendar confirmation showing the connected account (a confirm, not a connect), the Fork A browser-support notice, the static privacy line, `Turn on call notes`. Then the post-enable state showing the next upcoming meeting already armed — the spec is right that converting enable into arm in one breath is the highest-leverage moment in the funnel, so it gets built, not deferred.
- **WC1 pre-call prompt** — toast, lower right, 2 minutes before an armed event. `Ready to take notes on {title}`, the consent reminder line, `Start notes` / `Not this time`. Escalated consent variant as one additional advisory line, never blocking.
- **WC1a browser share prompt** — Fork A. The tab-and-audio-share step, designed so the "Share tab audio" requirement is impossible to miss, because missing it produces a silent recap.
- **WC2 / WC2a capturing indicator** — persistent, top-right of the web chrome. Recording dot, elapsed timer, stop; pause in a one-click menu. Paused state distinguishable without color: hollow dot, stopped and greyed timer, `Paused` label. Not dismissible while capture runs. No waveform, no live transcript, no "listening".
- **W8 processing** — in-panel, header rendered normally so the user knows which call this is. `Writing your notes` plus the honest estimate. A skeleton of the eventual layout, not a spinner. No percentage. 5-minute timeout path stubbed toward the error state.
- **Ready toast** → opens W3, closing the loop.

*Gate:* a reviewer can start from the intro card and reach a sent follow-up without the prototype breaking narrative.

---

## 4. Review rules, applied every session

From Part 3 of the Design Plan, as pass/fail checks rather than sentiment:

- Exactly one primary action per screen. If two buttons carry equal weight, the screen fails.
- No AI branding. No sparkles, gradients, glow, purple, or "AI-powered" anywhere.
- No transcript by default. No two-pane transcript-plus-summary layout.
- No dashboards, charts, talk-time, sentiment, or confidence numbers.
- Recording state always visible while capturing, never ambiguous, never color-alone.
- Nothing sends without an explicit user action. No auto-send, no scheduled send, no "sending in 5 seconds unless you cancel."
- Error copy names what happened in the user's terms, says what happened to their data, and gives exactly one next action.
- New color values or type sizes: zero. Needing one is a signal the layout is wrong.

And the standing question the Design Plan asks every review to open with: **does this make the follow-up email more likely to get sent?**

---

## 5. Deferred, with reason

| Surface | Why deferred |
|---|---|
| W7 empty state | Belongs with W11 Calls list, which is out of scope this pass |
| W9 degraded states (6) | Cheap to add once the `RECAP` fixture drives rendering — deliberately sequenced after the happy path, not dropped. Largest remaining chunk of P0 |
| W10 Recent calls | Needs a contact panel the shell doesn't have. Highest-value deferred item — it is the CRM-lite payoff |
| W11 Calls list | Archive, not a home. Deliberately last |
| W12 Settings | Extends `#settingsModal`; small, and unblocked whenever wanted |
| W13 Paywall | Not required while monetization stays bundled |
| W14 Share recap | P2 |
| Mobile M1–M5 | Out of scope for the web spec |

---

## 6. Risks and open questions

**Carried from the spec, still unanswered — these are decisions, not prototype problems:**

- Should capture default on for recurring external meetings? Needs counsel, not a product call.
- What retention default will legal accept for EU and India users?
- Is the Smart Write tone model good enough to draft a client-facing email without heavy editing? Testable now with existing users, and it determines whether W5's tone control is a nicety or load-bearing.
- Who owns consent copy review, and are they engaged before beta?

**Prototype-specific risks:**

- **Fork A's per-call friction is the real risk to the feature, and the prototype will make it visible.** A tab-picker on every single call is friction the desktop path does not have. If WC1/WC1a feel bad in the prototype, that is genuine evidence about the capture-model decision, not a prototype artifact — worth surfacing to the PM rather than designing around.
- **The calendar week view could absorb the whole build.** Timeboxed to one session and held to trigger-surface duties only.
- **Twelve surfaces in one 5,000-line file** will get unwieldy. The string table and single fixture are the mitigation; if it still strains, the split is by screen, not by state.

---

## 7. Assumptions

- The prototype is visual and clickable. No real audio capture, no real ASR, no backend. All state is simulated.
- Copy is taken verbatim from the Web Spec's Section 13 string list wherever a string exists there. The `recap.partial` en dash is replaced with a comma per the spec's own note.
- Fixture content follows the spec's copy direction: the recap reads the way a person would tell a colleague what happened, not the way a meeting summarizer writes.
- A Figma design plan may arrive and supersede parts of this. Sessions 2 and 3 are the most likely to move; Session 1 is spec-driven enough to start now.
