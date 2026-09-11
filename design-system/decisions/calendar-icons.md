# Calendar asset review

Reviewed eight SVGs from `Prototypes/Prabhat/Titan-recap/calendar_assets/`.

Added avatar, clock, video-conference and location.
Guests is a semantic duplicate of Groups; reuse the existing Groups artwork.
Chevron up is covered by rotating an existing chevron; no separate entry added.
Clock is distinct from Reminder (an alarm). External link was subsequently removed at the user’s request.
Recap was removed from the shared catalog and assets at the user’s request.

New files preserve original paths, normalize painted bounds uniformly into a 20-unit
footprint on the standard 24×24 canvas, and expose titan-artwork fragments.
Monochrome paint uses --titan-icon-color with source-color fallbacks. Source files are untouched. Geometry is recorded in calendar-icon-import.json.

Reviewed rendered artwork at enlarged and 20px sizes. Canonical icon tests pass;
the separate composer image-count assertion currently expects 29 but finds 26.
