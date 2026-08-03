# Titan Shell Architecture & Design Context

This document provides a top-level architectural overview and design context for the **Titan Email Base Shell**. It is designed as a starting point for building new features, extensions, or integrated product experiences (such as CRM Explorations) on top of Titan.

---

## 1. Top-Level Layout Architecture

The base shell (`index.html`) is structured into four primary layout zones:

```
┌─────────────────┬──────────────────┬───────────────────────────────┬──────────────────────┐
│  Left Sidebar   │  Middle Listing  │  Main Reading Pane            │  Right Utility Dock  │
│  (.sidebar)     │  (.inbox-list)   │  (.reading-pane)              │  (#tasks-panel)      │
│                 │                  │                               │                      │
│ - Brand Logo    │ - Search Bar     │ - Thread Header & Controls    │ - Integrated App     │
│ - Folder List   │ - Inbox Tabs     │ - Action Toolbar              │   Dock (Tasks,       │
│ - Storage/Apps  │ - Thread Cards   │ - Thread Messages             │   Calendar, CRM)     │
│                 │                  │ - Floating Composer           │ - Compact (56px) /   │
│                 │                  │                               │   Expanded (334px)   │
└─────────────────┴──────────────────┴───────────────────────────────┴──────────────────────┘
```

### Layout Zone Breakdown

1. **Left Sidebar (`.sidebar`)**
   - **Width**: `250px` (standard) / `64px` (collapsed in Focus/Zen Mode).
   - **Key Elements**: Brand logo, account switcher dropdown, main folder navigation (Inbox, Sent, Drafts, Trash), custom folders, and storage status.

2. **Middle Listing Pane (`.inbox-list`)**
   - **Width**: Dynamic flex / fixed listing width.
   - **Key Elements**: Global search input, view filters, email thread listings, selection checkboxes, and stacked message indicators.

3. **Main Reading Pane (`.reading-pane`)**
   - **Key Elements**: Email thread header, sender details, subject title, top action toolbar (Reply, Forward, Archive, Delete, Spam, Move), full email message view, and embedded floating email composer.

4. **Right Utility Dock (`#tasks-panel`)**
   - **Width**: `56px` (compact dock) expandable to `334px` (active app panel).
   - **Key Elements**: Vertical app switcher dock hosting integrated side-apps (Tasks, Calendar, and contextual third-party tools like CRM extensions).

---

## 2. Design System & Interaction Reference Links

For detailed aesthetic specifications, design tokens, and standardized UI interaction patterns, refer to the core documentation files:

- 📘 **[Redesign System Guidelines](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/App%20Redesign/redesign_guidelines.md)**:
  - Elevation-based card layouts, shadow tokens, and borderless design rules.
  - Core color system (Primary Active Blue `#2170f4`, Neutral Hover Grey `#f4f5f8`, Deep Hover Grey `#e2e6eb`).
  - Unified `6px` squircle highlight rules.
  - Focus Mode (Zen Mode) sidebar collapse rules.
  - Compactified Right App Dock behavior (`56px` → `334px`) and smooth reveal animations.

- ⚡ **[Interaction Specifications](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/Interactions%20Across%20Titan/interaction.md)**:
  - Standardized `.titan-action-btn` and `.titan-split-btn` action button components.
  - "Spring Expansion" hover effects and "Tactile Snap" click feedback.
  - Pure CSS thread stack overlapping animations.
  - Custom row-aware, slide-and-teleport tooltip positioning.

---

## 3. Core Product Philosophy: "Zero Memory Failure"

The fundamental principle driving CRM & contextual extensions within Titan:
> **A CRM integrated into an email client must never fail the user's memory.**

Whenever a user opens an email thread, every piece of critical context—past interaction history, custom notes, deal stage, budget, key takeaways, and scheduled tasks—should be immediately and effortlessly accessible in their natural line of sight (Right Dock & Header Badges). The user should never have to rely on human recall, search manually, or switch away to a separate app.

---

## 4. Modular CRM Component Architecture (`crm_app/`)

To maintain clean separation of concerns and avoid bloated single-file code, the CRM mini-app is decoupled into its own dedicated directory:

- 📂 `crm_app/crm_sidebar.html`: Standalone HTML component template for the CRM mini-app drawer. Supports progressive disclosure navigation (bread-crumb back button, summary cards, pipeline detail views, attachment vault).
- 📂 `crm_app/crm_app.css`: Dedicated stylesheet enforcing Titan design system tokens (squircle radii, elevation card shadows, Titan blue/red accents, typography).
- 📂 `crm_app/crm_app.js`: State manager handling drawer visibility, progressive disclosure stack navigation (`drillInto` / `goBack`), tab switching, note persistence, and lens views (Sales / Project / Inventory).

### Main Shell Integration (`index.html`)
The main shell includes:
```html
<link rel="stylesheet" href="crm_app/crm_app.css">
<div id="crmSidebarContainer"></div>
<script src="crm_app/crm_app.js"></script>
```
The `CrmApp` module automatically fetches and mounts `crm_sidebar.html` into `#crmSidebarContainer` at runtime.

---

## 5. Merged Approach (`Merged Approach/`)

To synthesize different design explorations without breaking isolated prototypes, the **Merged Approach** directory bridges Usha's pipeline-centric markers with Ishant's modular `crm_app` architecture:

- 📁 **[Merged Approach Directory](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/Merged%20Approach)**: Standalone prototype combining thread-level pipeline markers and stage advancement with the `crm_app` sidebar drawer.
- 📄 **[Analysis Document](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/Merged%20Approach/usha_approach_analysis.md)**: In-depth architectural analysis of Usha's pipeline labels (`.pipeline-label`, `.pipeline-chip`), single-select radio dropdown, and interactive stage bar.
- ⚡ **Lightweight Integration Bridge**: Clicking any pipeline label or chip in the inbox list or reading pane calls `openCrmPanel()`, which delegates directly to `CrmApp.openDrawer()` and updates the hero header and stage pill (`Sales · Proposal Sent`).
- 🗂️ **Streamlined 2-Tab Navigation & Outcome-First Layout**:
  - **Top Stage Bar Widget**: Positioned at the very top of the profile hero. Displays the **Pipeline Name** (`Neo Partnerships`), **`View Pipeline >`** link, and interactive **Chevron Stage Bar** with strict left-to-right z-index stacking (`z-index: 20` to `10`) and 2px white ribbon contour separation.
  - **Outcome-First Activity Feed**: Activity cards organized around **Business Direction / Conclusions Drawn** (Tier 1) rather than communication mechanics. Includes directional movement pills (Tier 2), channel context (Tier 3), and interactive per-activity **Personal Note Drawers** (Tier 4) with live note counters (`💬 2 Notes Saved`) and inline note creation (`+ Add Note`).
  - **Upcoming**: Scheduled meetings, follow-up checklists, and priority tasks.
  - **Overview (Hidden Non-Destructively)**: Preserved in DOM (`style="display: none !important;"`) so it can be unhidden cleanly at any point without loss of context.

---

## 6. Extending the Shell for New Products & Features

When building a new feature or product prototype (e.g., CRM Explorations):

1. **Adding Side-App Extensions**: Use the **Right Utility Dock (`#tasks-panel`)**. Add a new app button icon in the dock and pair it with a `334px` sliding container panel.
2. **Adding Thread-Level Context**: Insert inline status pills, cards, or action triggers directly inside the **Reading Pane Header** next to sender metadata.
3. **Adding Global Tools / Views**: Register navigation entries in the **Left Sidebar** or access higher-level views via the top-left App Switcher.

---

## 7. Recent CRM Activity Feed & Profile UI Refinements

The following user-requested refinements have been applied and synced across `crm_app/` and `Merged Approach/`:

1. **Connected Vertical Timeline**: Restored continuous vertical line (`.crm-timeline-wrapper::before`) with neutral slate-gray (`#64748b`) circular icon badges (`26px`).
2. **Timeline Rhythm & Spacing Tokens**:
   - Timeline item gap: `28px`.
   - Section headers: Scoped `4px` margin-bottom strictly for `Recent Activity` & `Shared Files` section titles.
   - Log Activity button: Full-width dashed low-contrast button positioned *before/above* the timeline feed with `4px` bottom margin (duplicate bottom button removed).
   - Sub-tab active indicator line thickness: Updated to `2.5px`.
3. **Activity Title Wrapping & Dynamic Subject Sync**:
   - Constrained title max-width to `195px` with top-aligned line wrapping (`align-items: flex-start; line-height: 1.35`).
   - Dynamic DOM subject resolution: `#crmAct1Title` & `#crmAllAct1Title` dynamically query the active email thread subject (`Project roadmap for Dashboard version 2`) rather than hardcoded fallbacks.
4. **Notes Button Position Swap & Labeling**:
   - Swapped positions: `+ Add Note` button placed on the **left** (right below activity title), `💬 N Notes` count pill on the **right**.
   - Note count pills updated to concise format (`💬 1 Note`, `💬 2 Notes`).
5. **Profile Hero Header Customizations**:
   - Top navigation bar (`.crm-nav-header` with back button & full view icon): Hidden non-destructively (`style="display: none;"`) for email-context viewing.
   - Contact chips strip (`See all details`, `Call`, `Email`, `LinkedIn`): Hidden non-destructively (`style="display: none;"`).
   - Profile header row: Added right-aligned vertically centered chevron (`>`) next to contact avatar, name, and role.
6. **Custom Pipeline Tooltips & Stage Naming**:
   - Custom dark slate (`#0f172a`, white text) slide-in tooltip (`0.15s cubic-bezier`) on hover over empty pipeline ribbons using body-anchored fixed positioning (disabled native browser `title` tooltips).
   - Stage name update: Renamed `Closed Won` stage to `Closed`.
7. **Pipeline Container Spacing**:
   - Increased internal gap between pipeline heading (`Neo Partnerships`) and blue chevron stage ribbons to `12px`.
   - Updated pipeline section container outer margins to `margin-top: 16px; margin-bottom: 16px;`.
8. **Consistent Icon Family System**:
   - Replaced all raw emojis across tasks, meetings, note pills, and file attachments (`💬`, `📅`, `⚡`, `🤝`, `📝`, `👥`, `📄`, `📊`, `⬇`) with a unified, lightweight SVG line icon family matching Titan design system conventions.
9. **Upcoming Task & Meeting Right Chevrons & Clean Subtext**:
   - Replaced right-side grey timestamp text with clean right-aligned chevron icons (`>`), providing a clear affordance for opening Google Meet or task details.
   - Cleaned up item subtext by removing redundant labels (`Google Meet`, `High Priority`, contact names), leaving crisp, readable schedule subtext (`Today at 3:00 PM`, `Tomorrow at 10:00 AM`, `Next Monday at 2:00 PM`).
   - Increased vertical gap between task/meeting card heading and subtext from `2px` to `4px` for enhanced readability and breathing room.
10. **Record-Centric Sidebar Layout Restructuring**:
    - Primary Title set to **Record Name** (`Q3 Licensing Deal ($32k)`) with company name (`Avon Technologies`) and social links (`LinkedIn`, `Website`) rendered directly underneath.
    - Replaced multi-chevron pipeline bar with a scalable & error-safe Stage Selector Dropdown (`Proposal Sent ▾`) capable of handling 10+ stages safely.
    - Converted layout into a unified single-stream vertical feed (no profile tabs): **Upcoming** (with `+ Add activity` dropdown & checkable task boxes) $\rightarrow$ **Recent Activity** (no action buttons, open note text field, 1-line AI summary under email subject, audit log notes, subtle line icons, deep inline scrollable history) $\rightarrow$ **Files** (record-specific attachments) $\rightarrow$ **More Info** (record metadata).
