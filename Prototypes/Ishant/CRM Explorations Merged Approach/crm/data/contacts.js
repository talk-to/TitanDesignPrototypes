/* ─────────────────────────────────────────────────────────────
   CONTACTS — the only owner of activity
   ─────────────────────────────────────────────────────────────
   `companyId` is NULLABLE and genuinely null for several records
   here. A private individual has no company, and that is not an
   edge case — it is the normal shape for gifting and hiring.

   Being at a company does NOT associate you with that company's
   opportunities. See links.js — ct_ayesha and ct_devang exist
   precisely to prove that.

   `details` is a free-form ordered list rendered as the label/value
   rows on the contact record page. Add or remove rows freely;
   nothing reads specific keys.
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.contacts = [
  {
    id: 'ct_rohan',
    name: 'Rohan Mehta',
    email: 'rohan@thirdwavebandra.com',
    role: 'Founder',
    companyId: 'co_thirdwave',
    phone: '+91 98200 41192',
    initials: 'RM',
    details: [
      { label: 'Role',    value: 'Founder' },
      { label: 'Company', value: 'Third Wave Bandra' },
      { label: 'Phone',   value: '+91 98200 41192' },
      { label: 'Source',  value: 'Inbound — website form' }
    ]
  },
  {
    id: 'ct_ayesha',
    name: 'Ayesha Khan',
    email: 'ayesha@thirdwavebandra.com',
    role: 'Operations Lead',
    companyId: 'co_thirdwave',
    phone: '+91 99303 55710',
    initials: 'AK',
    // Deliberately linked to NO opportunity. She is at a company
    // that IS linked. Proves association is not inherited.
    details: [
      { label: 'Role',    value: 'Operations Lead' },
      { label: 'Company', value: 'Third Wave Bandra' },
      { label: 'Phone',   value: '+91 99303 55710' }
    ]
  },
  {
    id: 'ct_priya',
    name: 'Priya Nair',
    email: 'priya.nair@lumensystems.com',
    role: 'Office Manager',
    companyId: 'co_lumen',
    phone: '+91 98192 33408',
    initials: 'PN',
    details: [
      { label: 'Role',    value: 'Office Manager' },
      { label: 'Company', value: 'Lumen Systems' },
      { label: 'Phone',   value: '+91 98192 33408' },
      { label: 'Source',  value: 'Repeat — gifted Diwali 2025' }
    ]
  },
  {
    id: 'ct_devang',
    name: 'Devang Shah',
    email: 'devang.shah@lumensystems.com',
    role: 'Finance',
    companyId: 'co_lumen',
    phone: null,
    initials: 'DS',
    // On the thread, at a linked company, NOT linked himself.
    details: [
      { label: 'Role',    value: 'Finance' },
      { label: 'Company', value: 'Lumen Systems' }
    ]
  },
  {
    id: 'ct_sneha',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@gmail.com',
    role: null,
    companyId: null,          // ← no company. Private individual.
    phone: '+91 90040 27781',
    initials: 'SI',
    details: [
      { label: 'Phone',  value: '+91 90040 27781' },
      { label: 'Source', value: 'Inbound — Instagram DM' },
      { label: 'Event',  value: 'Wedding, 14 Nov 2026' }
    ]
  },
  {
    id: 'ct_carlos',
    name: 'Carlos Restrepo',
    email: 'carlos@fincalacordillera.co',
    role: 'Export Manager',
    companyId: 'co_finca',
    phone: '+57 310 288 4417',
    initials: 'CR',
    details: [
      { label: 'Role',     value: 'Export Manager' },
      { label: 'Company',  value: 'Finca La Cordillera' },
      { label: 'Phone',    value: '+57 310 288 4417' },
      { label: 'Timezone', value: 'GMT−5 (Bogotá)' }
    ]
  },
  {
    id: 'ct_tara',
    name: 'Tara Menon',
    email: 'tara.menon@gmail.com',
    role: null,
    companyId: null,          // ← hiring candidate. No company by nature.
    phone: '+91 87796 10233',
    initials: 'TM',
    details: [
      { label: 'Phone',      value: '+91 87796 10233' },
      { label: 'Applying for', value: 'Barista' },
      { label: 'Experience', value: '2 yrs — Blue Tokai, Kala Ghoda' },
      { label: 'Source',     value: 'Inbound — careers@' }
    ]
  },
  {
    id: 'ct_vikram',
    name: 'Vikram Joshi',
    email: 'vikram@hearthandco.in',
    role: 'Head Chef',
    companyId: 'co_hearth',
    phone: '+91 98211 76650',
    initials: 'VJ',
    details: [
      { label: 'Role',    value: 'Head Chef' },
      { label: 'Company', value: 'Hearth & Co.' },
      { label: 'Phone',   value: '+91 98211 76650' }
    ]
  },
  {
    id: 'ct_farah',
    name: 'Farah Sheikh',
    email: 'farah.sheikh@gmail.com',
    role: null,
    companyId: null,
    phone: null,
    initials: 'FS',
    details: [
      { label: 'Source', value: 'Inbound — contact form' }
    ]
  }
];
