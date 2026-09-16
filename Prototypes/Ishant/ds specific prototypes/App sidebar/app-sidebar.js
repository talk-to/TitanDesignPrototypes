(() => {
  'use strict';

  const apps = [
    { id: 'mail', label: 'Mail', icon: 'app-mail', path: 'email shell/index.html', shape: 'mail' },
    { id: 'calendar', label: 'Calendar', icon: 'app-calendar', path: '../../design ops/DS-specific shells/TitanCalendar/index.html', shape: 'calendar' },
    { id: 'contacts', label: 'Contacts', icon: 'app-contacts', path: '../../design ops/DS-specific shells/Titan Contacts/index.html', shape: 'rows' },
    { id: 'bookings', label: 'Bookings', icon: 'app-bookings', path: 'placeholder.html', placeholder: true, shape: 'plain' },
    { id: 'drive', label: 'Drive', icon: 'app-drive', path: '../../design ops/DS-specific shells/TitanDrive/index.html', shape: 'rows' },
    { id: 'backup', label: 'Backup', icon: 'app-backup', path: 'placeholder.html', placeholder: true, shape: 'plain' },
    { id: 'tasks', label: 'Tasks', icon: 'app-tasks', path: 'placeholder.html', placeholder: true, shape: 'plain' }
  ];
  const tools = [
    { id: 'signature-designer', label: 'Signature Designer', icon: 'signature-designer', tone: 'pink', iconSize: 20 },
    { id: 'smart-write', label: 'Smart Write AI', icon: 'smart-write', tone: 'purple', iconSize: 20 },
    { id: 'email-designer', label: 'Email Designer', icon: 'email-designer', tone: 'blue' },
    { id: 'invoice-builder', label: 'Invoice Builder', icon: 'invoice-builder', tone: 'green' }
  ];

  const appsHost = document.getElementById('app-rail-apps');
  const footerHost = document.getElementById('app-rail-footer');
  const rail = document.querySelector('.app-rail');
  const tooltip = document.getElementById('app-rail-tooltip');
  const moreAppsListbox = document.getElementById('more-apps-listbox');
  const viewsHost = document.getElementById('app-views');
  const announcement = document.getElementById('app-announcement');
  const query = new URLSearchParams(location.search);
  const theme = query.get('theme') === 'dark' ? 'dark' : 'light';
  const inspect = query.get('ds') === 'true';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const variantSelect = document.getElementById('sidebar-variant-select');
  const transitionSelect = document.getElementById('app-transition-select');
  const requestedVariant = query.get('sidebar');
  const initialVariant = ['colored', 'colored-all', 'top-more', 'centered-more'].includes(requestedVariant) ? requestedVariant : 'grayscale';
  const requestedTransition = query.get('transition');
  const initialTransition = ['skeleton', 'slide-skeleton', 'instant'].includes(requestedTransition) ? requestedTransition : 'spinner';
  let transitionStyle = initialTransition;
  let currentApp = 'mail';
  let transitioning = false;
  let loaderShown = false;
  let pendingApp = null;
  let tooltipItem = null;
  let tooltipHideTimer = 0;

  function setSidebarVariant(variant) {
    document.body.dataset.sidebarVariant = variant;
    closeMoreApps();
    variantSelect.value = variant;
  }

  setSidebarVariant(initialVariant);
  variantSelect.addEventListener('change', () => setSidebarVariant(variantSelect.value));

  function setTransitionStyle(style) {
    transitionStyle = style;
    document.body.dataset.transition = style;
    transitionSelect.value = style;
  }

  setTransitionStyle(initialTransition);
  transitionSelect.addEventListener('change', () => setTransitionStyle(transitionSelect.value));

  function renderRailItem(item, current = false) {
    const label = `${item.label}${current ? ', current app' : ''}`;
    return `<div class="app-rail__item" role="listitem" data-app="${item.id}" data-label="${item.label}" data-current="${current}">` +
      TitanActions.iconButton({ label, icon: item.icon, iconSize: 20, variant: 'dark' }) +
      '</div>';
  }

  function prepareButton(button, className) {
    if (!button) return;
    button.classList.add(className);
    button.removeAttribute('title');
  }

  function renderApps(focusCurrent = false, animateCurrent = false) {
    appsHost.innerHTML = apps.map(app => renderRailItem(app, app.id === currentApp)).join('') +
      '<div class="app-rail__item app-rail__more-apps" role="listitem" data-more-apps data-label="More apps"></div>';
    appsHost.querySelector('[data-more-apps]').innerHTML = TitanActions.iconButton({ label: 'More apps', icon: 'more', iconSize: 20, variant: 'dark' });
    appsHost.querySelectorAll('.app-rail__item').forEach(item => {
      const button = item.querySelector('button');
      prepareButton(button, 'app-rail-icon-button--local');
      if (item.dataset.current === 'true') button?.setAttribute('aria-current', 'page');
      if (animateCurrent && item.dataset.current === 'true') button?.classList.add('app-rail-icon-button--pop');
    });
    if (focusCurrent) appsHost.querySelector('[aria-current="page"]')?.focus();
    const moreButton = appsHost.querySelector('[data-more-apps] button');
    prepareButton(moreButton, 'app-rail-icon-button--local');
    moreButton?.setAttribute('aria-haspopup', 'listbox');
    moreButton?.setAttribute('aria-controls', 'more-apps-listbox');
    moreButton?.setAttribute('aria-expanded', String(!moreAppsListbox.hidden));
  }

  renderApps();
  footerHost.innerHTML = tools.map(tool =>
    `<div class="app-rail__item" role="listitem" data-tool="${tool.id}" data-tool-tone="${tool.tone}" data-label="${tool.label}">` +
      TitanActions.iconButton({ label: tool.label, icon: tool.icon, iconSize: tool.iconSize || 16, variant: 'dark' }) +
    '</div>'
  ).join('') + '<div class="app-rail__item" role="listitem" data-tool="settings" data-label="Settings">' +
    TitanActions.iconButton({ label: 'Settings', icon: 'settings', iconSize: 16, iconColor: 'currentColor', variant: 'dark' }) +
    '</div>';
  footerHost.querySelectorAll('[data-tool]').forEach(item => {
    prepareButton(
      item.querySelector('button'),
      item.dataset.tool === 'settings' ? 'app-rail-icon-button--utility-local' : 'app-rail-icon-button--tool-local'
    );
  });
  moreAppsListbox.innerHTML = tools.map(tool =>
    `<button type="button" role="option" aria-selected="false" data-more-tool="${tool.id}" data-tool-tone="${tool.tone}">` +
      `<span class="more-apps-listbox__icon" style="--more-app-icon-size:${tool.iconSize || 16}px">${TitanIcons.render(tool.icon)}</span>` +
      `<span>${tool.label}</span>` +
    '</button>'
  ).join('');

  function closeMoreApps() {
    moreAppsListbox.hidden = true;
    appsHost.querySelector('[data-more-apps] button')?.setAttribute('aria-expanded', 'false');
  }

  function toggleMoreApps() {
    const item = appsHost.querySelector('[data-more-apps]');
    const willOpen = moreAppsListbox.hidden;
    if (!willOpen) return closeMoreApps();
    const rect = item.getBoundingClientRect();
    moreAppsListbox.hidden = false;
    moreAppsListbox.style.top = `${Math.max(8, Math.min(innerHeight - moreAppsListbox.offsetHeight - 8, rect.top + rect.height / 2 - moreAppsListbox.offsetHeight / 2))}px`;
    item.querySelector('button')?.setAttribute('aria-expanded', 'true');
  }

  const block = (style = '') => `<span class="app-skeleton__block"${style ? ` style="${style}"` : ''}></span>`;
  const blocks = (count, style) => Array.from({ length: count }, () => block(style)).join('');

  // A rough stand-in for the incoming app's layout, drawn from this prototype only.
  function skeletonBody(shape) {
    if (shape === 'mail') {
      return '<div class="app-skeleton__list">' +
        blocks(9, 'height:44px') +
      '</div><div class="app-skeleton__pane">' +
        block('height:28px;width:60%') + blocks(6, 'height:14px') + block('height:14px;width:45%') +
      '</div>';
    }
    if (shape === 'calendar') return `<div class="app-skeleton__grid">${blocks(35)}</div>`;
    if (shape === 'rows') {
      return '<div class="app-skeleton__rows">' +
        block('height:18px;width:30%') + blocks(10, 'height:32px') +
      '</div>';
    }
    return '<div class="app-skeleton__pane">' + block('height:24px;width:35%') + blocks(3, 'height:14px') + '</div>';
  }

  function skeletonMarkup(shape) {
    return '<div class="app-skeleton__nav">' +
        block('height:24px;width:90px;margin:12px auto 20px') + blocks(8, 'height:32px') +
      '</div>' +
      '<div class="app-skeleton__main">' +
        '<div class="app-skeleton__toolbar">' + block('height:36px;width:140px') + block('height:36px;width:min(48%,420px)') + '</div>' +
        `<div class="app-skeleton__body">${skeletonBody(shape)}</div>` +
      '</div>';
  }

  viewsHost.innerHTML = '<div class="app-view-loader" id="app-view-loader" aria-hidden="true" hidden>' +
    '<span class="app-view-loader__spinner"></span>' +
  '</div><div class="app-skeleton" id="app-skeleton" aria-hidden="true" hidden></div>' + apps.map((app, index) => {
    const frameQuery = new URLSearchParams({ theme });
    if (app.placeholder) {
      frameQuery.set('app', app.label);
      frameQuery.set('icon', app.icon);
    }
    if (inspect) frameQuery.set('ds', 'true');
    const src = `${app.path}?${frameQuery}`;
    return `<iframe class="app-view" data-app-view="${app.id}" title="Titan ${app.label}" src="${src}"${index ? ' hidden' : ''}></iframe>`;
  }).join('');

  const views = [...viewsHost.querySelectorAll('.app-view')];
  const viewLoader = document.getElementById('app-view-loader');
  const skeleton = document.getElementById('app-skeleton');

  function showTooltip(item) {
    if (!item) return;
    clearTimeout(tooltipHideTimer);
    tooltipItem?.querySelector('button')?.removeAttribute('aria-describedby');
    tooltipItem = item;
    const itemRect = item.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    tooltip.textContent = item.dataset.label;
    tooltip.style.left = `${railRect.right + 6}px`;
    tooltip.style.top = `${itemRect.top + itemRect.height / 2}px`;
    tooltip.hidden = false;
    tooltip.setAttribute('data-visible', 'true');
    item.querySelector('button')?.setAttribute('aria-describedby', tooltip.id);
  }

  function scheduleTooltipHide() {
    clearTimeout(tooltipHideTimer);
    tooltipHideTimer = window.setTimeout(() => {
      tooltip.removeAttribute('data-visible');
      tooltipItem?.querySelector('button')?.removeAttribute('aria-describedby');
      tooltipItem = null;
      tooltip.hidden = true;
    }, 140);
  }

  function animateButton(button) {
    if (!button) return;
    button.classList.remove('app-rail-icon-button--pop');
    void button.offsetWidth;
    button.classList.add('app-rail-icon-button--pop');
  }

  rail.addEventListener('pointerover', event => {
    const item = event.target.closest('.app-rail__item');
    if (item && item !== tooltipItem) showTooltip(item);
  });
  rail.addEventListener('pointerleave', scheduleTooltipHide);
  rail.addEventListener('focusin', event => showTooltip(event.target.closest('.app-rail__item')));
  rail.addEventListener('focusout', event => {
    if (!rail.contains(event.relatedTarget)) scheduleTooltipHide();
  });
  rail.addEventListener('scroll', () => {
    if (tooltipItem) showTooltip(tooltipItem);
  });
  window.addEventListener('resize', () => {
    if (tooltipItem) showTooltip(tooltipItem);
  });

  // The incoming view is revealed blurred behind a layout skeleton, then the two
  // cross-fade. In 'slide-skeleton' the skeleton also slides in on the outgoing
  // view's heels, so it stands in for the screen rather than for a spinner.
  function swapWithSkeleton(next, incomingView, outgoingView, direction) {
    const slide = transitionStyle === 'slide-skeleton' && !reduceMotion && Boolean(outgoingView);
    const move = `app-view--move-${direction}`;
    transitioning = true;
    skeleton.innerHTML = skeletonMarkup(next.shape || 'plain');
    skeleton.classList.remove('app-skeleton--out');

    function revealSkeleton() {
      skeleton.hidden = false;
      if (slide) skeleton.classList.add('app-view--entering', move);
      incomingView.classList.add('app-view--warming');
      views.forEach(view => { view.hidden = view !== incomingView; });

      window.setTimeout(() => {
        skeleton.classList.remove('app-view--entering', move);
        skeleton.classList.add('app-skeleton--out');
        incomingView.classList.remove('app-view--warming');

        window.setTimeout(() => {
          skeleton.hidden = true;
          skeleton.classList.remove('app-skeleton--out');
          transitioning = false;
          announcement.textContent = `${next.label} opened`;
          const queued = pendingApp;
          pendingApp = null;
          if (queued && queued !== currentApp) selectApp(queued);
        }, 240);
      }, slide ? 380 : 300);
    }

    if (!slide) return revealSkeleton();

    outgoingView.classList.add('app-view--leaving', move);
    window.setTimeout(() => {
      outgoingView.hidden = true;
      outgoingView.classList.remove('app-view--leaving', move);
      revealSkeleton();
    }, 180);
  }

  // Instant swap with no slide and no skeleton: the centre loader stands in for the
  // one cold app load, then every later swap cuts straight to the screen.
  function swapInstant(next, incomingView) {
    const showLoader = !loaderShown;
    loaderShown = true;
    if (showLoader) {
      transitioning = true;
      viewLoader.hidden = false;
    }
    views.forEach(view => { view.hidden = view !== incomingView; });
    if (!showLoader) {
      announcement.textContent = `${next.label} opened`;
      return;
    }

    window.setTimeout(() => {
      viewLoader.hidden = true;
      transitioning = false;
      announcement.textContent = `${next.label} opened`;
      const queued = pendingApp;
      pendingApp = null;
      if (queued && queued !== currentApp) selectApp(queued);
    }, 360);
  }

  function selectApp(id) {
    const next = apps.find(app => app.id === id);
    if (!next || id === currentApp) return;
    if (transitioning) {
      pendingApp = id;
      return;
    }
    const restoreFocus = appsHost.contains(document.activeElement);
    const keepTooltip = Boolean(tooltipItem);
    const currentIndex = apps.findIndex(app => app.id === currentApp);
    const nextIndex = apps.findIndex(app => app.id === id);
    const direction = nextIndex > currentIndex ? 'up' : 'down';
    const outgoingView = views.find(view => !view.hidden);
    const incomingView = views.find(view => view.dataset.appView === id);
    currentApp = id;
    renderApps(restoreFocus, true);
    if (keepTooltip) showTooltip(appsHost.querySelector(`[data-app="${id}"]`));
    document.title = `${next.label} · App sidebar · Titan`;
    announcement.textContent = `Opening ${next.label}`;

    if (transitionStyle.endsWith('skeleton') && incomingView) {
      swapWithSkeleton(next, incomingView, outgoingView, direction);
      return;
    }

    if (transitionStyle === 'instant' && incomingView) {
      swapInstant(next, incomingView);
      return;
    }

    if (reduceMotion || !outgoingView || !incomingView) {
      views.forEach(view => { view.hidden = view !== incomingView; });
      announcement.textContent = `${next.label} opened`;
      return;
    }

    transitioning = true;
    // The loader stands in for a cold app load, so it only plays on the first swap;
    // later swaps are instant, the way a preloaded app would behave in production.
    const showLoader = !loaderShown;
    loaderShown = true;
    incomingView.hidden = false;
    incomingView.classList.add('app-view--queued', `app-view--move-${direction}`);
    outgoingView.classList.add('app-view--leaving', `app-view--move-${direction}`);

    window.setTimeout(() => {
      outgoingView.hidden = true;
      outgoingView.classList.remove('app-view--leaving', `app-view--move-${direction}`);
      if (showLoader) viewLoader.hidden = false;

      window.setTimeout(() => {
        viewLoader.hidden = true;
        incomingView.classList.remove('app-view--queued');
        incomingView.classList.add('app-view--entering');

        window.setTimeout(() => {
          incomingView.classList.remove('app-view--entering', `app-view--move-${direction}`);
          transitioning = false;
          announcement.textContent = `${next.label} opened`;
          const queued = pendingApp;
          pendingApp = null;
          if (queued && queued !== currentApp) selectApp(queued);
        }, 260);
      }, showLoader ? 360 : 0);
    }, 180);
  }

  appsHost.addEventListener('click', event => {
    if (event.target.closest('[data-more-apps]')) {
      animateButton(event.target.closest('button'));
      toggleMoreApps();
      return;
    }
    const item = event.target.closest('[data-app]');
    if (!item) return;
    if (item.dataset.app === currentApp) animateButton(item.querySelector('button'));
    else selectApp(item.dataset.app);
  });

  rail.addEventListener('keydown', event => {
    const railButtons = [...rail.querySelectorAll('button')];
    const currentIndex = railButtons.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    let nextIndex;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % railButtons.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex + railButtons.length - 1) % railButtons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = railButtons.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      railButtons[nextIndex].focus();
    }
  });

  footerHost.addEventListener('click', event => {
    const item = event.target.closest('[data-tool]');
    if (!item) return;
    animateButton(item.querySelector('button'));
    announcement.textContent = `${item.dataset.label} is shown as a reusable control; no destination is connected in this prototype.`;
  });
  moreAppsListbox.addEventListener('click', event => {
    const option = event.target.closest('[data-more-tool]');
    if (!option) return;
    announcement.textContent = `${option.textContent.trim()} is shown as a reusable control; no destination is connected in this prototype.`;
    closeMoreApps();
  });
  document.addEventListener('pointerdown', event => {
    if (!moreAppsListbox.hidden && !event.target.closest('#more-apps-listbox, [data-more-apps]')) closeMoreApps();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !moreAppsListbox.hidden) {
      closeMoreApps();
      appsHost.querySelector('[data-more-apps] button')?.focus();
    }
  });
})();
