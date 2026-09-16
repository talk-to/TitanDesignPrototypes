# Grouped actions

Registered the observed horizontal icon-and-label action grouping as a composed
component. Renderer reuses Button; group owns the existing 4px semantic gap and
alignment. Removed grouped specimens from individual Button previews; its toolbar
variant remains a single button. No icon-only group variants invented.
No group-level interactions, so sidebar shows the standard empty message.
Child Button states stay with Button. Native group semantics, no assumed roving
toolbar keyboard model. Parent width/overflow is outside this contract.

Attachment checks and component tests run; browser verification pending.
