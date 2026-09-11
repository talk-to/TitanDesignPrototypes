(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./selection.js'):root.TitanSelection);if(typeof module==='object'&&module.exports)module.exports=api;else root.TitanLauncher=api;})(globalThis,function(Selection){
const Icons=typeof module==='object'&&module.exports?require('../icons/runtime.js'):globalThis.TitanIcons;
const assetBase=typeof document!=='undefined'?new URL('./assets/',document.currentScript.src).href:'/design-system/components/assets/';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=v=>{if(typeof v!=='string'||!v.trim())throw Error('Label required');return esc(v);};
const image=(id,cls)=>Icons.render(id).replace('<img ','<img class="'+esc(cls)+'" ');
function appTile(o){return '<button type="button" class="titan-launcher-scope app-switcher-item titan-app-tile'+(o.selected?' titan-app-tile--selected':'')+'" data-launcher-item="'+esc(o.id)+'"'+(o.selected?' aria-current="true"':'')+'><span class="app-icon">'+image(o.icon,'app-icon-img')+'</span><span class="app-label">'+label(o.label)+'</span></button>';}
function launcherItem(o){if(o.variant==='footer')return '<button type="button" class="titan-launcher-scope footer-link-row titan-launcher-item" data-inspector-variant="Supporting link" data-launcher-item="'+esc(o.id)+'"><span class="footer-link-content">'+image(o.icon,o.beaker?'beaker-icon':'footer-link-icon')+'<span class="footer-link-text">'+label(o.label)+'</span>'+image(o.arrow,'footer-arrow')+'</span></button>';if(!['pink','purple','blue','green'].includes(o.tone))throw Error('Observed icon tone required');return '<button type="button" class="titan-launcher-scope app-switcher-tool-item titan-launcher-item" data-inspector-variant="Tool" data-launcher-item="'+esc(o.id)+'"><span class="tool-icon bg-'+o.tone+'">'+image(o.icon,'')+'</span><span class="tool-label">'+label(o.label)+'</span></button>';}
function appGrid(o={}){
 const apps=o.apps||[];
 if(!Array.isArray(apps))throw Error('Apps must be an array');
 if(o.selected&&!apps.some(app=>app.id===o.selected))throw Error('Unknown selected app: '+o.selected);
 return '<div class="titan-launcher-scope titan-app-grid app-switcher-section" role="group" aria-label="'+label(o.label||'Apps')+'">'+Array.from({length:Math.ceil(apps.length/3)},(_,row)=>'<div class="app-switcher-row">'+apps.slice(row*3,row*3+3).map(app=>appTile({...app,selected:app.id===o.selected})).join('')+'</div>').join('')+'</div>';
}
function appSwitcherPanel(o={}){
 const tools=o.tools||[],footer=o.footer||[];
 return '<div class="titan-launcher-scope titan-app-switcher-panel" role="dialog" aria-label="'+label(o.panelLabel||'Choose an app or tool')+'"><div class="app-switcher-bg">'+image(o.background||assetBase+'app-switcher-surface.svg','')+'</div><div class="app-switcher-content">'+appGrid({apps:o.apps,selected:o.selected})+(tools.length?'<div class="app-switcher-divider">'+image(o.divider||assetBase+'app-switcher-divider.svg','')+'</div><div class="app-switcher-tools">'+tools.map(launcherItem).join('')+'</div>':'')+(footer.length?'<div class="app-switcher-footer">'+footer.map(item=>launcherItem({...item,variant:'footer'})).join('')+'</div>':'')+'</div></div>';
}
function mount(host,kind,o,callbacks={}){const render={appTile,appGrid,launcherItem,appSwitcherPanel}[kind];if(!render)throw Error('Unknown launcher component');host.classList.add('titan-launcher-scope');host.innerHTML=render(o);return bind(host,callbacks);}
function bind(host,callbacks={}){const click=e=>{const item=e.target.closest('[data-launcher-item]');if(item&&host.contains(item))callbacks.select?.(item.dataset.launcherItem);};host.addEventListener('click',click);return ()=>host.removeEventListener('click',click);}

return {appTile,appGrid,launcherItem,appSwitcherPanel,mount,bind};
});
