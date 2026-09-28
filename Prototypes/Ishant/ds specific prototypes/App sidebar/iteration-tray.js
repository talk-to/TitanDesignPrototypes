(() => {
  const tray = document.querySelector('.sidebar-variant-panel');
  const handle = tray.querySelector('.sidebar-variant-panel__handle');
  let drag = null;
  function place(x, y) {
    const bounds = tray.getBoundingClientRect();
    tray.style.left = `${Math.max(0, Math.min(x, innerWidth - bounds.width))}px`;
    tray.style.top = `${Math.max(0, Math.min(y, innerHeight - bounds.height))}px`;
    tray.style.right = 'auto';
    tray.style.bottom = 'auto';
  }
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const bounds = tray.getBoundingClientRect();
    drag = {x: event.clientX - bounds.left, y: event.clientY - bounds.top};
    handle.setPointerCapture(event.pointerId);
    document.body.classList.add('is-moving-iterations');
  });
  handle.addEventListener('pointermove', event => {
    if (drag) place(event.clientX - drag.x, event.clientY - drag.y);
  });
  function finishDrag() {
    drag = null;
    document.body.classList.remove('is-moving-iterations');
  }
  handle.addEventListener('pointerup', finishDrag);
  handle.addEventListener('pointercancel', finishDrag);
  handle.addEventListener('lostpointercapture', finishDrag);
  handle.addEventListener('keydown', event => {
    const directions = {ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1]};
    if (!directions[event.key]) return;
    event.preventDefault();
    const [x,y] = directions[event.key];
    const rect = tray.getBoundingClientRect();
    const step = event.shiftKey ? 40 : 10;
    place(rect.left+x*step, rect.top+y*step);
  });
  function toggleShortcut(event) {
    if (event.key.toLowerCase() !== 'h' || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    finishDrag();
    tray.hidden = !tray.hidden;
  }
  // Shells are same-origin iframes: H works while focus is in an app, too.
  window.addEventListener('keydown', toggleShortcut, true);
  for (const frame of document.querySelectorAll('.app-view')) {
    const connect = () => {
      try { frame.contentWindow.addEventListener('keydown', toggleShortcut, true); } catch (_) {}
    };
    frame.addEventListener('load', connect);
    connect();
  }
  window.addEventListener('resize', () => {
    if (tray.hidden || !tray.style.left) return;
    const bounds = tray.getBoundingClientRect();
    place(bounds.left, bounds.top);
  });
})();
