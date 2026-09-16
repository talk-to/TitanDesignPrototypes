# TitanCalendar

Static HTML study of the supplied September 6–12, 2026 calendar screenshot.
Open `index.html` through the studio at:

http://localhost:8031/app/Prototypes/Ishant/design%20ops/DS-specific%20shells/TitanCalendar/index.html

JavaScript only renders the shared DS controls and fixed calendar content. There are no event editors, navigation handlers, account connections, or persistence. Add `?ds=true` for the optional existing DS inspector.

Uses shared Button, Icon Button, Dropdown and Checkbox renderers, token stylesheets, and registered calendar/arrow/settings icons. The Titan logo references the neighboring email shell. Small account/add/feedback artwork is local because no matching registered icons exist. Toolbar sizing, checkbox size, calendar geometry and screenshot-specific event/today colors remain screen-owned, with local adaptations documented in CSS.

Checked: attachment validation (no errors), JS syntax, rendered desktop geometry at 1787×959, 1280px page width, and contained horizontal calendar scrolling at 768px. Inspector traced 16px toolbar gaps to the shared spacing token; imports/images loaded. New Event leaves the static view unchanged. Shared component files were not modified.

Mini calendar now uses the shared interactive component: local selection/month
browsing emits optional signals; no host callback changes the static week grid.
Add calendar uses the shared dark Button. See DS USAGE.md for input/output contracts.
