(() => {
  const apps = ['Mail', 'Calendar', 'Contacts', 'Bookings', 'Drive', 'Backup', 'Tasks', 'Site'].map(label => ({
    id: label.toLowerCase(), label, icon: `/design-system/icons/assets/app-${label.toLowerCase()}.svg`
  }));
  const tools = [
    ['Signature Designer', 'pink', 'signature-designer'],
    ['Smart Write AI', 'purple', 'smart-write'],
    ['Email Designer', 'blue', 'email-designer'],
    ['Invoice Builder', 'green', 'invoice-builder']
  ].map(([label, tone, id]) => ({id, label, tone, icon: `/design-system/icons/assets/${id}.svg`}));
  const destinations = [...apps, ...tools];
  const rail = document.getElementById('app-rail-items');
  rail.innerHTML = apps.map(app => TitanLauncher.appTile(app)).join('') +
    '<div class="rail-tools" role="group" aria-label="Tools">' + tools.map(tool => TitanLauncher.launcherItem(tool)).join('') + '</div>';
  const buttons = [...rail.querySelectorAll('button')];
  buttons.forEach(button => {
    const isTool = button.classList.contains('titan-launcher-item');
    const sourceId = isTool ? 'launcher-item' : 'app-tile';
    const sourceName = isTool ? 'Launcher item' : 'App tile';
    const sourceClass = isTool ? 'titan-launcher-item' : 'titan-app-tile';
    // The screen inspector includes this class in both its panel and copied context.
    button.classList.add(`${sourceClass}--derived-local-unregistered-icon-only`);
    // The workbench inspector reads this explicit human-readable variant label.
    button.setAttribute('data-inspector-variant', `Derived from ${sourceName} · Icon-only rail · Local, unregistered`);
    button.setAttribute('data-derived-from', sourceId);
    button.setAttribute('data-derivation-status', 'local-unregistered');
    button.setAttribute('data-derivation-definition', 'derivations.json');
  });
  const tooltip = document.createElement('div');
  tooltip.className = 'rail-tooltip';
  tooltip.hidden = true;
  document.body.append(tooltip);
  function hideTooltip() { tooltip.hidden = true; }
  function showTooltip(button) {
    const rect = button.getBoundingClientRect();
    tooltip.textContent = button.getAttribute('aria-label');
    tooltip.hidden = false;
    tooltip.style.left = `${document.querySelector('.app-rail').getBoundingClientRect().right + 8}px`;
    tooltip.style.top = `${Math.max(8, Math.min(innerHeight - tooltip.offsetHeight - 8, rect.top + (rect.height - tooltip.offsetHeight) / 2))}px`;
  }
  buttons.forEach(button => {
    button.setAttribute('aria-label', destinations.find(item => item.id === button.dataset.launcherItem).label);
    button.addEventListener('mouseenter', () => showTooltip(button));
    button.addEventListener('mouseleave', hideTooltip);
    button.addEventListener('focus', () => showTooltip(button));
    button.addEventListener('blur', hideTooltip);
    button.addEventListener('click', hideTooltip);
  });
  rail.addEventListener('keydown', event => { if (event.key === 'Escape') hideTooltip(); });
  document.querySelector('.app-rail').addEventListener('scroll', hideTooltip);
  window.addEventListener('resize', hideTooltip);
  const preview = document.getElementById('app-preview');
  function selectApp(id) {
    const app = destinations.find(app => app.id === id) || apps[0];
    document.querySelector('.app-window').dataset.activeApp = app.id;
    buttons.forEach(button => {
      if (button.dataset.launcherItem === app.id) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    preview.hidden = app.id === 'mail';
    document.getElementById('app-preview-title').textContent = app.label;
    document.getElementById('app-preview-name').textContent = app.label;
    document.getElementById('app-preview-icon').src = app.icon;
    document.title = `${app.label} · App sidebar · Titan`;
  }
  rail.addEventListener('click', event => {
    const button = event.target.closest('[data-launcher-item]');
    if (button) selectApp(button.dataset.launcherItem);
  });
  rail.addEventListener('keydown', event => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next !== undefined) { event.preventDefault(); buttons[next].focus(); }
  });
  document.getElementById('return-to-mail').innerHTML = TitanActions.button({label: 'Back to Mail'});
  document.getElementById('return-to-mail').addEventListener('click', () => { selectApp('mail'); buttons[0].focus(); });
  selectApp('mail');
})();
