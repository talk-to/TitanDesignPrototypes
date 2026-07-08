import re

with open("TitanEmailShell/index.html", "r") as f:
    text = f.read()

# 1. Thread Stack Expansion
# Remove expandStack function
text = re.sub(r'function expandStack\(element\) \{.*?\}\n', '', text, flags=re.DOTALL)
# Remove onclick="expandStack(this)"
text = text.replace(' onclick="expandStack(this)"', '')
# Remove .thread-stack.expanded CSS
text = re.sub(r'/\* Expanded state \*/.*?\.thread-stack\.expanded \.stack-card-content \{\s*opacity: 1;\s*\}', '', text, flags=re.DOTALL)

# 2. Composer Tooltips
# Remove JS
text = re.sub(r'// ── Shared Composer Tooltip Logic ──.*?\)\(\);', '', text, flags=re.DOTALL)
# Remove HTML
text = re.sub(r'<div class="comp-tooltip" id="comp-tooltip"></div>', '', text)
# Remove CSS
text = re.sub(r'/\* ── Floating Tooltip \(Shared\) ── \*/.*?\.comp-tooltip\.visible \{\s*opacity: 1;\s*transform: translateX\(-50%\) translateY\(0\);\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'\.comp-tooltip\.no-slide \{\s*transition: opacity 0\.15s ease;\s*\}', '', text, flags=re.DOTALL)

# 3. App Switcher Fade
# Remove transitions from .app-switcher-panel
text = re.sub(r'transition: opacity 0\.2s ease, transform 0\.2s cubic-bezier\(0\.22, 1, 0\.36, 1\);', '', text)
text = re.sub(r'transform: translateY\(8px\) scale\(0\.98\);', '', text)
# In .app-switcher-panel.open, remove transform and opacity
text = re.sub(r'\.app-switcher-panel\.open \{\s*opacity: 1;\s*transform: translateY\(0\) scale\(1\);\s*pointer-events: auto;\s*\}', 
              '.app-switcher-panel.open {\n      opacity: 1;\n      pointer-events: auto;\n    }', text)

# 4. Dropdown Panel
# Remove transitions from .dropdown-panel
text = re.sub(r'transition: opacity 0\.2s ease, transform 0\.2s cubic-bezier\(0\.22, 1, 0\.36, 1\);', '', text)
text = re.sub(r'transform: translateY\(-8px\) scale\(0\.98\);', '', text)
text = re.sub(r'\.dropdown-panel\.open \{\s*opacity: 1;\s*transform: translateY\(0\) scale\(1\);\s*pointer-events: auto;\s*\}', 
              '.dropdown-panel.open {\n      opacity: 1;\n      pointer-events: auto;\n    }', text)

# 5. Icon Hover Scale
# Remove scale from titan-action-btn
text = re.sub(r'transform: scale\(1\.15\);', '', text)
text = re.sub(r'transform: scale\(1\.1\);', '', text)
text = re.sub(r'transform: scale\(var\(--click-scale\)\);', '', text)
text = re.sub(r'transition: background 0\.15s ease, transform 0\.1s ease;', 'transition: background 0.15s ease;', text)
text = re.sub(r'transition: transform 0\.1s ease;', '', text)

# Remove scale from comp-action-btn
text = re.sub(r'transition: background 0\.15s ease, transform 0\.1s ease;', 'transition: background 0.15s ease;', text)

# Remove scale from comp-icon-btn
text = re.sub(r'transition: background 0\.1s ease, transform 0\.1s ease;', 'transition: background 0.1s ease;', text)

# 6. Smooth Push-down animation in addNewEmail
new_add_email = """function addNewEmail() {
      const list = document.querySelector('.email-list');
      const data = NEW_EMAILS[newEmailIndex % NEW_EMAILS.length];
      newEmailIndex++;

      const tile = document.createElement('div');
      tile.className = 'email-tile new-email-tile';
      tile.innerHTML = `
    <div class="email-tile-inner" style="opacity:1;">
      <div class="tile-icons">
        <div class="tile-chk"><div class="chk"><img src="assets/392bf29c-08b1-44e8-b95b-b99905e722e6.svg" alt=""></div></div>
        <div class="tile-dot"></div>
        <div class="tile-star"><img src="assets/1e1696aa-5b8d-4409-97fd-4ce5c85c5ae5.svg" alt=""></div>
      </div>
      <div class="tile-content">
        <div style="display:flex;justify-content:space-between;">
          <div class="tile-sender bold">${data.sender}</div>
          <div class="tile-time">just now</div>
        </div>
        <div class="tile-subject">${data.subject}</div>
        <div class="tile-preview">${data.preview}</div>
        <div class="tile-hover-actions">
          <div class="tile-action-pill"><div class="icon18"><img src="assets/7c1d5199-2bce-428f-9bff-eb73b6954e12.svg" alt=""></div></div>
          <div class="tile-action-pill"><div class="icon18"><img src="assets/65a9156f-d37a-414e-bef2-e5b477cb6436.svg" alt=""></div></div>
        </div>
      </div>
    </div>
    <div class="tile-divider"><img src="assets/5a7cff96-86fc-4121-9127-08bc8d0621c7.svg" alt=""></div>`;

      // Instant append
      const overlay = list.querySelector('.refresh-overlay');
      if(overlay) overlay.after(tile);
    }"""
text = re.sub(r'function addNewEmail\(animate = true\) \{.*?(?=\s+function |\Z)', new_add_email + '\n\n', text, flags=re.DOTALL)

# Simplify triggerRefresh to instant append
new_trigger_refresh = """function triggerRefresh(btn) {
      addNewEmail();
    }"""
text = re.sub(r'function triggerRefresh\(btn\) \{.*?(?=\s+const NEW_EMAILS)', new_trigger_refresh + '\n\n', text, flags=re.DOTALL)

# Remove sweepSidebarNav entirely
text = re.sub(r'function sweepSidebarNav\(btn, reset = false\) \{.*?(?=\s+function addNewEmail)', '', text, flags=re.DOTALL)

# 7. Button Ripple effect
text = re.sub(r'// ── Blue Buttons Ripple Effect ──.*?\}\);', '', text, flags=re.DOTALL)

with open("TitanEmailShell/index.html", "w") as f:
    f.write(text)

print("Stripped extra interactions!")
