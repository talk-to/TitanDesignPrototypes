# Titan Drive

Static DS-connected study of the supplied Drive screen.

Open through the Titan studio at:

http://localhost:8032/app/Prototypes/Ishant/design%20ops/DS-specific%20shells/TitanDrive/index.html

Every control is a registered renderer: Titan Sidebar Header, Sidebar Item,
Search Field, Filters and Account Dropdown (`account-light` for the light toolbar), Button (`primary` for Upload and
`outlined-primary` for New Folder), Icon Button (row actions), Checkbox (`large`)
and Data list for the file table. Nothing is a local derivation. Screen CSS only
sets values the components expose or document as parent-owned: the data list's
`--titan-data-list-*` row heights, row hover colour, sidebar item hover and
selection colours, host widths, and the size of artwork this screen supplies
into a slot. Header type, colour and separators stay as the component renders
them, so the table's column labels match Contacts exactly.

Two deliberate departures from the reference image, as requested: the sidebar
uses the existing Titan navigation surface rather than the reference's navy, and
the app switcher plus Titan logo header replaces the reference's plain "Drive"
title.

Folder, upload, new-folder and the sidebar view icons are screen-local assets in
`assets/` because no equivalents are registered in the shared icon catalog. The
sidebar assets are white for the dark surface, matching how Titan Contacts
supplies its own; the folder and button artwork use `currentColor` so it tints
from the surrounding text colour instead of a fixed hue.

Search, selection, navigation, and prototype action feedback are wired locally;
no backend operations or persistence are implied.

Append `?ds=true` for the optional spacing inspector.
