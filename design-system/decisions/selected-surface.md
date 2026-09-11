# Selected surface

Registered the observed selected message-row background (#eff6ff) as
`--titan-color-blue-50`, referenced by `--titan-surface-selected`. The message
component uses this semantic; legacy `--selected-bg` aliases it for compatibility.
The primitive and semantic are registered in foundation presentation and color roles.
No new color ramp or appearance change is introduced. Spacing and behavior are unchanged.

Validation: attachment check and existing component tests. Browser visual verification pending.

Follow-up (explicit user request): the observed `#eff6ff` selected surface read too
light, so the selection now uses a new `--titan-color-blue-100: #dbeafe` primitive;
`--titan-surface-selected` points at it and the legacy `--selected-bg` alias follows.
`--titan-color-blue-50` is retained. No opacity is involved in the selected fills;
the change applies to every selected surface (message row, tabs, data list, app tile)
and the pressed-selection backgrounds that alias `--selected-bg`.
