# Kickoff — /design-start

Runs unattended except for gathering the spec. Do not stop to confirm between
steps 1-4 unless something fails.

## 1. Check the tree is clean

`git status --short`. If there are uncommitted changes, stop and ask what to do
with them - never stash or discard without permission.

## 2. Detect the base branch

`git symbolic-ref refs/remotes/origin/HEAD` → strip to the branch name
(`develop` in nike). If that fails, check the repo's own CLAUDE.md, then ask.

## 3. Name and cut the branch

Ask the designer for the feature name. Enforce: lowercase, hyphenated, no
`design/` prefix in their answer (add it yourself). Confirm the full branch name
back before creating it.

Branch from the remote tip, not a stale local copy:

```bash
git fetch origin <base>
git checkout -b design/<feature> origin/<base>
```

## 4. Environment

Read `.nvmrc`. If the active node differs, run `nvm use` in the same shell as
the dev server - **nike needs 24.13.1 and shells often default to 20.x**, which
fails in confusing ways.

Find the dev command in `package.json` scripts (`yarn start` in nike). Launch it
in the background. Report the local URL once it is serving; if it fails, show
the error rather than retrying blindly.

## 5. Gather the spec

**Ask what already exists before asking anything else.** Designers usually
arrive with context, not a blank page:

> Do you have a spec, ticket, Figma link, or research to point me at - or do you
> want to just talk me through it?

Accept any of these and extract from them rather than re-interviewing:

- A PM spec doc (PDF, docx) - convert local files with the `markitdown` MCP
  (`file://` URIs only, never a URL)
- A pasted ticket, Slack thread, or Figma link
- A long spoken or typed brain-dump, however unstructured
- `titan-context/` for persona and product context, `titan-ds/` for tokens - use
  what is already on disk instead of asking for it

Then **ask only about material gaps** - things that would change what gets
built. Never re-ask what you were just given.

### Scale the questions to the work

Judge the size from what they have described, and say which mode you are in so
they can correct you.

**Small - a UI fix, a chore, a clear implementation.** Do not ask about personas
or problem statements; it is noise. Two questions are enough:
1. What is being changed, and what does correct look like?
2. Anything that must not change?

**Feature-size - new capability, real design decisions.** Cover:
1. What is broken or missing? (the problem, in a sentence or two)
2. Who is this for, and why are they the priority persona?
3. What is explicitly **out** of scope?
4. How will we know it worked?
5. What led here - research, interviews, a complaint, a metric? Links?
6. Which parts are you unsure about and expect to iterate on?
7. Which edge cases matter - empty, loading, error, long content, permissions?

Accept "skip" or "don't know yet" on anything. A thin spec beats a stalled one;
gaps get filled as the work goes.

**Do not ask developer-handoff questions here.** Those are tertiary at kickoff
and go stale. `handoff.md` asks them at the moment they matter.

## 6. Decide the overlay

Do not ask this as a standalone question. It follows from step 5: **if the
designer described options, alternatives, or anything they expect to iterate on
and compare, the overlay is needed.** If the implementation is settled and there
is nothing to compare, it is not - that is a normal and common answer.

State your read and let them correct it:

> You mentioned comparing two hero layouts - I'll add the dev widget so you can
> toggle them live in review. Say the word if you'd rather not.

If yes:

1. Copy the template into the repo:
   `cp -R <titan-workflow>/overlays/dev-overlay <repo>/src/arch/vanguard/dev-overlay`
2. Add the marked mount block to the app entry (`src/index.js` in nike) - keep
   both marker comments, they are what makes the strip deterministic:

   ```js
   /* TITAN-DEV-OVERLAY:START — design branch only, strip before handoff */
   import '@vanguard/dev-overlay';
   /* TITAN-DEV-OVERLAY:END */
   ```
3. Fill in `variants.config.ts` with the options the designer described in
   step 5. An empty config renders nothing, so seed it with what they actually
   said rather than leaving it blank.
4. Record `Overlay: yes` in the memory file, and add each group to the
   `## Variants` table with `Chosen` left blank - the audit resolves those.

Full detail in `overlays/README.md`. Options can be added as the work goes; the
initial set does not have to be complete.

## 7. Write the memory file

Create `<memory-folder>/<feature>/memory.md` from the template in `context.md`,
filled with what step 5 produced and the environment facts from step 4. Resolve
the memory folder per `context.md` - never hardcode a path.

For small work, leave the unused spec headings in place but empty. The shape is
what makes the file fast to read later.

## 8. Report

Confirm briefly: branch created, server URL, overlay yes/no, memory file path.
Then stop - the designer drives from here.

The branch is **not pushed** at this point. See "Review builds" in `SKILL.md`
for how design-side review gets a build.
