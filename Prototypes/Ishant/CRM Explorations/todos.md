# CRM Explorations - Prototype Roadmap & To-Dos

> **Core Philosophy ("Zero Memory Failure")**: A CRM integrated into an email client must **never fail the user's memory**. Whenever a user views an email thread, every key detail, custom note, interaction history, budget, and pipeline status about that lead or customer must be effortlessly and intuitively accessible right in their line of sight—requiring zero reliance on human recall or tedious searching.

> **Approach**: Prioritizing the **Happy Path Scenario** first for fast presentation and visual validation. Interactive edge cases and complex flows will be connected incrementally. (Note: Standalone creation form dropped for now).

---

## 📋 Roadmap & Task Checklist

- [ ] **1. Right Dock CRM Panel - Contextual Memory Surface (Happy Path)**
  - *Context*: Active CRM tab in Titan's right utility dock (`#tasks-panel`).
  - *Goal*: Displays the complete memory profile of the active email sender—deal stage, value, key attributes, recent interaction timeline, and a zero-friction "Add Quick Memory Note" input.

- [ ] **2. Inline Thread Header Memory Badges (Happy Path)**
  - *Context*: Contextual memory cues inserted directly into the email thread header next to sender metadata.
  - *Goal*: Immediate visual recall pills (`[ Lead | $12k | Proposal Sent ]` + key memory snippet) right when opening an email.

- [ ] **3. Global CRM Pipeline & Memory Board (Happy Path)**
  - *Context*: High-level deal and contact memory bank accessible via Titan's top-left App Switcher.
  - *Goal*: Visual Kanban board for managing all lead memory records across pipeline stages.
