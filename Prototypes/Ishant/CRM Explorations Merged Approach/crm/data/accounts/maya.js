/* ─────────────────────────────────────────────────────────────
   ACCOUNT — Maya Rao · Ember & Oak Coffee Roasters
   ─────────────────────────────────────────────────────────────
   Loaded with ?u=maya. She RUNS the business and is the one being
   inquired at — the first scenario we're representing.

   THREADS hold only what a mail client actually knows: a subject
   and a list of name+email participants. They do NOT reference
   contact ids. Resolving an address to a CRM contact (or to a
   CANDIDATE that doesn't exist yet) happens in crm_data.js.

   That indirection is the point. It's what makes "people from this
   thread" a genuine proposal rather than a lookup of records we
   already had — and it's why th_cafe below works at all.

   ── The three root scenarios, one thread each ──
     th_wholesale  2 opportunities   → root: opportunity list   (panel 6)
     th_cafe       0 opps, 3 people  → root: participants list  (panel 4)
     th_wedding    0 opps, 1 person  → root: contact record     (panel 5)
   The remaining three are ordinary single-opportunity threads.
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.account = {
  id: 'maya',
  name: 'Maya Rao',
  email: 'maya@emberandoak.com',
  initials: 'MR',
  business: 'Ember & Oak Coffee Roasters',
  role: 'Founder',
  // Her own address is never offered as a contact to add.
  self: ['maya@emberandoak.com', 'hello@emberandoak.com']
};

window.CRM.threads = [
  {
    id: 'th_wholesale',
    subject: 'Wholesale pricing for Third Wave Bandra',
    snippet: 'Adding myself to this thread — I will be handling the standing order.',
    lastAt: '2026-08-07T11:00:00',
    messageCount: 6,
    participants: [
      { name: 'Rohan Mehta', email: 'rohan@thirdwavebandra.com' },
      { name: 'Ayesha Khan', email: 'ayesha@thirdwavebandra.com' },
      { name: 'Maya Rao',    email: 'maya@emberandoak.com' }
    ]
    // Two opportunities (supply + hamper co-brand) both point here.
    // Ayesha is a real contact at a linked company but is NOT linked
    // to either opportunity — so she is what "Add from this thread"
    // offers on the Associated Contacts page.
  },
  {
    id: 'th_gifting',
    subject: 'Diwali gifting for the office',
    snippet: '₹1,200 per box all-in, delivered in two batches.',
    lastAt: '2026-08-06T12:30:00',
    messageCount: 4,
    participants: [
      { name: 'Priya Nair',  email: 'priya.nair@lumensystems.com' },
      { name: 'Devang Shah', email: 'devang.shah@lumensystems.com' },
      { name: 'Maya Rao',    email: 'maya@emberandoak.com' }
    ]
    // Devang: known contact, linked company, unlinked to the deal.
  },
  {
    id: 'th_sourcing',
    subject: 'Introduction via Aurelio',
    snippet: 'Three lots, 300 g each. Washed and one natural.',
    lastAt: '2026-07-24T21:15:00',
    messageCount: 5,
    participants: [
      { name: 'Carlos Restrepo', email: 'carlos@fincalacordillera.co' },
      { name: 'Maya Rao',        email: 'maya@emberandoak.com' }
    ]
    // Outbound pipeline. Maya is the buyer, not the seller.
  },
  {
    id: 'th_hiring',
    subject: 'Application — barista',
    snippet: 'Two years at Blue Tokai, Kala Ghoda. Available from September.',
    lastAt: '2026-07-28T08:30:00',
    messageCount: 2,
    participants: [
      { name: 'Tara Menon', email: 'tara.menon@gmail.com' },
      { name: 'Maya Rao',   email: 'maya@emberandoak.com' }
    ]
    // Free-mail domain → no company anywhere in this opportunity.
  },
  {
    id: 'th_wedding',
    subject: 'Favour boxes for 14 Nov wedding',
    snippet: 'Looking for about 200 small favour boxes — two sachets each.',
    lastAt: '2026-08-08T20:45:00',
    messageCount: 1,
    participants: [
      { name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com' },
      { name: 'Maya Rao',   email: 'maya@emberandoak.com' }
    ]
    // ROOT = panel 5. One counterparty, no opportunity. She is a
    // known contact with zero opportunities, so the record page
    // renders with an empty opportunity list and "Add an opportunity"
    // as the only call to action.
  },
  {
    id: 'th_cafe',
    subject: 'Café supplies — pricing and minimums',
    snippet: 'We are three friends opening a small place in Versova early next year.',
    lastAt: '2026-08-09T13:20:00',
    messageCount: 1,
    participants: [
      { name: 'Farah Sheikh',  email: 'farah.sheikh@gmail.com' },
      { name: 'Nikhil Rane',   email: 'nikhil@versovacoffee.in' },
      { name: 'Dia Kapoor',    email: 'dia.kapoor27@gmail.com' },
      { name: 'Maya Rao',      email: 'maya@emberandoak.com' }
    ]
    // ROOT = panel 4, and it exercises all three resolution outcomes:
    //   Farah  → existing contact, no company
    //   Nikhil → CANDIDATE contact + CANDIDATE company (versovacoffee.in
    //            is in no data file — the panel offers to create it)
    //   Dia    → CANDIDATE contact, free-mail domain so no company
  }
];
