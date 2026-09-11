# Spacing — phase 2b

## Accepted baseline and scope

The user said the color/type result "looks fine" and accepted spacing as the next
pass. Record this as user acceptance of that appearance, not automated accessibility
or responsive verification. Preserve that baseline. This pass only extracts spacing;
components, radii, borders, elevation, motion and density variants remain later work.

## Evidence and decision

Static stylesheet inventory of ../index.html shows repeated 4/8/12/16/20/24px values.
Add those six primitive distances to tokens/spacing.css. This is an observed subset,
not a compulsory four-pixel grid. Values such as 2, 3, 6, 10, 11 and 14px remain valid.

Six source-owned relationships get separate aliases: reading-pane inline inset;
mail-row block and inline inset; message block and inline inset; message-header gap.
These are not component contracts. Reading-pane 24px inset and message 24px padding
remain different roles even though they share a primitive. The message inset is
supported by existing thread, stack and expanded-message content alignment.

32 declarations across 25 selectors adopt tokens with identical resolved values.
Toolbar and settings values use primitives directly; no claim of shared semantic
ownership is made. Existing 8px margins stay on their original selectors. Do not
add a parent gap or move margin ownership as part of a later token-only edit.

## Preserved exceptions

- Wide-view .email-tile padding is 0 16px 0 21px and continues to override default
  row insets. Its 44px sender line height and 160px action reserve remain local.
- Collapsed stacks retain 60px height and -50px overlap. The expanded-state 8px
  margin is tokenized only at its original selector; collapsed overrides stay intact.
- Expanded message header keeps 20px top / 24px sides / 12px bottom. Body bottom
  padding remains separate from message-inline inset. No global padding shortcut.
- Composer/send/format bars have duplicate selectors and inline reply overrides.
  In particular, 16px and 24px horizontal insets must not be silently unified.
  Composer, reply, app-switcher and small control spacing remain outside this pass.
- Pane widths, heights, transforms, responsive behavior, inline styles and scripts
  are unchanged. The legacy --card-spacing: 12px is not made an alias of a new role.

## Evidence and verification

spacing-adoption.json records each selector/property replacement and source hashes.
Every new expression resolves to the exact original value. Reversing the 32
substitutions reproduces the pre-pass shell byte-for-byte. This guards against changes
to markup, scripts, layout geometry, CSS specificity, order and exceptions.

specimens/spacing.html uses real spacing tokens for rulers and measurement diagrams.
These diagrams illustrate padding/gaps; they do not duplicate a component renderer.
The actual shell remains the source preview. Component/composition catalogs stay empty.
Browser discovery still returned no connected surfaces; no agent visual verification
is claimed. User review of spacing is pending. Review inbox, expanded/collapsed
threads and settings at 1440×900 / 1280×800, and check overflow at 768×900.

Final checks: attachment validator passed with zero errors. All new spacing values
resolve to their original literals; no missing token references or cycles. Existing
scripts and inline styles are unchanged. The shell, spacing page, page CSS, token
entry point and spacing token file all returned HTTP 200. Shared studio is clean.

## Relationship view

Show existing source-owned roles grouped into Gaps, Horizontal insets and Vertical
insets, connected to the six primitive values. Diagrams measure only the specified
axis; other diagram geometry is illustrative. No generic heading/description gap
has been defined: add that role only after inspecting actual screen evidence.
