#!/bin/bash
set -euo pipefail
commands_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
workspace_dir="$(cd -- "$commands_dir/../../.." && pwd)"
exec node "$workspace_dir/Prototypes/Ishant/design ops/design system/studio.js" start \
  --config "$workspace_dir/design-system/studio.config.json" \
  --port "${1:-8031}"
