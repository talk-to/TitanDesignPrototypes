# Small Avatar variant

The user explicitly requested a smaller Avatar variant to restore Account header's
earlier appearance. Avatar now owns `variant: 'small'`: a 24px circle with the same
purple surface, type size, weight and zero padding as the default 36px variant.
Account header selects it through the renderer; it has no Avatar CSS overrides.
Both sizes are shown in the Avatar specimen and Live-only variant controls, and
identified by data-inspector-variant. This supersedes the earlier temporary use
of default Avatar in Account header, not the unchanged-reuse policy.

No new colors or Contacts migration are included.
