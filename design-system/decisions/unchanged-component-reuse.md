# Unchanged component reuse

User-directed policy: consumers reuse shared components unchanged. Internal overrides
and unrequested adaptations/variants are prohibited; leave visual mismatches visible
until the user requests a variant. See AGENTS.md and USAGE.md for the binding rule.
This supersedes historical customization allowances.

Account header now renders default 36px purple Avatar without size or background
overrides. Removed its avatarBackground option and migrated its known callers.
No small Avatar variant was requested or created. Existing Contacts avatar overrides
are outside this change and remain a known discrepancy, not approved variants.
