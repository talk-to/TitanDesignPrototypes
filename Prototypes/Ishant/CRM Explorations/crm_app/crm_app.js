/**
 * Minimal CRM Controller Module
 */
const CrmApp = (function () {
  let navHistory = ['overview'];

  function toggleDrawer() {
    const drawer = document.getElementById('crmSidebar');
    if (drawer) drawer.classList.toggle('open');
  }

  function openDrawer() {
    const drawer = document.getElementById('crmSidebar');
    if (drawer) drawer.classList.add('open');
  }

  function closeDrawer() {
    const drawer = document.getElementById('crmSidebar');
    if (drawer) drawer.classList.remove('open');
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

  function switchTab(tabId) {
    navHistory = [tabId];
    renderView(tabId);
  }

  function renderView(viewId) {
    // Hide all view pages
    document.querySelectorAll('.crm-view-page').forEach(page => page.classList.remove('active'));

    // Show target view page
    const targetPage = document.getElementById(`crmView-${viewId}`);
    if (targetPage) targetPage.classList.add('active');

    // Update Back Button visibility
    const backBtn = document.getElementById('crmBackBtn');
    if (backBtn) {
      backBtn.style.display = navHistory.length > 1 ? 'flex' : 'none';
    }

    // Update Nav Breadcrumbs
    const titleEl = document.getElementById('crmNavTitle');
    const subtitleEl = document.getElementById('crmNavSubtitle');

    if (viewId === 'all-notes') {
      if (titleEl) titleEl.textContent = 'All Notes';
      if (subtitleEl) subtitleEl.textContent = 'Notes History • Ella Mathews';
    } else if (viewId === 'more-details') {
      if (titleEl) titleEl.textContent = 'Contact Fields';
      if (subtitleEl) subtitleEl.textContent = 'All Profile & Company Info';
    } else if (viewId === 'activity') {
      if (titleEl) titleEl.textContent = 'Activity';
      if (subtitleEl) subtitleEl.textContent = 'Interactions & Shared Files';
    } else if (viewId === 'activities') {
      if (titleEl) titleEl.textContent = 'Activities';
      if (subtitleEl) subtitleEl.textContent = 'Tasks & Scheduled Follow-ups';
    } else {
      if (titleEl) titleEl.textContent = 'CRM Context';
      if (subtitleEl) subtitleEl.textContent = 'Ella Mathews';
    }

    // Highlight main top tab if applicable
    if (['overview', 'activity', 'activities'].includes(viewId)) {
      document.querySelectorAll('.crm-tab-item').forEach(tab => {
        const isActive = tab.getAttribute('onclick')?.includes(`'${viewId}'`);
        tab.classList.toggle('active', !!isActive);
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

    const taskCard = document.querySelector('#crmView-activities .crm-card');
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

  function init() {
    const container = document.getElementById('crmSidebarContainer');
    if (container) {
      fetch('crm_app/crm_sidebar.html')
        .then(res => res.text())
        .then(html => {
          container.innerHTML = html;
        })
        .catch(err => console.error('Failed to load CRM Sidebar HTML component:', err));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    toggleDrawer,
    openDrawer,
    closeDrawer,
    drillInto,
    goBack,
    switchTab,
    saveNote,
    addTask,
    logActivityPrompt,
    openFullView
  };
})();

function toggleCrmSidebar() {
  CrmApp.toggleDrawer();
}
