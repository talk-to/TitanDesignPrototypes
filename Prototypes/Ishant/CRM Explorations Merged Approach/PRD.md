# Titan CRM – Product Requirements Document (PRD)

**Version:** 0.2 (Living Document)  
**Status:** Draft  
**Product:** Titan CRM  
**Last Updated:** August 2026

---

# Vision

Titan CRM is a lightweight, inbox-first CRM designed for small and medium businesses that manage customer relationships through email.

Rather than replacing the inbox with a complex CRM, Titan CRM extends the email experience with customer context, organization, follow-ups, and collaboration.

The goal is to help businesses stay organized without changing the way they already work.

---

# Problem Statement

For many SMBs, email is the operational hub of their business.

Customer inquiries, quotations, orders, invoices, project discussions, partnerships and support requests all arrive in the inbox.

As the business grows, keeping track of these conversations becomes increasingly difficult.

Common challenges include:

- Losing track of customer conversations
- Forgetting to follow up
- Having no visibility into ongoing work
- Scattered notes across emails
- Difficulty collaborating with teammates
- Customer information existing only in someone's inbox

Traditional CRMs solve these problems but introduce significant overhead:

- Steep learning curve
- Sales-heavy terminology
- Complex setup
- Feature overload
- Workflow builders and automation systems that many SMBs never fully utilize

Titan CRM aims to provide just enough structure to organize customer relationships while keeping email at the center of the experience.

---

# Product Philosophy

Email should remain the user's primary workspace.

CRM should provide context—not replace the inbox.

Every feature should reduce friction, not introduce it.

## Core Principles

- Inbox-first
- Simple by default
- Fast to adopt
- Flexible across industries
- Deterministic over magical
- AI assists users—it does not make decisions
- Minimal setup
- Progressive complexity

---

# Target Users

Titan CRM is built for **small and medium businesses (typically 2–15 team members)** that rely on email as a core communication channel.

These businesses often don't have dedicated sales, operations, or CRM administrators. Instead, business owners and small teams manage customer relationships directly from their inbox.

The CRM should therefore be flexible enough to support different business models—not just sales teams.

---

## 1. Retail & Commerce

Businesses that sell physical products and regularly communicate with customers or suppliers.

Examples:

- Fashion & apparel boutiques
- Eyewear & sunglasses retailers
- Flower shops & nurseries
- Home décor stores
- Furniture stores
- Gift shops
- Electronics retailers
- Jewellery stores
- Cosmetic & skincare brands
- Pet stores
- Toy stores
- Bookstores
- Grocery & specialty food stores
- Artisan & handmade product sellers

Typical workflows:

- Customer inquiries
- Product availability
- Quotations
- Bulk orders
- Repeat customers
- Supplier communication
- Delivery coordination

---

## 2. Professional Services

Businesses where customer relationships are built around ongoing services.

Examples:

- Marketing agencies
- Design studios
- Branding agencies
- Consultants
- Chartered accountants
- Law firms
- Recruitment agencies
- HR consultants
- Interior designers
- Architects
- Financial advisors
- Business consultants
- IT service providers
- Managed service providers

Typical workflows:

- Client onboarding
- Proposal discussions
- Contracts
- Project updates
- Renewals
- Follow-ups

---

## 3. Local Businesses

Businesses that primarily serve customers within a city or region.

Examples:

- Salons
- Spas
- Clinics
- Dental practices
- Gyms
- Fitness studios
- Tuition centers
- Coaching institutes
- Restaurants
- Cafés
- Bakeries
- Event planners
- Photography studios
- Repair & maintenance businesses
- Cleaning services
- Pest control services

Typical workflows:

- Appointment requests
- Booking confirmations
- Service reminders
- Customer follow-ups
- Repeat customers

---

## 4. B2B Businesses

Businesses selling to other businesses.

Examples:

- Manufacturers
- Wholesalers
- Distributors
- Suppliers
- Exporters
- SaaS startups
- Software agencies
- Hardware vendors
- Logistics providers
- Industrial suppliers

Typical workflows:

- Vendor communication
- Purchase orders
- RFQs
- Quotations
- Partnership discussions
- Account management

---

## 5. Creative & Independent Professionals

Individuals or small teams managing clients directly.

Examples:

- Freelancers
- Photographers
- Videographers
- Artists
- Musicians
- Coaches
- Trainers
- Writers
- Content creators
- UX designers
- Developers

Typical workflows:

- Client inquiries
- Project discussions
- Payments
- Revisions
- Referrals

---

## Common Characteristics

Regardless of industry, these businesses share common needs.

They need to:

- Know who a customer is
- Remember previous conversations
- Track ongoing work
- Never miss a follow-up
- Collaborate with teammates
- Store documents related to customers
- Keep everything organized without leaving email

---

# Goals

## Primary Goals

- Organize customer relationships inside the inbox
- Reduce missed follow-ups
- Make customer context instantly accessible
- Support different business workflows
- Integrate naturally with existing Titan products
- Keep setup under 10 minutes

---

# Non Goals (V1)

Titan CRM is **not** intended to become:

- Enterprise CRM
- Marketing automation platform
- Customer support suite
- Workflow automation builder
- Business intelligence platform
- Sales forecasting tool

Features intentionally excluded:

- AI decision making
- AI workflow execution
- Automatic stage prediction
- Lead scoring
- Revenue forecasting
- Complex dashboards
- Advanced reporting
- Scripting & custom code

---

# Core Data Model

## Contacts

Represents an individual.

Stores:

- Personal details
- Contact information
- Notes
- Timeline
- Related work items
- Tags

Purpose:

Create a unified view of every customer relationship.

---

## Companies

Represents an organization.

Contains:

- Contacts
- Work items
- Shared notes
- Shared timeline

---

## Work Items

Represents an ongoing piece of business.

Unlike traditional CRMs, Titan CRM intentionally avoids forcing the concept of a "Deal."

Different businesses use different terminology.

Examples include:

- Sales Opportunity
- Order
- Project
- Booking
- Candidate
- Partnership
- Vendor Request
- Service Request
- Inquiry

Internally these are the same object.

The displayed name may evolve in future versions to better match the user's business.

---

## Pipelines

Pipelines organize work items into stages.

A pipeline is simply an ordered collection of user-defined stages.

Titan CRM never assigns semantic meaning to stage names.

Users define both the stages and their meaning.

Examples:

### Sales

Lead

Qualified

Proposal

Negotiation

Won

---

### Retail Orders

Inquiry

Quotation

Confirmed

Packed

Delivered

---

### Client Projects

Discovery

Planning

Execution

Review

Completed

---

### Recruitment

Applied

Interview

Offer

Joined

---

### Customer Onboarding

Signed Up

Documentation

Training

Go Live

Completed

Multiple pipelines should be supported.

---

## Kanban Board

Visual representation of pipeline stages.

Users can:

- Move work items
- View progress
- Identify bottlenecks
- Manage ongoing work visually

---

## Activities

Examples:

- Reminder
- Meeting
- Call
- Follow-up
- Task

Activities help ensure that nothing gets forgotten.

---

## Notes

Rich text notes attached to:

- Contacts
- Companies
- Work items

---

## Tags

Flexible labels for categorization.

Examples:

VIP

Wholesale

Priority

Supplier

Returning Customer

---

## Timeline

Chronological history of interactions.

Includes:

- Emails
- Notes
- Meetings
- Attachments
- Activities

---

# Inbox Experience

Titan Email remains the primary interface.

When opening an email, users can optionally open a CRM sidebar.

The sidebar should be:

- Lightweight
- Collapsible
- Pinnable
- Non-intrusive

Possible information:

- Contact profile
- Company
- Current work item
- Pipeline
- Notes
- Tags
- Activity history
- Upcoming reminders
- Linked files
- Recent meetings

The objective is to provide context—not distraction.

---

# Titan Ecosystem Integration

## Titan Email

Primary workspace.

Every CRM interaction should originate naturally from email.

---

## Titan Forms

Primary lead and inquiry capture mechanism.

Typical flow:

Form Submission

↓

Create Contact

↓

Create Company (optional)

↓

Create Work Item

↓

Assign Pipeline

↓

Notify Owner

---

## Titan Calendar

Meetings become linked activities.

Users should be able to view meeting history alongside conversations.

---

## Titan Drive

Attach files to:

- Contacts
- Companies
- Work items

Examples:

- Quotations
- Contracts
- Invoices
- Brochures
- Proposals
- Presentations

---

# Automation Philosophy

Automation should always be deterministic.

If X happens,

then Y happens.

No interpretation.

No predictions.

No AI-driven workflows.

Examples:

When:

- Form submitted

Then:

- Create Contact

---

When:

- Reminder due

Then:

- Notify owner

---

When:

- Work item created

Then:

- Assign owner

Future versions may introduce a simple library of automation templates without exposing users to complex workflow builders.

---

# AI Philosophy

AI should help users understand information—not operate the CRM.

Suitable applications:

- Thread summaries
- Conversation summaries
- Contact summaries
- Action item extraction
- Draft email assistance

AI should never:

- Move stages
- Trigger automations
- Change pipelines
- Close work items
- Modify customer data automatically

The user always remains in control.

---

# Success Metrics

- CRM activation rate
- Contacts created
- Work items created
- Pipeline adoption
- Reminder completion rate
- Sidebar usage
- Titan Forms conversion into CRM records
- Weekly active CRM users
- Average onboarding time

---

# Product Positioning

Titan CRM is an inbox-first CRM built for small businesses.

It provides just enough structure to organize customer relationships without requiring teams to learn an entirely new system.

By integrating seamlessly with Titan Email, Titan Forms, Titan Calendar, and Titan Drive, Titan CRM becomes the central layer that connects conversations, customers, documents, and ongoing work.

---

# Guiding Principle

> **Email is where work happens. Titan CRM ensures nothing gets lost.**