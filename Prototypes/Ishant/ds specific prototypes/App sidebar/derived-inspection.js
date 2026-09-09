/* Prototype-owned inspector decoration; no shared studio changes. */
(() => {
  if (new URLSearchParams(location.search).get('ds') !== 'true') return;
  function attach() {
    const root = document.getElementById('ds-spacing-inspector')?.shadowRoot;
    if (!root || !root.querySelector('.component-outline')) return false;
    const style = document.createElement('style');
    style.textContent = `
      .component-outline[data-derived] { border-color: #d6a600; background: #ffd43b18; }
      .component-outline[data-derived] .component-name { background: #ffd43b; color: #302600; }
      .component-outline[data-derived] .component-name::after { content: ' · Derived · local'; font-weight: 600; }
      .component-panel[data-derived] h3 { border-left: 4px solid #d6a600; padding-left: 8px; }
      .component-panel[data-derived] h3::after { content: 'Derived · local, unregistered'; display: block; background: #fff1ad; color: #302600; font-size: 12px; padding: 6px; margin-top: 8px; }
    `;
    root.append(style);
    const outline = root.querySelector('.component-outline');
    const panel = root.querySelector('.component-panel');
    function update() {
      const box = outline.getBoundingClientRect();
      const derived = !outline.hidden && [...document.querySelectorAll('[data-derivation-status="local-unregistered"]')].some(el => {
        const rect = el.getBoundingClientRect();
        return Math.abs(rect.x-box.x)<1 && Math.abs(rect.y-box.y)<1 && Math.abs(rect.width-box.width)<1 && Math.abs(rect.height-box.height)<1;
      });
      outline.toggleAttribute('data-derived', derived);
      if (panel) panel.toggleAttribute('data-derived', derived && !panel.hidden && panel.textContent.includes('derived-local-unregistered'));
      // Preserve the existing instance-copy payload. Only suppress base-component
      // copying when the selected instance carries our local derivation marker.
      if (panel) {
        const localInstance = panel.textContent.includes('derived-local-unregistered');
        for (const button of panel.querySelectorAll('button')) {
          if (button.textContent === 'Copy component' && button.hidden !== localInstance) button.hidden = localInstance;
        }
      }
      const label = outline.querySelector('.component-name');
      if (label && !outline.hidden) {
        // Use viewport coordinates so neither the outline nor its component is covered.
        const gap = 6, edge = 8;
        const width = Math.min(label.scrollWidth, innerWidth - edge * 2);
        const height = label.getBoundingClientRect().height;
        let left = Math.max(edge, Math.min(box.left, innerWidth - width - edge));
        let top;
        if (box.top - height - gap >= edge) top = box.top - height - gap;
        else if (box.bottom + gap + height <= innerHeight - edge) top = box.bottom + gap;
        else {
          top = Math.max(edge, Math.min(box.top, innerHeight - height - edge));
          if (box.right + gap + width <= innerWidth - edge) left = box.right + gap;
          else if (box.left - gap - width >= edge) left = box.left - gap - width;
          // A viewport-filling component has no outside space: use its nearest edge.
          else top = edge;
        }
        const css = `position:fixed;left:${left}px;top:${top}px;max-width:calc(100vw - 16px);white-space:normal;overflow-wrap:anywhere;box-sizing:border-box;`;
        if (label.style.cssText !== css) {
          // Compare normalized styles to avoid observer loops caused by CSS serialization.
          const desired = document.createElement('span'); desired.style.cssText = css;
          if (label.style.cssText !== desired.style.cssText) label.style.cssText = css;
        }
      }

    }
    new MutationObserver(update).observe(root, {subtree:true,childList:true,attributes:true,attributeFilter:['style','hidden']});
    update();
    return true;
  }
  if (!attach()) {
    const observer = new MutationObserver(() => { if (attach()) observer.disconnect(); });
    observer.observe(document.body, {childList:true});
  }
})();
