/* ─────────────────────────────────────────────────────────────
   ACTIVITIES — one flat collection, split by TIME at render
   ─────────────────────────────────────────────────────────────
   There is no separate "tasks" collection. `at` in the future
   renders under Upcoming, `at` in the past renders under Older.
   A meeting crosses the divider on its own as time passes — no
   migration, no state change.

   OWNERSHIP
     contactId      REQUIRED. A contact is the only owner of activity.
     threadId       set on emails, null on everything else.
     opportunityId  NULLABLE, and it is an OVERRIDE, not the primary
                    attribution. See DATA-MODEL §6.

       null  → belongs to every opportunity its thread is linked to
       set   → narrowed by a human to this one deal

   Companies own nothing. A company's feed is the union of its
   contacts' feeds, computed in crm_data.js.

   KINDS — 7. Three are automatic, four are authored.
     email          auto   direction: 'in' | 'out'
     stage_change   auto   from / to hold stage ids
     scheduled_send auto   a queued Titan send-later
     task           authored   done: true|false
     call           authored
     note           authored
     meeting        authored via Calendar (Calendar stays the owner)

   EMAIL HEADERS
     messageId / references are the real RFC 5322 headers. They are
     what makes thread identity deterministic — a new message is
     matched by looking for any known messageId in its references
     chain. Not a heuristic, a lookup. See DATA-MODEL §6.

   Attachments are a property of the activity that carried them.
   The Files tab is a filtered view over activities with
   `attachments`, never a second copy of the data.

   "NOW" for this prototype is pinned in crm_data.js so Upcoming
   and Older stay stable. Change NOW there, not here.
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.activities = [

  /* ── opp_tw_wholesale · Rohan · Wholesale Accounts @ Pricing agreed ── */
  { id: 'act_001', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: 'th_wholesale',
    messageId: '<tw-001@thirdwavebandra.com>', references: [],
    kind: 'email', direction: 'in', at: '2026-07-21T10:12:00',
    title: 'Wholesale pricing for Third Wave Bandra',
    body: 'We are opening a second outlet in September and want to move off our current roaster. Could you share wholesale rates for the single origins?' },

  { id: 'act_002', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'stage_change', at: '2026-07-21T10:14:00', from: null, to: 'inquiry',
    title: 'Opportunity opened at Inquiry' },

  { id: 'act_003', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: 'th_wholesale',
    messageId: '<eo-001@emberandoak.com>',
    references: ['<tw-001@thirdwavebandra.com>'],
    kind: 'email', direction: 'out', at: '2026-07-22T09:40:00',
    title: 'Sample pack on its way',
    body: 'Sending three lots — Huila, Chikmagalur and the house blend. Should reach you Thursday.',
    attachments: [{ name: 'ember-oak-wholesale-rates.pdf', size: '184 KB' }] },

  { id: 'act_004', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'stage_change', at: '2026-07-22T09:41:00', from: 'inquiry', to: 'samples',
    title: 'Moved to Samples sent' },

  { id: 'act_005', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'meeting', at: '2026-07-29T16:00:00', durationMins: 60,
    title: 'Cupping at the roastery',
    body: 'Rohan brought his head barista. Preferred the Huila for espresso.' },

  { id: 'act_006', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'stage_change', at: '2026-07-29T17:05:00', from: 'samples', to: 'tasting',
    title: 'Moved to Tasting' },

  { id: 'act_007', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'call', at: '2026-08-01T11:20:00', durationMins: 18,
    title: 'Rate discussion',
    body: 'Wants 12 kg/week to start, weekly Tuesday delivery. Asked for 8% off list at that volume — agreed to 6%.' },

  { id: 'act_008', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'note', at: '2026-08-01T11:45:00',
    title: 'Note',
    body: 'Decision sits with Rohan alone, no procurement layer. Ayesha handles the standing order once it starts — loop her in only after signing.' },

  { id: 'act_009', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'stage_change', at: '2026-08-03T10:00:00', from: 'tasting', to: 'pricing',
    title: 'Moved to Pricing agreed' },

  { id: 'act_010', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'scheduled_send', at: '2026-08-11T09:00:00',
    title: 'Reply goes out Monday 9:00 AM',
    body: 'Rate card, countersigned.' },

  { id: 'act_011', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'task', at: '2026-08-12T17:00:00', done: false,
    title: 'Send signed rate card' },

  { id: 'act_012', contactId: 'ct_rohan', opportunityId: 'opp_tw_wholesale',
    threadId: null,
    kind: 'meeting', at: '2026-08-14T15:30:00', durationMins: 45,
    title: 'Contract walkthrough' },

  /* ── opp_tw_gifting · Rohan · Corporate Gifting @ Requirements ──
     Same contact, SAME THREAD, different deal. act_013 is narrowed
     to gifting by an explicit opportunityId — a human decided that. */
  { id: 'act_013', contactId: 'ct_rohan', opportunityId: 'opp_tw_gifting',
    threadId: 'th_wholesale',
    messageId: '<tw-002@thirdwavebandra.com>',
    references: ['<tw-001@thirdwavebandra.com>', '<eo-001@emberandoak.com>'],
    kind: 'email', direction: 'in', at: '2026-08-04T14:05:00',
    title: 'Diwali hampers — co-brand?',
    body: 'Separate from the supply conversation — would you be open to a co-branded hamper we sell at the counter through October?' },

  { id: 'act_014', contactId: 'ct_rohan', opportunityId: 'opp_tw_gifting',
    threadId: null,
    kind: 'stage_change', at: '2026-08-04T14:07:00', from: null, to: 'inquiry',
    title: 'Opportunity opened at Inquiry' },

  { id: 'act_015', contactId: 'ct_rohan', opportunityId: 'opp_tw_gifting',
    threadId: null,
    kind: 'note', at: '2026-08-05T10:30:00',
    title: 'Note',
    body: 'Worth doing even at thin margin — their counter gets ~300 walk-ins a day and the sleeve carries our name.' },

  { id: 'act_016', contactId: 'ct_rohan', opportunityId: 'opp_tw_gifting',
    threadId: null,
    kind: 'stage_change', at: '2026-08-06T09:15:00', from: 'inquiry', to: 'requirements',
    title: 'Moved to Requirements' },

  { id: 'act_017', contactId: 'ct_rohan', opportunityId: 'opp_tw_gifting',
    threadId: null,
    kind: 'task', at: '2026-08-13T12:00:00', done: false,
    title: 'Confirm hamper count and sleeve artwork' },

  /* ── opp_lumen_gifting · Priya · Corporate Gifting @ Quote sent ── */
  { id: 'act_018', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: 'th_gifting',
    messageId: '<lm-001@lumensystems.com>', references: [],
    kind: 'email', direction: 'in', at: '2026-07-30T11:02:00',
    title: 'Diwali gifting for the office',
    body: 'Same as last year but larger — roughly 200 boxes. Can you quote?' },

  { id: 'act_019', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: null,
    kind: 'stage_change', at: '2026-07-30T11:04:00', from: null, to: 'inquiry',
    title: 'Opportunity opened at Inquiry' },

  { id: 'act_020', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: 'th_gifting',
    messageId: '<eo-002@emberandoak.com>',
    references: ['<lm-001@lumensystems.com>'],
    kind: 'email', direction: 'out', at: '2026-08-01T16:20:00',
    title: 'A few questions before quoting',
    body: 'Box size, whether you want ground or whole bean, and the delivery window.' },

  { id: 'act_021', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: null,
    kind: 'stage_change', at: '2026-08-02T10:00:00', from: 'inquiry', to: 'requirements',
    title: 'Moved to Requirements' },

  { id: 'act_022', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: 'th_gifting',
    messageId: '<eo-003@emberandoak.com>',
    references: ['<lm-001@lumensystems.com>', '<eo-002@emberandoak.com>'],
    kind: 'email', direction: 'out', at: '2026-08-06T12:30:00',
    title: 'Quote — 200 gift boxes',
    body: '₹1,200 per box all-in, delivered in two batches.',
    attachments: [
      { name: 'lumen-diwali-quote.pdf', size: '96 KB' },
      { name: 'box-mockup-v2.png',      size: '1.4 MB' }
    ] },

  { id: 'act_023', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: null,
    kind: 'stage_change', at: '2026-08-06T12:31:00', from: 'requirements', to: 'quote',
    title: 'Moved to Quote sent' },

  { id: 'act_024', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: null,
    kind: 'task', at: '2026-08-11T10:00:00', done: false,
    title: 'Chase quote approval' },

  // A commerce date modelled as a task, not a new kind.
  { id: 'act_025', contactId: 'ct_priya', opportunityId: 'opp_lumen_gifting',
    threadId: null,
    kind: 'task', at: '2026-08-20T00:00:00', done: false,
    title: 'Advance payment due' },

  /* ── opp_finca_sourcing · Carlos · outbound @ Cupping ── */
  { id: 'act_026', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: 'th_sourcing',
    messageId: '<eo-004@emberandoak.com>', references: [],
    kind: 'email', direction: 'out', at: '2026-06-18T18:40:00',
    title: 'Introduction via Aurelio',
    body: 'Aurelio passed on your details. We roast in Mumbai and are looking for a Huila lot for next season.' },

  { id: 'act_027', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: null,
    kind: 'stage_change', at: '2026-06-18T18:41:00', from: null, to: 'sourced',
    title: 'Opportunity opened at Sourced' },

  { id: 'act_028', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: null,
    kind: 'stage_change', at: '2026-07-02T09:00:00', from: 'sourced', to: 'samples',
    title: 'Moved to Samples requested' },

  { id: 'act_029', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: 'th_sourcing',
    messageId: '<fc-001@fincalacordillera.co>',
    references: ['<eo-004@emberandoak.com>'],
    kind: 'email', direction: 'in', at: '2026-07-24T21:15:00',
    title: 'Samples dispatched — DHL 4471882203',
    body: 'Three lots, 300 g each. Washed and one natural.',
    attachments: [{ name: 'lot-analysis-huila-2026.pdf', size: '212 KB' }] },

  { id: 'act_030', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: null,
    kind: 'meeting', at: '2026-08-07T10:00:00', durationMins: 90,
    title: 'Cupping session — Huila lots',
    body: 'Natural scored highest but too fruit-forward for the house blend. Washed lot 2 is the one.' },

  { id: 'act_031', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: null,
    kind: 'stage_change', at: '2026-08-07T12:00:00', from: 'samples', to: 'cupping',
    title: 'Moved to Cupping' },

  { id: 'act_032', contactId: 'ct_carlos', opportunityId: 'opp_finca_sourcing',
    threadId: null,
    kind: 'task', at: '2026-08-15T11:00:00', done: false,
    title: 'Send cupping scores and confirm 18 bags' },

  /* ── opp_tara_hiring · Tara · no company @ Trial shift ── */
  { id: 'act_033', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: 'th_hiring',
    messageId: '<tm-001@gmail.com>', references: [],
    kind: 'email', direction: 'in', at: '2026-07-28T08:30:00',
    title: 'Application — barista',
    body: 'Two years at Blue Tokai, Kala Ghoda. Available from September.',
    attachments: [{ name: 'tara-menon-cv.pdf', size: '78 KB' }] },

  { id: 'act_034', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: null,
    kind: 'stage_change', at: '2026-07-28T08:32:00', from: null, to: 'applied',
    title: 'Opportunity opened at Applied' },

  { id: 'act_035', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: null,
    kind: 'call', at: '2026-07-30T15:00:00', durationMins: 22,
    title: 'Phone screen',
    body: 'Strong on dial-in and milk. Wants weekday shifts only — workable.' },

  { id: 'act_036', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: null,
    kind: 'stage_change', at: '2026-07-30T15:30:00', from: 'applied', to: 'screened',
    title: 'Moved to Screened' },

  { id: 'act_037', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: null,
    kind: 'stage_change', at: '2026-08-05T09:00:00', from: 'screened', to: 'trial',
    title: 'Moved to Trial shift' },

  { id: 'act_038', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: null,
    kind: 'meeting', at: '2026-08-12T08:00:00', durationMins: 240,
    title: 'Trial shift — Saturday morning' },

  { id: 'act_039', contactId: 'ct_tara', opportunityId: 'opp_tara_hiring',
    threadId: null,
    kind: 'task', at: '2026-08-13T18:00:00', done: false,
    title: 'Decide after trial shift' },

  /* ── opp_hearth_wholesale · Vikram · no thread in this account ── */
  { id: 'act_040', contactId: 'ct_vikram', opportunityId: 'opp_hearth_wholesale',
    threadId: null,
    messageId: '<hc-001@hearthandco.in>', references: [],
    kind: 'email', direction: 'in', at: '2026-08-06T17:10:00',
    title: 'House blend for three restaurants',
    body: 'Rohan mentioned you. We go through roughly 30 kg a week across the group.' },

  { id: 'act_041', contactId: 'ct_vikram', opportunityId: 'opp_hearth_wholesale',
    threadId: null,
    kind: 'stage_change', at: '2026-08-06T17:12:00', from: null, to: 'inquiry',
    title: 'Opportunity opened at Inquiry' },

  /* ── UNATTACHED — contact activity with no opportunity and no
     linked thread. These drive the panel-4 / panel-5 roots. ── */
  { id: 'act_042', contactId: 'ct_sneha', opportunityId: null,
    threadId: 'th_wedding',
    messageId: '<si-001@gmail.com>', references: [],
    kind: 'email', direction: 'in', at: '2026-08-08T20:45:00',
    title: 'Favour boxes for 14 Nov wedding',
    body: 'Looking for about 200 small favour boxes — two sachets each. Is that something you do?' },

  { id: 'act_043', contactId: 'ct_farah', opportunityId: null,
    threadId: 'th_cafe',
    messageId: '<fs-001@gmail.com>', references: [],
    kind: 'email', direction: 'in', at: '2026-08-09T13:20:00',
    title: 'Café supplies — pricing and minimums',
    body: 'We are three friends opening a small place in Versova early next year.' },

  { id: 'act_044', contactId: 'ct_ayesha', opportunityId: null,
    threadId: 'th_wholesale',
    messageId: '<tw-003@thirdwavebandra.com>',
    references: ['<tw-001@thirdwavebandra.com>', '<eo-001@emberandoak.com>',
                 '<tw-002@thirdwavebandra.com>'],
    kind: 'email', direction: 'in', at: '2026-08-07T11:00:00',
    title: 'Re: Wholesale pricing for Third Wave Bandra',
    body: 'Adding myself to this thread — I will be handling the standing order.' },

  /* ── THE SHARED-THREAD CASE ────────────────────────────────
     A reply on th_wholesale, which is linked to TWO opportunities.
     opportunityId is null, so it belongs to BOTH — nobody has
     narrowed it, and nothing was guessed. It appears in the
     wholesale AND the hamper timelines.

     It must NOT reset either deal's quiet counter: it is not
     evidence that anyone moved either deal forward. That is why
     daysSinceLastActivity() counts strict activity only.        */
  { id: 'act_045', contactId: 'ct_rohan', opportunityId: null,
    threadId: 'th_wholesale',
    messageId: '<tw-004@thirdwavebandra.com>',
    references: ['<tw-001@thirdwavebandra.com>', '<eo-001@emberandoak.com>',
                 '<tw-002@thirdwavebandra.com>', '<tw-003@thirdwavebandra.com>'],
    kind: 'email', direction: 'in', at: '2026-08-09T18:30:00',
    title: 'Quick question about the order',
    body: 'One thing before we sign — can we change the delivery day to Wednesday?' }
];
