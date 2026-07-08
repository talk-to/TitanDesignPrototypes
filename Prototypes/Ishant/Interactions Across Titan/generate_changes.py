html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interaction Updates Showcase</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
    background: #f4f5f7;
    color: #333;
    margin: 0;
    padding: 40px;
  }
  .header { margin-bottom: 40px; }
  .header h1 { font-size: 32px; font-weight: 600; margin-bottom: 8px; }
  .header p { font-size: 16px; color: #666; }
  .showcase-card {
    background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    padding: 32px; margin-bottom: 32px;
  }
  .showcase-card h2 { font-size: 20px; margin-bottom: 8px; border-bottom: 1px solid #eaeaea; padding-bottom: 12px; }
  .showcase-card p { font-size: 14px; color: #666; margin-bottom: 24px; }
  .comparison-grid { display: flex; gap: 32px; }
  .panel {
    flex: 1; background: #fafafa; border: 1px solid #eaeaea; border-radius: 6px;
    padding: 48px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative; min-height: 200px; overflow: hidden;
  }
  .panel-label {
    position: absolute; top: 12px; left: 12px; font-size: 12px; font-weight: 600;
    text-transform: uppercase; color: #888; background: #e0e0e0; padding: 4px 8px; border-radius: 4px; z-index: 50;
  }
  .panel.after { background: #f0f7ff; border-color: #cce0ff; }
  .panel.after .panel-label { background: #0052cc; color: #fff; }

  /* 1. Icon Hover */
  .old-action-btn {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    border-radius: 4px; border: none; background: transparent; cursor: pointer; transition: background 0.15s ease;
  }
  .old-action-btn:hover { background: #e0e0e0; }
  .old-action-btn svg { width: 24px; height: 24px; fill: #666; }

  .new-action-btn {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    border-radius: 4px; border: none; background: transparent; cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease;
  }
  .new-action-btn svg { width: 24px; height: 24px; fill: #666; transition: fill 0.2s ease; }
  .new-action-btn:hover { background: #edeefd; transform: scale(1.1); }
  .new-action-btn:hover svg { fill: #5c53db; }

  /* 2. Split Button */
  .old-split-btn {
    display: inline-flex; align-items: center; background: #2170f4; border-radius: 4px; border: none;
    cursor: pointer; color: white; height: 38px; font-weight: 600; font-size: 14px;
  }
  .old-split-btn:hover { background: #1a5bc2; }
  .old-split-main { padding: 0 16px; display: flex; align-items: center; border-right: 1px solid rgba(255,255,255,0.3); height: 100%; }
  .old-split-dd { padding: 0 12px; display: flex; align-items: center; height: 100%; }

  .new-split-btn {
    display: inline-flex; align-items: center; border-radius: 4px; border: none; background: #2170f4;
    cursor: pointer; padding: 0; position: relative; overflow: visible; height: 38px; color: white; font-weight: 600; font-size: 14px;
  }
  .new-split-main {
    height: 100%; display: flex; align-items: center; padding: 0 16px;
    border-top-left-radius: 4px; border-bottom-left-radius: 4px; transition: background 0.15s ease;
  }
  .new-split-main:hover { background: rgba(255, 255, 255, 0.12); }
  .new-split-main:active { background: rgba(0, 0, 0, 0.15); }
  .new-split-dd {
    height: 100%; display: flex; align-items: center; justify-content: center; padding: 0 12px;
    border-left: 1.5px solid rgba(255, 255, 255, 0.35); border-top-right-radius: 4px; border-bottom-right-radius: 4px;
    transition: background 0.15s ease;
  }
  .new-split-dd:hover { background: rgba(255, 255, 255, 0.12); }
  .new-split-dd:active { background: rgba(0, 0, 0, 0.15); }
  .new-btn-wrapper { transition: transform 0.1s ease; display: inline-flex; align-items: center; }
  .new-split-main:active .new-btn-wrapper, .new-split-dd:active .new-btn-wrapper { transform: scale(0.95); }
  @keyframes border-ripple { 0% { box-shadow: 0 0 0 0px rgba(33, 112, 244, 0.6); } 100% { box-shadow: 0 0 0 6px rgba(33, 112, 244, 0); } }
  .ripple-active { animation: border-ripple 0.4s cubic-bezier(0.25, 1, 0.5, 1); }

  /* 3. Thread Stack */
  .stack-container { width: 100%; max-width: 300px; display: flex; flex-direction: column; align-items: center; }
  
  .old-stack {
    width: 100%; height: 40px; background: #fff; border: 1px solid #ddd; border-radius: 4px;
    display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; cursor: pointer;
  }
  .old-stack:hover { background: #f9f9f9; }
  .old-expanded-list { width: 100%; display: none; flex-direction: column; gap: 8px; }
  .old-expanded-list .card { background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 4px; font-size: 12px; }

  .new-stack { width: 100%; position: relative; cursor: pointer; margin-bottom: 8px; }
  .new-stack-card {
    background: #fff; border: 1px solid #dedede; border-radius: 4px; height: 46px;
    display: flex; align-items: center; padding: 0 16px; font-size: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden;
  }
  .new-stack:not(.expanded) .new-stack-card { height: 46px; margin-bottom: -36px; }
  .new-stack:not(.expanded) .new-stack-card.card-1 { margin-bottom: 0; }
  .new-stack-card.card-5 { z-index: 1; } .new-stack-card.card-4 { z-index: 2; }
  .new-stack-card.card-3 { z-index: 3; } .new-stack-card.card-2 { z-index: 4; } .new-stack-card.card-1 { z-index: 5; }
  .new-card-content { opacity: 0; transition: opacity 0.3s; }
  .new-stack:not(.expanded) .card-1 .new-card-content { opacity: 1; }
  
  .new-stack-pill {
    position: absolute; top: 12px; left: 50%; transform: translate(-50%, -50%);
    background: #fdfdfd; border: 1px solid #d4d4d4; border-radius: 100px; padding: 4px 12px;
    font-size: 11px; color: #666; z-index: 10; transition: opacity 0.3s, transform 0.3s;
  }
  .new-stack.expanded .new-stack-card { height: 46px; margin-bottom: 8px; }
  .new-stack.expanded .new-card-content { opacity: 1; }
  .new-stack.expanded .new-stack-pill { opacity: 0; transform: translate(-50%, -50%) scale(0.9); pointer-events: none; }

  /* 4. Tooltips */
  .toolbar-row { display: flex; gap: 12px; background: #fff; padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; position: relative; }
  .toolbar-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 4px; cursor: pointer; }
  
  /* Smart Tooltip */
  .smart-tooltip {
    position: fixed; background: #333; color: #fff; font-size: 11px; padding: 4px 8px;
    border-radius: 4px; pointer-events: none; opacity: 0; transform: translate(-50%, -8px);
    transition: opacity 0.15s ease, left 0.2s cubic-bezier(0.2, 0, 0, 1), top 0.2s cubic-bezier(0.2, 0, 0, 1);
    z-index: 1000;
  }
  .smart-tooltip.visible { opacity: 1; transform: translate(-50%, -4px); }
  .smart-tooltip.no-slide { transition: opacity 0.15s ease; }

</style>
</head>
<body>

<div class="header">
  <h1>Interaction Updates Showcase</h1>
  <p>A side-by-side comparison of the refined UI interactions implemented in Titan.</p>
</div>

<!-- 1. Hover States -->
<div class="showcase-card">
  <h2>1. Icon Button Hover (Spring Expansion)</h2>
  <p>Replaced standard flat color changes with a spring-based scale transformation for a satisfying, tactile pop.</p>
  <div class="comparison-grid">
    <div class="panel">
      <div class="panel-label">Before</div>
      <button class="old-action-btn" title="Reminder">
        <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
      </button>
    </div>
    <div class="panel after">
      <div class="panel-label">After</div>
      <button class="new-action-btn">
        <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
      </button>
    </div>
  </div>
</div>

<!-- 2. Split Button -->
<div class="showcase-card">
  <h2>2. Split Action Button (Tactile Click & Ripple)</h2>
  <p>Added instant scale-down click feedback and a satisfying ripple effect upon release.</p>
  <div class="comparison-grid">
    <div class="panel">
      <div class="panel-label">Before</div>
      <div class="old-split-btn">
        <div class="old-split-main">Send</div>
        <div class="old-split-dd">▼</div>
      </div>
    </div>
    <div class="panel after">
      <div class="panel-label">After</div>
      <div class="new-split-btn">
        <div class="new-split-main"><span class="new-btn-wrapper">Send</span></div>
        <div class="new-split-dd"><span class="new-btn-wrapper">▼</span></div>
      </div>
    </div>
  </div>
</div>

<!-- 3. Thread Stack -->
<div class="showcase-card">
  <h2>3. Thread Stack Expansion</h2>
  <p>Replaced the abrupt element-swapping stack with a purely CSS-driven, physically layered margin expansion.</p>
  <div class="comparison-grid">
    <div class="panel" style="align-items: flex-start; padding-top:60px;">
      <div class="panel-label">Before</div>
      <div class="stack-container">
        <div class="old-stack" onclick="this.style.display='none'; document.getElementById('old-list').style.display='flex';">
          3 older messages
        </div>
        <div class="old-expanded-list" id="old-list">
          <div class="card">Rachel Zane</div>
          <div class="card">Mike Ross</div>
          <div class="card">Louis Litt</div>
        </div>
      </div>
    </div>
    <div class="panel after" style="align-items: flex-start; padding-top:60px;">
      <div class="panel-label">After</div>
      <div class="stack-container">
        <div class="new-stack" onclick="this.classList.toggle('expanded')">
          <div class="new-stack-card card-3"><div class="new-card-content">Rachel Zane</div></div>
          <div class="new-stack-card card-2"><div class="new-card-content">Mike Ross</div></div>
          <div class="new-stack-card card-1"><div class="new-card-content">Louis Litt</div></div>
          <div class="new-stack-pill">3 older messages</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 4. Tooltips -->
<div class="showcase-card">
  <h2>4. Smart Persistence Tooltips</h2>
  <p>Replaced glitchy native title tooltips with custom ones that slide along the X-axis and teleport between rows.</p>
  <div class="comparison-grid">
    <div class="panel">
      <div class="panel-label">Before</div>
      <div class="toolbar-row" style="margin-bottom: 20px;">
        <div class="toolbar-icon" title="Bold">B</div>
        <div class="toolbar-icon" title="Italic">I</div>
        <div class="toolbar-icon" title="Underline">U</div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-icon" title="Align Left">L</div>
        <div class="toolbar-icon" title="Align Center">C</div>
      </div>
    </div>
    <div class="panel after">
      <div class="panel-label">After</div>
      <div class="toolbar-row smart-row" style="margin-bottom: 20px;" data-row="1">
        <div class="toolbar-icon smart-trigger" data-tip="Bold">B</div>
        <div class="toolbar-icon smart-trigger" data-tip="Italic">I</div>
        <div class="toolbar-icon smart-trigger" data-tip="Underline">U</div>
      </div>
      <div class="toolbar-row smart-row" data-row="2">
        <div class="toolbar-icon smart-trigger" data-tip="Align Left">L</div>
        <div class="toolbar-icon smart-trigger" data-tip="Align Center">C</div>
      </div>
    </div>
  </div>
</div>

<div class="smart-tooltip" id="global-tooltip">Tooltip</div>

<script>
  // Ripple JS
  document.querySelectorAll('.new-split-main, .new-split-dd').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.remove('ripple-active');
      void el.offsetWidth; 
      el.classList.add('ripple-active');
    });
    el.addEventListener('animationend', (e) => {
      if (e.animationName === 'border-ripple') el.classList.remove('ripple-active');
    });
  });

  // Smart Tooltip JS
  (function() {
    const tooltip = document.getElementById('global-tooltip');
    const triggers = document.querySelectorAll('.smart-trigger');
    let hideTimeout;
    let currentRow = null;

    triggers.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        clearTimeout(hideTimeout);
        const rect = item.getBoundingClientRect();
        const row = item.closest('.smart-row').dataset.row;
        
        tooltip.textContent = item.dataset.tip;
        tooltip.style.left = rect.left + (rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 8) + 'px';

        if (currentRow !== row && tooltip.classList.contains('visible')) {
          tooltip.classList.add('no-slide');
          tooltip.offsetHeight; 
          requestAnimationFrame(() => {
            tooltip.classList.remove('no-slide');
          });
        } else if (!tooltip.classList.contains('visible')) {
          tooltip.classList.add('no-slide');
          tooltip.offsetHeight;
          requestAnimationFrame(() => {
            tooltip.classList.remove('no-slide');
            tooltip.classList.add('visible');
          });
        }
        currentRow = row;
      });

      item.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          tooltip.classList.remove('visible');
          currentRow = null;
        }, 150);
      });
    });
  })();
</script>

</body>
</html>
"""
with open("/Users/ishant.p/Documents/Interactions Across Titan/changes.html", "w") as f:
    f.write(html_content)
