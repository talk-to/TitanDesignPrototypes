# Handoff — /design-handoff

Moves approved work from `design/<feature>` to a branch a developer can take
forward. The `design/` branch is **never rewritten** - everything happens on the
new branch, so the exploration stays recoverable forever.

## 1. The gate — do this first

Read `## Audit receipts` from the memory file. Handoff proceeds only if the
latest receipt is `PASS` **and** its commit sha is `HEAD`.

If there is no receipt, or it predates `HEAD`:

> No passing audit since `<sha>` (`<n>` commits back). Run `/design-audit` first?

Wait for an answer. If they choose to skip anyway, say plainly what is being
skipped and record `Audit: skipped by designer` in the receipts section. Never
skip silently - a designer who has not read these docs depends on this gate.

## 2. Who takes it forward

Ask: is the designer opening the PR, or handing the branch to a developer? It
changes only the final report - what to tell them, or what to tell the dev.

## 3. Cut the handoff branch

Ask for the type and name, following the repo's convention:

| Type | When |
|---|---|
| `feature/<name>` | new capability |
| `fix/<ticket>-<name>` | bug fix (nike wants the ticket number) |
| `chore/<name>` | maintenance, refactor |

Branch from the current remote tip of the base, not from a stale local ref:

```bash
git fetch origin <base>
git checkout -b feature/<name> origin/<base>
git merge --squash design/<feature>
```

Squash by default: the developer gets one reviewable commit instead of a
designer's exploration history. Offer full history if they ask - some teams
want it.

If the base has moved and conflicts appear, resolve them in favour of the base
for anything outside the design's surface, and ask about anything inside it.

## 4. Strip the overlay

```bash
rm -rf src/arch/vanguard/dev-overlay
```

Then delete the marked block from the app entry (`src/index.js` in nike),
markers included:

```js
/* TITAN-DEV-OVERLAY:START — design branch only, strip before handoff */
import '@vanguard/dev-overlay';
/* TITAN-DEV-OVERLAY:END */
```

Also remove any `html[data-titan-design-variant-<key>]` style blocks - those are
variant styling rather than overlay chrome, so they belong to step 5, but they
live in product `.less` files and are the easiest thing here to miss.

## 5. Collapse the variants

For every row in `## Variants`, using the winner from the audit receipt:

- Remove the losing components, the conditional, and their unused styles
- Inline the winner directly
- Delete the variant's registration with the widget

```tsx
// before
{variant === 'split' ? <HeroSplit/> : <HeroStacked/>}
// after
<HeroSplit/>
```

Nothing is lost: `design/<feature>` still holds every variant, still runnable
with the widget attached.

## 6. Verify — mechanical, not by eye

All of these must come back clean before the handoff is called done:

```bash
# --untracked matters: plain `git grep` searches TRACKED files only, so an
# uncommitted overlay folder would be skipped and the check would pass on a
# tree that still contains all of it.
git grep -n --untracked "TITAN-DEV-OVERLAY"          # must be empty
git grep -n --untracked "dev-overlay"                # must be empty
git grep -n --untracked "useVariant"                 # must be empty
git grep -n --untracked "data-titan-design-variant"  # must be empty
git grep -n --untracked "__titanDesign"              # must be empty
git grep -n --untracked "<each variant key>"         # must be empty
npx eslint <changed files>              # scoped only
npx tsc --noEmit <changed files>        # scoped only
yarn test <relevant tests>
```

If new user-facing strings were added, run `yarn update-translations`.

Report the actual output. A failing check is a failing handoff - say so.

## 7. Handoff notes — ask now, not at kickoff

These go stale if asked earlier, so they are asked here:

1. Ticket or Jira number, if there is one (nike wants it in the branch and PR
   title for fixes).
2. Anything a developer needs to know that the diff does not show - a decision
   that looks arbitrary, a constraint you worked around.
3. Anything deliberately left undone, and why.
4. Does this need backend or API work the designer could not do? Flag it
   explicitly; it is the most common thing to lose at handoff.

Write the answers into the memory file and into the PR description.

## 8. Commit, push, report

Commit with the repo's PR title format (`[feature] …`, `[bugfix] …`,
`[chore] …`). Push and report the branch name plus what a reviewer should know:
what changed, which variant won and why, anything deliberately out of scope.

Then update the memory file: `Status: handed off`, the `Handoff branch` row, and
a `## Decisions` entry for the final direction if it is not already there.

## 9. Leave the design branch alone

Do not delete or force-push `design/<feature>`. It is the record of the
exploration and the only way back to a rejected variant. It is never merged -
the `feature/` branch is - so automatic branch cleanup will not remove it, but a
human might. Leave it alone.

Engineering QA now happens on the developer's branch. That is outside this
workflow; design-side review already happened during the work (see "Review
builds" in `SKILL.md`).
