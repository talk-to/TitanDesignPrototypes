(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TitanAvatar=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(o={}){if(typeof o.initials!=='string'||!o.initials.trim())throw Error('Avatar initials are required');if(!o.decorative&&(typeof o.label!=='string'||!o.label.trim()))throw Error('Non-decorative avatar requires a label');const variant=o.variant??'default';if(!['default','small'].includes(variant))throw Error('Unsupported Avatar variant');return '<span class="titan-avatar'+(variant==='small'?' titan-avatar--small':'')+'" data-inspector-variant="'+variant+'" '+(o.decorative?'aria-hidden="true"':'role="img" aria-label="'+esc(o.label)+'"')+'>'+esc(o.initials.trim())+'</span>';}
return {render};
});
