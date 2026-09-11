# Titan design ops

Start here for Titan design-system work. The shared DS content lives at the
workspace root in `design-system/`, not in the studio folder beside this file.

- [Component registration contract](../../../design-system/COMPONENT-REGISTRATION.md) — authoritative component boundaries, state categories and preview rules.
- [Using the design system](../../../design-system/USAGE.md) — how to reuse tokens, components and icons.
- [Agent instructions](../../../design-system/AGENTS.md) — required workflow and further reading.
- [Component catalog](../../../design-system/registry.json) — registered definitions and source paths.
- [Run the studio](../commands/start-studio.md).

## Agent instruction: run DS means follow DS

Referencing this file or saying “run DS” in this workspace instructs the agent to
follow the Titan design system for the current task and subsequent related screen
work in this conversation. No additional “follow the DS” prompt is required.

- Read and follow the linked shared AGENTS.md and USAGE.md. Use their current
  change-specific checklist; do not reread unchanged instructions already loaded.
- Mandatory: inspect existing components and variants for the whole and its parts
  before extracting or registering anything new. Compose suitable existing children
  first; show mismatches for review instead of inventing near-duplicates or variants.
- Mandatory: reuse components unchanged, including nested children. Do not override
  their internal styling or add variants without an explicit user request. Leave
  mismatches visible and report them; follow shared AGENTS.md for the full rule.
- Mandatory: distinguish caller-owned state values from child-owned control treatment
  and parent-owned actions. State alone does not justify a new component; read
  USAGE.md’s mandatory state ownership and component boundary rule.
- Every independently interactive section must use a registered component instance.
  Follow USAGE.md’s interaction ownership and registration rule for all components,
  not just split controls. Parent state targets cannot replace child registration.
- New components must follow shared AGENTS.md’s mandatory registration rules: clear
  responsibility, real standalone preview, ownership, direct dependencies and verified consumers.
- Existing components/compositions come first, including Action group and App grid.
  Reuse a suitable registered implementation before consulting layout guidance for
  uncovered arrangements; the guidance does not deprecate those components.
- For screen layouts, read the shared DS layouts/README.md for list, grid,
  row and footer guidelines. Apply tokenized spacing in existing screen code; no
  required recipe import or class. Parent layout choices are freely configurable;
  child component internals remain protected.
- Before building, inspect the catalog and reuse matching shared implementations,
  tokens and icons. A similar-looking copy is not component reuse. Keep one-off
  layout screen-owned and use existing spacing roles or primitives appropriately.
- For new or rearranged screens, perform the required visual spacing review with
  the available inspector. Maintain affected component spacing mappings. Report
  unavailable browser checks honestly; follow the checklist for review scope.
- Keep checks proportional to the change and paperwork light. This is primarily a
  prototype library; visual consistency and easy reuse remain priorities.
- If a task accompanies this reference, carry it out using the DS. If the request
  is only this reference or “run DS”, start or reuse the studio by following
  [Run the studio](../commands/start-studio.md), verify it, and return its preview URL.
  Apply DS guidance to subsequent related tasks without requiring it to be repeated.
- Reuse a studio that is already running. Never stop, kill or restart a live Titan
  studio in order to move it to a different port, and never start a second copy
  beside it. Whatever port it already holds is the correct port.
- Always report the live studio’s current URL. Detect the running instance rather
  than assuming 8031: find the studio process and the port it is actually listening
  on, confirm it serves this workspace’s root `design-system/` content, then return
  that clickable link — in this reply and in later replies whenever the studio is
  relevant. Start a new instance only when no correct studio is running.

```bash
# Current active studio: process, port, then verify it responds.
ps ax -o pid,command | grep "design ops/design system/studio.js" | grep -v grep
lsof -nP -iTCP -sTCP:LISTEN | grep -E "^node .*<pid>"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:<port>/design-system/registry.json"
```

This instruction does not authorize unrelated screen migrations or override a later
explicit request to use another system. Detailed rules stay in the linked shared
files so this entry point does not become a second checklist.

## Folder locations

- `../../../design-system/` — shared tokens, components, icons, specimens and instructions.
- `design system/` — DS Starter studio tooling, maintained as a separate repository.
- `DS-specific shells/` — shells connected to the shared DS.
- `design-system-recovery/` — recovery material.

The root `design-system/` folder is currently gitignored. These links point to local
files; they do not copy or track that content. A fresh clone needs the shared content
restored before the links can work. Keep instructions at their source to avoid drift.
