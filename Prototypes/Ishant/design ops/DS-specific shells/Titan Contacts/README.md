# Titan Contacts

Static DS-connected study of the supplied contacts screen.

Open through the Titan studio at:

http://localhost:8032/app/Prototypes/Ishant/design%20ops/DS-specific%20shells/Titan%20Contacts/index.html

The screen reuses Titan Sidebar Header, Account Dropdown, Sidebar Item, Search
Field, Button, Checkbox and Avatar renderers. The contacts table and its trailing
info affordances remain screen-owned because no matching registered component
exists yet. `contacts-import-button` is a local derived adaptation of the shared
Outlined Button: it keeps the shared renderer and adds the reference blue treatment.
It carries the App Sidebar prototype's local-unregistered derivation metadata and
uses the existing yellow inspector decoration when opened with `?ds=true`.
Search, selection, navigation, and prototype action feedback are wired locally;
no backend operations or persistence are implied.

Append `?ds=true` for the optional spacing inspector.
