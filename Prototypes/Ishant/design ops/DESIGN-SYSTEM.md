# Titan design ops

Start here for Titan design-system work. The shared DS content lives at the
workspace root in `design-system/`, not in the studio folder beside this file.

- [Using the design system](../../../design-system/USAGE.md) — how to reuse tokens, components and icons.
- [Agent instructions](../../../design-system/AGENTS.md) — required workflow and further reading.
- [Component catalog](../../../design-system/registry.json) — registered definitions and source paths.
- [Run the studio](../commands/RUN-DS.md).

## Starting a new chat

Open this workspace and reference this DESIGN-SYSTEM.md, then say:

> Work with the existing Titan design system. Read the shared `design-system/USAGE.md`
> and `design-system/AGENTS.md` at the workspace root, and follow their referenced
> instructions. Inspect the registered implementations before making shared changes.
> My task: …

## Folder locations

- `../../../design-system/` — shared tokens, components, icons, specimens and instructions.
- `design system/` — DS Starter studio tooling, maintained as a separate repository.
- `DS-specific shells/` — shells connected to the shared DS.
- `design-system-recovery/` — recovery material.

The root `design-system/` folder is currently gitignored. These links point to local
files; they do not copy or track that content. A fresh clone needs the shared content
restored before the links can work. Keep instructions at their source to avoid drift.
