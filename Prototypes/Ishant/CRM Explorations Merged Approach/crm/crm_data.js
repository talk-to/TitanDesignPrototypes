/* ═════════════════════════════════════════════════════════════
   CRM DATA — the query layer
   ═════════════════════════════════════════════════════════════
   Pure functions over window.CRM.*. No DOM, no rendering, no
   state. The sidebar consumes this; the future fullscreen CRM
   will consume the same functions, so the two surfaces can never
   disagree about what the data means.

   The old prototype kept two separate PIPELINES datasets — one in
   the shell, one in the drawer — and they silently drifted. This
   file exists so that cannot happen again.

   Load order: data/*.js must all be loaded before this file.
   ═════════════════════════════════════════════════════════════ */

window.CrmData = (function () {
  'use strict';

  /* ── Pinned clock ───────────────────────────────────────────
     The mock data is static, so "now" must be too — otherwise
     Upcoming quietly empties out as real time passes and the
     prototype stops demonstrating the time split.
     THIS IS THE ONLY PLACE TO CHANGE IT.                       */
  const NOW = new Date('2026-08-10T11:00:00');

  /* Free-mail domains never resolve to a company. This single rule
     is what makes "a contact may or may not have a company" true
     without anyone hand-authoring the exception.                */
  const FREE_MAIL = new Set([
    'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com',
    'live.com', 'yahoo.com', 'yahoo.co.in', 'icloud.com', 'me.com',
    'proton.me', 'protonmail.com', 'rediffmail.com', 'aol.com'
  ]);

  const D = () => window.CRM || {};
  const byId = (list, id) => (list || []).find(x => x.id === id) || null;
  const domainOf = email => String(email || '').split('@')[1]?.toLowerCase() || '';

  /* ── Pipelines & stages ─────────────────────────────────── */

  function pipeline(id) { return byId(D().pipelines, id); }

  function stagesOf(pipelineId) {
    const p = pipeline(pipelineId);
    return p ? p.stages : [];
  }

  function stage(pipelineId, stageId) {
    return stagesOf(pipelineId).find(s => s.id === stageId) || null;
  }

  /** Position of a stage in its pipeline — for a progress indicator.
   *  Returns { index, total } with index 0-based, or null. */
  function stageProgress(pipelineId, stageId) {
    const stages = stagesOf(pipelineId);
    const i = stages.findIndex(s => s.id === stageId);
    return i === -1 ? null : { index: i, total: stages.length };
  }

  /* ── Opportunities ──────────────────────────────────────── */

  function opportunity(id) { return byId(D().opportunities, id); }

  function linkFor(opportunityId) {
    return (D().links || []).find(l => l.opportunityId === opportunityId)
        || { opportunityId, threadIds: [], contactIds: [], companyIds: [] };
  }

  /** Opportunity decorated with its pipeline, stage and progress —
   *  what every view actually wants. */
  function opportunityView(id) {
    const o = opportunity(id);
    if (!o) return null;
    return Object.assign({}, o, {
      pipeline: pipeline(o.pipelineId),
      stage: stage(o.pipelineId, o.stageId),
      progress: stageProgress(o.pipelineId, o.stageId)
    });
  }

  /** Every opportunity this thread is linked to. A thread may belong
   *  to more than one — that is why the panel roots at a list. */
  function opportunitiesForThread(threadId) {
    return (D().links || [])
      .filter(l => (l.threadIds || []).includes(threadId))
      .map(l => opportunityView(l.opportunityId))
      .filter(Boolean);
  }

  /** Opportunities this thread is NOT on — populates
   *  "Add this thread to other opportunities". */
  function opportunitiesNotOnThread(threadId) {
    const on = new Set(opportunitiesForThread(threadId).map(o => o.id));
    return (D().opportunities || [])
      .filter(o => !on.has(o.id))
      .map(o => opportunityView(o.id));
  }

  /** Opportunities a contact is explicitly linked to. */
  function opportunitiesForContact(contactId) {
    return (D().links || [])
      .filter(l => (l.contactIds || []).includes(contactId))
      .map(l => opportunityView(l.opportunityId))
      .filter(Boolean);
  }

  function opportunitiesForCompany(companyId) {
    return (D().links || [])
      .filter(l => (l.companyIds || []).includes(companyId))
      .map(l => opportunityView(l.opportunityId))
      .filter(Boolean);
  }

  /* ── Associations — explicit edges only ─────────────────────
     These read link arrays and NOTHING else. If a contact ever
     appears here because their company is linked, association has
     started being inherited and the core rule is broken.        */

  function contactsForOpportunity(opportunityId) {
    return linkFor(opportunityId).contactIds
      .map(id => contact(id))
      .filter(Boolean);
  }

  function companiesForOpportunity(opportunityId) {
    return linkFor(opportunityId).companyIds
      .map(id => company(id))
      .filter(Boolean);
  }

  function threadsForOpportunity(opportunityId) {
    return linkFor(opportunityId).threadIds
      .map(id => thread(id))
      .filter(Boolean);
  }

  /* ── Contacts & companies ───────────────────────────────── */

  function contact(id) { return byId(D().contacts, id); }
  function company(id) { return byId(D().companies, id); }
  function thread(id)  { return byId(D().threads, id); }

  function contactByEmail(email) {
    const e = String(email || '').toLowerCase();
    return (D().contacts || []).find(c => (c.email || '').toLowerCase() === e) || null;
  }

  function companyByDomain(domain) {
    const d = String(domain || '').toLowerCase();
    if (!d || FREE_MAIL.has(d)) return null;
    return (D().companies || []).find(c => (c.domain || '').toLowerCase() === d) || null;
  }

  /** All contacts sitting in a company. This is an org grouping —
   *  it says nothing about opportunity association. */
  function contactsForCompany(companyId) {
    return (D().contacts || []).filter(c => c.companyId === companyId);
  }

  function companyForContact(contactId) {
    const c = contact(contactId);
    return c && c.companyId ? company(c.companyId) : null;
  }

  /* ── Address resolution ─────────────────────────────────────
     A mail client knows addresses; the CRM knows records. Matching
     is a query, and a miss is a CANDIDATE — a record we could
     create, which is exactly what the "+" affordances offer.     */

  /** → { name, email, contact|null, company|null, isCandidate,
   *      companyIsCandidate } */
  function resolveAddress(participant) {
    const email = participant.email;
    const dom = domainOf(email);
    const existing = contactByEmail(email);
    const existingCo = companyByDomain(dom);

    // A known contact's own companyId wins over domain inference.
    const co = existing && existing.companyId
      ? company(existing.companyId)
      : existingCo;

    const canBeCompany = !!dom && !FREE_MAIL.has(dom);

    return {
      name: (existing && existing.name) || participant.name || email,
      email,
      domain: dom,
      contact: existing,
      isCandidate: !existing,
      company: co,
      // No record for a real (non-free-mail) domain → offer to create it.
      companyIsCandidate: !co && canBeCompany,
      candidateCompanyName: !co && canBeCompany ? dom.replace(/\.[a-z.]+$/, '') : null
    };
  }

  function isSelf(email) {
    const list = (D().account && D().account.self) || [];
    return list.map(e => e.toLowerCase()).includes(String(email || '').toLowerCase());
  }

  /** Everyone on the thread except the account owner, resolved. */
  function counterparties(threadId) {
    const t = thread(threadId);
    if (!t) return [];
    return (t.participants || [])
      .filter(p => !isSelf(p.email))
      .map(resolveAddress);
  }

  /** Distinct companies inferrable from a thread, resolved.
   *  Includes candidates. */
  function companiesFromThread(threadId) {
    const out = [];
    const seen = new Set();
    counterparties(threadId).forEach(r => {
      const key = r.company ? 'co:' + r.company.id
                : r.companyIsCandidate ? 'cand:' + r.domain : null;
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push(r.company
        ? { company: r.company, isCandidate: false, name: r.company.name, domain: r.domain }
        : { company: null, isCandidate: true, name: r.candidateCompanyName, domain: r.domain });
    });
    return out;
  }

  /** People on the thread who are NOT yet linked to this opportunity.
   *  Powers "Add from this thread" on the Associated Contacts page. */
  function addableContactsFromThread(threadId, opportunityId) {
    const linked = new Set(linkFor(opportunityId).contactIds);
    return counterparties(threadId).filter(r => !r.contact || !linked.has(r.contact.id));
  }

  /** Companies on the thread not yet linked to this opportunity. */
  function addableCompaniesFromThread(threadId, opportunityId) {
    const linked = new Set(linkFor(opportunityId).companyIds);
    return companiesFromThread(threadId).filter(c => !c.company || !linked.has(c.company.id));
  }

  /* ── Activity ───────────────────────────────────────────────
     Contacts own activity. Companies own none — a company feed is
     the union of its contacts' feeds, computed here.             */

  const byTimeAsc  = (a, b) => new Date(a.at) - new Date(b.at);
  const byTimeDesc = (a, b) => new Date(b.at) - new Date(a.at);

  /** An opportunity's feed is GENEROUS by default:
   *    • activities explicitly narrowed to it, PLUS
   *    • un-narrowed activities from any thread it is linked to
   *
   *  So a reply on a thread shared by two deals shows in both, and
   *  nothing is guessed. `opportunityId` is an override, not the
   *  primary attribution — see DATA-MODEL §6.
   *
   *  strict:true returns ONLY the explicit ones. Use it for signals
   *  that must not be fooled by shared-thread traffic. */
  function activitiesForOpportunity(opportunityId, opts) {
    const acts = D().activities || [];
    const explicit = acts.filter(a => a.opportunityId === opportunityId);
    if (opts && opts.strict) return explicit;

    const threads = new Set(linkFor(opportunityId).threadIds);
    const inherited = acts.filter(a =>
      a.opportunityId == null && a.threadId && threads.has(a.threadId));

    return explicit.concat(inherited);
  }

  /** True when this activity is only in the feed by thread
   *  inheritance — i.e. nobody has said which deal it belongs to.
   *  Renders as "unsorted" and offers the narrowing affordance. */
  function isInherited(activity) {
    return activity.opportunityId == null && !!activity.threadId;
  }

  /** Everything that ever happened with this person, across every
   *  opportunity plus anything unattached. */
  function activitiesForContact(contactId) {
    return (D().activities || []).filter(a => a.contactId === contactId);
  }

  function activitiesForCompany(companyId) {
    const ids = new Set(contactsForCompany(companyId).map(c => c.id));
    return (D().activities || []).filter(a => ids.has(a.contactId));
  }

  /** THE time split. Upcoming = soonest first; Older = newest first. */
  function splitByTime(activities, now) {
    const t = (now || NOW).getTime();
    const upcoming = [], older = [];
    (activities || []).forEach(a => {
      (new Date(a.at).getTime() > t ? upcoming : older).push(a);
    });
    return { upcoming: upcoming.sort(byTimeAsc), older: older.sort(byTimeDesc) };
  }

  /** Files are a lens over activities that carried attachments —
   *  never a second copy. */
  function filesFrom(activities) {
    const out = [];
    (activities || []).slice().sort(byTimeDesc).forEach(a => {
      (a.attachments || []).forEach(f => out.push(Object.assign({}, f, {
        at: a.at, viaKind: a.kind, viaTitle: a.title, activityId: a.id
      })));
    });
    return out;
  }

  /** The next thing owed on an opportunity — a task or meeting, not
   *  an email. This is what a fixed header would surface. */
  function nextDue(opportunityId) {
    const { upcoming } = splitByTime(activitiesForOpportunity(opportunityId));
    return upcoming.find(a => a.kind === 'task' || a.kind === 'meeting') || null;
  }

  /** Days since anyone actually moved THIS deal forward.
   *
   *  STRICT on purpose. A reply on a thread shared with another
   *  opportunity is not evidence that this deal progressed, so
   *  counting it would let a dead deal look alive — and "reduce
   *  missed follow-ups" is the whole point of the signal.
   *
   *  The timeline is generous; the staleness signal is strict.
   *  Same data, two deliberately different reads. */
  function daysSinceLastActivity(opportunityId, now) {
    const { older } = splitByTime(
      activitiesForOpportunity(opportunityId, { strict: true }), now);
    if (!older.length) return null;
    const ms = (now || NOW).getTime() - new Date(older[0].at).getTime();
    return Math.floor(ms / 86400000);
  }

  /* ── Incoming mail attachment ───────────────────────────────
     What happens when a new message lands. See DATA-MODEL §6.   */

  /** Which thread does this message belong to?
   *  Deterministic — RFC 5322 References/In-Reply-To. Not matching,
   *  not scoring: a lookup of ids the sender's client wrote for us.
   *  Returns null when the chain is empty or unknown (a brand new
   *  thread, or a forward that broke the chain). */
  function threadForMessage(references) {
    const known = new Map();
    (D().activities || []).forEach(a => {
      if (a.messageId && a.threadId) known.set(a.messageId, a.threadId);
    });
    for (let i = (references || []).length - 1; i >= 0; i--) {
      const t = known.get(references[i]);
      if (t) return t;
    }
    return null;
  }

  /** Decide what to do with an arriving message.
   *
   *  ARITY decides, not cleverness:
   *    0 candidates → 'none'    nothing to attach to
   *    1 candidate  → 'auto'    no ambiguity, file it silently
   *    2+           → 'suggest' never guess; a human picks
   *
   *  Precision over recall: a missing email costs one tap, a wrongly
   *  filed one costs trust in the timeline — which is the product.
   *
   *  msg: { messageId, references, fromEmail }
   *  → { threadId, opportunities, mode, basis } */
  function classifyIncoming(msg) {
    const threadId = threadForMessage(msg.references);

    // Case 1 — reply into a known thread. Thread is certain.
    if (threadId) {
      const opps = opportunitiesForThread(threadId);
      return {
        threadId,
        opportunities: opps,
        basis: 'references',
        mode: opps.length === 0 ? 'none' : opps.length === 1 ? 'auto' : 'suggest'
      };
    }

    // Case 2/3 — new thread. Fall back to the sender's own deals.
    const c = contactByEmail(msg.fromEmail);
    if (!c) return { threadId: null, opportunities: [], basis: 'unknown', mode: 'none' };

    const opps = opportunitiesForContact(c.id);
    return {
      threadId: null,
      opportunities: opps,
      basis: 'contact',
      // Never silent on a new thread — the contact match says WHO,
      // not WHICH deal. One candidate still gets confirmed.
      mode: opps.length === 0 ? 'none' : 'suggest'
    };
  }

  /* ── Root scenario ──────────────────────────────────────────
     Which page the panel opens on for a given thread. The nav
     stack's ROOT is scenario-dependent; back never escapes it.   */

  function rootScenario(threadId) {
    const opps = opportunitiesForThread(threadId);
    if (opps.length) return { page: 'opportunities', threadId };

    const others = counterparties(threadId);
    if (others.length > 1) return { page: 'participants', threadId };

    const only = others[0];
    if (only && only.contact) {
      return { page: 'contact', contactId: only.contact.id, threadId };
    }
    // Sole counterparty isn't a record yet — nothing to show but the
    // offer to create one, which is the participants page with one row.
    return { page: 'participants', threadId };
  }

  return {
    NOW, FREE_MAIL,

    pipeline, stagesOf, stage, stageProgress,

    opportunity, opportunityView, linkFor,
    opportunitiesForThread, opportunitiesNotOnThread,
    opportunitiesForContact, opportunitiesForCompany,

    contactsForOpportunity, companiesForOpportunity, threadsForOpportunity,

    contact, company, thread,
    contactByEmail, companyByDomain,
    contactsForCompany, companyForContact,

    resolveAddress, isSelf, counterparties, companiesFromThread,
    addableContactsFromThread, addableCompaniesFromThread,

    activitiesForOpportunity, activitiesForContact, activitiesForCompany,
    isInherited, splitByTime, filesFrom, nextDue, daysSinceLastActivity,

    threadForMessage, classifyIncoming,

    rootScenario
  };
})();
