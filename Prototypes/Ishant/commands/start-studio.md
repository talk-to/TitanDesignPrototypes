# Start the design system studio

## Agent instructions

When the user tags or references this file to run the design system, **run it for
them**. Treat a message containing only this file reference as a request to start
the studio. Do not merely repeat the commands or ask whether to proceed.

1. Resolve the workspace root three directories above this file's folder.
2. Check whether a Titan studio is already running on **any** port, not just the
   default 8031 — a previous run may have started it elsewhere. Locate the process
   and the port it is listening on:

   ```bash
   ps ax -o pid,command | grep "design ops/design system/studio.js" | grep -v grep
   lsof -nP -iTCP -sTCP:LISTEN | grep node
   ```

   Verify its configuration identifies this workspace's root `design-system/`
   content folder; do not assume any service on a port is the correct studio.
3. If the correct studio is running, reuse it on the port it already holds. Do not
   stop, kill or restart it to move it to another port, and do not start a second
   instance. Only when no correct studio is running, run the launcher from the
   workspace root in a persistent terminal session:

   ```bash
   bash "Prototypes/Ishant/commands/run-ds.command"
   ```

   If another service occupies port 8031, leave it running and pass an available
   port such as `8032` to the launcher.
4. Verify that the studio page and `/design-system/registry.json` respond
   successfully. Keep the server running after your response.
5. Return the working clickable preview URL of the studio that is actually live —
   the detected port, not the default. If startup fails, report the actual error and
   resolve routine issues without modifying unrelated projects.

## Manual instructions

From the **Titan Design Git** workspace root:

```bash
bash "Prototypes/Ishant/commands/run-ds.command"
```

Or double-click `run-ds.command` in Finder. It finds the workspace automatically.
Open [http://localhost:8031](http://localhost:8031). Keep the terminal running;
press **Ctrl+C** to stop. If a studio is already open on another port, use that
one instead of starting a second copy.

If the port is occupied:

```bash
bash "Prototypes/Ishant/commands/run-ds.command" 8032
```

Then open [http://localhost:8032](http://localhost:8032).

## Direct command

From the workspace root:

```bash
node "Prototypes/Ishant/design ops/design system/studio.js" start \
  --config design-system/studio.config.json \
  --port 8031
```

Requires Node.js, the studio checkout, and your local gitignored `design-system/`
content folder. Design-system usage instructions live in that content folder.
