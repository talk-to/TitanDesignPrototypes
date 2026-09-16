# Inspector naming clarification

Shared studio inspection now distinguishes registered components from basic elements
and layout containers, using Component badges, blue component outlines, muted basic
element outlines and dashed container outlines. Layout wrappers are grouped under
Show layout layers; Control-click and Cycle layer retain access to every ancestor.

Titan launcher roots explicitly annotate Supporting link and Tool variants with
data-inspector-variant. Stable IDs, geometry and action handlers are unchanged.
Browser screenshots verified collapsed layout layers and Launcher item · Supporting
link on the actual dropdown row. Launcher renderer tests and studio suite pass.
