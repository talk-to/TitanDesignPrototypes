# App sidebar experiment

Open through the Titan studio:
http://localhost:8031/app/Prototypes/Ishant/ds%20specific%20prototypes/App%20sidebar/index.html

Based on the DS-specific TitanEmailShell. The copied screen references its source
asset folders and imports the live root design-system definitions. Run the studio
with `bash "Prototypes/Ishant/commands/run-ds.command"` from the workspace root.

Eight persistent app tiles and four tools replace the dropdown. Admin and both
supporting footer links are excluded. Mail retains the email shell;
other apps show clearly labeled placeholder workspaces. Mail DOM and composer
state survive switching. Tab/Enter activate buttons; Up/Down, Home/End move focus.
The rail scrolls independently on short windows so every app remains reachable.

## Design ownership and verification

This is a screen-owned experiment, not a new shared catalog component.
TitanLauncher.appTile owns tile markup, 8px/2px insets, 2px icon-label gap,
38px icon slot and 34px canonical app artwork. The screen owns the 88px rail,
8px side/12px bottom inset, 4px between-tile gap, 64px heading alignment,
selected surface/indicator, app selection and placeholder routing. Shared Button
renders Back to Mail. Colors, text, spacing and radii reference Titan tokens.
Rail/heading/indicator dimensions are intentional local layout geometry.

Verified in browser: default desktop appearance, the original nine named controls,
Calendar selection, return to the existing Mail view, and End/Enter selection
of Admin before the requested exclusion. Static asset references resolve on disk and the new JS passes syntax
checking. Source shell and shared DS files are unchanged. Full responsive,
theme and inherited email-interaction regression testing remain unperformed.

The tools reuse TitanLauncher.launcherItem with screen-owned vertical layout,
8px/4px insets, 4px icon-label gap and wrapping labels. Tools are Signature Designer,
Smart Write AI, Email Designer and Invoice Builder. Shared DS definitions are unchanged.

## Compact rail revision

The latest experiment replaces visible labels with hover/focus tooltips. The rail
is 56px wide with 40px hit areas, 24px app artwork, and 20px tool artwork within
24px colored slots. All buttons retain explicit accessible names. The tooltip
renders outside the scrolling rail, dismisses on Escape/blur/scroll, and stays
within the viewport vertically. These are screen-local overrides; shared catalog
sizes remain unchanged. Browser screenshot and keyboard focus verified at the
normal desktop viewport; all 12 icons fit without scrolling at 720px height.
