/**
 * Dedicated CRM Mini-App Controller & State Manager
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

    // Update Nav Title & Subtitle
    const titleEl = document.getElementById('crmNavTitle');
    const subtitleEl = document.getElementById('crmNavSubtitle');

    if (viewId === 'pipeline') {
      if (titleEl) titleEl.textContent = 'Pipeline Progress';
      if (subtitleEl) subtitleEl.textContent = 'Stage 3 of 4: Proposal Sent';
    } else if (viewId === 'attachments') {
      if (titleEl) titleEl.textContent = 'Shared Documents';
      if (subtitleEl) subtitleEl.textContent = 'Vault • 3 files';
    } else if (viewId === 'timeline') {
      if (titleEl) titleEl.textContent = 'Activity Feed';
      if (subtitleEl) subtitleEl.textContent = 'Chronological Logs';
    } else if (viewId === 'adaptor') {
      if (titleEl) titleEl.textContent = 'Entity Adaptor Lens';
      if (subtitleEl) subtitleEl.textContent = 'Sales / Project / Inventory';
    } else {
      if (titleEl) titleEl.textContent = 'CRM Context';
      if (subtitleEl) subtitleEl.textContent = 'Ella Mathews • Avon Tech';
    }

    // Highlight active tab if top tab
    if (['overview', 'timeline', 'adaptor'].includes(viewId)) {
      document.querySelectorAll('.crm-tab-item').forEach(tab => {
        const isActive = tab.getAttribute('onclick')?.includes(viewId);
        tab.classList.toggle('active', !!isActive);
      });
    }
  }

  function setLens(lens) {
    const salesView = document.getElementById('lens-sales-view');
    const projectView = document.getElementById('lens-project-view');
    const inventoryView = document.getElementById('lens-inventory-view');

    if (salesView) salesView.style.display = lens === 'sales' ? 'flex' : 'none';
    if (projectView) projectView.style.display = lens === 'project' ? 'flex' : 'none';
    if (inventoryView) inventoryView.style.display = lens === 'inventory' ? 'flex' : 'none';
  }

  function saveNote() {
    const input = document.getElementById('crmNoteInput');
    if (!input || !input.value.trim()) return;
    const noteText = input.value.trim();

    const memoryBox = document.getElementById('crmMemoryContent');
    if (memoryBox) {
      memoryBox.innerHTML = `📌 <b>New Note:</b> ${noteText}<br><span style="font-size:11px; opacity:0.7;">Just now by You</span><hr style="border:none; border-top:1px solid #fef3c7; margin:6px 0;">` + memoryBox.innerHTML;
    }
    input.value = '';
  }

  function openFullView() {
    alert('Launching Full CRM Workspace (Landing Page View)...');
  }

  // Auto-injector for mounting CRM Component into main page
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

  // Load component on DOMReady
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
    setLens,
    saveNote,
    openFullView
  };
})();

// Global handler alias for toolbar button trigger
function toggleCrmSidebar() {
  CrmApp.toggleDrawer();
}
