# Titan design ops

Start here for Titan design-system work. The shared DS content lives at the
workspace root in `design-system/`, not in the studio folder beside this file.

- [Using the design system](../../../design-system/USAGE.md) — how to reuse tokens, components and icons.
- [Agent instructions](../../../design-system/AGENTS.md) — required workflow and further reading.
- [Component catalog](../../../design-system/registry.json) — registered definitions and source paths.
- [Run the studio](../commands/RUN-DS.md).

## Agent instruction: run DS means follow DS

Referencing this file or saying “run DS” in this workspace instructs the agent to
follow the Titan design system for the current task and subsequent related screen
work in this conversation. No additional “follow the DS” prompt is required.

- Read and follow the linked shared AGENTS.md and USAGE.md. Use their current
  change-specific checklist; do not reread unchanged instructions already loaded.
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
  [Run the studio](../commands/RUN-DS.md), verify it, and return its preview URL.
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
