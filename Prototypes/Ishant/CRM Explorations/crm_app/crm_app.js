/**
 * Minimal CRM Controller Module
 */
const CrmApp = (function () {
  let navHistory = ['home', 'overview']; // Root is home, default selected contact on email thread is Ella Mathews

  function toggleDrawer() {
    const drawer = document.getElementById('crmSidebar');
    const btn = document.querySelector('.action-btn-crm');
    if (drawer) {
      const isOpen = drawer.classList.toggle('open');
      if (btn) btn.classList.toggle('active', isOpen);
    }
  }

  function openDrawer() {
    const drawer = document.getElementById('crmSidebar');
    const btn = document.querySelector('.action-btn-crm');
    if (drawer) drawer.classList.add('open');
    if (btn) btn.classList.add('active');
  }

  function closeDrawer() {
    const drawer = document.getElementById('crmSidebar');
    const btn = document.querySelector('.action-btn-crm');
    if (drawer) drawer.classList.remove('open');
    if (btn) btn.classList.remove('active');
  }

  function drillInto(viewId) {
    navHistory.push(viewId);
    renderView(viewId);
  }

  function goBack() {
    if (navHistory.length > 1) {
      navHistory.pop();
      const previousView = navHistory[navHistory.length - 1];
      renderView(previousView);
    }
  }

  function goHome() {
    navHistory = ['home'];
    renderView('home');
  }

  function switchTab(tabId) {
    // If on contact profile, switch between overview and activity tabs
    if (navHistory.length > 0 && navHistory[0] === 'home') {
      navHistory = ['home', tabId];
    } else {
      navHistory = [tabId];
    }
    renderView(tabId);
  }

  function selectContact(contactId) {
    if (contactId === 'ella') {
      navHistory = ['home', 'overview'];
      renderView('overview');
    } else {
      // For demo, load contact profile view
      navHistory = ['home', 'overview'];
      renderView('overview');
    }
  }

  function renderView(viewId) {
    // Hide all view pages cleanly
    const allPages = document.querySelectorAll('.crm-view-page');
    allPages.forEach(page => {
      page.classList.remove('active');
      page.style.cssText = 'display: none !important;';
    });

    // Display target view page cleanly
    const targetPage = document.getElementById(`crmView-${viewId}`);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.style.cssText = 'display: flex !important; flex-direction: column; gap: 16px;';
    }

    const backBtn = document.getElementById('crmBackBtn');
    const tabsBar = document.getElementById('crmTabsBar');
    const heroHeader = document.querySelector('.crm-profile-hero');
    const titleEl = document.getElementById('crmNavTitle');

    const isDrilledIn = navHistory.length > 1;
    const isProfileTab = viewId === 'overview' || viewId === 'activity' || viewId === 'upcoming';

    // Toggle Back Chevron Button
    if (backBtn) {
      backBtn.style.display = isDrilledIn ? 'flex' : 'none';
    }

    // Toggle Profile Hero Header (Only visible on contact profile views)
    if (heroHeader) {
      heroHeader.style.display = (isProfileTab || viewId === 'all-notes' || viewId === 'more-details' || viewId === 'company-details') ? 'flex' : 'none';
    }

    // Toggle 3-Tab Bar (Only visible when on contact profile overview/activity/upcoming)
    if (tabsBar) {
      tabsBar.style.display = isProfileTab ? 'flex' : 'none';
    }

    // Update Header Title
    if (viewId === 'home') {
      if (titleEl) titleEl.textContent = 'CRM Board';
    } else if (viewId === 'all-notes') {
      if (titleEl) titleEl.textContent = 'All Notes';
    } else if (viewId === 'more-details') {
      if (titleEl) titleEl.textContent = 'Contact Details';
    } else if (viewId === 'company-details') {
      if (titleEl) titleEl.textContent = 'Company Profile';
    } else if (viewId === 'all-activity') {
      if (titleEl) titleEl.textContent = 'All Activity';
    } else if (viewId === 'all-tasks') {
      if (titleEl) titleEl.textContent = 'Upcoming Tasks';
    } else if (viewId === 'all-pipelines') {
      if (titleEl) titleEl.textContent = 'Active Pipelines';
    } else if (viewId === 'new-lead') {
      if (titleEl) titleEl.textContent = 'Priya Anand';
    } else if (viewId === 'potential-promo') {
      if (titleEl) titleEl.textContent = 'Jordan Lee';
    } else if (viewId === 'promo-interactions' || viewId === 'lead-interactions') {
      if (titleEl) titleEl.textContent = 'Other Interactions';
    } else {
      if (titleEl) titleEl.textContent = 'Ella Mathews';
    }

    // Highlight main top tab based on exact text match
    if (isProfileTab) {
      document.querySelectorAll('.crm-tab-item').forEach(tab => {
        const text = tab.textContent.trim().toLowerCase();
        const isActive = (viewId === 'overview' && text === 'overview') ||
                         (viewId === 'activity' && text === 'activity') ||
                         (viewId === 'upcoming' && text === 'upcoming');
        tab.classList.toggle('active', isActive);
      });
    }
  }

  function saveNote() {
    const input = document.getElementById('crmNoteInput');
    if (!input || !input.value.trim()) return;
    const noteText = input.value.trim();

    const noteDisplay = document.getElementById('crmLatestNoteText');
    if (noteDisplay) {
      noteDisplay.textContent = noteText;
    }
    input.value = '';
    alert('Sticky note added!');
  }

  function addTask() {
    const input = document.getElementById('crmTaskInput');
    if (!input || !input.value.trim()) return;
    const taskText = input.value.trim();

    const taskCard = document.querySelector('#crmView-activity .crm-card');
    if (taskCard) {
      const newId = 'task_' + Date.now();
      const div = document.createElement('div');
      div.className = 'crm-task-row';
      div.innerHTML = `<input type="checkbox" id="${newId}"><label for="${newId}">${taskText}</label>`;
      taskCard.appendChild(div);
    }
    input.value = '';
  }

  function logActivityPrompt() {
    const activity = prompt('Enter activity log (e.g., "10 min phone call on pricing"):');
    if (activity) {
      const card = document.querySelector('#crmView-activity .crm-card');
      if (card) {
        const div = document.createElement('div');
        div.className = 'crm-activity-row';
        div.innerHTML = `
          <div class="crm-activity-icon-badge">📝</div>
          <div class="crm-activity-content">
            <span class="crm-activity-title">Activity Logged</span>
            <span class="crm-activity-desc">${activity}</span>
            <span class="crm-activity-time">Just now</span>
          </div>
        `;
        card.prepend(div);
      }
    }
  }

  function openFullView() {
    alert('Opening Full CRM Workspace (Landing Page View)...');
  }

  function toggleTask(el) {
    if (!el) return;
    el.classList.toggle('checked');
    const container = el.closest('.crm-item-card') || el.parentElement;
    if (container) {
      const title = container.querySelector('.crm-item-title');
      if (title) {
        if (el.classList.contains('checked')) {
          title.style.textDecoration = 'line-through';
          title.style.opacity = '0.55';
        } else {
          title.style.textDecoration = 'none';
          title.style.opacity = '1';
        }
      }
    }
  }

  function setPipelineStage(stageEl) {
    if (!stageEl) return;
    const container = stageEl.closest('.crm-pipeline-stages');
    if (!container) return;
    container.querySelectorAll('.crm-pipe-stage').forEach(s => s.classList.remove('active'));
    stageEl.classList.add('active');
  }

  // Ella's thread content, kept here so clicking back to her email restores it exactly.
  const ELLA_THREAD = {
    title: 'RE: Q3 Proposal & Licensing Terms',
    sender: 'Ella Mathews',
    to: 'To: me, Dave Miller',
    timestamp: '2:15 PM',
    bodyHtml: `
        <p>Hi,</p>
        <p>Thanks for sending over the updated Q3 proposal and licensing terms — I've had a chance to review
          with Dave and the team on our end.</p>
        <p>&zwj;</p>
        <p>1. SSO integration is still a must-have requirement before we can move to contract sign-off.</p>
        <p>2. We've got budget approved up to $45,000 for the security line item, so let's make sure the
          final quote lines up.</p>
        <p>&zwj;</p>
        <p>Dave will be looped in as the technical decision maker alongside me. I generally prefer async
          updates over a call if that works on your end.</p>
        <p>Thanks!</p>
      `
  };

  function selectEllaEmail(tileEl) {
    if (!tileEl) return;

    document.querySelectorAll('.email-tile').forEach(t => t.classList.remove('selected'));
    tileEl.classList.add('selected');

    const historyBlock = document.getElementById('threadHistoryBlock');
    if (historyBlock) historyBlock.style.display = '';

    const titleText = document.getElementById('threadTitleText');
    if (titleText) titleText.textContent = ELLA_THREAD.title;

    const expSender = document.getElementById('expSenderText');
    if (expSender) expSender.textContent = ELLA_THREAD.sender;

    const expTo = document.getElementById('expToText');
    if (expTo) expTo.textContent = ELLA_THREAD.to;

    const expTimestamp = document.getElementById('expTimestampText');
    if (expTimestamp) expTimestamp.textContent = ELLA_THREAD.timestamp;

    const expBody = document.getElementById('expandedBodyContent');
    if (expBody) expBody.innerHTML = ELLA_THREAD.bodyHtml;

    openDrawer();
    navHistory = ['home', 'overview'];
    renderView('overview');
  }

  // Clicking a personal email from someone not yet in the CRM — visual only, not wired to real data.
  // Selects the tile, swaps the reading pane to that email, and points the CRM drawer at a
  // simple contact-detail card instead of Ella's profile.
  function selectPromoLead(tileEl) {
    if (!tileEl) return;

    document.querySelectorAll('.email-tile').forEach(t => t.classList.remove('selected'));
    tileEl.classList.add('selected');

    const dot = tileEl.querySelector('.tile-dot');
    if (dot) dot.remove();
    const sender = tileEl.querySelector('.tile-sender');
    if (sender) sender.classList.remove('bold');

    const historyBlock = document.getElementById('threadHistoryBlock');
    if (historyBlock) historyBlock.style.display = 'none';

    const titleText = document.getElementById('threadTitleText');
    if (titleText) titleText.textContent = 'Exploring Titan for our team at Northbridge Analytics';

    const expSender = document.getElementById('expSenderText');
    if (expSender) expSender.textContent = 'Priya Anand';

    const expTo = document.getElementById('expToText');
    if (expTo) expTo.textContent = 'To: ishantp@titan.email';

    const expTimestamp = document.getElementById('expTimestampText');
    if (expTimestamp) expTimestamp.textContent = '11:05 AM';

    const expBody = document.getElementById('expandedBodyContent');
    if (expBody) {
      expBody.innerHTML = `
        <p>Hi,</p>
        <p>A colleague recommended Titan for our ops team — we're about 60 people and looking to
          consolidate our email and CRM tooling.</p>
        <p>&zwj;</p>
        <p>Could you share more about your Enterprise pricing and what onboarding typically looks like?
          Happy to hop on a call this week if that's easier.</p>
        <p>&zwj;</p>
        <p>Best,<br>Priya Anand<br>Head of Operations, Northbridge Analytics</p>
      `;
    }

    openDrawer();
    navHistory = ['home', 'new-lead'];
    renderView('new-lead');
  }

  // Clicking an already-read mass marketing email — visual only, not wired to real data.
  // There's little reliable info to extract, so the CRM drawer shows a sparse card flagged
  // as a likely promotion, leaving the call on whether to track it to the user.
  function selectPotentialPromo(tileEl) {
    if (!tileEl) return;

    document.querySelectorAll('.email-tile').forEach(t => t.classList.remove('selected'));
    tileEl.classList.add('selected');

    const historyBlock = document.getElementById('threadHistoryBlock');
    if (historyBlock) historyBlock.style.display = 'none';

    const titleText = document.getElementById('threadTitleText');
    if (titleText) titleText.textContent = '3 Ways to 10x Your Email Outreach in 2026';

    const expSender = document.getElementById('expSenderText');
    if (expSender) expSender.textContent = 'Jordan Lee';

    const expTo = document.getElementById('expToText');
    if (expTo) expTo.textContent = 'To: ishantp@titan.email';

    const expTimestamp = document.getElementById('expTimestampText');
    if (expTimestamp) expTimestamp.textContent = '8:15 AM';

    const expBody = document.getElementById('expandedBodyContent');
    if (expBody) {
      expBody.innerHTML = `
        <p>Hi there,</p>
        <p>Struggling to get replies from cold outreach? GrowthBoost's AI platform helps sales teams
          increase reply rates by up to 3x — trusted by 500+ companies.</p>
        <p>&zwj;</p>
        <p>Book a free demo this week and get 20% off your first quarter.</p>
        <p>&zwj;</p>
        <p>Cheers,<br>The GrowthBoost Team</p>
        <p>&zwj;</p>
        <p style="color:#999; font-size:12px;">You're receiving this because you subscribed to marketing updates. Unsubscribe here.</p>
      `;
    }

    openDrawer();
    navHistory = ['home', 'potential-promo'];
    renderView('potential-promo');
  }

  // Visual-only acknowledgement — no data is actually persisted.
  function addLeadToCrm(btnEl) {
    if (!btnEl || btnEl.disabled) return;
    btnEl.textContent = '✓ Added to CRM';
    btnEl.disabled = true;
    btnEl.style.background = '#16a34a';
    btnEl.style.cursor = 'default';
  }

  // No init needed — CRM sidebar HTML is inlined directly in index.html

  return {
    toggleDrawer,
    openDrawer,
    closeDrawer,
    drillInto,
    goBack,
    goHome,
    switchTab,
    selectContact,
    saveNote,
    addTask,
    logActivityPrompt,
    openFullView,
    toggleTask,
    setPipelineStage,
    selectEllaEmail,
    selectPromoLead,
    selectPotentialPromo,
    addLeadToCrm
  };
})();

window.CrmApp = CrmApp;

function toggleCrmSidebar() {
  CrmApp.toggleDrawer();
}
