# Figma color palette

The user-supplied `Prototypes/Ishant/design ops/DS-specific shells/colorVariables` is the preferred palette. Its repeated blocks are identical and are deduplicated into 48 canonical primitives. Preserve source shade names, including `grey`; parentheses are normalized (`blue-400-(primary)` becomes `--titan-color-blue-400-primary`). All supplied colors are registered even without semantic uses.

Existing public primitive names remain aliases so existing consumers keep working. Alias names are not listed as duplicate primitives in Foundations. Both themes resolve their existing semantic roles through the canonical palette. Primitive values do not vary by theme. Fixed asset literals are outside this migration.

Matches use nearby OKLab colors, restricted to neutrals for gray values. The two muted navy state colors remain supplemental primitives: the source has no close blue match; nearest unrestricted matches would incorrectly shift these states toward violet. Color-wheel grouping uses the actual hue (for example Figma green-100 is cyan), while gray names stay Neutrals.

## Existing primitive mapping

| Existing token | Previous value | Canonical token | New value |
| --- | --- | --- | --- |
| `--titan-color-white` | `#fff` | `--titan-color-grey-white` | `#ffffff` |
| `--titan-color-paper` | `#fbfbfb` | `--titan-color-grey-400` | `#fbfbfb` |
| `--titan-color-ink` | `#1a1a1a` | `--titan-color-grey-950` | `#1f1f20` |
| `--titan-color-charcoal` | `#1c1c1c` | `--titan-color-grey-950` | `#1f1f20` |
| `--titan-color-gray-800` | `#333` | `--titan-color-grey-900` | `#333333` |
| `--titan-color-gray-600` | `#666` | `--titan-color-grey-815` | `#666666` |
| `--titan-color-gray-500` | `#888` | `--titan-color-grey-800` | `#888888` |
| `--titan-color-blue-50` | `#eff6ff` | `--titan-color-blue-50` | `#eff5ff` |
| `--titan-color-blue-100` | `#dbeafe` | `--titan-color-blue-100` | `#e6efff` |
| `--titan-color-blue` | `#2170f4` | `--titan-color-blue-400-primary` | `#2170f4` |
| `--titan-color-night-10` | `#202020` | `--titan-color-grey-950` | `#1f1f20` |
| `--titan-color-night-20` | `#141414` | `--titan-color-grey-980` | `#141414` |
| `--titan-color-night-30` | `#d7d7d7` | `--titan-color-grey-550` | `#dddddd` |
| `--titan-color-night-40` | `#f1f1f1` | `--titan-color-grey-450` | `#f2f2f2` |
| `--titan-color-night-50` | `#b0b0b0` | `--titan-color-grey-700` | `#bdbdbd` |
| `--titan-color-night-60` | `#999999` | `--titan-color-grey-750` | `#9c9c9c` |
| `--titan-color-night-70` | `#1d385b` | `--titan-color-night-70` | `#1d385b` |
| `--titan-color-night-80` | `#7db4ff` | `--titan-color-blue-180` | `#71a6ff` |
| `--titan-color-night-90` | `#343434` | `--titan-color-grey-900` | `#333333` |
| `--titan-color-night-100` | `#3b3b3b` | `--titan-color-grey-910` | `#373737` |
| `--titan-color-night-110` | `#191919` | `--titan-color-grey-980` | `#141414` |
| `--titan-color-night-120` | `#303030` | `--titan-color-grey-900` | `#333333` |
| `--titan-color-night-130` | `#28486d` | `--titan-color-night-130` | `#28486d` |
| `--titan-color-night-140` | `#2c2c2c` | `--titan-color-grey-830` | `#2d2d2d` |
| `--titan-color-night-150` | `#292929` | `--titan-color-grey-850` | `#292929` |
| `--titan-color-night-160` | `#555555` | `--titan-color-grey-820` | `#4a4a4a` |
| `--titan-color-night-170` | `#707070` | `--titan-color-grey-810` | `#6f6f6f` |
| `--titan-color-gray-25` | `#f9f9fa` | `--titan-color-grey-400` | `#fbfbfb` |
| `--titan-color-gray-175` | `#e8eaed` | `--titan-color-grey-500` | `#f0f0f0` |
| `--titan-color-gray-200` | `#dedede` | `--titan-color-grey-600` | `#dedede` |
| `--titan-color-gray-50` | `#f4f4f7` | `--titan-color-grey-450` | `#f2f2f2` |
| `--titan-color-gray-150` | `#eaeaea` | `--titan-color-grey-500` | `#f0f0f0` |
| `--titan-color-blue-75` | `#e0ecfc` | `--titan-color-blue-100` | `#e6efff` |
| `--titan-color-gray-700` | `#494949` | `--titan-color-grey-820` | `#4a4a4a` |
| `--titan-color-gray-900` | `#252525` | `--titan-color-grey-850` | `#292929` |
| `--titan-color-gray-850` | `#2d2d2d` | `--titan-color-grey-830` | `#2d2d2d` |
| `--titan-color-black` | `#000000` | `--titan-color-grey-black` | `#000000` |
| `--titan-color-gray-100` | `#f0f0f0` | `--titan-color-grey-500` | `#f0f0f0` |
| `--titan-color-gray-75` | `#f2f2f2` | `--titan-color-grey-450` | `#f2f2f2` |
| `--titan-color-gray-125` | `#ededed` | `--titan-color-grey-500` | `#f0f0f0` |
| `--titan-color-gray-250` | `#dddddd` | `--titan-color-grey-550` | `#dddddd` |
| `--titan-color-gray-300` | `#cccccc` | `--titan-color-grey-700` | `#bdbdbd` |
| `--titan-color-gray-225` | `#dedded` | `--titan-color-grey-600` | `#dedede` |
