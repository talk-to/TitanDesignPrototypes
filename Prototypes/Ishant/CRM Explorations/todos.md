# CRM Explorations - Prototype Roadmap & To-Dos

> **Core Philosophy ("Zero Memory Failure")**: A CRM integrated into an email client must **never fail the user's memory**. Whenever a user views an email thread, every key detail, custom note, interaction history, budget, and pipeline status about that lead or customer must be effortlessly and intuitively accessible right in their line of sight—requiring zero reliance on human recall or tedious searching.

> **Approach**: Prioritizing the **Happy Path Scenario** first for fast presentation and visual validation. Interactive edge cases and complex flows will be connected incrementally. (Note: Standalone creation form dropped for now).

---

## 📋 Roadmap & Task Checklist

- [x] **1. Right Dock CRM Sidebar Drawer (Enriched Memory Surface - Happy Path)**
  - *Added*: Red CRM trigger button in the top-right toolbar next to Read Receipts & Settings.
  - *Added*: Matching `.side-modal` sliding drawer (`#crmSidebar`) displaying web-scraped intelligence (website, LinkedIn, company size, location).
  - *Added*: "Zero Memory Failure" pinned context card, key lead metrics grid, and interactive 1-click note-saver.
  - *Added*: Tabbed navigation (`Overview & Memory`, `Activity Feed`, `Deals & Adaptor`) with secondary use-case lenses (`Sales Deal`, `Project`, `Inventory`).

- [ ] **2. Inline Thread Header Memory Badges (Happy Path)**
  - *Context*: Contextual memory cues inserted directly into the email thread header next to sender metadata.
  - *Goal*: Immediate visual recall pills (`[ Lead | $12k | Proposal Sent ]` + key memory snippet) right when opening an email.

- [ ] **3. Global CRM Pipeline & Memory Board (Happy Path)**
  - *Context*: High-level deal and contact memory bank accessible via Titan's top-left App Switcher.
  - *Goal*: Visual Kanban board for managing all lead memory records across pipeline stages.
