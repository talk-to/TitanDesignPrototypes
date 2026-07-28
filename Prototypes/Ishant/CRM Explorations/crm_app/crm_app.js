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
    toggleTask
  };
})();

window.CrmApp = CrmApp;

function toggleCrmSidebar() {
  CrmApp.toggleDrawer();
}
