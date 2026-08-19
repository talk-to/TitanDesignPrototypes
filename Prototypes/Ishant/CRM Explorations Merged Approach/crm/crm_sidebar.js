/* ═════════════════════════════════════════════════════════════
   CRM SIDEBAR — page stack + renderers
   ═════════════════════════════════════════════════════════════
   All markup is generated here. There is deliberately no HTML
   file: the previous prototype's crm_sidebar.html was fetched
   behind a guard that never fired, so it silently drifted from an
   inline duplicate. One source, no duplicate, no drift.

   Reads data only through CrmData. Mutations (linking, stage
   changes, notes) write back to window.CRM in memory — nothing is
   persisted, so a reload restores the authored dataset.
   ═════════════════════════════════════════════════════════════ */

window.CrmSidebar = (function () {
  'use strict';

  const Q = window.CrmData;

  /* ── Icons ──────────────────────────────────────────────── */
  const IC = {
    back:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    plus:  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    mail:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    phone: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 3h4l2 5-3 2a14 14 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    cal:   '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    note:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v11l-5 5H4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M20 15h-5v5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    task:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flag:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 21V4h14l-3 4 3 4H5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    clock: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    clip:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M21 12l-8.5 8.5a5 5 0 01-7-7L14 5a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L15 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    expand:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M20 4l-7.5 7.5M10 20H4v-6M4 20l7.5-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bldg:  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16M14 21V10h5a1 1 0 011 1v10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 8h3M7 12h3M7 16h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  const KIND_ICON = {
    email: IC.mail, call: IC.phone, meeting: IC.cal, note: IC.note,
    task: IC.task, stage_change: IC.flag, scheduled_send: IC.clock
  };
  const AUTO_KINDS = new Set(['email', 'stage_change', 'scheduled_send']);

  /* ── Utilities ──────────────────────────────────────────── */

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const PALETTE = ['#2170f4', '#7c3aed', '#0d9488', '#c2410c', '#b91c1c',
                   '#0369a1', '#4d7c0f', '#a16207', '#be185d'];

  function tint(seed) {
    let h = 0;
    for (let i = 0; i < String(seed).length; i++) h = (h * 31 + String(seed).charCodeAt(i)) | 0;
    return PALETTE[Math.abs(h) % PALETTE.length];
  }

  function initialsOf(name) {
    const parts = String(name || '?').trim().split(/\s+/);
    return ((parts[0] || '')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function clockTime(d) {
    let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return h + ':' + m + ' ' + ap;
  }

  /** Relative to the PINNED clock (CrmData.NOW), not real time. */
  function when(at) {
    const d = new Date(at), now = Q.NOW;
    const dayMs = 86400000;
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const n0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((d0 - n0) / dayMs);

    if (days === 0)  return 'Today ' + clockTime(d);
    if (days === 1)  return 'Tomorrow ' + clockTime(d);
    if (days === -1) return 'Yesterday';
    if (days > 1 && days < 7)   return 'In ' + days + ' days';
    if (days < -1 && days > -7) return Math.abs(days) + ' days ago';
    return MON[d.getMonth()] + ' ' + d.getDate();
  }

  function avatar(seed, name, opts) {
    opts = opts || {};
    const cls = 'crm-avatar' + (opts.square ? ' sq' : '') + (opts.candidate ? ' candidate' : '');
    const style = opts.candidate ? '' : ' style="background:' + tint(seed) + '"';
    return '<div class="' + cls + '"' + style + '>' + esc(opts.text || initialsOf(name)) + '</div>';
  }

  function toast(msg) {
    let el = document.getElementById('crmToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'crmToast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ── State ──────────────────────────────────────────────── */

  let threadId = null;   // which email thread is open
  let stack = [];        // nav stack; stack[0] is the scenario root
  let back = false;      // direction, for the page transition
  let tab = 'notes';     // Notes | Files on the opportunity page
  let seq = 1000;        // id generator for records created at runtime

  const top = () => stack[stack.length - 1];
  const nextId = p => p + '_' + (++seq);

  function push(page) { stack.push(page); back = false; render(); }
  function pop() { if (stack.length > 1) { stack.pop(); back = true; render(); } }

  /* ── Panel open / close ─────────────────────────────────── */

  function panel() { return document.getElementById('crmSidebar'); }

  function open() {
    const p = panel();
    if (!p) return;
    p.classList.add('open');
    const btn = document.getElementById('crmToggleBtn');
    if (btn) btn.classList.add('active');
    render();
  }

  function close() {
    const p = panel();
    if (!p) return;
    p.classList.remove('open');
    const btn = document.getElementById('crmToggleBtn');
    if (btn) btn.classList.remove('active');
  }

  function toggle() {
    const p = panel();
    if (!p) return;
    p.classList.contains('open') ? close() : open();
  }

  /** Selecting a thread resets the stack to that thread's root
   *  scenario — back can never escape into another thread's pages. */
  function setThread(id) {
    threadId = id;
    tab = 'notes';
    stack = [Q.rootScenario(id)];
    back = false;
    render();
  }

  /* ── Shared fragments ───────────────────────────────────── */

  /** Deep link into the full app for whatever page you're on, so
   *  "Open in CRM" lands on the record rather than a root page. */
  function fullUrl() {
    const p = top() || {};
    switch (p.page) {
      case 'opportunity':
      case 'oppContacts':
      case 'oppCompanies': return 'crm.html#/opportunity/' + p.opportunityId;
      case 'contact':      return 'crm.html#/contact/' + p.contactId;
      case 'company':      return 'crm.html#/company/' + p.companyId;
      default:             return 'crm.html#/opportunities';
    }
  }

  function crumb() {
    const p = top();
    const openBtn = '<button class="crm-crumb-open" title="Open in the full CRM" ' +
      'onclick="CrmSidebar.openFull()">' + IC.expand + '</button>';

    if (stack.length <= 1) {
      return '<div class="crm-crumb"><span class="crm-crumb-title">' +
        esc(p.crumbTitle || 'CRM') + '</span>' + openBtn + '</div>';
    }
    const parent = stack[stack.length - 2];
    return '<div class="crm-crumb">' +
      '<div class="crm-crumb-back" onclick="CrmSidebar.pop()">' + IC.back +
        '<span class="crm-crumb-label">' + esc(parent.crumbTitle || 'Back') + '</span>' +
      '</div>' + openBtn + '</div>';
  }

  function stagePill(o) {
    return '<span class="crm-stage-pill">' + esc(o.stage ? o.stage.name : '—') + '</span>';
  }

  function ticks(o) {
    if (!o.progress) return '';
    let h = '<div class="crm-ticks">';
    for (let i = 0; i < o.progress.total; i++) {
      h += '<div class="crm-tick' + (i <= o.progress.index ? ' done' : '') + '"></div>';
    }
    return h + '</div>';
  }

  function oppCard(o, onclick) {
    return '<div class="crm-opp" onclick="' + onclick + '">' +
      '<div class="crm-opp-name">' + esc(o.name) + '</div>' +
      '<div class="crm-opp-meta">' +
        '<span class="crm-opp-pipe">' + esc(o.pipeline ? o.pipeline.name : '—') + '</span>' +
        '<span class="crm-opp-dot">·</span>' + stagePill(o) +
      '</div>' + ticks(o) + '</div>';
  }

  function searchBar(placeholder) {
    return '<div class="crm-search">' + IC.search +
      '<input type="text" placeholder="' + esc(placeholder) + '" ' +
      'oninput="CrmSidebar.filter(this)"></div>';
  }

  function personRow(r, opts) {
    opts = opts || {};
    const name = r.contact ? r.contact.name : r.name;
    const sub = r.contact
      ? (r.contact.role ? r.contact.role + (r.company ? ' · ' + r.company.name : '') : r.contact.email)
      : r.email + ' · not a contact yet';
    const av = avatar(r.contact ? r.contact.id : r.email, name, { candidate: !r.contact });
    const tail = opts.add
      ? '<button class="crm-row-add" title="Add" onclick="event.stopPropagation();' + opts.add + '">' + IC.plus + '</button>'
      : '<span class="crm-row-chev">' + IC.chev + '</span>';
    return '<div class="crm-row" data-name="' + esc(name.toLowerCase()) + '"' +
      (opts.click ? ' onclick="' + opts.click + '"' : ' style="cursor:default"') + '>' +
      av + '<div class="crm-row-main"><div class="crm-row-title">' + esc(name) + '</div>' +
      '<div class="crm-row-sub">' + esc(sub) + '</div></div>' + tail + '</div>';
  }

  /* ── Activity rendering ─────────────────────────────────── */

  function activityItem(a, opts) {
    opts = opts || {};
    const upcoming = new Date(a.at) > Q.NOW;
    /* Inherited = in this feed only because its thread is linked,
       with nobody having said which deal it belongs to. Only worth
       flagging when the thread actually serves more than one. */
    const inherited = opts.oppId && Q.isInherited(a) && opts.shared;
    const cls = 'crm-act ' + a.kind + (AUTO_KINDS.has(a.kind) ? ' auto' : '') +
                (upcoming ? ' upcoming' : '') + (inherited ? ' inherited' : '');
    const ic = KIND_ICON[a.kind] || IC.note;

    let title = esc(a.title);
    if (a.kind === 'task') {
      title = '<span class="crm-task-chk" onclick="event.stopPropagation();CrmSidebar.toggleTask(\'' +
        a.id + '\')"></span>' + title;
    }
    if (a.kind === 'email' && a.direction) {
      title = title + ' <span style="color:#9aa1ab;font-weight:500">· ' +
        (a.direction === 'in' ? 'received' : 'sent') + '</span>';
    }

    let h = '<div class="' + cls + '">' +
      '<div class="crm-act-dot">' + ic + '</div>' +
      '<div class="crm-act-top"><div class="crm-act-title">' + title + '</div>' +
      '<div class="crm-act-when">' + esc(when(a.at)) + '</div></div>';

    if (a.body) h += '<div class="crm-act-body">' + esc(a.body) + '</div>';

    (a.attachments || []).forEach(f => {
      h += '<div class="crm-act-attach">' + IC.clip + esc(f.name) +
           ' <span style="color:#b6bcc5">' + esc(f.size) + '</span></div>';
    });

    const c = Q.contact(a.contactId);
    if (c) h += '<div class="crm-act-who">' + esc(c.name) + '</div>';

    /* The narrowing affordance. Ignoring it is safe — the message
       stays in every linked deal, which is never wrong, only broad. */
    if (inherited) {
      h += '<div class="crm-unsorted">' +
        '<span class="crm-unsorted-tag">Also in ' + (opts.shared - 1) +
          ' other ' + (opts.shared - 1 === 1 ? 'deal' : 'deals') + '</span>' +
        '<button class="crm-unsorted-btn" onclick="CrmSidebar.narrowTo(\'' +
          a.id + '\',\'' + opts.oppId + '\')">Only this one</button></div>';
    }

    return h + '</div>';
  }

  function timeline(list, opts) {
    if (!list.length) return '';
    return '<div class="crm-tl">' +
      list.map(a => activityItem(a, opts)).join('') + '</div>';
  }

  function activitySections(acts, opts) {
    opts = opts || {};
    const s = Q.splitByTime(acts);
    let h = '';

    if (s.upcoming.length) {
      h += '<div class="crm-sec">Upcoming Activity</div>' + timeline(s.upcoming, opts);
    } else if (opts.showEmptyUpcoming) {
      h += '<div class="crm-sec">Upcoming Activity</div>' +
           '<div class="crm-empty">Nothing scheduled. Nobody is waiting on you here.</div>';
    }

    if (opts.addLink) {
      h += '<button class="crm-link-add" onclick="CrmSidebar.newActivity()">new Activity</button>';
    }

    h += '<div class="crm-sec">Older Activity</div>';
    h += s.older.length ? timeline(s.older, opts) : '<div class="crm-empty">Nothing yet.</div>';
    return h;
  }

  /* ═══════════════════════════════════════════════════════════
     PAGES
     ═══════════════════════════════════════════════════════════ */

  /* ── ROOT A · opportunities for this thread (panel 6) ───── */
  function pageOpportunities(p) {
    const linked = Q.opportunitiesForThread(p.threadId);
    const others = Q.opportunitiesNotOnThread(p.threadId);

    let h = '<button class="crm-btn-primary" onclick="CrmSidebar.addOpportunity()">' +
      IC.plus + 'Add an opportunity</button>';

    h += '<div class="crm-sec">Active Opportunities for this thread</div>';
    h += linked.length
      ? linked.map(o => oppCard(o, "CrmSidebar.openOpp('" + o.id + "')")).join('')
      : '<div class="crm-empty">This thread is not on any opportunity yet.</div>';

    if (others.length) {
      h += '<div class="crm-sec">Add this thread to other opportunities</div>';
      h += others.map(o =>
        '<div class="crm-row" data-name="' + esc(o.name.toLowerCase()) + '" style="cursor:default">' +
        avatar(o.id, o.name, { square: true, text: (o.pipeline ? o.pipeline.name[0] : '?') }) +
        '<div class="crm-row-main"><div class="crm-row-title">' + esc(o.name) + '</div>' +
        '<div class="crm-row-sub">' + esc(o.pipeline ? o.pipeline.name : '') +
          ' · ' + esc(o.stage ? o.stage.name : '') + '</div></div>' +
        '<button class="crm-row-add" title="Add this thread" onclick="CrmSidebar.linkThread(\'' +
          o.id + '\')">' + IC.plus + '</button></div>').join('');
    }
    return h;
  }

  /* ── ROOT B · participants (panel 4) ────────────────────── */
  function pageParticipants(p) {
    const people = Q.counterparties(p.threadId);
    const cos = Q.companiesFromThread(p.threadId);

    let h = '<button class="crm-btn-primary" onclick="CrmSidebar.addOpportunity()">' +
      IC.plus + 'Add an opportunity</button>';

    h += '<div class="crm-sec">Companies from this thread</div>';
    if (cos.length) {
      h += cos.map(c => {
        const label = c.isCandidate ? c.name : c.company.name;
        const sub = c.isCandidate ? c.domain + ' · not a company yet'
                                  : (c.company.kind + ' · ' + c.company.location);
        const click = c.company ? "CrmSidebar.openCompany('" + c.company.id + "')" : '';
        return '<div class="crm-row" data-name="' + esc(label.toLowerCase()) + '"' +
          (click ? ' onclick="' + click + '"' : ' style="cursor:default"') + '>' +
          avatar(c.domain, label, { square: true, candidate: c.isCandidate,
            text: c.isCandidate ? '+' : initialsOf(c.company.name) }) +
          '<div class="crm-row-main"><div class="crm-row-title">' + esc(label) + '</div>' +
          '<div class="crm-row-sub">' + esc(sub) + '</div></div>' +
          (c.isCandidate
            ? '<button class="crm-row-add" onclick="event.stopPropagation();CrmSidebar.createCompany(\'' +
              esc(c.domain) + '\')">' + IC.plus + '</button>'
            : '<span class="crm-row-chev">' + IC.chev + '</span>') + '</div>';
      }).join('');
    } else {
      h += '<div class="crm-empty">No company addresses on this thread — everyone is on personal mail.</div>';
    }

    h += '<div class="crm-sec">People from this thread</div>';
    h += people.map(r => personRow(r, {
      click: r.contact ? "CrmSidebar.openContact('" + r.contact.id + "')" : '',
      add: r.contact ? null : "CrmSidebar.createContact('" + esc(r.email) + "')"
    })).join('');

    return h;
  }

  /* ── ROOT C / drill · contact record (panel 5) ──────────── */
  function pageContact(p) {
    const c = Q.contact(p.contactId);
    if (!c) return '<div class="crm-empty">Contact not found.</div>';
    const co = Q.companyForContact(c.id);
    const opps = Q.opportunitiesForContact(c.id);
    const acts = Q.activitiesForContact(c.id);

    let h = '';
    if (!opps.length) {
      h += '<button class="crm-btn-primary" onclick="CrmSidebar.addOpportunity()">' +
        IC.plus + 'Add an opportunity</button>';
    }

    h += '<div class="crm-rec-head" style="margin-top:' + (opps.length ? '2px' : '16px') + '">' +
      '<div class="crm-rec-avatar" style="background:' + tint(c.id) + '">' +
        esc(c.initials || initialsOf(c.name)) + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div class="crm-rec-name">' + esc(c.name) + '</div>' +
        '<div class="crm-rec-role">' + esc(c.role || (co ? co.name : 'No company')) +
          (c.role && co ? ' · ' + esc(co.name) : '') + '</div>' +
        '<div class="crm-rec-acts">' +
          '<button class="crm-rec-act" title="' + esc(c.email) + '" ' +
            'onclick="CrmSidebar.say(\'Compose to ' + esc(c.email) + '\')">' + IC.mail + '</button>' +
          '<button class="crm-rec-act" title="' + esc(c.phone || 'No number') + '"' +
            (c.phone ? ' onclick="CrmSidebar.say(\'Call ' + esc(c.phone) + '\')"' : ' disabled') +
            '>' + IC.phone + '</button>' +
          (co ? '<button class="crm-rec-act" title="' + esc(co.name) + '" ' +
            'onclick="CrmSidebar.openCompany(\'' + co.id + '\')">' + IC.bldg + '</button>' : '') +
        '</div>' +
      '</div></div>';

    if (c.details && c.details.length) {
      h += '<div class="crm-sec">Details</div><div class="crm-details">' +
        c.details.map(d => '<div class="crm-detail"><div class="crm-detail-k">' +
          esc(d.label) + '</div><div class="crm-detail-v">' + esc(d.value) + '</div></div>').join('') +
        '</div>';
    }

    h += '<div class="crm-sec">Opportunities</div>';
    h += opps.length
      ? opps.map(o => oppCard(o, "CrmSidebar.openOpp('" + o.id + "')")).join('')
      : '<div class="crm-empty">Not on any opportunity yet.</div>';

    h += activitySections(acts, { addLink: false });
    return h;
  }

  /* ── Company record ─────────────────────────────────────── */
  function pageCompany(p) {
    const co = Q.company(p.companyId);
    if (!co) return '<div class="crm-empty">Company not found.</div>';
    const people = Q.contactsForCompany(co.id);
    const opps = Q.opportunitiesForCompany(co.id);

    let h = '<div class="crm-rec-head">' +
      '<div class="crm-rec-avatar sq" style="background:' + tint(co.id) + '">' +
        esc(initialsOf(co.name)) + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div class="crm-rec-name">' + esc(co.name) + '</div>' +
        '<div class="crm-rec-role">' + esc(co.kind + ' · ' + co.location) + '</div>' +
      '</div></div>';

    h += '<div class="crm-sec">Details</div><div class="crm-details">' +
      '<div class="crm-detail"><div class="crm-detail-k">Domain</div>' +
        '<div class="crm-detail-v">' + esc(co.domain) + '</div></div>' +
      '<div class="crm-detail"><div class="crm-detail-k">Type</div>' +
        '<div class="crm-detail-v">' + esc(co.kind) + '</div></div>' +
      (co.note ? '<div class="crm-detail"><div class="crm-detail-k">Note</div>' +
        '<div class="crm-detail-v">' + esc(co.note) + '</div></div>' : '') +
      '</div>';

    h += '<div class="crm-sec">People here</div>' +
      '<div class="crm-sec-sub">Being at this company does not put them on an opportunity.</div>';
    h += people.map(c => personRow({ contact: c, company: co, name: c.name, email: c.email },
      { click: "CrmSidebar.openContact('" + c.id + "')" })).join('');

    h += '<div class="crm-sec">Opportunities</div>';
    h += opps.length
      ? opps.map(o => oppCard(o, "CrmSidebar.openOpp('" + o.id + "')")).join('')
      : '<div class="crm-empty">None.</div>';

    h += '<div class="crm-sec">Activity</div>' +
      '<div class="crm-sec-sub">Rolled up from everyone here — companies store no activity of their own.</div>';
    const s = Q.splitByTime(Q.activitiesForCompany(co.id));
    h += timeline(s.older.slice(0, 8)) || '<div class="crm-empty">Nothing yet.</div>';
    return h;
  }

  /* ── Opportunity record (panel 1) ───────────────────────── */
  function pageOpportunity(p) {
    const o = Q.opportunityView(p.opportunityId);
    if (!o) return '<div class="crm-empty">Opportunity not found.</div>';

    const contacts = Q.contactsForOpportunity(o.id);
    const cos = Q.companiesForOpportunity(o.id);
    const acts = Q.activitiesForOpportunity(o.id);
    const files = Q.filesFrom(acts);
    const quiet = Q.daysSinceLastActivity(o.id);

    /* Header — name, then the stage control directly beneath it. */
    let h = '<div class="crm-opp-head">' +
      '<div class="crm-opp-title">' + esc(o.name) + '</div>' +
      '<div class="crm-opp-sub">' + esc(o.pipeline ? o.pipeline.name : '') +
        (o.value ? ' · ' + esc(o.value) : '') +
        (quiet != null ? ' · quiet ' + quiet + 'd' : '') + '</div>' +
      '<div class="crm-stage-wrap">' +
        '<span class="crm-stage-select">' + esc(o.stage ? o.stage.name : 'Set stage') + IC.down + '</span>' +
        '<select class="crm-stage-native" onchange="CrmSidebar.setStage(\'' + o.id + '\',this.value)">' +
          Q.stagesOf(o.pipelineId).map(s => '<option value="' + s.id + '"' +
            (s.id === o.stageId ? ' selected' : '') + '>' + esc(s.name) + '</option>').join('') +
        '</select>' +
      '</div>' + ticks(o) + '</div>';

    /* Two nav boxes */
    const cName = contacts.length ? contacts[0].name.split(' ')[0] +
      (contacts.length > 1 ? ' +' + (contacts.length - 1) : '') : 'None';
    const oName = cos.length ? cos[0].name + (cos.length > 1 ? ' +' + (cos.length - 1) : '') : 'None';

    h += '<div class="crm-duo">' +
      '<div class="crm-duo-box" onclick="CrmSidebar.openOppContacts(\'' + o.id + '\')">' +
        '<div class="crm-duo-label">Contacts ' + IC.chev + '</div>' +
        '<div class="crm-duo-value' + (contacts.length ? '' : ' none') + '">' + esc(cName) + '</div></div>' +
      '<div class="crm-duo-box" onclick="CrmSidebar.openOppCompanies(\'' + o.id + '\')">' +
        '<div class="crm-duo-label">Companies ' + IC.chev + '</div>' +
        '<div class="crm-duo-value' + (cos.length ? '' : ' none') + '">' + esc(oName) + '</div></div>' +
      '</div>';

    /* Notes / Files tabs */
    h += '<div class="crm-tabs">' +
      '<div class="crm-tab' + (tab === 'notes' ? ' active' : '') +
        '" onclick="CrmSidebar.setTab(\'notes\')">Notes</div>' +
      '<div class="crm-tab' + (tab === 'files' ? ' active' : '') +
        '" onclick="CrmSidebar.setTab(\'files\')">Files ' +
        '<span class="crm-tab-count">' + files.length + '</span></div></div>';

    h += '<div class="crm-tabpane">';
    if (tab === 'notes') {
      h += '<textarea class="crm-note-box" id="crmNoteBox" ' +
        'placeholder="Write a note about this opportunity…"></textarea>' +
        '<div class="crm-note-actions">' +
        '<button class="crm-btn-sm accent" onclick="CrmSidebar.saveNote(\'' + o.id + '\')">Save note</button>' +
        '</div>' +
        '<div class="crm-sec-sub" style="margin-top:8px">Saved notes appear in the timeline below, ' +
        'against the point in time they were written.</div>';
    } else {
      h += files.length
        ? files.map(f => '<div class="crm-file"><div class="crm-file-ic">' +
            esc((f.name.split('.').pop() || '').slice(0, 3).toUpperCase()) + '</div>' +
            '<div class="crm-row-main"><div class="crm-row-title">' + esc(f.name) + '</div>' +
            '<div class="crm-row-sub">' + esc(f.size) + ' · ' + esc(when(f.at)) + '</div></div></div>').join('')
        : '<div class="crm-empty">No attachments on this opportunity yet.</div>';
      h += '<div class="crm-sec-sub" style="margin-top:10px">A lens over activities that carried ' +
           'attachments — not a separate store.</div>';
    }
    h += '</div>';

    /* How many opportunities share this opportunity's threads? If
       more than one, inherited messages are genuinely ambiguous and
       get the "unsorted" treatment. If exactly one, there is nothing
       to disambiguate and the flag would be noise. */
    const shared = Math.max.apply(null,
      [1].concat(Q.threadsForOpportunity(o.id)
        .map(t => Q.opportunitiesForThread(t.id).length)));

    h += activitySections(acts, {
      addLink: true, showEmptyUpcoming: true, oppId: o.id, shared: shared
    });
    return h;
  }

  /* ── Associated contacts (panel 2) ──────────────────────── */
  function pageOppContacts(p) {
    const o = Q.opportunityView(p.opportunityId);
    const linked = Q.contactsForOpportunity(o.id);
    const addable = threadId ? Q.addableContactsFromThread(threadId, o.id) : [];

    let h = searchBar('Search for a contact');

    h += '<div class="crm-sec">Associated Contacts</div>';
    h += linked.length
      ? linked.map(c => personRow(
          { contact: c, company: Q.companyForContact(c.id), name: c.name, email: c.email },
          { click: "CrmSidebar.openContact('" + c.id + "')" })).join('')
      : '<div class="crm-empty">Nobody linked yet.</div>';

    if (addable.length) {
      h += '<div class="crm-sec">Add from this thread</div>' +
        '<div class="crm-sec-sub">On the thread, not yet on this opportunity.</div>';
      h += addable.map(r => personRow(r, {
        add: r.contact
          ? "CrmSidebar.linkContact('" + o.id + "','" + r.contact.id + "')"
          : "CrmSidebar.createContact('" + esc(r.email) + "','" + o.id + "')"
      })).join('');
    }
    return h;
  }

  /* ── Associated companies (panel 3) ─────────────────────── */
  function pageOppCompanies(p) {
    const o = Q.opportunityView(p.opportunityId);
    const linked = Q.companiesForOpportunity(o.id);
    const addable = threadId ? Q.addableCompaniesFromThread(threadId, o.id) : [];

    let h = searchBar('Search for a company');

    h += '<div class="crm-sec">Associated Companies</div>';
    h += linked.length
      ? linked.map(c => '<div class="crm-row" data-name="' + esc(c.name.toLowerCase()) +
          '" onclick="CrmSidebar.openCompany(\'' + c.id + '\')">' +
          avatar(c.id, c.name, { square: true }) +
          '<div class="crm-row-main"><div class="crm-row-title">' + esc(c.name) + '</div>' +
          '<div class="crm-row-sub">' + esc(c.kind + ' · ' + c.location) + '</div></div>' +
          '<span class="crm-row-chev">' + IC.chev + '</span></div>').join('')
      : '<div class="crm-empty">No company linked. That is normal — this may be an individual.</div>';

    if (addable.length) {
      h += '<div class="crm-sec">Add from this thread</div>';
      h += addable.map(c => {
        const label = c.isCandidate ? c.name : c.company.name;
        return '<div class="crm-row" style="cursor:default">' +
          avatar(c.domain, label, { square: true, candidate: c.isCandidate,
            text: c.isCandidate ? '+' : initialsOf(label) }) +
          '<div class="crm-row-main"><div class="crm-row-title">' + esc(label) + '</div>' +
          '<div class="crm-row-sub">' + esc(c.domain) +
            (c.isCandidate ? ' · not a company yet' : '') + '</div></div>' +
          '<button class="crm-row-add" onclick="' + (c.isCandidate
            ? "CrmSidebar.createCompany('" + esc(c.domain) + "','" + o.id + "')"
            : "CrmSidebar.linkCompany('" + o.id + "','" + c.company.id + "')") +
          '">' + IC.plus + '</button></div>';
      }).join('');
    }
    return h;
  }

  /* ── Render ─────────────────────────────────────────────── */

  const PAGES = {
    opportunities: pageOpportunities,
    participants:  pageParticipants,
    contact:       pageContact,
    company:       pageCompany,
    opportunity:   pageOpportunity,
    oppContacts:   pageOppContacts,
    oppCompanies:  pageOppCompanies
  };

  function label(p) {
    switch (p.page) {
      case 'opportunities': return 'Opportunities';
      case 'participants':  return 'This thread';
      case 'contact':       { const c = Q.contact(p.contactId); return c ? c.name : 'Contact'; }
      case 'company':       { const c = Q.company(p.companyId); return c ? c.name : 'Company'; }
      case 'opportunity':   { const o = Q.opportunity(p.opportunityId); return o ? o.name : 'Opportunity'; }
      case 'oppContacts':   return 'Associated Contacts';
      case 'oppCompanies':  return 'Associated Companies';
      default: return 'CRM';
    }
  }

  function render() {
    const p = panel();
    if (!p || !p.classList.contains('open')) return;

    if (!stack.length) {
      p.innerHTML = '<div class="crm-crumb"><span class="crm-crumb-title">CRM</span></div>' +
        '<div class="crm-body"><div class="crm-empty">Open an email thread to see its CRM context.</div></div>';
      return;
    }

    stack.forEach(pg => { pg.crumbTitle = label(pg); });

    const cur = top();
    const fn = PAGES[cur.page];
    const html = fn ? fn(cur) : '<div class="crm-empty">Unknown page.</div>';

    p.innerHTML = crumb() +
      '<div class="crm-body"><div class="crm-page' + (back ? ' back' : '') + '">' + html + '</div></div>';
    back = false;
  }

  /* ═══════════════════════════════════════════════════════════
     ACTIONS — all mutate window.CRM in memory only
     ═══════════════════════════════════════════════════════════ */

  function linkFor(oppId) {
    let l = window.CRM.links.find(x => x.opportunityId === oppId);
    if (!l) {
      l = { opportunityId: oppId, threadIds: [], contactIds: [], companyIds: [] };
      window.CRM.links.push(l);
    }
    return l;
  }

  function logActivity(a) { window.CRM.activities.push(a); }

  const api = {
    open, close, toggle, setThread, pop, render,

    say: toast,

    setTab(t) { tab = t; render(); },

    openOpp(id)      { push({ page: 'opportunity',  opportunityId: id }); },
    openOppContacts(id)  { push({ page: 'oppContacts',  opportunityId: id }); },
    openOppCompanies(id) { push({ page: 'oppCompanies', opportunityId: id }); },
    openContact(id)  { push({ page: 'contact', contactId: id }); },

    /** Leave the inbox for the full app, landing on this record. */
    openFull() { window.location.href = fullUrl(); },
    openCompany(id)  { push({ page: 'company', companyId: id }); },

    /** Stage change is real — it rewrites stageId and logs the
     *  automatic stage_change activity, which is what gives a
     *  pipeline its history. */
    setStage(oppId, stageId) {
      const o = Q.opportunity(oppId);
      if (!o || o.stageId === stageId) return;
      const from = o.stageId;
      o.stageId = stageId;
      const contacts = Q.contactsForOpportunity(oppId);
      logActivity({
        id: nextId('act'),
        contactId: contacts.length ? contacts[0].id : null,
        opportunityId: oppId,
        kind: 'stage_change',
        at: new Date(Q.NOW.getTime() - 1000).toISOString().slice(0, 19),
        from: from, to: stageId,
        title: 'Moved to ' + (Q.stage(o.pipelineId, stageId) || {}).name
      });
      render();
      toast('Stage → ' + (Q.stage(o.pipelineId, stageId) || {}).name);
    },

    saveNote(oppId) {
      const box = document.getElementById('crmNoteBox');
      const text = box && box.value.trim();
      if (!text) { toast('Nothing to save.'); return; }
      const contacts = Q.contactsForOpportunity(oppId);
      logActivity({
        id: nextId('act'),
        contactId: contacts.length ? contacts[0].id : null,
        opportunityId: oppId,
        kind: 'note',
        at: new Date(Q.NOW.getTime() - 1000).toISOString().slice(0, 19),
        title: 'Note', body: text
      });
      render();
      toast('Note saved to the timeline.');
    },

    /** Narrow a shared-thread message to one deal. This is the ONLY
     *  way an activity gets an explicit opportunityId at runtime —
     *  the system never assigns one on its own. */
    narrowTo(actId, oppId) {
      const a = window.CRM.activities.find(x => x.id === actId);
      if (!a) return;
      a.opportunityId = oppId;
      render();
      const o = Q.opportunity(oppId);
      toast('Filed under ' + o.name + ' only.');
    },

    toggleTask(actId) {
      const a = window.CRM.activities.find(x => x.id === actId);
      if (!a) return;
      a.done = !a.done;
      toast(a.done ? 'Task done — ' + a.title : 'Task reopened');
    },

    linkThread(oppId) {
      if (!threadId) return;
      const l = linkFor(oppId);
      if (!l.threadIds.includes(threadId)) l.threadIds.push(threadId);
      const o = Q.opportunity(oppId);
      stack = [Q.rootScenario(threadId)];
      render();
      toast('Thread added to ' + o.name);
    },

    linkContact(oppId, contactId) {
      const l = linkFor(oppId);
      if (!l.contactIds.includes(contactId)) l.contactIds.push(contactId);
      render();
      toast(Q.contact(contactId).name + ' linked. Their company was not linked with them.');
    },

    linkCompany(oppId, companyId) {
      const l = linkFor(oppId);
      if (!l.companyIds.includes(companyId)) l.companyIds.push(companyId);
      render();
      toast(Q.company(companyId).name + ' linked. Its other contacts were not.');
    },

    /** A candidate becomes a record. This is the "records are born
     *  from threads" path — nothing was typed from scratch. */
    createContact(email, oppId) {
      const t = Q.thread(threadId);
      const part = t && (t.participants || []).find(p =>
        p.email.toLowerCase() === String(email).toLowerCase());
      const name = (part && part.name) || email;
      const dom = email.split('@')[1];
      const co = Q.companyByDomain(dom);
      const c = {
        id: nextId('ct'), name: name, email: email, role: null,
        companyId: co ? co.id : null, phone: null,
        initials: initialsOf(name),
        details: [{ label: 'Source', value: 'Created from thread' }]
      };
      window.CRM.contacts.push(c);
      if (oppId) {
        const l = linkFor(oppId);
        if (!l.contactIds.includes(c.id)) l.contactIds.push(c.id);
      }
      render();
      toast(name + ' created as a contact' + (co ? ' at ' + co.name : ''));
    },

    createCompany(domain, oppId) {
      const name = domain.replace(/\.[a-z.]+$/, '')
        .replace(/(^|[^a-z])([a-z])/g, (m, a, b) => a + b.toUpperCase());
      const co = {
        id: nextId('co'), name: name, domain: domain,
        kind: 'Company', location: '—', note: 'Created from thread'
      };
      window.CRM.companies.push(co);
      if (oppId) {
        const l = linkFor(oppId);
        if (!l.companyIds.includes(co.id)) l.companyIds.push(co.id);
      }
      render();
      toast(name + ' created as a company');
    },

    addOpportunity() {
      const pipes = window.CRM.pipelines;
      const list = pipes.map((p, i) => (i + 1) + '. ' + p.name).join('\n');
      const pick = window.prompt(
        'Start an opportunity — pick a pipeline:\n\n' + list + '\n\nEnter a number:', '1');
      if (!pick) return;
      const p = pipes[parseInt(pick, 10) - 1];
      if (!p) { toast('No such pipeline.'); return; }

      const t = Q.thread(threadId);
      const suggested = t ? t.subject : 'New opportunity';
      const name = window.prompt('Name this opportunity:', suggested);
      if (!name) return;

      const o = {
        id: nextId('opp'), name: name,
        pipelineId: p.id,
        stageId: p.stages[0].id,     // starts at the first stage
        openedAt: Q.NOW.toISOString().slice(0, 10),
        value: null
      };
      window.CRM.opportunities.push(o);

      /* Seed it from the thread: link the thread and its sole
         counterparty, plus that person's company if they have one.
         Everything else stays unlinked — no inheritance. */
      const l = linkFor(o.id);
      if (threadId) l.threadIds.push(threadId);
      const others = threadId ? Q.counterparties(threadId) : [];
      if (others.length === 1 && others[0].contact) {
        l.contactIds.push(others[0].contact.id);
        if (others[0].company) l.companyIds.push(others[0].company.id);
      }

      logActivity({
        id: nextId('act'),
        contactId: l.contactIds[0] || null,
        opportunityId: o.id,
        kind: 'stage_change',
        at: new Date(Q.NOW.getTime() - 1000).toISOString().slice(0, 19),
        from: null, to: o.stageId,
        title: 'Opportunity opened at ' + p.stages[0].name
      });

      stack = [Q.rootScenario(threadId)];
      push({ page: 'opportunity', opportunityId: o.id });
      toast('Opened in ' + p.name + ' at ' + p.stages[0].name);
    },

    newActivity() {
      toast('Prototype — activity composer not built yet.');
    },

    /** Client-side filter for the search fields. */
    filter(input) {
      const q = input.value.toLowerCase().trim();
      const body = input.closest('.crm-body');
      if (!body) return;
      body.querySelectorAll('.crm-row[data-name]').forEach(r => {
        r.style.display = (!q || r.dataset.name.includes(q)) ? '' : 'none';
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════
     SHELL WIRING
     ═══════════════════════════════════════════════════════════ */

  /** Map CRM.threads onto the shell's existing email tiles. We
   *  rewrite only the text nodes, so every bit of shell chrome —
   *  checkboxes, stars, hover actions — survives untouched. */
  function wireEmailList() {
    const list = document.querySelector('.email-list');
    if (!list) return;
    const tiles = Array.from(list.querySelectorAll('.email-tile'));
    if (!tiles.length) return;

    const threads = window.CRM.threads || [];

    // More threads than tiles? Clone the last tile to fit.
    while (tiles.length < threads.length) {
      const clone = tiles[tiles.length - 1].cloneNode(true);
      tiles[tiles.length - 1].parentNode.appendChild(clone);
      tiles.push(clone);
    }

    tiles.forEach((tile, i) => {
      const t = threads[i];
      if (!t) { tile.style.display = 'none'; return; }

      const other = (t.participants || []).find(p => !Q.isSelf(p.email));
      const set = (sel, txt) => {
        const el = tile.querySelector(sel);
        if (el) el.textContent = txt;
      };
      set('.tile-sender', other ? other.name : t.subject);
      set('.tile-subject', t.subject);
      set('.tile-preview', t.snippet);
      set('.tile-time', when(t.lastAt));

      tile.dataset.threadId = t.id;
      tile.classList.remove('selected');
      tile.addEventListener('click', () => {
        tiles.forEach(x => x.classList.remove('selected'));
        tile.classList.add('selected');
        setThread(t.id);
        const title = document.querySelector('.thread-title');
        if (title) title.textContent = t.subject;
        if (!panel().classList.contains('open')) open();
      });
    });

    // Land on the thread that shows the richest scenario.
    const first = tiles.find(x => x.dataset.threadId === 'th_wholesale') || tiles[0];
    if (first) first.click();
  }

  function init() {
    if (!window.CRM || !window.CrmData) {
      console.error('[CrmSidebar] data not loaded — check script order');
      return;
    }
    const btn = document.getElementById('crmToggleBtn');
    if (btn) btn.addEventListener('click', toggle);
    wireEmailList();
    open();   // start open so the surface is visible on load
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return api;
})();
