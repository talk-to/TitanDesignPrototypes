# CRM Explorations - Prototype Roadmap & To-Dos

> **Core Philosophy ("Zero Memory Failure")**: A CRM integrated into an email client must **never fail the user's memory**. Whenever a user views an email thread, every key detail, custom note, interaction history, budget, and pipeline status about that lead or customer must be effortlessly and intuitively accessible right in their line of sight—requiring zero reliance on human recall or tedious searching.

> **Approach**: Prioritizing a **Minimal, High-Readability UI** with progressive disclosure. Don't overwhelm the user—show essential high-level context first, and allow 1-click drill-downs into full details.

---

## 📋 Roadmap & Task Checklist

- [x] **1. Right Dock CRM Sidebar Drawer (Minimal & Decoupled - Happy Path)**
  - *Added*: Red CRM trigger button in the top-right toolbar next to Read Receipts & Settings.
  - *Added*: Decoupled `crm_app/` module (`crm_sidebar.html`, `crm_app.css`, `crm_app.js`) using Titan design tokens, generous spacing, and clear 13px–16px typography.
  - *Refined Navigation*:
    1. **Activity**: Interaction logs (emails, calls), `+ Log Activity` button, and Shared Files Vault (`Proposal_v2.pdf`, `SOW_Draft.docx`).
    2. **Upcoming**: Scheduled meetings, tasks & follow-ups checklist (`+ Schedule`).
    3. **Overview (Hidden Non-Destructively)**: Preserved in code (`style="display: none !important;"`) for easy restoration.

- [x] **1b. Merged Approach Pipeline Integration (`Merged Approach/`)**
  - *Added*: [Merged Approach/](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/Merged%20Approach) synthesizing Usha's pipeline labels and stage dropdown with Ishant's `crm_app` sidebar.
  - *Added*: Interactive Pipeline Stage Pill (`Sales · Proposal Sent`) embedded in the header hero of `crm_sidebar.html`.
  - *Added*: Documented context in [usha_approach_analysis.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/Merged%20Approach/usha_approach_analysis.md) and cross-linked in [new_chat_context.md](file:///Users/ishant.p/Documents/Titan%20Design%20Git/Prototypes/Ishant/CRM%20Explorations/new_chat_context.md).

- [ ] **2. Inline Thread Header Memory Badges (Happy Path)**
  - *Context*: Contextual memory cues inserted directly into the email thread header next to sender metadata.
  - *Goal*: Immediate visual recall pills (`[ Lead | $12k | Proposal Sent ]` + key memory snippet) right when opening an email.

- [ ] **3. Global CRM Pipeline & Memory Board (Happy Path)**
  - *Context*: High-level deal and contact memory bank accessible via Titan's top-left App Switcher.
  - *Goal*: Visual Kanban board for managing all lead memory records across pipeline stages.
