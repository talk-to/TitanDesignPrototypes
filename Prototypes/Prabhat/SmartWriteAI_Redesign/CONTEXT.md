# SmartWrite AI Redesign — Working Context

Running log of everything built in this prototype, so context survives across sessions.

- **Prototype:** `Prototypes/Prabhat/SmartWriteAI_Redesign/index.html` (~7,430 lines, ~249 KB)
- **Figma source:** [Titan AI Write — node 4584-186621](https://www.figma.com/design/pGfBybT7p0UQpbG198nq2P/Titan-AI-Write?node-id=4584-186621) ("Final Flows" section)
  · [Changes section — node 4651-214235](https://www.figma.com/design/pGfBybT7p0UQpbG198nq2P/Titan-AI-Write?node-id=4651-214235) (four annotated change rows)
- **Sessions covered:** 31 Jul 2026 → 10 Aug 2026
- **Git status:** folder is **untracked** — nothing has been committed yet
- **Last edit to `index.html`:** 10 Aug 2026

---

## 1. Setup — 31 Jul

Branched the prototype from the shared shell, matching how other prototypes (Ishant's, Usha's `titan-crm`) are structured.

- Copied all of `Shells/TitanEmailShell` — `index.html` plus `app_switcher_assets/`, `assets/`, `composer_assets/`, `settings_sidebar_assets/` — into this folder.
- **Convention confirmed:** each prototype folder holds its own full copy of the shell. No shared/linked assets.

---

## 2. Build — 5 Aug

Built the AI Write feature into the composer, replicated from the Figma "Final Flows" section. 30 real SVG/PNG assets exported from Figma into `ai_write_assets/` (committed bytes, not the 7-day Figma URLs, so they don't expire).

### Prototype panel (bottom-left, collapsible)
Two toggles plus **Restart flow**:
- **Flow** — Happy (Ultra, unlimited) ↔ Paywall (Pro, limited)
- **Dropdown labels** — Approach 1 ↔ Approach 2

### Approach 1 vs Approach 2
The Figma row was titled "Option 2, different dropdown text". The actual difference:

|  | Approach 1 | Approach 2 |
|---|---|---|
| Pill labels | selected value (`Professional`, `Long`, `EN`) | category name (`Tone`, `Length`, `EN`) — never changes |
| Menu | `Tone` header row + blue checkmark on current | no header, no checkmark |

### States implemented
- **Prompt bar** — `Try writing with AI - describe your email`, blue 1px border, Figma's two-layer shadow
- **Typed** → circular blue ↑; **generating** → gradient border, spinning arc, `Generating...`, stop button
- **Refine bar** — `Describe your change` + Tone/Length/EN pills, undo/redo, thumbs; all menus open **upward**
- Body dims to 35% while regenerating; undo/redo walk real history
- **Paywall** — amber `2 suggestions left` chip → nudge popover; `0 suggestions left` banner → upgrade modal; once exhausted the AI Write entry point itself becomes the nudge (Figma frame 11), CTA copy switching between `Smart Write` and `Unlimited AI Write` per anchor
- Full 16-feature upgrade modal, both columns verbatim

### Content decisions
- Draft copy is **verbatim** from the frames (initial, warmer, casual, long, Spanish).
- **Authored (not in Figma)**, so every menu option lands somewhere: **Friendly** tone, **Short** length, PT/FR translations.
- Figma's paywall row shows no counter until exhaustion — made it count down **2 → 1 → 0** consistently, since the continuation row does show `2 suggestions left`.

> Figma MCP flagged that these components have no Code Connect mappings. Skipped deliberately.

---

## 3. Paywall correction — 6 Aug, morning

The paywall banner was misread as an exhausted-only state. It's in the refine bar **from the very first generation**. Corrected against frames `4574:145952` and `4583:154625`.

| After | Refine bar |
|---|---|
| Generation 1 (2→1) | `↑ 1 suggestion left` · `Upgrade to get unlimited suggestions` — pills fully enabled |
| Generation 2 (1→0) | `↑ 0 suggestions left` · same link — pills at 40% |
| While typing a change | banner and pills collapse away, leaving text + blue ↑ (frame `4574:147494`) |

Three specifics fixed:
1. **Banner timing** — appears from the first generation, not only at zero.
2. **Singular/plural** — Figma uses `1 suggestion left` but `0 suggestions left`; the count string builds the right form.
3. **Zero state** — the bar keeps its blue `#2170f4` border and shadow (was wrongly greyed to `#dedede`). Only the **Tone/Length/EN pills** drop to 40%; undo/redo and thumbs stay fully live.

Empty prompt bar still carries the amber `2 suggestions left` chip inline (frame `4583:166809`). Happy flow has no banner anywhere. `.aiw-exhausted*` classes renamed `.aiw-banner*`.

---

## 4. Entry-point polish — 6 Aug, 11:00

1. **Formatting selected on open** — the `A` button carries the selected grey pill when the composer opens, and is a real toggle (`toggleFormatBar()`). Figma node `4583:155744` showed `A` **un**highlighted while AI Write owns the bar, so the toggle tracks whether the formatting bar is genuinely on screen; highlight returns when AI Write closes.
2. **Icon size** — root cause was padding *inside* the SVG, not CSS. The purple mark sat in a 21.33 viewBox with the glyph filling only ~70%. Both AI Write SVGs re-cropped to `viewBox="3 3.3359 15 15"` so CSS size = visible size: **18px** in the feature-chip row, **15px** in the bottom strip.
3. **Grey before selection** — added `ai_write_assets/titan-ai-grey.svg` (`#888888`, matching other toolbar icons). Both entry points swap icons on `.aiw-on` — grey by default, purple + `#e6efff` pill when active.

> **CSS gotcha:** the shell's `.comp-feat .fic img` out-specifies a plain `.aiw-ic-on` selector (renders both icons stacked). Swap rules are scoped through `.aiw-chip .fic img.aiw-ic-on` rather than using `!important`.

---

## 5. Typography & measurement pass — 6 Aug, 11:30

1. `.aiw-pill-label` → **14px** (`EN`, `Professional`, `Long`, `Tone`, `Length`)
2. **Undo enabled after the first generation** — `generate()` only recorded history when a draft already existed, so the opening draft had nothing behind it. Now records every generation; undo from the first draft returns to the empty composer.
3. **Selected width = hover width** — the shell's `.titan-action-btn:hover { transform: scale(1.1) }` grew hover to 35.2px while selected sat at 32px. `.aiw-tool-btn.aiw-on` now carries the same `scale(1.1)`.
4. **Caret** — `10.15px × 5.72px`
5. `.aiw-menu-head` — `padding: 7px 9px 7px 12px`, 13.5px, 500, `#888`
6. `.aiw-menu-row` — `gap: 20px`, `padding: 7px 12px`, 13.5px, `#333`

Head/row styles are shared classes, so Tone, Length and the language list all picked these up at once. Menu width **165px**.

---

## 6. Feedback, tooltips, animation — 6 Aug, 12:00

| Change | Result |
|---|---|
| `Describe your change` | **14px** (was 13.5px) |
| Redo when active | now reads as live |
| Generating border | colour travels around it |
| Tooltips | `Helpful` · `Not helpful` · `Undo` · `Redo` |
| Thumbs up | icon → blue + bottom-centre toast |
| Thumbs down | icon → blue + feedback popover |
| Submit gating | off until a pill **and** text are present |
| Submit | popover closes, "Feedback submitted successfully" toast |

- **Redo bug root cause:** the exported `redo.svg` had `stroke="#DEDEDE"` baked in (Figma exported it from a disabled frame) while `undo.svg` was `#888888` — so redo rendered pale in both states. Asset recoloured to `#888888`; disabled look now comes purely from `.aiw-disabled` opacity. Deleted `undo-disabled.svg` (byte-identical copy of `undo.svg`, so its src-swap was a no-op).
- **Animated border:** uses `@property --aiw-angle` to make a conic-gradient angle animatable — blue→violet→magenta band rotates over **2.4s**.
- **Feedback popover:** anchored above thumbs-down, tail aligned to the button. Pills single-select; Escape or outside click dismisses; reopening resets the form.

> **Architecture note:** the AI Write bar is **one shared component driven by a single state object** — nothing is duplicated per flow. Every change lands in all four flow/approach combinations automatically.

---

## 7. Width, icon size, bar height — 6 Aug, 12:20

**Chip width across states** — the hardcoded `width: 93.27px` on the selected state was the culprit. With `box-sizing: border-box`, forcing a width wider than the 88.83px content dumped all 4.44px of slack on the **right** instead of padding symmetrically. Override removed; all states now share one intrinsic box at **88.83px**, padding `2px 6px 2px 4px`.

> ⚠️ This supersedes the earlier "make it 93.27" instruction. To genuinely widen the pill, bump horizontal padding in *all* states (e.g. `2px 8px 2px 6px` → ~92.8px) rather than pinning a width.

> ⚠️ Superseded on 10 Aug: the row is now pinned to **45px** in every state, padding `8px 9px 8px 13px` (see §10).

**Top toolbar icon** — 18px → **16px**. It measured 18×18, identical to Design/Templates/Invoices/Groups; it only *looked* bigger because it's a solid filled disc among line icons. 16px balances the visual weight.

**Prompt bar height** — the row collapsed 33px → 27px when pills gave way to the arrow (bar 53 → 47). `.aiw-row` now has `min-height: 33px`:

```
happy    rest=53  typing=53   constant
paywall  rest=98  typing=53   banner adds its own row, as specified
```

---

## 8. Approach-2 menu padding & button spacing — 6 Aug, 12:45

**Menu row padding, Approach 2 only** — scoped via an `.aiw-a2` class the renderer puts on each menu:

```
A1 tone/length/lang   rowPad 7px 12px            header #888 / 500 / cursor:auto
A2 tone/length/lang   rowPad 7px 16px 7px 12px   no header
```

Approach 1's header stays `#888` / weight 500 / no pointer (the `#333 + cursor: pointer` block applied to rows, not headers).

**Tighter spacing on the last four buttons** — undo/redo lived inside `.aiw-pill-group`, so tightening would have squeezed the Professional/Long/EN pills too. Pulled undo/redo into their own `.aiw-history` wrapper:

| | before | after |
|---|---|---|
| undo ↔ redo | 9px | **2px** |
| thumbs up ↔ down | 9px | **2px** |
| redo ↔ separator | 13px | **10px** |
| pills (unchanged) | 9px | 9px |

---

## 9. Reply surfaces — 7 Aug

### Architecture decision: one bar, two homes
Rather than duplicating the AI Write markup and JS into the reply box (which would drift on the next tweak), the shell is a **single relocatable instance** that docks into whichever surface invoked it.

- A **`HOSTS` map** describes each surface: mount point, frame, editable body, chip, tool button, placeholder.
- **`mountShell()`** moves the node and clears the other surface's active state.
- Opening AI Write on one surface while active on the other **moves** the bar rather than leaving two lit chips.
- **`discardReply()`** tears down an AI Write session hosted there and returns the shell to the composer, so it can't be orphaned in a hidden reply box.

### Entry-point behaviour (final)

```
Reply (on open)          aiwOpen=false  formatBar=true   chip=off
Reply + chip click       aiwOpen=true   formatBar=false  chip=on   value=""   generate=false
Reply all (on open)      aiwOpen=false  formatBar=true   chip=off
Reply all + chip click   aiwOpen=true   formatBar=false  chip=on   value=""   generate=false
Reply with AI (on open)  aiwOpen=true   formatBar=false  chip=on
                         value="Draft a reply for the above message"  generate=true
Forward                  aiwOpen=false  generate=false   value=""
```

> ⚠️ Superseded on 10–11 Aug (see §10): the formatting bar no longer collapses when AI Write opens, and **Reply / Reply all now open with AI Write already on screen at rest**. Forward is unchanged.

- **Reply with AI** seeds the prompt with **real text** (not a placeholder) so Generate is live on open. Text arrives **pre-selected** so the user can tap Generate or type straight over it. After generating, the input clears and the placeholder becomes `Describe your change`.
- **Reply / Reply all** open plain, formatting bar showing, body focused. AI Write opens on demand from the chip or toolbar button — and when opened manually the prompt starts **empty** with `Draft a reply for the above message` as grey placeholder, mirroring the main composer. This keeps "Reply with AI" meaningfully different.
- **Forward** stays on the plain path (not requested).

### Bottom-toolbar button in the reply box
Added in the same position as the main composer — first in the icon strip, right after the megaphone separator. Wired to the same `aiwToggle('reply')` as the chip, so activating either lights both. Registering it as the reply host's `tool` also makes the paywall upsell nudge anchor correctly when credits run out.

```
aiw-tool-btn-reply  15.0 x 15.0
Text styling        15.0 x 15.0
Attachment          14.5 x 15.5
Image               16.0 x 14.0
```

Grey when inactive, purple with `#e6efff` pill when active.

> **One `!important`:** the reply box sets `display: flex` inline on its formatting bar, so hiding it while AI Write is on requires `display: none !important` — an inline style can't be beaten otherwise.
>
> ⚠️ Resolved 11 Aug: the redundant inline `display: flex` was **removed** (`.comp-format-bar` already sets it in CSS), so `#reply-box-card.fmt-hidden .comp-format-bar` hides it with no `!important` anywhere. See §10.

---

## 10. Figma "Changes" round — 10 Aug

Figma added a **Changes** section (node `4651:214235`) with four annotated rows. Rows 1–3 are the real changes; row 4 is "same as change three, just the paywall has been added". Two further asks came in alongside them (compact chips, language heading).

### Change 1 — AI Write is open on composer open, at rest
The composer now opens with the AI Write bar already on screen but **unfocused**, and the formatting bar **collapsed**.

|  | Resting (`.aiw-rest`) | Focused |
|---|---|---|
| Background | `#eff5ff` | `#fff` |
| Border | none | 1px `#2170f4` |
| Shadow | none | two-layer |
| Prompt text | `#333` — reads as a label | `#bdbdbd` placeholder + caret |

- `openComposer()` adds `fmt-hidden`, drops `fmt-on`, and calls **`aiwOpenAtRest('composer')`** — which docks the shell, opens it, and leaves `S.focused = false`. Focus still goes to the **To** field, as before.
- **Reply and Reply all get the same treatment** (11 Aug): `openReplyBox()` calls `aiwOpenAtRest('reply')` and then focuses the reply body, so the bar is on screen with the chip lit but unfocused. Clicking the prompt box promotes it. `aiwOpenAtRest(hostName)` is the shared entry point — one function, both surfaces; `aiwOpenOnCompose()` is a thin wrapper kept for `openComposer()`. **Forward** is explicitly excluded and still opens plain, and **Reply with AI** keeps its own path (`aiwOpenInReply()`: seeded, pre-selected, focused).
- The reply box now shows the **same prompt copy as the composer** — `Try writing with AI - describe your email`. `HOSTS.reply` therefore carries two strings: `placeholder` (that shared copy) and **`seed`** (`Draft a reply for the above message`, the real text "Reply with AI" fills in). They used to be one field, so changing the copy would have silently changed what Reply with AI generates from.
- `S.focused` flips on the input's `focus`/`blur`, so the two states are reversible; `mousedown` anywhere on a resting bar forwards focus to the input.
- Only the *opening prompt* rests. Once a draft exists the refine bar is always the bordered white bar.
- `aiwToggle()` had to learn that opening the composer already opened the bar — otherwise the click that opened it immediately toggled it shut (`justOpened` now forces `S.open = true`).
- `aiwReset(false)` lands back on this default when the composer is open, rather than leaving it with no bottom bar at all.

### Change 2 — counter has no background; banner colours by threshold

```
prompt box, at rest/focused   plain amber text  #c56a00   no chip background
after generating, 6–20 left   banner, no background       text #666, link #5692f6
after generating, ≤5 left     banner, #fdf4db amber       .aiw-banner-warn
while typing a change         counter/banner collapse, blue ↑ takes over
```

- **`START_CREDITS` 2 → 7** and **`WARN_AT = 5`**. Figma's row runs 7 → 6 (clear) → 5 (amber), so seven is what demonstrates the threshold.
- The banner is now a **full-bleed bottom row** of the bar (rounded bottom corners, `overflow: hidden` on `.aiw-bar`), not an inset chip. Padding moved off `.aiw-bar` and onto `.aiw-row`; the generating state's tighter padding moved with it (`.aiw-bar.aiw-gen .aiw-row`).
- Banner copy gained its Figma full stop: `6 suggestions left. Upgrade to get unlimited suggestions`.
- Seven credits makes the exhausted/upgrade flows a long walk, so the prototype panel gained a **Suggestions left** row (7 · 6 · 5 · 1 · 0) that jumps the counter and doubles as a live readout. Prototype tooling — hidden in the happy flow, not part of the design.
- `Upgrade to get unlimited suggestions` is weight **400** (was 500).
- **`0` is a refine-bar state**, so `aiwSetCredits(0)` seeds `DRAFTS.first` and sets `generated` when nothing has been generated yet — otherwise there'd be no draft for the exhausted bar to sit under. It lands on exactly the out-of-suggestions screen: pills at 40% and inert, prompt input disabled with no submit arrow, **undo / redo / thumbs stay fully live**, amber banner reading `0 suggestions left.`

### Change 3 — formatting bar and AI Write coexist

The `.aiw-mode .comp-format-bar { display: none !important }` rule is **gone**. DOM order already puts the shell inside `.comp-body-area`, above `.comp-bottom`, so the formatting bar opens **below** the AI Write bar and pushes it up — no JS, no transition needed. The Formatting toggle now owns its own visibility, and `render()` syncs `fmt-on` from `#composer-window.fmt-hidden` alone instead of forcing it off whenever AI Write was open. The reply box gets the same behaviour, and on **11 Aug** it also gained the composer's *collapsed-by-default* half:

- `openReplyBox()` adds `fmt-hidden` to `#reply-box-card` and clears `fmt-on`, so **Reply, Reply all and Reply with AI all open with only the AI Write bar** — no formatting bar.
- The reply box's **`A` button is now live**: `id="reply-fmt-toggle"` → `toggleReplyFormatBar()`, mirroring `toggleFormatBar()`. It opens the formatting bar below the AI Write bar, pushing it up, and takes the same grey `fmt-on` pill.
- The redundant inline `display: flex` came off that bar so `#reply-box-card.fmt-hidden .comp-format-bar` can hide it by class — **the `!important` from §9 is gone entirely.**

### Change 4 — more compact chips

| | before | after |
|---|---|---|
| pill padding | `7px 7px 7px 11px` | `5px 6px 5px 9px` |
| pill label | 14px | **13px** |
| caret | 10.15 × 5.72, margin `0 4px 0 6px` | **9.1 × 5.13**, margin `0 2px 0 5px` |
| pill-group gap | 9px | **7px** |
| language pill | same as others | `5px 5px 5px 8px`, label **12px**, caret **8.1 × 4.57** |

`.aiw-row` no longer relies on the old 33px floor — see the height pin below.

### One row height — 45px
The prompt box measured **38px at rest** and jumped to **45px** the moment the submit arrow appeared. `.aiw-row` is now `min-height: 45px` with padding `8px 9px 8px 13px` (gen state `8px 9px`), so rest, focused, typed, generating **and** the refine bar all land on exactly 45px — 47px counting the bar's border. Measured in the browser, all five states.

> **Gotcha:** `box-sizing` is global in this shell, so `min-height` on `.aiw-row` **includes** its padding. The old `33px` floor was therefore never reached (20px of text + 18px padding = 38px), which is why the height moved at all.

### Change 5 — "Translate to" heading on the language menu
`MENUS.lang.head` is now `Translate to`, and `renderMenus()` no longer excludes `lang` from the header row — Approach 1 heads all three menus, Approach 2 stays headerless throughout. The language list scrolls, so `.aiw-menu-lang .aiw-menu-head` is `position: sticky` and keeps the heading in view.

> **Verification:** every state was rendered in headless Chrome (composer + reply box × happy/paywall × Approach 1/2) and compared against the Figma frames — resting/focused prompt, typed, generating, refine, 7/6/5/0 credits, formatting bar open with and without a draft.

---

## 11. Packaging

Delivered twice as **`~/Downloads/SmartWriteAI_Redesign.zip`** (latest: 218 KB, 198 files, `index.html` at 242,841 bytes).

The **whole folder** is zipped, not just the HTML — `index.html` pulls icons and images from five sibling directories (`ai_write_assets/`, `composer_assets/`, `assets/`, `app_switcher_assets/`, `settings_sidebar_assets/`) and renders imageless on its own. The zip lives in `~/Downloads` deliberately so it stays out of git.

---

## Conventions & gotchas worth remembering

- **Single shared component.** The AI Write bar is one instance with one state object, relocated between hosts via `HOSTS` + `mountShell()`. Never duplicate it per surface.
- **Every change must hold across the full matrix:** happy/A1, happy/A2, paywall/A1, paywall/A2 × composer and reply box.
- **Verify in a real browser** after each change — measured values, not assumptions. Several "CSS bugs" turned out to be baked-in SVG problems (icon padding in the viewBox, `#DEDEDE` stroke in `redo.svg`).
- **Don't pin widths on `border-box` elements** to equalise states — the slack lands on one side. Adjust padding in all states instead.
- **The shell's own CSS out-specifies** naive AI Write selectors. Scope through a parent (`.aiw-chip .fic img...`) rather than reaching for `!important`.
- Assets are **committed bytes** from Figma, not Figma URLs (which expire in 7 days).
- **Headless Chrome is the verification loop.** Copy the folder to a scratch dir, append a small `?s=<step>` driver script that calls `openComposer()` / `aiwToggle()` / `aiwSubmit()`, then `--headless --screenshot --virtual-time-budget=9000`. Crop with `sips` and compare to the Figma frame.

---

## Open items

- Nothing is committed to git — the whole folder is still untracked.
- Code Connect mappings for the Figma components were skipped.
- **Forward** does not have AI Write wired.
- If the pill genuinely needs to be wider than 88.83px, do it via symmetric padding (see §7).
- The prompt bar has **no leading AI icon**, though the Figma "Text field" node carries a 24px `Titan AI non fill` mark at its left. Pre-existing gap, not part of the 10 Aug changes — worth confirming whether it should be added.
- The `.aiw-mode` class is still toggled on the host frame but no longer drives any CSS (§10, change 3).
- The zip in `~/Downloads` predates the 10 Aug changes.
