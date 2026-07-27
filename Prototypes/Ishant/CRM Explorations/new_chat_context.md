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

## 3. Extending the Shell for New Products & Features

When building a new feature or product prototype (e.g., CRM Explorations):

1. **Adding Side-App Extensions**: Use the **Right Utility Dock (`#tasks-panel`)**. Add a new app button icon in the dock and pair it with a `334px` sliding container panel.
2. **Adding Thread-Level Context**: Insert inline status pills, cards, or action triggers directly inside the **Reading Pane Header** next to sender metadata.
3. **Adding Global Tools / Views**: Register navigation entries in the **Left Sidebar** or access higher-level views via the top-left App Switcher.
