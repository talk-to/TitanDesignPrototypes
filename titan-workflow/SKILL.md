---
name: titan-workflow
description: Aahna's design workflow for any Titan codebase (nike, nix, drive, ...). Use when starting design work in a repo, auditing a design before handoff, handing a design branch off to engineering, or resuming a design project after a break. Covers design/ branch setup, the dev overlay widget, per-project spec + running memory, the pre-handoff audit, and the design-to-dev handoff.
---

# Titan Workflow

A designer explores in a `design/<feature>` branch, iterates with a dev widget,
then hands clean code to engineering. Four phases, one memory file per project.

```
/design-start  →  ...work...  →  /design-audit  →  /design-handoff
     │                                 │                  │
     └──────── memory.md  ◄────────────┴──────────────────┘
              (spec + running log + audit receipts)
```

## Routing

Read only the file that applies. Do not read all of them.

| If the task is... | Read |
| --- | --- |
| Starting design work, cutting a branch, `/design-start` | `kickoff.md` |
| Reading or writing the memory file, resuming a project, cold-starting | `context.md` |
| Auditing before handoff, `/design-audit` | `audit.md` |
| Handing off to engineering, merging, `/design-handoff` | `handoff.md` |
| Anything about the overlay widget itself | `overlays/README.md` |

`context.md` is read by every other phase — it owns the memory file format and
the rule for locating it. Read it alongside whichever phase you are running.

## Review builds — design-side, not engineering QA

Two different things, often confused:

**Design-side review** happens on the `design/` branch, during the work. Its
audience is a manager, senior designer, PM, or a user test - people looking at
whether the design is right. A developer runs a build from the pushed branch, or
the designer runs one themselves if they have access. It may be a staging or a
prod-QA build; the practical difference is only which email accounts the
reviewer can test with.

**Engineering QA** happens *after* handoff, on the developer's `feature/` branch,
and is not part of this workflow.

So: push the `design/` branch when someone needs a build from it, not on
kickoff. Nothing here blocks on a review build, and the audit does not wait for
one - stakeholder approval and the pre-handoff audit are separate gates.

## Non-negotiables

1. The overlay widget exists **only** in `design/` branches. Never anywhere else.
2. `/design-handoff` refuses to run without a passing audit receipt newer than
   `HEAD`. If missing, offer to run `/design-audit` first.
3. Never commit to the repo's base branch (`develop` in nike). Never force-push
   a `design/` branch that has been shared for QA.
4. The `design/` branch is never rewritten. Collapsing variants happens only on
   the new `feature/` branch, so the exploration stays recoverable.

## Install (for other designers)

Clone this repo anywhere, then link it once:

```bash
ln -sfn "$PWD" ~/.claude/skills/titan-workflow
for f in commands/*.md; do ln -sfn "$PWD/$f" ~/.claude/commands/"$(basename "$f")"; done
```

Symlinks, not copies - `git pull` updates everything for everyone. Nothing in
this repo is machine-specific; per-designer paths resolve at runtime (see
`context.md`).
