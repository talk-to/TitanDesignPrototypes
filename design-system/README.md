# Titan design system

A growing Titan catalog, initially informed by TitanEmailShell. Read FINDINGS.md
for the durable color, typography, spacing, shape and behavior evidence, then AGENTS.md
for the current upstream workflow. The first screen is a reference, not the scope limit.

From the Titan Design Git workspace root:

```sh
node "Prototypes/Ishant/design ops/design system/studio.js" start --config design-system/studio.config.json --port 8031
node "Prototypes/Ishant/design ops/design system/studio.js" check --config design-system/studio.config.json
```

Open http://localhost:8031/#foundations for the native foundation catalog, or
http://localhost:8031/#overview for the studio overview. The studio reads tokens
and registry entries directly from this folder; no separate presentation rebuild
or sandbox data import is required. The source shell is at /app/index.html.

The independent ds-starter checkout is restored to upstream e544b39 (0.3.0).
Previous local UI edits are in a recovery archive and Git stash, not installed.
Keep all Titan content and future evidence here so studio updates preserve it.
The existing standalone specimen files remain supporting references, not primary
navigation. Components have deliberately not been extracted yet.
