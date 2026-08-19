/* ─────────────────────────────────────────────────────────────
   LINKS — the explicit edges. The most important file here.
   ─────────────────────────────────────────────────────────────
   ONE RULE: association is never inherited.

   Linking a company to an opportunity does NOT link that company's
   contacts. Every contact is joined on purpose, one at a time.
   That rule is only true because these arrays are separate — a
   nested shape would have made inheritance the default.

   Two records exist purely to keep us honest:
     • ct_ayesha  is at co_thirdwave, which IS linked to
                  opp_tw_wholesale. She appears in NO contactIds.
     • ct_devang  is at co_lumen, which IS linked to
                  opp_lumen_gifting. He appears in NO contactIds.
   If either ever shows up in an Associated Contacts list, the
   query layer has started inferring edges. That's the bug.

   A thread may appear under MORE THAN ONE opportunity — see
   th_wholesale below, which belongs to both Third Wave records.
   ───────────────────────────────────────────────────────────── */

window.CRM = window.CRM || {};

window.CRM.links = [
  {
    opportunityId: 'opp_tw_wholesale',
    threadIds:   ['th_wholesale'],
    contactIds:  ['ct_rohan'],
    companyIds:  ['co_thirdwave']
  },
  {
    opportunityId: 'opp_tw_gifting',
    threadIds:   ['th_wholesale'],      // ← same thread as above
    contactIds:  ['ct_rohan'],
    companyIds:  ['co_thirdwave']
  },
  {
    opportunityId: 'opp_lumen_gifting',
    threadIds:   ['th_gifting'],
    contactIds:  ['ct_priya'],          // Devang is on the thread, not linked
    companyIds:  ['co_lumen']
  },
  {
    opportunityId: 'opp_finca_sourcing',
    threadIds:   ['th_sourcing'],
    contactIds:  ['ct_carlos'],
    companyIds:  ['co_finca']
  },
  {
    opportunityId: 'opp_tara_hiring',
    threadIds:   ['th_hiring'],
    contactIds:  ['ct_tara'],
    companyIds:  []                     // ← no company. Empty is valid.
  },
  {
    opportunityId: 'opp_hearth_wholesale',
    threadIds:   [],                    // ← unlinked to any thread
    contactIds:  ['ct_vikram'],
    companyIds:  ['co_hearth']
  }
];
