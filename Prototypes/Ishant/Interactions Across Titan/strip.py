import re

with open("TitanEmailShell/index.html", "r") as f:
    text = f.read()

# Remove iter-panel HTML
text = re.sub(r'<!-- ── Iteration Panel ── -->.*?<div class="iter-panel-collapsed" .*?</div>\s*</div>', '', text, flags=re.DOTALL)

# Remove iter-panel CSS (lines from .iter-panel { to body[data-iteration="4"] ... )
text = re.sub(r'\.iter-panel \{.*?\/\* ── New email push-down \(height controlled via JS\) ── \*\/', '/* ── New email push-down (height controlled via JS) ── */', text, flags=re.DOTALL)

# Remove Toast HTML
text = re.sub(r'<div id="refresh-toast">.*?</div>\s*</div>', '', text, flags=re.DOTALL)

# Remove Toast CSS
text = re.sub(r'/\* ── D · Toast ── \*/.*?/\* ── Shared: spinning refresh icon ── \*/', '/* ── Shared: spinning refresh icon ── */', text, flags=re.DOTALL)

# Remove Skeleton CSS
text = re.sub(r'/\* ── A · Skeleton ── \*/.*?/\* ── Middle panel overlay', '/* ── Middle panel overlay', text, flags=re.DOTALL)

# Remove Sweep Bar CSS
text = re.sub(r'/\* ── Sweep bar .*?\*/.*?/\* ── Refresh overlay', '/* ── Refresh overlay', text, flags=re.DOTALL)

# Remove JS config and iter functions
text = re.sub(r'// ── Config ──.*?function triggerRefresh', 'function triggerRefresh', text, flags=re.DOTALL)

# Simplify triggerRefresh to only do "fade"
new_trigger_refresh = """function triggerRefresh(btn) {
      const isLogoClick = btn && (btn.classList.contains('titan-logo') || btn.closest('.titan-logo'));
      const img = (btn && !isLogoClick) ? btn.querySelector('img') : null;
      const list = document.querySelector('.email-list');
      const cls = 'fade-refresh';

      if (list.classList.contains(cls)) return;

      const existing = list.querySelectorAll('.new-email-tile');
      if (existing.length) {
        existing.forEach(tile => tile.remove());
        triggerRefresh(btn);
        return;
      }

      if (img) {
        img.style.animation = 'none';
        img.offsetHeight;
        img.style.animation = 'spin 0.7s linear infinite';
      }

      const middleOverlay = document.querySelector('.middle-refresh-overlay');
      sweepSidebarNav(btn);

      list.classList.add(cls);
      if (middleOverlay) { middleOverlay.style.background = 'rgba(255,255,255,0.45)'; middleOverlay.style.opacity = '1'; }

      const duration = 1800 + Math.random() * 1400;
      setTimeout(() => {
        if (middleOverlay) middleOverlay.style.opacity = '0';
        list.classList.remove(cls);
        list.classList.add('fade-stopping');
        setTimeout(() => {
          list.classList.remove('fade-stopping');
          if (img) img.style.animation = '';
          addNewEmail();
          sweepSidebarNav(null, true);
        }, 520);
      }, duration);
    }"""
text = re.sub(r'function triggerRefresh\(btn\).*?const NEW_EMAILS =', new_trigger_refresh + '\n\n    const NEW_EMAILS =', text, flags=re.DOTALL)

# Remove JS iter-panel initialization at bottom
text = re.sub(r'// Setup active iteration.*?\}\);', '', text, flags=re.DOTALL)
text = re.sub(r'function expandPanel\(\).*?\}', '', text, flags=re.DOTALL)
text = re.sub(r'function collapsePanel\(\).*?\}', '', text, flags=re.DOTALL)

# Remove specific Iteration 3 & 4 HTML from sidebar/tabs
text = re.sub(r'<div class="tabs-refresh-btn".*?</div>', '', text, flags=re.DOTALL)
text = re.sub(r'<div class="sidebar-refresh-btn titan-action-btn".*?</div>', '', text, flags=re.DOTALL)

# Remove sweep-bar HTML
text = re.sub(r'<div class="sweep-bar"></div>', '', text)

with open("TitanEmailShell/index.html", "w") as f:
    f.write(text)

print("Stripping complete!")
