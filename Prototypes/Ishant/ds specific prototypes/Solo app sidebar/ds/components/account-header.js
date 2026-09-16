(function(root,factory){const node=typeof module==='object'&&module.exports;const Icons=node?require('../icons/runtime.js'):globalThis.TitanIcons;const Avatar=node?require('./avatar.js'):globalThis.TitanAvatar;const api=factory(Icons,Avatar);if(node)module.exports=api;else root.TitanAccountHeader=api;})(globalThis,function(Icons,Avatar){
'use strict';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function required(value,what){if(typeof value!=='string'||!value.trim())throw Error(what);return esc(value.trim());}

function render(o={}){
  const email=required(o.email,'Account email required');
  required(o.initials,'Account initials required');
  const expanded=o.expanded===undefined?true:!!o.expanded;
  // Select the registered small Avatar variant; the header owns only its placement.
  const avatar='<span class="titan-account-header__avatar">'+Avatar.render({initials:o.initials,decorative:true,variant:'small'})+'</span>';
  return '<button type="button" class="titan-account-header" data-action="'+esc(o.id??'account')+'" aria-expanded="'+expanded+'"'+(o.disabled?' disabled':'')+'>'
   +'<span class="titan-account-header__chevron">'+Icons.render('chevron-down','currentColor')+'</span>'
   +'<span class="titan-account-header__identity">'+avatar
   +'<span class="titan-account-header__email">'+email+'</span>'
   +'</span></button>';
}

function mount(host,o={},callbacks={}){
  host.innerHTML=render(o);
  const node=host.firstElementChild;
  const click=event=>{if(node.disabled)return;const next=node.getAttribute('aria-expanded')!=='true';node.setAttribute('aria-expanded',String(next));callbacks.toggle?.(next,event);};
  node.addEventListener('click',click);
  return {node,destroy(){node.removeEventListener('click',click);}};
}
return {render,mount};
});
