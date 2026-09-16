(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('./selection.js'):root.TitanSelection);if(node)module.exports=api;else root.TitanSidebarHeader=api;})(globalThis,function(Selection){
'use strict';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// icon and logo are image-path content slots; changing assets does not define a variant.
// Slot geometry is shared CSS-owned. The brand accessible name remains Titan.
function render(o={}){
 if(typeof o.logo!=='string'||!o.logo.trim())throw Error('Logo path required');
 // A page may supply a rendered trigger/pattern in the header's content slot.
 const launcher=o.trigger||Selection.dropdown({label:o.label||'Switch app',variant:'app-switcher',icon:o.icon,expanded:!!o.expanded});
 return '<div class="titan-sidebar-header" data-inspector-variant="default">'+launcher+'<div class="titan-sidebar-header__logo"><img src="'+esc(o.logo)+'" alt="Titan"></div></div>';
}
return {render};
});
