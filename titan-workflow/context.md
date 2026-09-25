# Project Memory

One file per design project: the spec, the decisions, the commit log, the audit
receipts. It exists so a session can cold-start with full context in one read
instead of twenty questions.

## Locating the memory folder

Resolve in this order. Stop at the first hit.

1. **Sibling** — `titan-projects/` next to the current repo (`../titan-projects`
   from inside `nike/`). Use it if it exists.
2. **Recorded** — the path on the first line of `~/.claude/titan-workflow.local`.
3. **Ask** — ask the designer where project context should live, then write that
   path to `~/.claude/titan-workflow.local` so it is never asked again.

The project folder is `<memory-folder>/<feature>/`, where `<feature>` is exactly
the suffix of the `design/<feature>` branch. The file is `memory.md`.

```
~/work/titan-projects/ai-label-capping/memory.md   ←  design/ai-label-capping
```

This folder may or may not be a git repo. **Never `git add` or commit in it**
unless the designer explicitly asks - and never assume a remote exists.

## One designer per branch

Assumed: two designers never work the same `design/` branch at the same time.
Handover is sequential - the second designer picks up after the first has closed
their work.

So the memory file has a single owner and needs no merge handling. When work
changes hands, the outgoing designer can share their memory file directly, or
the incoming one can start a fresh file. Both are fine; do not try to reconcile
two copies.

## Template

Write this on `/design-start`. Keep every heading, even if a section is empty -
the shape is what makes it fast to read.

```markdown
# <Feature name>

| | |
|---|---|
| Repo | nike |
| Design branch | design/<feature> |
| Base branch | develop |
| Started | 2026-09-01 |
| Status | in progress \| audited \| handed off |
| Handoff branch | feature/<name> (once cut) |

## Environment
Recorded on kickoff so later sessions skip the setup questions.
- Node: 24.13.1 (`nvm use`)
- Start: `yarn start`
- Overlay: yes \| no

## Spec
**Problem** — what is broken or missing, in one or two sentences.
**Persona** — the priority persona, and why they are the priority here.
**Context** — what led to this; prior art; links to research or Figma.
**Scope — in** — bulleted, specific.
**Scope — out** — bulleted. As important as "in".
**Success** — how we know it worked. Observable, not aspirational.
**Edge cases** — empty, loading, error, long content, permissions, offline.

## Variants
| Key | Options | Chosen | Why |
|---|---|---|---|
| hero | split, stacked | split | Stakeholder read the split layout faster |

## Decisions
### <Decision title>
**Decided:** what was chosen
**Why:** the reasoning
**Rejected:** alternatives and why they were ruled out
**Didn't work:** anything attempted that failed

## Commit log
Last logged: <full sha>
| Commit | Message | Note |
|---|---|---|
| a1b2c3d | add hero variant B | why it was made, if not obvious |

## Audit receipts
_Written by /design-audit. Read by /design-handoff._

## Open questions
- Anything unresolved or waiting on someone.
```

## Keeping the commit log current

No git hook. Hooks are unreliable here - nike sets `core.hooksPath=.husky/_`,
so `.git/hooks/` never fires, and husky regenerates its own directory on
`yarn install`.

Instead, **reconcile against git** whenever you touch the project:

1. Read `Last logged:` from the memory file.
2. `git log <last-logged>..HEAD --oneline` in the repo.
3. Append every missing commit to the table.
4. Update `Last logged:` to the current `HEAD` sha.

Handle these cases rather than assuming commits exist:

- **Nothing committed yet.** Common on design branches - the work sits in the
  working tree for days. Write
  `Last logged: (no commits yet — working tree only)`, note the reconcile date so
  the next session knows the check ran, and move on. There is nothing to log and
  that is not a problem.
- **`Last logged:` absent, or its sha unknown to git** (rebased, squashed, fresh
  branch). Fall back to the commits unique to the branch:
  `git log <base>..HEAD --oneline`.
- **That fallback returns hundreds of commits.** The branch was not cut fresh
  from the base - it carries unrelated history. Do not log them. Record the
  merge-base and its date in the commit log so nobody mistakes the base-diff for
  this project's work, and log only commits since the memory file's `Started`
  date (`git log --since=<Started>`).

Add the **why** for anything non-obvious - the facts come from git, the
reasoning only exists in the session. When a decision is made, write it to
`## Decisions`, not just the commit note.

## Resuming a project

Read the memory file **first**, before searching the codebase. It should answer:
what this is, who it is for, what is in and out, which variants exist and which
won, what has been decided, and what is still open. Then reconcile the commit
log, and only then start work.

If the memory file contradicts the code, the code is the truth - fix the file
and note the drift.
