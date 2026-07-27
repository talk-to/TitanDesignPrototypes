# CRM Explorations - Prototype Roadmap & To-Dos

> **Core Philosophy ("Zero Memory Failure")**: A CRM integrated into an email client must **never fail the user's memory**. Whenever a user views an email thread, every key detail, custom note, interaction history, budget, and pipeline status about that lead or customer must be effortlessly and intuitively accessible right in their line of sight—requiring zero reliance on human recall or tedious searching.

> **Approach**: Prioritizing a **Minimal, High-Readability UI** with progressive disclosure. Don't overwhelm the user—show essential high-level context first, and allow 1-click drill-downs into full details.

---

## 📋 Roadmap & Task Checklist

- [x] **1. Right Dock CRM Sidebar Drawer (Minimal & Decoupled - Happy Path)**
  - *Added*: Red CRM trigger button in the top-right toolbar next to Read Receipts & Settings.
  - *Added*: Decoupled `crm_app/` module (`crm_sidebar.html`, `crm_app.css`, `crm_app.js`) using Titan design tokens, generous spacing, and clear 13px–16px typography.
  - *Added*: **3 Core Tabs**:
    1. **Overview**: Pinned Sticky Notes, `Show All Notes →` (date-grouped history), Constant Contact Info, `More Details →` (all contact fields).
    2. **Activity**: Interaction logs (emails, calls), `+ Log Activity` button, and Shared Files Vault (`Proposal_v2.pdf`, `SOW_Draft.docx`).
    3. **Activities**: Scheduled tasks & follow-ups checklist (`+ Add Task`).
  - *Removed*: Use-Case Lens and unnecessary visual clutter.

- [ ] **2. Inline Thread Header Memory Badges (Happy Path)**
  - *Context*: Contextual memory cues inserted directly into the email thread header next to sender metadata.
  - *Goal*: Immediate visual recall pills (`[ Lead | $12k | Proposal Sent ]` + key memory snippet) right when opening an email.

- [ ] **3. Global CRM Pipeline & Memory Board (Happy Path)**
  - *Context*: High-level deal and contact memory bank accessible via Titan's top-left App Switcher.
  - *Goal*: Visual Kanban board for managing all lead memory records across pipeline stages.
