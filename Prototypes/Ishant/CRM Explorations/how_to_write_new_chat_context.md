# How to write a `new_chat_context.md`

Conventions for the context documents in this tree. A `new_chat_context.md` exists so a **fresh chat with zero memory** can start work in a folder without re-deriving everything — and without confidently repeating decisions we already rejected.

There is one per meaningful prototype folder:

- 📄 `CRM Explorations/new_chat_context.md` — the base Titan shell architecture
- 📄 `CRM Explorations Merged Approach/new_chat_context.md` — the merged prototype

---

## 1. The one rule that matters

**Everything in it must be verified, not remembered.**

A context doc that is 90% right is worse than none, because a new chat trusts it and builds on the wrong 10%. Before writing a claim: open the file, grep the symbol, run the check. If you cannot verify something, either leave it out or mark it explicitly:

> ⚠️ *Unverified: inferred from the `!document.getElementById(...)` guard, not runtime-tested.*

Stale confident prose is the main failure mode. This tree already has an example — §4 of the parent `new_chat_context.md` says `CrmApp` "automatically fetches and mounts `crm_sidebar.html` at runtime." That was true when written and is now false: the drawer is inlined in `index.html`, so the fetch guard never passes. Nobody lied; the code moved and the doc didn't.

---

## 2. Required sections

Write them in this order. A new chat reads top-down and should be able to stop early once oriented.

| # | Section | Why it comes here |
|---|---|---|
| 1 | **What this folder is / read this first** | Orientation in three sentences. Which file is the real prototype, and what to open first. |
| 2 | **File map** | A table: file, size or line count, what it does, and **status** (live / dead / duplicate / stub). |
| 3 | **Architecture** | ASCII layout diagram plus a line-number table for the major regions. |
| 4 | **How the main flows work** | Entry-point function names with line numbers, in call order. |
| 5 | **⚠️ Traps** | Dead code, duplicated files, conflicting data. **The highest-value section.** |
| 6 | **Product decisions already made** | So they are not re-litigated. Include the *why*, not just the what. |
| 7 | **Where design and code diverge** | What is decided but not yet built. |
| 8 | **Open questions** | Genuinely unresolved, with the trade-off stated. |
| 9 | **Related docs** | Cross-links. |

---

## 3. Rules per section

### File map — always carry a status column

A new chat cannot tell a live file from an abandoned one, and will happily edit the dead copy. Mark every file:

- **live** — in the current execution path
- **dead** — present but unreachable (say *why*: no callers, a guard that never passes)
- **duplicate** — exists twice; say **which copy wins** and that they can drift
- **stub** — the UI exists, the handler `alert()`s

### Traps — be specific and cite lines

Bad: *"there is some legacy CRM code."*
Good: *"Two CRM panels coexist. The inline `#crm-panel` (`index.html:3909-4040`) is orphaned — `openCrmPanel()` (L6576) actively strips its `.open` class. Worse, `crm_app.js`'s `renderStageLabel` (L404) still writes to `#crm-ps-text`, an id that exists **only** inside that dead panel."*

The second version stops someone wasting an hour. The first does not.

### Decisions — record the reasoning

*"Work Items, not Deals"* invites re-argument. *"Work Items is one object named per business; **Deal is one of its names**, not the thing it must not be — a bakery takes orders, a clinic takes bookings"* does not.

### Design vs code — keep them visibly separate

The most dangerous ambiguity is a doc that describes an intended design in the present tense. If the sidebar is *designed* with three tabs but *built* with two different ones, say both and label which is which. Never let a decision read as though it shipped.

---

## 4. What to leave out

- **Do not duplicate another doc.** Link it. Two copies of the same fact drift within a week — link to `PRD.md`, `CANVAS-GUIDE.md`, or the design guidelines instead of restating them.
- **Do not paste long code.** Function name plus line number is enough; the file is right there.
- **Do not log CSS minutiae.** "Increased gap to 12px" is git history, not context. Section 7 of the parent doc drifted this way — it is a changelog wearing a context doc's clothes.
- **Do not write aspirations.** Roadmap belongs in `todos.md`.

---

## 5. Keeping it true

- **Date it.** Put `Last verified: YYYY-MM-DD` at the top. A reader can then judge how much to trust it.
- **Update it in the same change that invalidates it.** If you delete a function the doc names, fix the doc in that commit.
- **Re-verify §2–§5 before trusting them** if the date is older than a few weeks. Line numbers rot fastest.
- Prefer **line numbers over quoted code**: numbers going stale is obvious, stale quotes look current.

---

## 6. Skeleton

```markdown
# <Folder> — New Chat Context

Last verified: YYYY-MM-DD · branch: <branch>

## 1. What this is
Two or three sentences. Open <file> first.

## 2. File map
| File | Size | Purpose | Status |
|---|---|---|---|

## 3. Architecture
(ASCII diagram + line-number table)

## 4. Key flows
(entry points in call order, with line numbers)

## 5. ⚠️ Traps
(dead code, duplicates, conflicting data — cite lines)

## 6. Decisions already made
(with the why)

## 7. Design vs code
(decided but not built)

## 8. Open questions
(with the trade-off)

## 9. Related docs
```

---

## 7. A note on auto-loading

`new_chat_context.md` is **not** loaded automatically — it has to be `@`-mentioned. Only a `CLAUDE.md` loads on its own, and there is none in this repo.

So either mention the file explicitly at the start of a session, or add a short `CLAUDE.md` that points at it. If you add one, keep it a **pointer**, never a copy.
