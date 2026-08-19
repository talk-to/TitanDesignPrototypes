/* ─────────────────────────────────────────────────────────────
   COMPANIES — an alias for a business, and a bucket for contacts
   ─────────────────────────────────────────────────────────────
   A company is ONLY a grouping. It owns no activity of its own —
   a company's activity feed is computed as the union of its
   contacts' activity, never stored here.

   `domain` is what lets us guess a company from an email address
   when offering "companies from this thread".
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.companies = [
  {
    id: 'co_thirdwave',
    name: 'Third Wave Bandra',
    domain: 'thirdwavebandra.com',
    kind: 'Café',
    location: 'Bandra West, Mumbai',
    note: 'Two outlets. Opened 2024.'
  },
  {
    id: 'co_lumen',
    name: 'Lumen Systems',
    domain: 'lumensystems.com',
    kind: 'Corporate',
    location: 'Lower Parel, Mumbai',
    note: '400-person office. Repeat gifting client.'
  },
  {
    id: 'co_hearth',
    name: 'Hearth & Co.',
    domain: 'hearthandco.in',
    kind: 'Restaurant group',
    location: 'Colaba, Mumbai',
    note: 'Three restaurants, one bakery.'
  },
  {
    id: 'co_finca',
    name: 'Finca La Cordillera',
    domain: 'fincalacordillera.co',
    kind: 'Producer',
    location: 'Huila, Colombia',
    note: 'Supplier, not a client. Sourced via broker in 2025.'
  }
];
