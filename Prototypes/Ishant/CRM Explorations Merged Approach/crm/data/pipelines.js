/* ─────────────────────────────────────────────────────────────
   PIPELINES — stage templates
   ─────────────────────────────────────────────────────────────
   A pipeline is a TEMPLATE, not a container. It owns nothing but
   an ordered list of stages. Opportunities are the instances that
   run through it.

   Stages are per-pipeline. There is no global status field, and
   `screened` in Hiring has nothing to do with `proposed` anywhere
   else. Stage ids only need to be unique within their pipeline.

   To add a pipeline: append an object. Nothing else needs editing.
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.pipelines = [
  {
    id: 'pl_wholesale',
    name: 'Wholesale Accounts',
    // Ends in an ongoing relationship, not a close.
    stages: [
      { id: 'inquiry',    name: 'Inquiry' },
      { id: 'samples',    name: 'Samples sent' },
      { id: 'tasting',    name: 'Tasting' },
      { id: 'pricing',    name: 'Pricing agreed' },
      { id: 'first_order', name: 'First order' },
      { id: 'active',     name: 'Active' }
    ]
  },
  {
    id: 'pl_gifting',
    name: 'Corporate Gifting',
    // Transactional. Ends at Paid.
    stages: [
      { id: 'inquiry',      name: 'Inquiry' },
      { id: 'requirements', name: 'Requirements' },
      { id: 'quote',        name: 'Quote sent' },
      { id: 'approved',     name: 'Approved' },
      { id: 'dispatched',   name: 'Dispatched' },
      { id: 'paid',         name: 'Paid' }
    ]
  },
  {
    id: 'pl_sourcing',
    name: 'Green Coffee Sourcing',
    // Runs OUTBOUND — Maya is the buyer here, not the seller.
    stages: [
      { id: 'sourced',    name: 'Sourced' },
      { id: 'samples',    name: 'Samples requested' },
      { id: 'cupping',    name: 'Cupping' },
      { id: 'contracted', name: 'Contracted' }
    ]
  },
  {
    id: 'pl_hiring',
    name: 'Hiring',
    // About a person. The contact has no company by definition.
    stages: [
      { id: 'applied',   name: 'Applied' },
      { id: 'screened',  name: 'Screened' },
      { id: 'trial',     name: 'Trial shift' },
      { id: 'offer',     name: 'Offer' },
      { id: 'joined',    name: 'Joined' }
    ]
  }
];
