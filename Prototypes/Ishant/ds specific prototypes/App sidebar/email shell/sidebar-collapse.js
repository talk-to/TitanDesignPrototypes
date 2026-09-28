(() => {
  const sidebar = document.getElementById('mail-sidebar');
  const control = document.getElementById('mail-collapse-control');
  const navigation = sidebar.querySelector('.nav-scroll');
  sidebar.querySelector('#sidebar-footer-host').parentElement.classList.add('mail-expanded-footer');
  const compact = document.createElement('nav');
  compact.className = 'mail-compact-nav';
  compact.setAttribute('aria-label', 'Mail folders');
  sidebar.append(compact);
  let collapsed = false;
  const disclosures = new Map();
  let selectedFolder = navigation.querySelector('.nav-item.active');

  function compactNavigation() {
    compact.replaceChildren();
    for (const source of navigation.children) {
      const row = document.createElement('div');
      row.className = 'mail-compact-row';
      if (source.matches('.titan-account-header')) {
        row.classList.add('mail-compact-account');
        const name = source.querySelector('.titan-account-header__email').textContent.trim();
        row.innerHTML = '<span class="mail-compact-account-chevron">' + TitanActions.iconButton({label: `Expand navigation for ${name}`, icon: 'chevron-down', variant: 'dark', iconColor: 'currentColor'}) + '</span>' + TitanAvatar.render({initials: source.querySelector('.titan-avatar').textContent.trim(), label: name, variant: 'small'});
        row.querySelector('button').addEventListener('click', () => setCollapsed(false));
      } else if (source.matches('.nav-item')) {
        const label = source.querySelector('.nav-item-label')?.textContent.trim();
        const artwork = source.querySelector('.nav-item-icon img');
        if (!label || !artwork) continue;
        if (label === 'More' || label === 'Less') {
          let expanded = disclosures.get(source) ?? label === 'Less';
          function renderDisclosure() {
            row.innerHTML = TitanActions.iconButton({label: expanded ? 'Show less' : 'Show more', icon: expanded ? 'sidebar-more' : 'chevron-down', variant: 'dark', iconColor: 'currentColor', iconSize: 16});
            const button = row.querySelector('button');
            button.setAttribute('aria-expanded', String(expanded));
            button.addEventListener('click', () => {
              expanded = !expanded;
              disclosures.set(source, expanded);
              compactNavigation();
              compact.querySelector(`[data-disclosure="${Array.from(navigation.children).indexOf(source)}"] button`).focus();
            });
          }
          row.dataset.disclosure = Array.from(navigation.children).indexOf(source);
          renderDisclosure();
          compact.append(row);
          continue;
        }
        // Disclosure and other actions do not replace the selected folder.
        const isAction = label.startsWith('Add ');
        if (!isAction) row.dataset.current = String(source === selectedFolder);
        let previous = source.previousElementSibling;
        while (previous?.matches('.nav-item')) {
          const previousLabel = previous.querySelector('.nav-item-label')?.textContent.trim();
          if (previousLabel === 'Less' || previousLabel === 'More') {
            row.hidden = !(disclosures.get(previous) ?? previousLabel === 'Less');
            break;
          }
          previous = previous.previousElementSibling;
        }
        row.innerHTML = TitanActions.iconButton({label, icon: artwork.dataset.titanIcon || artwork.getAttribute('src'), variant: 'dark', iconSize: 16});
        row.querySelector('button').addEventListener('click', () => {
          source.click();
          if (isAction) return;
          selectedFolder = source;
          compact.querySelectorAll('[data-current]').forEach(item => item.dataset.current = 'false');
          row.dataset.current = 'true';
        });
      } else if (source.matches('.sidebar-line')) {
        row.className = 'mail-compact-separator';
      } else continue;
      compact.append(row);
    }
  }

  function setCollapsed(value) {
    collapsed = value;
    if (collapsed) compactNavigation();
    sidebar.dataset.collapsed = String(collapsed);
    const hadFocus = control.contains(document.activeElement);
    // Page-owned control: its circular surface and interaction treatment are local.
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mail-sidebar-toggle';
    button.setAttribute('aria-label', collapsed ? 'Expand mail sidebar' : 'Collapse mail sidebar');
    button.title = button.getAttribute('aria-label');
    if (collapsed) {
      button.innerHTML = TitanIcons.render('sidebar', 'currentColor');
    } else {
      const arrow = document.createElement('img');
      arrow.src = './sidebar-collapse.svg';
      arrow.alt = '';
      arrow.draggable = false;
      button.append(arrow);
    }
    control.replaceChildren(button);
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute('aria-controls', 'mail-sidebar');
    button.addEventListener('click', () => setCollapsed(!collapsed));
    if (hadFocus) button.focus();
  }
  setCollapsed(false);
})();
