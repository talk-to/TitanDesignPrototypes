import re

with open("/Users/ishant.p/Documents/Interactions Across Titan/changes.html", "r") as f:
    content = f.read()

# CSS to insert before </style>
css_insert = """
  /* 5. Dropdown Item Hover */
  .old-app-item {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; border-radius: 4px; cursor: pointer;
    transition: background 0.15s ease;
  }
  .old-app-item:hover { background: #e0e0e0; }
  .app-icon-placeholder { width: 40px; height: 40px; background: #2170f4; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 16px; }

  .new-app-item {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; border-radius: 4px; cursor: pointer; z-index: 10;
  }
  .new-app-item::before {
    content: ""; position: absolute; inset: 0; background: #f2f2f2; border-radius: 4px; z-index: -1; opacity: 0; transform: scale(0.8);
    transition: transform 0.2s ease-in, opacity 0.2s ease-in; pointer-events: none;
  }
  .new-app-item:hover::before { opacity: 1; transform: scale(1); transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease-out; }
  .new-app-item .app-icon-placeholder { transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1); }
  .new-app-item:hover .app-icon-placeholder { transform: scale(1.06); }

  /* 6. Composer Shutter */
  .composer-demo-container { position: relative; width: 100%; height: 200px; background: #e0e0e0; overflow: hidden; border-radius: 6px; border: 1px solid #ccc; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .demo-trigger-btn { padding: 8px 16px; background: #2170f4; color: white; border: none; border-radius: 4px; cursor: pointer; z-index: 10; font-weight: 600; }
  
  .old-composer-shutter {
    position: absolute; bottom: 0; right: 20px; width: 200px; height: 160px; background: #fff;
    border-top-left-radius: 8px; border-top-right-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none; flex-direction: column; z-index: 50;
  }
  .old-composer-shutter.open { display: flex; }
  
  .new-composer-shutter {
    position: absolute; bottom: 0; right: 20px; width: 200px; height: 160px; background: #fff;
    border-top-left-radius: 8px; border-top-right-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex; flex-direction: column; transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.2, 0, 0, 1); z-index: 50;
  }
  .new-composer-shutter.open { transform: translateY(0); }

  .shutter-header { background: #f5f5f5; padding: 8px 12px; font-size: 12px; font-weight: 600; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
  .close-icon { font-size: 10px; color: #888; }
"""
content = content.replace("</style>", css_insert + "\n</style>")

# HTML to insert before </div></div>\n\n<div class="smart-tooltip"
html_insert = """
<!-- 5. App Switcher Item -->
<div class="showcase-card">
  <h2>5. Dropdown Item Hover (App Switcher)</h2>
  <p>Added a premium spring bounce to the background highlight and a slight scale up for the icon inside the dropdown menu.</p>
  <div class="comparison-grid">
    <div class="panel">
      <div class="panel-label">Before</div>
      <div class="old-app-item">
        <div class="app-icon-placeholder">C</div>
        <span style="font-size: 12px; font-weight: 500;">Contacts</span>
      </div>
    </div>
    <div class="panel after">
      <div class="panel-label">After</div>
      <div class="new-app-item">
        <div class="app-icon-placeholder">C</div>
        <span style="font-size: 12px; font-weight: 500;">Contacts</span>
      </div>
    </div>
  </div>
</div>

<!-- 6. Composer Shutter -->
<div class="showcase-card">
  <h2>6. Composer Shutter Animation</h2>
  <p>Replaced abrupt element spawning with a smooth, physical slide-up animation from the bottom of the screen.</p>
  <div class="comparison-grid">
    <div class="panel" style="padding: 0;">
      <div class="panel-label" style="top: 8px; left: 8px;">Before</div>
      <div class="composer-demo-container">
        <button class="demo-trigger-btn" onclick="document.getElementById('old-comp').classList.toggle('open')">Toggle Composer</button>
        <div class="old-composer-shutter" id="old-comp">
          <div class="shutter-header" onclick="document.getElementById('old-comp').classList.remove('open')"><span>New Message</span><span class="close-icon">✕</span></div>
        </div>
      </div>
    </div>
    <div class="panel after" style="padding: 0;">
      <div class="panel-label" style="top: 8px; left: 8px;">After</div>
      <div class="composer-demo-container">
        <button class="demo-trigger-btn" onclick="document.getElementById('new-comp').classList.toggle('open')">Toggle Composer</button>
        <div class="new-composer-shutter" id="new-comp">
          <div class="shutter-header" onclick="document.getElementById('new-comp').classList.remove('open')"><span>New Message</span><span class="close-icon">✕</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
"""
content = content.replace("</div>\n</div>\n\n<div class=\"smart-tooltip\"", html_insert + "\n</div>\n</div>\n\n<div class=\"smart-tooltip\"")

with open("/Users/ishant.p/Documents/Interactions Across Titan/changes.html", "w") as f:
    f.write(content)
