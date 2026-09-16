(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('../components/selection.js'):root.TitanSelection,node?require('../components/app-switcher.js'):root.TitanLauncher);if(node)module.exports=api;else root.TitanAppSwitcherPattern=api;})(globalThis,function(Selection,Launcher){
let serial=0;
function render(o={}){
 const current=o.selected?(o.apps||[]).find(app=>app.id===o.selected):null;
 if(o.selected&&!current)throw Error('Unknown selected app: '+o.selected);
 const id='titan-app-switcher-panel-'+(++serial);
 const trigger=Selection.dropdown({label:'Switch app',variant:'app-switcher',icon:current?current.icon:o.triggerIcon,expanded:!!o.open,controls:id});
 return '<div class="titan-launcher-scope titan-app-switcher">'+trigger+'<div class="titan-app-switcher__popover" id="'+id+'"'+(o.open?'':' hidden')+'>'+Launcher.appSwitcherPanel(o)+'</div></div>';
}
function bind(host,callbacks={}){const trigger=host.querySelector('.titan-dropdown-trigger'),panel=host.querySelector('.titan-app-switcher__popover');const setOpen=value=>{if(!panel)return;panel.hidden=!value;trigger.setAttribute('aria-expanded',String(value));if(value)panel.querySelector('button')?.focus();};const click=e=>{if(trigger?.contains(e.target))setOpen(panel.hidden);const item=e.target.closest('[data-launcher-item]');if(item&&host.contains(item)){if(panel){setOpen(false);trigger.focus();}callbacks.select?.(item.dataset.launcherItem);}};const outside=e=>{if(!host.contains(e.target))setOpen(false);};const key=e=>{if(e.key==='Escape'&&panel&&!panel.hidden){setOpen(false);trigger.focus();}};host.addEventListener('click',click);document.addEventListener('click',outside);host.addEventListener('keydown',key);return ()=>{host.removeEventListener('click',click);document.removeEventListener('click',outside);host.removeEventListener('keydown',key);};}
return {render,bind};
});
