# titan-workflow — Decision Log

Decisions about this workflow tool, not about any project built with it.
Per-project decisions live in each project's own `memory.md`.

---

## Where the workflow lives
**Decided:** Its own git repo at `~/work/titan-workflow/`, symlinked into
`~/.claude/skills/`. Not inside nike.
**Why:** Skills in `~/.claude/skills/` load in every repo regardless of location,
so the workflow works in nike, nix, drive, or anything cloned later. A symlink
means one source of truth: edit in the repo, `git pull` updates every designer.
**Rejected:** Files inside nike hidden with `.gitignore` - it is a committed,
shared team file, so personal rules would reach every nike developer.
`.git/info/exclude` would stay local, but the files would still be trapped in one
repo and lost on re-clone.

## Flat, one skill — not one skill per phase
**Decided:** Repo root is a single skill. Phases are `.md` files routed from a
table in `SKILL.md`.
**Why:** Claude Code requires one folder per skill, so N skills means N symlinks -
and a new symlink every time a workflow is added. That is the step a teammate
forgets. Flat has one symlink, created once, nothing to maintain.
`apple-design` already proves the pattern: one skill, 53 routed reference docs.
**Rejected:** `skills/` + `overlays/` nested layout. Real cost (per-skill
symlinks) for a benefit not yet needed (independent trigger descriptions). If one
workflow later needs its own trigger, it gets its own folder then - a five-minute
change, no rework.

## Slash commands, with a fact-check gate
**Decided:** `/design-start`, `/design-audit`, `/design-handoff` as explicit
entry points. Plus `handoff.md` refuses to run without a `PASS` audit receipt
whose sha equals `HEAD`.
**Why:** Commands are unambiguous - the right phase runs every time. But a
designer who has not read the docs will skip the audit, and a reminder in a doc
does not help someone not reading it. Checking the receipt against git makes the
gate structural rather than advisory.
**Rejected:** Auto-triggering from plain language alone - risks loading the wrong
phase or missing the trigger. Relying on designers to remember the audit.

## Per-project memory in titan-projects, resolved at runtime
**Decided:** `<memory-folder>/<feature>/memory.md`, where the folder resolves as:
sibling `titan-projects/` next to the repo → path recorded in
`~/.claude/titan-workflow.local` → ask once and record.
**Why:** Sibling detection means zero config for anyone using the `~/work/`
layout, and a single question for anyone who is not. Nothing machine-specific
enters the shared repo, which is what makes it scale past one designer.
**Rejected:** A folder inside each repo - lost on re-clone, no backup, separate
pile per repo. The titan-workflow repo itself - teammates who clone the tool
would see each other's specs.
**Note:** `titan-projects` is a private repo on `aahna-titan`, so memory files
are backed up there. Another designer's folder may not be a repo at all, so the
skill never assumes it can commit.

## Commit log reconciled against git, no hook
**Decided:** The memory file records the last logged sha; any session runs
`git log <last>..HEAD` and backfills what is missing.
**Why:** nike sets `core.hooksPath=.husky/_`, so `.git/hooks/post-commit` never
fires - a hook there would have been silently dead. `.husky/_/post-commit` is
gitignored and would fire, but husky regenerates that directory on
`yarn install`, so it would vanish without warning. Reconciling needs no file
anywhere, survives `yarn install`, works in any repo, and self-heals after a
long gap.
**Didn't work:** The original plan was a `post-commit` hook. Chosen, then found
non-viable when `core.hooksPath` was checked.

## Variants collapse on the feature/ branch only
**Decided:** At handoff, losing variants are deleted and the winner inlined - on
the new `feature/` branch. `design/` is never rewritten.
**Why:** A developer inheriting a ternary cannot tell which side is real, and a
diff containing three rejected designs is unreviewable; worst case both paths
ship. Doing it only on `feature/` means the rejected work stays runnable on the
`design/` branch, so collapsing destroys nothing and is reversible.
**Rejected:** Porting all variants with a comment marking the winner - ships dead
code and moves the cleanup to someone with less context.

## Overlay: one folder, one mount line
**Decided:** All widget code in a single folder plus exactly one import line at a
known entry point.
**Why:** It makes removal *verifiable* - handoff greps for the folder name and
fails if anything remains, instead of trusting that someone remembered. Without
physical separability, "port everything except the overlay" is guesswork.
**Open:** How a component reads the current variant, which decides how much (if
anything) lands in repo source files.

## Audit defers to each repo's rules
**Decided:** `audit.md` reads the repo's own `CLAUDE.md` and `.claude/rules/`
rather than restating them.
**Why:** nike's rules change without this repo knowing. A copy would rot and
start giving wrong advice with full confidence.

## Spec gathering is adaptive, and the overlay follows from it
**Decided:** Ask what context already exists first (PM doc, ticket, Figma,
brain-dump), extract from it, then ask only about material gaps. Scale the
questions to the size of the work - no persona questions for a UI chore.
Developer-facing questions move to handoff. The overlay decision is inferred
from whether the designer described options to compare, not asked separately.
**Why:** Designers arrive with context, not a blank page. A fixed questionnaire
re-asks what was just handed over and asks persona questions about a padding fix.
Iterating is the actual trigger for needing the widget, so asking about it
separately duplicates a question already answered.

## Design review builds are not engineering QA
**Decided:** Design-side review (manager, PM, senior designer, user testing)
happens on the `design/` branch during the work, via a build a developer or the
designer runs. Engineering QA happens after handoff on the `feature/` branch and
is outside this workflow. The branch is not pushed at kickoff.
**Why:** Conflating them would make the audit wait on stakeholder approval.
They are independent gates: stakeholders decide if the design is right, the audit
decides if the handoff is clean.

## One designer per branch
**Decided:** Assumed; no merge handling for memory files. Handover is sequential,
and the incoming designer either receives the file or starts fresh.
**Why:** Confirmed as how the design team actually works. Building for concurrent
editing would add machinery for a case that does not occur.

## Audit findings are classified inherited vs introduced
**Decided:** Every finding is grep-proved against untouched code. Inherited
(pre-existing pattern) downgrades to a warning; inherited-and-extended stays a
blocker but is labelled, with its systemic breadth stated.
**Why:** The first real audit run hit a contrast failure in a token used across
13 `.less` files, including unchanged code in the same module. Reporting that as
a fresh blocker every audit would train designers to ignore receipts, and would
scope the fix as a one-file patch when it is a design-system call.
**Rejected:** Reporting every failure identically regardless of origin. Also
rejected: suppressing inherited findings entirely - a warning is not silence, and
the designer still needs to know what they are shipping on top of.

## The audit surface is derived, never assumed
**Decided:** `audit.md` works out what to audit from git state - working tree,
branch commits, both, or a narrowed window - and says which it chose.
**Why:** The docs assumed `git diff <base>...HEAD`. The first real run returned
790 commits, because the branch carried the entire AI Inbox history rather than
being cut fresh, while 100% of the actual design work was uncommitted. The
assumed lens showed everything except the work.
**Didn't work:** Trusting `<base>..HEAD`, and trusting `git diff` alone - it
hides untracked files, and on that branch a brand-new folder was the main
deliverable.

## Variant attribute is `data-titan-design-variant-<key>`
**Decided:** The long form, not a short prefix.
**Why:** The first choice, `data-v-`, was wrong twice over — it is Vue's
scoped-style attribute prefix, and nike already owns a `data-titan-*` product
namespace (`data-titan-email-file-id`, confirmed by grep). The handoff gate only
works if its grep string cannot appear for any other reason, so uniqueness beats
brevity here even though designers type it in every CSS selector.
**Rejected:** `data-tdv-` for symmetry with the `tdo-` class prefix — short, but
opaque to a developer meeting it cold on a design branch, and not provably unique.

## The overlay mounts from the app entry, not the webpack config
**Decided:** One marked block in `src/index.js` (the app entry), delimited by
`TITAN-DEV-OVERLAY:START` / `:END` comments.
**Why:** Every JS app has an entry module; not every repo has nike's webpack
shape, and this workflow has to serve nix and drive too. The markers make removal
deterministic — delete between them rather than hunting an import that may have
moved — and give the gate a grep string that exists for no other reason.
**Rejected:** A dev-only webpack `entry` addition, which would keep the module out
of production bundles entirely. It needs a second edit to `config/paths.js`
(Node's `require.resolve` cannot resolve `.tsx`), it is nike-specific, and a
webpack-config diff inside a design handoff reads as alarming to a reviewer.
Also rejected: a guarded `require()` so the bundler could drop it — nike sets
`global-require: 'error'`, so it would cost an eslint-disable in a core entry
file. The residual cost is a few KB of no-op code *if* the block ever survived
handoff, and the grep is the real defence.
**Didn't work:** `.git/info/exclude` on the overlay folder, to make it
uncommittable. Actively wrong — a developer builds the design-review build from
the pushed branch, so the overlay must be committed on `design/` branches. The
boundary is the handoff, not the commit.

## Handoff greps must pass `--untracked`
**Decided:** Every verification grep uses `git grep --untracked`.
**Why:** Found by running the install-and-strip cycle for real in nike. Plain
`git grep` searches tracked files only, so it reported one hit for `dev-overlay`
(the import line) while ignoring the entire 580-line untracked folder beside it.
At handoff the squash-merge usually makes everything tracked, but a gate that
passes on an untracked tree is not a gate.
