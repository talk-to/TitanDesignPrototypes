# Audit — /design-audit

The pre-handoff gate. Its job is to make the handoff boring: nothing for the
developer to reverse-engineer, no use case discovered late.

Can also be run mid-project as a sanity check. Only the latest receipt counts.

## 1. Establish the audit surface

Read the memory file first (`context.md` for how to find it), then work out what
you are actually auditing. **Do not assume `git diff <base>...HEAD`.** A design
branch is often not cut fresh from the base, and the work is often uncommitted.

```bash
git status --porcelain                    # working tree, including untracked
git log --oneline <base>..HEAD | wc -l    # commits unique to the branch
git merge-base <base> HEAD | xargs git log -1 --format='%h %ad' --date=short
```

Pick the surface from what those return:

| Situation | Audit surface |
| --- | --- |
| Uncommitted changes, no branch commits | The working tree. `git diff` plus untracked files - **remember `git diff` alone hides new files**, and a new folder is usually where the real work is |
| A handful of branch commits, clean tree | `git diff <base>...HEAD` |
| Both | Both, together |
| Hundreds of branch commits, or a merge-base far older than the memory file's `Started` date | The branch is **not** freshly cut - it carries unrelated history. `<base>..HEAD` is meaningless. Use the working tree plus `git log --since=<Started>`, and confirm the set with the designer before auditing |

State which surface you chose and why, in one line, before going further. Then
reconcile the commit log per `context.md`.

## 2. Resolve the variants — required

For every row in `## Variants` with an empty `Chosen`, ask which option won and
why. **The audit cannot pass with an unresolved variant** - handoff collapses
code based on these answers, so a blank here means dead code ships.

Record the winner and the reasoning in the table.

## 3. Scope check against the spec

- Everything in `Scope — in` actually built? List anything missing.
- Anything built that is in `Scope — out`, or in neither? Flag scope creep -
  it is the developer's problem to review, so it should be deliberate.
- `Success` criteria still met by what was actually built?

## 4. Design system

Read `titan-ds/design-system-context.md`. Check the diff for:

- Hardcoded colors, spacing, radii, font sizes where a token exists
- Tokens used for the wrong semantic role
- New values invented when the system already had one

Prefer the fix the design system already contains.

## 5. States and edge cases

Walk each new or changed surface: **empty, loading, error, long content,
truncation, zero/one/many, permissions, offline.** Compare against the spec's
edge-case list and name any that were never designed - this is where handoffs
most often leak.

## 6. Accessibility

Separate real failures from taste. **Fix** these before handoff:

- Text contrast below 4.5:1 (3:1 for large text) - compute it, do not eyeball it
- Hit targets under 44x44
- Keyboard reachability and a visible focus state
- Labels on icon-only controls

Density and type-scale opinions are proposals for the designer, not blockers.

Resolve tokens to a hex value before computing - they usually chain
(`--text-color-very-subtle` → `--tertiary-text-three` → `#888888`) and differ per
theme. Check light **and** dark; one commonly passes while the other fails.

## 7. Repo rules — defer, do not duplicate

Read the repo's own `CLAUDE.md` and `.claude/rules/` and check the diff against
them. Do not restate them here; they change without this file knowing.

In nike this currently means: `data-test-id` on interactive elements, all
user-facing strings through react-intl, `yarn update-translations` run for new
strings, tests for changed behaviour, custom theme applied to modals and
popovers, no `any` or `@ts-ignore`, path aliases not relative cross-layer
imports.

Then, scoped only to changed files - never the whole project:

```bash
npx eslint <changed files>
npx tsc --noEmit <changed files>
yarn test <relevant test files>
```

## 8. Separate inherited from introduced

Before writing anything up, test every finding: **does this problem already
exist in code this branch did not touch?** Prove it with a grep or a line
reference - do not guess.

- **Introduced** - this work created it. Judge on merit.
- **Inherited** - a pre-existing pattern the design system or codebase already
  has. Label it `inherited`, cite the breadth (how many files, and one example
  in unchanged code), and downgrade it to a **warning**.
- **Inherited and extended** - pre-existing, but this work adds a *new* instance
  of it. Stays a **blocker**, still labelled `inherited`, with the systemic scope
  stated so the fix is scoped as a design-system call rather than a patch in one
  file.

This matters because the alternative is re-reporting the same systemic issue as a
fresh blocker on every audit, which trains designers to ignore the receipt. An
inherited finding should read the same way on the fifth audit as the first.

Never quietly drop an inherited finding - a warning is not silence.

## 9. Write the receipt

Append to `## Audit receipts` in the memory file:

```markdown
### 2026-09-01 · commit a1b2c3d | working tree
**Surface:** what was audited, and why that surface
**Result:** PASS | FAIL
**Variants:** hero=split
**Blockers:** none | numbered; mark any `inherited`
**Warnings:** things worth knowing that do not block
**Inherited:** systemic issues, with breadth — not this work's fault, not fixed here
**Passing:** what was actually verified, so the next audit need not redo it
```

`FAIL` on: an unresolved variant, an accessibility failure from step 6, a
broken repo rule, or an undesigned edge case on a shipping surface - **including
one created by an early return that skips a surface** rather than by missing
design. Warnings never block.

Pay particular attention to states that **correlate** rather than combine
independently. If condition A makes condition B more likely, the pair is a
likely state, not an edge case, and a surface that handles neither is a blocker.

## 10. Report

State the result plainly. If `FAIL`, list blockers in severity order and offer
to fix them. Never soften a fail - the whole point is catching it here rather
than in review.
