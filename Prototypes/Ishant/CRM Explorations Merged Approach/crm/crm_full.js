/* ═════════════════════════════════════════════════════════════
   CRM FULL — the standalone app
   ═════════════════════════════════════════════════════════════
   Consumes the SAME crm_data.js as the sidebar. No second query
   layer, no second copy of the rules — the old prototype kept two
   conflicting PIPELINES datasets and they drifted.

   HASH ROUTING. Every record has a URL:
     #/opportunities            #/opportunity/opp_tw_wholesale
     #/contacts                 #/contact/ct_rohan
     #/companies                #/company/co_thirdwave
     #/pipeline/pl_wholesale

   That is what lets the sidebar's "Open in CRM" button deep-link
   to the exact record you were looking at, rather than dumping you
   on a root page — the gap that made the previous prototype's
   "Open in CRM" useless.
   ═════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const Q = window.CrmData;

  /* ── Icons ──────────────────────────────────────────────── */
  const IC = {
    grid:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="1.9"/><circle cx="12" cy="5" r="1.9"/><circle cx="19" cy="5" r="1.9"/><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/><circle cx="5" cy="19" r="1.9"/><circle cx="12" cy="19" r="1.9"/><circle cx="19" cy="19" r="1.9"/></svg>',
    search:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    back:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    deal:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4v10l-9 4-9-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 7l9 4 9-4M12 11v10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    people:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 5.5a3 3 0 010 5.4M18 19c0-2.4-.9-4-2.5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    bldg:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16M14 21V10h5a1 1 0 011 1v10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 8h3M7 12h3M7 16h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    mail:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    phone: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 3h4l2 5-3 2a14 14 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    cal:   '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    note:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v11l-5 5H4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M20 15h-5v5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    task:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flag:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 21V4h14l-3 4 3 4H5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    clock: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    clip:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21 12l-8.5 8.5a5 5 0 01-7-7L14 5a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L15 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const KIND_ICON = {
    email: IC.mail, call: IC.phone, meeting: IC.cal, note: IC.note,
    task: IC.task, stage_change: IC.flag, scheduled_send: IC.clock
  };

  /* ── Utilities (shared shape with the sidebar) ──────────── */

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

  function initials(name) {
    const p = String(name || '?').trim().split(/\s+/);
    return ((p[0] || '')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }

  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function clockTime(d) {
    let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return h + ':' + m + ' ' + ap;
  }

  function when(at) {
    const d = new Date(at), now = Q.NOW;
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const n0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((d0 - n0) / 86400000);
    if (days === 0)  return 'Today ' + clockTime(d);
    if (days === 1)  return 'Tomorrow ' + clockTime(d);
    if (days === -1) return 'Yesterday';
    if (days > 1 && days < 7)   return 'In ' + days + ' days';
    if (days < -1 && days > -7) return Math.abs(days) + ' days ago';
    return MON[d.getMonth()] + ' ' + d.getDate();
  }

  function av(seed, name, opts) {
    opts = opts || {};
    const cls = 'f-av' + (opts.sq ? ' sq' : '') + (opts.lg ? ' lg' : '');
    return '<div class="' + cls + '" style="background:' + tint(seed) + '">' +
      esc(opts.text || initials(name)) + '</div>';
  }

  function toast(msg) {
    let el = document.getElementById('fToast');
    if (!el) { el = document.createElement('div'); el.id = 'fToast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function ticks(o) {
    if (!o.progress) return '';
    let h = '<div class="f-ticks">';
    for (let i = 0; i < o.progress.total; i++) {
      h += '<div class="f-tick' + (i <= o.progress.index ? ' on' : '') + '"></div>';
    }
    return h + '</div>';
  }

  /** Last stage of a pipeline reads as done, not in-flight. */
  function stagePill(o) {
    const last = o.progress && o.progress.index === o.progress.total - 1;
    return '<span class="f-stage' + (last ? ' done' : '') + '">' +
      esc(o.stage ? o.stage.name : '—') + '</span>';
  }

  function quiet(oppId) {
    const d = Q.daysSinceLastActivity(oppId);
    if (d == null) return '<span class="f-quiet">no activity</span>';
    return '<span class="f-quiet' + (d >= 7 ? ' warn' : '') + '">quiet ' + d + 'd</span>';
  }

  const go = hash => { location.hash = hash; };

  /* ═══════════════════════════════════════════════════════════
     LEFT NAV
     ═══════════════════════════════════════════════════════════ */

  function nav(route) {
    const D = window.CRM;
    const at = r => route.name === r ? ' active' : '';

    let h = '<div class="f-nav-sec">Records</div>';

    h += '<a class="f-nav-item' + at('opportunities') + '" href="#/opportunities">' +
      IC.deal + 'Opportunities<span class="f-nav-count">' +
      D.opportunities.length + '</span></a>';

    h += '<a class="f-nav-item' + at('contacts') + '" href="#/contacts">' +
      IC.people + 'Contacts<span class="f-nav-count">' +
      D.contacts.length + '</span></a>';

    h += '<a class="f-nav-item' + at('companies') + '" href="#/companies">' +
      IC.bldg + 'Companies<span class="f-nav-count">' +
      D.companies.length + '</span></a>';

    /* Pipelines are configuration, not records — hence a separate
       group. Each one filters the opportunity list. */
    h += '<div class="f-nav-sec">Pipelines</div>';
    D.pipelines.forEach(p => {
      const n = D.opportunities.filter(o => o.pipelineId === p.id).length;
      const active = route.name === 'pipeline' && route.id === p.id;
      h += '<a class="f-nav-item' + (active ? ' active' : '') + '" href="#/pipeline/' + p.id + '">' +
        '<span class="f-pipe-dot" style="background:' + tint(p.id) + '"></span>' +
        esc(p.name) + '<span class="f-nav-count">' + n + '</span></a>';
    });

    return h;
  }

  /* ═══════════════════════════════════════════════════════════
     LIST VIEWS
     ═══════════════════════════════════════════════════════════ */

  function oppRow(o) {
    const contacts = Q.contactsForOpportunity(o.id);
    const cos = Q.companiesForOpportunity(o.id);
    const who = cos.length ? cos[0].name
              : contacts.length ? contacts[0].name : 'No contact yet';
    return '<div class="f-row" onclick="CrmFull.go(\'#/opportunity/' + o.id + '\')">' +
      av(o.id, o.name, { sq: true, text: initials(o.pipeline ? o.pipeline.name : '?') }) +
      '<div class="f-row-main"><div class="f-row-t">' + esc(o.name) + '</div>' +
      '<div class="f-row-s">' + esc(who) +
        (o.value ? ' · ' + esc(o.value) : '') + '</div>' + ticks(o) + '</div>' +
      '<div class="f-col w-stage">' + stagePill(o) + '</div>' +
      '<div class="f-col w-when">' + quiet(o.id) + '</div></div>';
  }

  function pageOpportunities(route) {
    const D = window.CRM;
    const filter = route.name === 'pipeline' ? route.id : null;
    const pipes = filter ? D.pipelines.filter(p => p.id === filter) : D.pipelines;

    const title = filter ? (Q.pipeline(filter) || {}).name : 'Opportunities';
    const all = D.opportunities.filter(o => !filter || o.pipelineId === filter);

    let h = '<div class="f-head"><div><div class="f-title">' + esc(title) + '</div>' +
      '<div class="f-sub">' + all.length + ' open · ' +
      (filter ? 'one pipeline' : D.pipelines.length + ' pipelines') + '</div></div>' +
      '<div class="f-head-right">' +
      '<button class="f-btn accent" onclick="CrmFull.say(\'Prototype — create from the inbox sidebar.\')">' +
      IC.plus + 'New opportunity</button></div></div>';

    /* Grouped by pipeline. Stage names only mean something inside
       their own pipeline, so a flat list with a Stage column would
       be comparing incomparable values. */
    pipes.forEach(p => {
      const list = D.opportunities
        .filter(o => o.pipelineId === p.id)
        .map(o => Q.opportunityView(o.id));
      h += '<div class="f-card"><div class="f-card-head">' +
        '<span class="f-pipe-dot" style="background:' + tint(p.id) + '"></span>' +
        esc(p.name) + '<span class="f-nav-count">' + list.length + '</span>' +
        '<span style="margin-left:auto;font-weight:500;color:var(--f-faint);font-size:11px">' +
        esc(p.stages.map(s => s.name).join(' → ')) + '</span></div>';
      h += list.length ? list.map(oppRow).join('')
                       : '<div class="f-empty">Nothing in this pipeline yet.</div>';
      h += '</div>';
    });
    return h;
  }

  function pageContacts() {
    const list = window.CRM.contacts.slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    let h = '<div class="f-head"><div><div class="f-title">Contacts</div>' +
      '<div class="f-sub">' + list.length + ' people · ' +
      list.filter(c => !c.companyId).length + ' with no company</div></div></div>';

    h += '<div class="f-card">';
    h += list.map(c => {
      const co = Q.companyForContact(c.id);
      const opps = Q.opportunitiesForContact(c.id);
      const acts = Q.activitiesForContact(c.id);
      const last = Q.splitByTime(acts).older[0];
      return '<div class="f-row" onclick="CrmFull.go(\'#/contact/' + c.id + '\')">' +
        av(c.id, c.name, { text: c.initials }) +
        '<div class="f-row-main"><div class="f-row-t">' + esc(c.name) + '</div>' +
        '<div class="f-row-s">' + esc(c.email) + '</div></div>' +
        '<div class="f-col w-stage">' +
          (co ? esc(co.name) : '<span style="color:var(--f-faint)">—</span>') + '</div>' +
        '<div class="f-col w-num">' + opps.length +
          (opps.length === 1 ? ' deal' : ' deals') + '</div>' +
        '<div class="f-col w-when">' + (last ? esc(when(last.at)) : '—') + '</div></div>';
    }).join('');
    return h + '</div>';
  }

  function pageCompanies() {
    const list = window.CRM.companies.slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    let h = '<div class="f-head"><div><div class="f-title">Companies</div>' +
      '<div class="f-sub">' + list.length + ' businesses · a company is a grouping, ' +
      'it owns no activity of its own</div></div></div>';

    h += '<div class="f-card">';
    h += list.map(co => {
      const people = Q.contactsForCompany(co.id);
      const opps = Q.opportunitiesForCompany(co.id);
      const last = Q.splitByTime(Q.activitiesForCompany(co.id)).older[0];
      return '<div class="f-row" onclick="CrmFull.go(\'#/company/' + co.id + '\')">' +
        av(co.id, co.name, { sq: true }) +
        '<div class="f-row-main"><div class="f-row-t">' + esc(co.name) + '</div>' +
        '<div class="f-row-s">' + esc(co.domain) + ' · ' + esc(co.kind) + '</div></div>' +
        '<div class="f-col w-stage">' + esc(co.location) + '</div>' +
        '<div class="f-col w-num">' + people.length +
          (people.length === 1 ? ' person' : ' people') + '</div>' +
        '<div class="f-col w-num">' + opps.length +
          (opps.length === 1 ? ' deal' : ' deals') + '</div>' +
        '<div class="f-col w-when">' + (last ? esc(when(last.at)) : '—') + '</div></div>';
    }).join('');
    return h + '</div>';
  }

  /* ═══════════════════════════════════════════════════════════
     TIMELINE
     ═══════════════════════════════════════════════════════════ */

  function actItem(a, opts) {
    opts = opts || {};
    const up = new Date(a.at) > Q.NOW;
    const inherited = opts.oppId && Q.isInherited(a) && opts.shared > 1;
    let h = '<div class="f-act ' + a.kind + (up ? ' upcoming' : '') +
      (inherited ? ' inherited' : '') + '">' +
      '<div class="f-act-dot">' + (KIND_ICON[a.kind] || IC.note) + '</div>' +
      '<div class="f-act-top"><div class="f-act-t">' + esc(a.title) +
      (a.kind === 'email' && a.direction
        ? ' <span style="color:#9aa1ab;font-weight:500">· ' +
          (a.direction === 'in' ? 'received' : 'sent') + '</span>' : '') +
      '</div><div class="f-act-w">' + esc(when(a.at)) + '</div></div>';

    if (a.body) h += '<div class="f-act-b">' + esc(a.body) + '</div>';
    (a.attachments || []).forEach(f => {
      h += '<div class="f-attach">' + IC.clip + esc(f.name) +
        ' <span style="color:#b6bcc5">' + esc(f.size) + '</span></div>';
    });
    const c = Q.contact(a.contactId);
    if (c) h += '<div class="f-act-who">' + esc(c.name) + '</div>';

    if (inherited) {
      h += '<div class="f-unsorted"><span class="f-unsorted-tag">Also in ' +
        (opts.shared - 1) + ' other ' + (opts.shared - 1 === 1 ? 'deal' : 'deals') +
        '</span><button class="f-unsorted-btn" onclick="CrmFull.narrowTo(\'' +
        a.id + '\',\'' + opts.oppId + '\')">Only this one</button></div>';
    }
    return h + '</div>';
  }

  function timeline(list, opts) {
    if (!list.length) return '<div class="f-empty">Nothing yet.</div>';
    return '<div class="f-tl">' + list.map(a => actItem(a, opts)).join('') + '</div>';
  }

  function activityBlocks(acts, opts) {
    const s = Q.splitByTime(acts);
    let h = '';
    if (s.upcoming.length) {
      h += '<div class="f-sec">Upcoming</div>' + timeline(s.upcoming, opts);
    }
    h += '<div class="f-sec">Older</div>' + timeline(s.older, opts);
    return h;
  }

  /* ═══════════════════════════════════════════════════════════
     RECORD PAGES
     ═══════════════════════════════════════════════════════════ */

  function pageOpportunity(route) {
    const o = Q.opportunityView(route.id);
    if (!o) return '<div class="f-empty">Opportunity not found.</div>';

    const contacts = Q.contactsForOpportunity(o.id);
    const cos = Q.companiesForOpportunity(o.id);
    const threads = Q.threadsForOpportunity(o.id);
    const acts = Q.activitiesForOpportunity(o.id);
    const files = Q.filesFrom(acts);
    const next = Q.nextDue(o.id);

    const shared = Math.max.apply(null,
      [1].concat(threads.map(t => Q.opportunitiesForThread(t.id).length)));

    let h = '<div class="f-crumb" onclick="CrmFull.go(\'#/pipeline/' + o.pipelineId + '\')">' +
      IC.back + esc(o.pipeline ? o.pipeline.name : 'Back') + '</div>';

    h += '<div class="f-rec"><div class="f-rec-main">';

    h += '<div class="f-rec-head">' +
      '<div class="f-rec-name">' + esc(o.name) + '</div>' +
      '<div class="f-rec-meta">' + esc(o.pipeline ? o.pipeline.name : '') +
        (o.value ? ' · ' + esc(o.value) : '') +
        ' · opened ' + esc(o.openedAt) + ' · ' + quiet(o.id) + '</div>' +
      '<div class="f-stage-wrap">' +
        '<span class="f-stage-btn">' + esc(o.stage ? o.stage.name : 'Set stage') + IC.down + '</span>' +
        '<select class="f-stage-native" onchange="CrmFull.setStage(\'' + o.id + '\',this.value)">' +
        Q.stagesOf(o.pipelineId).map(s => '<option value="' + s.id + '"' +
          (s.id === o.stageId ? ' selected' : '') + '>' + esc(s.name) + '</option>').join('') +
        '</select></div>' + ticks(o) + '</div>';

    h += activityBlocks(acts, { oppId: o.id, shared: shared });
    h += '</div>';

    /* ── right rail ── */
    h += '<div class="f-rec-side">';

    if (next) {
      h += '<div class="f-side-card"><div class="f-side-t">Next due</div>' +
        '<div style="font-size:13px;font-weight:600">' + esc(next.title) + '</div>' +
        '<div style="font-size:11.5px;color:var(--f-dim);margin-top:3px">' +
        esc(when(next.at)) + '</div></div>';
    }

    h += '<div class="f-side-card"><div class="f-side-t">Contacts ' +
      '<span>' + contacts.length + '</span></div>';
    h += contacts.length
      ? '<div class="f-chip-row">' + contacts.map(c =>
          '<span class="f-chip" onclick="CrmFull.go(\'#/contact/' + c.id + '\')">' +
          av(c.id, c.name, { text: c.initials }) + esc(c.name) + '</span>').join('') + '</div>'
      : '<div style="font-size:11.5px;color:var(--f-faint)">Nobody linked.</div>';
    h += '</div>';

    h += '<div class="f-side-card"><div class="f-side-t">Companies ' +
      '<span>' + cos.length + '</span></div>';
    h += cos.length
      ? '<div class="f-chip-row">' + cos.map(c =>
          '<span class="f-chip" onclick="CrmFull.go(\'#/company/' + c.id + '\')">' +
          av(c.id, c.name, { sq: true }) + esc(c.name) + '</span>').join('') + '</div>'
      : '<div style="font-size:11.5px;color:var(--f-faint)">None — this may be an individual.</div>';
    h += '</div>';

    if (threads.length) {
      h += '<div class="f-side-card"><div class="f-side-t">Email threads ' +
        '<span>' + threads.length + '</span></div>';
      h += threads.map(t => {
        const n = Q.opportunitiesForThread(t.id).length;
        return '<div style="font-size:12px;font-weight:600;line-height:1.4;margin-bottom:4px">' +
          esc(t.subject) + '</div>' +
          '<div style="font-size:11px;color:var(--f-faint)">' + t.messageCount + ' messages' +
          (n > 1 ? ' · shared with ' + (n - 1) + ' other deal' : '') + '</div>';
      }).join('');
      h += '</div>';
    }

    if (files.length) {
      h += '<div class="f-side-card"><div class="f-side-t">Files ' +
        '<span>' + files.length + '</span></div>';
      h += files.map(f => '<div style="font-size:12px;margin-bottom:6px">' +
        esc(f.name) + '<div style="font-size:10.5px;color:var(--f-faint)">' +
        esc(f.size) + ' · ' + esc(when(f.at)) + '</div></div>').join('');
      h += '</div>';
    }

    return h + '</div></div>';
  }

  function pageContact(route) {
    const c = Q.contact(route.id);
    if (!c) return '<div class="f-empty">Contact not found.</div>';
    const co = Q.companyForContact(c.id);
    const opps = Q.opportunitiesForContact(c.id);
    const acts = Q.activitiesForContact(c.id);

    let h = '<div class="f-crumb" onclick="CrmFull.go(\'#/contacts\')">' +
      IC.back + 'Contacts</div>';

    h += '<div class="f-rec"><div class="f-rec-main">';
    h += '<div class="f-rec-head"><div class="f-rec-top">' +
      av(c.id, c.name, { lg: true, text: c.initials }) +
      '<div style="flex:1;min-width:0"><div class="f-rec-name">' + esc(c.name) + '</div>' +
      '<div class="f-rec-meta">' + esc(c.role || 'No role recorded') +
        (co ? ' · <a href="#/company/' + co.id + '" style="color:var(--f-blue);text-decoration:none">' +
          esc(co.name) + '</a>' : ' · no company') + '</div>' +
      '<div style="margin-top:10px;display:flex;gap:7px">' +
        '<button class="f-btn" onclick="CrmFull.say(\'Compose to ' + esc(c.email) + '\')">' +
          IC.mail + esc(c.email) + '</button>' +
        (c.phone ? '<button class="f-btn">' + IC.phone + esc(c.phone) + '</button>' : '') +
      '</div></div></div></div>';

    h += activityBlocks(acts, {});
    h += '</div><div class="f-rec-side">';

    h += '<div class="f-side-card"><div class="f-side-t">Opportunities ' +
      '<span>' + opps.length + '</span></div>';
    h += opps.length
      ? opps.map(o => '<div style="padding:7px 0;border-bottom:1px solid var(--f-line);cursor:pointer" ' +
          'onclick="CrmFull.go(\'#/opportunity/' + o.id + '\')">' +
          '<div style="font-size:12.5px;font-weight:600;line-height:1.35">' + esc(o.name) + '</div>' +
          '<div style="margin-top:4px">' + stagePill(o) + '</div></div>').join('')
      : '<div style="font-size:11.5px;color:var(--f-faint)">Not on any opportunity yet.</div>';
    h += '</div>';

    if (c.details && c.details.length) {
      h += '<div class="f-side-card"><div class="f-side-t">Details</div>' +
        c.details.map(d => '<div class="f-detail"><div class="f-detail-k">' +
          esc(d.label) + '</div><div class="f-detail-v">' + esc(d.value) + '</div></div>').join('') +
        '</div>';
    }

    return h + '</div></div>';
  }

  function pageCompany(route) {
    const co = Q.company(route.id);
    if (!co) return '<div class="f-empty">Company not found.</div>';
    const people = Q.contactsForCompany(co.id);
    const opps = Q.opportunitiesForCompany(co.id);
    const acts = Q.activitiesForCompany(co.id);
    const linked = new Set();
    opps.forEach(o => Q.contactsForOpportunity(o.id).forEach(c => linked.add(c.id)));

    let h = '<div class="f-crumb" onclick="CrmFull.go(\'#/companies\')">' +
      IC.back + 'Companies</div>';

    h += '<div class="f-rec"><div class="f-rec-main">';
    h += '<div class="f-rec-head"><div class="f-rec-top">' +
      av(co.id, co.name, { lg: true, sq: true }) +
      '<div style="flex:1;min-width:0"><div class="f-rec-name">' + esc(co.name) + '</div>' +
      '<div class="f-rec-meta">' + esc(co.kind) + ' · ' + esc(co.location) +
        ' · ' + esc(co.domain) + '</div>' +
      (co.note ? '<div style="font-size:12.5px;color:var(--f-dim);margin-top:8px">' +
        esc(co.note) + '</div>' : '') +
      '</div></div></div>';

    h += '<div class="f-sec">Activity</div>' +
      '<div style="font-size:11.5px;color:var(--f-faint);margin:-4px 0 10px">' +
      'Rolled up from everyone here. A company stores no activity of its own.</div>';
    h += timeline(Q.splitByTime(acts).older, {});

    h += '</div><div class="f-rec-side">';

    h += '<div class="f-side-card"><div class="f-side-t">People ' +
      '<span>' + people.length + '</span></div>';
    h += people.map(c =>
      '<div class="f-row" style="padding:7px 0;border-bottom:1px solid var(--f-line)" ' +
      'onclick="CrmFull.go(\'#/contact/' + c.id + '\')">' +
      av(c.id, c.name, { text: c.initials }) +
      '<div class="f-row-main"><div class="f-row-t">' + esc(c.name) + '</div>' +
      '<div class="f-row-s">' + esc(c.role || c.email) + '</div></div>' +
      (linked.has(c.id) ? '' :
        '<span style="font-size:10px;color:var(--f-faint);white-space:nowrap">not on a deal</span>') +
      '</div>').join('');
    /* The no-inheritance rule made visible: being at a linked
       company does not put you on its opportunities. */
    h += '<div style="font-size:10.5px;color:var(--f-faint);margin-top:8px;line-height:1.45">' +
      'Being here does not put someone on this company\'s opportunities — ' +
      'each contact is linked on purpose.</div></div>';

    h += '<div class="f-side-card"><div class="f-side-t">Opportunities ' +
      '<span>' + opps.length + '</span></div>';
    h += opps.length
      ? opps.map(o => '<div style="padding:7px 0;border-bottom:1px solid var(--f-line);cursor:pointer" ' +
          'onclick="CrmFull.go(\'#/opportunity/' + o.id + '\')">' +
          '<div style="font-size:12.5px;font-weight:600;line-height:1.35">' + esc(o.name) + '</div>' +
          '<div style="margin-top:4px">' + stagePill(o) + '</div></div>').join('')
      : '<div style="font-size:11.5px;color:var(--f-faint)">None.</div>';
    h += '</div>';

    return h + '</div></div>';
  }

  /* ═══════════════════════════════════════════════════════════
     ROUTER
     ═══════════════════════════════════════════════════════════ */

  function parse() {
    const raw = (location.hash || '#/opportunities').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    return { name: parts[0] || 'opportunities', id: parts[1] || null };
  }

  const PAGES = {
    opportunities: pageOpportunities,
    pipeline:      pageOpportunities,
    contacts:      pageContacts,
    companies:     pageCompanies,
    opportunity:   pageOpportunity,
    contact:       pageContact,
    company:       pageCompany
  };

  function render() {
    const route = parse();
    const fn = PAGES[route.name] || pageOpportunities;
    document.getElementById('fNav').innerHTML = nav(route);
    const main = document.getElementById('fMain');
    const wide = ['opportunity', 'contact', 'company'].includes(route.name);
    main.innerHTML = '<div class="f-page' + (wide ? ' wide' : '') + '">' + fn(route) + '</div>';
    main.scrollTop = 0;
  }

  /* ═══════════════════════════════════════════════════════════
     PUBLIC
     ═══════════════════════════════════════════════════════════ */

  window.CrmFull = {
    go: go,
    say: toast,
    render: render,

    setStage(oppId, stageId) {
      const o = Q.opportunity(oppId);
      if (!o || o.stageId === stageId) return;
      const from = o.stageId;
      o.stageId = stageId;
      const cs = Q.contactsForOpportunity(oppId);
      window.CRM.activities.push({
        id: 'act_f' + Date.now(),
        contactId: cs.length ? cs[0].id : null,
        opportunityId: oppId,
        threadId: null,
        kind: 'stage_change',
        at: new Date(Q.NOW.getTime() - 1000).toISOString().slice(0, 19),
        from: from, to: stageId,
        title: 'Moved to ' + (Q.stage(o.pipelineId, stageId) || {}).name
      });
      render();
      toast('Stage → ' + (Q.stage(o.pipelineId, stageId) || {}).name);
    },

    narrowTo(actId, oppId) {
      const a = window.CRM.activities.find(x => x.id === actId);
      if (!a) return;
      a.opportunityId = oppId;
      render();
      toast('Filed under ' + Q.opportunity(oppId).name + ' only.');
    },

    search(input) {
      const q = input.value.toLowerCase().trim();
      document.querySelectorAll('#fMain .f-row').forEach(r => {
        r.style.display = (!q || r.textContent.toLowerCase().includes(q)) ? '' : 'none';
      });
    }
  };

  function init() {
    if (!window.CRM || !window.CrmData) {
      document.getElementById('fMain').innerHTML =
        '<div class="f-page"><div class="f-empty">Data failed to load — check script order.</div></div>';
      return;
    }
    const me = window.CRM.account;
    document.getElementById('fMe').textContent = me.initials;
    document.getElementById('fMe').title = me.name + ' · ' + me.business;
    window.addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
