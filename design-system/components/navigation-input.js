(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('../icons/runtime.js'):root.TitanIcons,node?require('./actions.js'):root.TitanActions,node?require('./selection.js'):root.TitanSelection);if(node)module.exports=api;else root.TitanNavigationInput=api;})(typeof globalThis!=='undefined'?globalThis:this,function(Icons,Actions,Selection){
'use strict';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=value=>{if(typeof value!=='string'||!value.trim())throw Error('An accessible label is required');return esc(value);};
function image(id){return Icons.render(id);}
function searchField(o={}){return '<form role="search" class="titan-search-field search-bar" aria-label="'+label(o.label)+'"><span class="search-icon">'+image(o.icon||'search')+'</span><input type="search" aria-label="'+esc(o.label)+'" placeholder="'+esc(o.placeholder)+'" value="'+esc(o.value)+'"'+(o.disabled?' disabled':'')+(o.readOnly?' readonly':'')+'>'+(o.filter?'<span class="search-divider"></span>'+filterTrigger(o):'')+'</form>';}
function filterTrigger(o){if(!Selection)throw Error('A search filter requires components/selection.js to be loaded first');return Selection.dropdown({label:o.filterLabel||'Search filters',variant:'search',disabled:o.disabled});}
function sidebarItem(o={}){const item='<button type="button" class="titan-sidebar-item nav-item'+(o.selected?' active':'')+'"'+(o.selected?' aria-current="page"':'')+(o.disabled?' disabled':'')+(typeof o.expanded==='boolean'?' aria-expanded="'+o.expanded+'"':'')+'><span class="nav-item-icon">'+image(o.icon)+'</span><span class="nav-item-label'+(o.selected?' active':'')+(o.muted?' secondary':'')+'">'+label(o.label)+'</span>'+(o.count!==undefined?'<span class="nav-badge">'+esc(o.count)+'</span>':'')+'</button>';
 if(!o.action)return item;
 // Trailing action: the registered Icon button as a sibling, since a control
 // cannot nest inside the item button. The row owns their arrangement and the
 // selection surface; Icon button keeps its own size, hover and focus contract.
 if(!Actions)throw Error('A sidebar item trailing action requires components/actions.js to be loaded first');
 return '<div class="titan-sidebar-item-row">'+item+Actions.iconButton(o.action)+'</div>';}
function mount(host,kind,o={},handlers={}){const render={searchField,sidebarItem}[kind];if(!render)throw Error('Unknown component');host.innerHTML=render(o);const node=host.firstElementChild,listeners=[];function on(el,event,fn){el.addEventListener(event,fn);listeners.push(()=>el.removeEventListener(event,fn));}
if(kind==='searchField'){const input=node.querySelector('input');on(node,'submit',event=>{event.preventDefault();if(!input.disabled)handlers.search?.(input.value,event);});on(input,'input',event=>handlers.change?.(input.value,event));const filter=node.querySelector('.titan-dropdown-trigger');if(filter)on(filter,'click',event=>{if(!filter.disabled)handlers.filter?.(event);});}else{const item=node.classList.contains('titan-sidebar-item')?node:node.querySelector('.titan-sidebar-item');on(item,'click',event=>{if(!item.disabled)handlers.activate?.(event);});const action=node.querySelector('.titan-icon-button');if(action)on(action,'click',event=>{event.stopPropagation();if(!action.disabled)handlers.action?.(event);});}return ()=>listeners.forEach(fn=>fn());}
return {searchField,sidebarItem,mount};
});
