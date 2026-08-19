/* ─────────────────────────────────────────────────────────────
   OPPORTUNITIES — one live run through one pipeline
   ─────────────────────────────────────────────────────────────
   `pipelineId` + `stageId` is the whole state. stageId must be one
   of that pipeline's stage ids (see pipelines.js).

   An opportunity does NOT hold its threads/contacts/companies —
   those are edges in links.js. This keeps the no-inheritance rule
   structurally true rather than merely intended.

   A new opportunity normally starts at its pipeline's FIRST stage,
   but stageId is free — nothing enforces the starting position.
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.opportunities = [
  {
    id: 'opp_tw_wholesale',
    name: 'Third Wave Bandra — wholesale supply',
    pipelineId: 'pl_wholesale',
    stageId: 'pricing',
    openedAt: '2026-07-21',
    value: '₹42,000 / mo'
  },
  {
    id: 'opp_tw_gifting',
    name: 'Third Wave — Diwali hamper co-brand',
    pipelineId: 'pl_gifting',
    stageId: 'requirements',
    openedAt: '2026-08-04',
    value: '₹1,10,000'
    // Shares thread th_wholesale with opp_tw_wholesale.
    // This is the reason the panel roots at a LIST, not a record.
  },
  {
    id: 'opp_lumen_gifting',
    name: 'Lumen Systems — Diwali gifting, 200 boxes',
    pipelineId: 'pl_gifting',
    stageId: 'quote',
    openedAt: '2026-07-30',
    value: '₹2,40,000'
  },
  {
    id: 'opp_finca_sourcing',
    name: 'Finca La Cordillera — 2026 Huila lot',
    pipelineId: 'pl_sourcing',
    stageId: 'cupping',
    openedAt: '2026-06-18',
    value: '18 bags'
    // Outbound. Maya is the buyer.
  },
  {
    id: 'opp_tara_hiring',
    name: 'Tara Menon — Barista',
    pipelineId: 'pl_hiring',
    stageId: 'trial',
    openedAt: '2026-07-28',
    value: null
    // Contact has no company. Companies list will be empty here.
  },
  {
    id: 'opp_hearth_wholesale',
    name: 'Hearth & Co. — house blend supply',
    pipelineId: 'pl_wholesale',
    stageId: 'inquiry',
    openedAt: '2026-08-06',
    value: null
    // Deliberately has NO threads linked. This is what populates
    // "Add this thread to other opportunities" on every thread.
  }
];
