const test=require('node:test'),assert=require('node:assert/strict'),L=require('../components/app-switcher.js'),P=require('../patterns/app-switcher.js');
test('launcher items are native actions with escaped labels and safe image paths',()=>{const tile=L.appTile({id:'mail',label:'<Mail>',icon:'assets/mail.svg'});assert(tile.startsWith('<button'));assert(tile.includes('&lt;Mail&gt;'));assert.throws(()=>L.appTile({label:'Mail',icon:'javascript:alert(1)'}));const tool=L.launcherItem({id:'tool',label:'Tool',icon:'assets/tool.svg',tone:'pink'});assert(tool.includes('data-launcher-item="tool"'));});
test('switcher composes registered children and keeps menu hidden when closed',()=>{const html=P.render({triggerIcon:'assets/mail.svg',background:'assets/bg.svg',divider:'assets/line.svg',apps:[{id:'mail',label:'Mail',icon:'assets/mail.svg'}],tools:[],footer:[]});assert(html.includes('titan-dropdown-trigger--app'));assert(html.includes('titan-app-tile'));assert(/class="titan-app-switcher__popover"[^>]* hidden/.test(html));assert(html.includes('titan-app-grid'));assert(html.includes('titan-app-switcher-panel'));assert(html.includes('aria-expanded="false"'));});

test('grid renders all apps including partial rows and escapes content',()=>{
 const apps=Array.from({length:11},(_,i)=>({id:String(i),label:'<App '+i+'>',icon:'app-mail'}));
 const html=L.appGrid({apps,selected:'10'});
 assert.equal((html.match(/data-launcher-item=/g)||[]).length,11);
 assert.equal((html.match(/class="app-switcher-row"/g)||[]).length,4);
 assert.equal((html.match(/aria-current="true"/g)||[]).length,1);
 assert(html.includes('&lt;App 10&gt;'));
 assert.throws(()=>L.appGrid({apps,selected:'missing'}),/Unknown selected/);
});
test('standalone panel owns its surface without requiring shell assets or a trigger',()=>{
 const html=L.appSwitcherPanel({apps:[{id:'mail',label:'Mail',icon:'app-mail'}]});
 assert(html.includes('class="app-switcher-bg" aria-hidden="true"'));
 assert(!html.includes('app-switcher-surface.svg'));
 assert(!html.includes('titan-dropdown-trigger'));
 assert(!html.includes('app-switcher-tools'));
 assert(!html.includes('app-switcher-footer'));
});

test('binding owns toggle, selection, outside dismissal and complete listener cleanup',()=>{
 const previous=global.document;
 const listeners=new Map(),docListeners=new Map();let focused=0,chosen=[];
 const trigger={setAttribute(k,v){this[k]=v;},contains(n){return n===this;},focus(){focused++;}};
 const tile={dataset:{launcherItem:'mail'},closest(){return this;},focus(){focused++;}};
 const panel={hidden:true,querySelector(){return tile;}};
 const host={querySelector(s){return s==='.titan-dropdown-trigger'?trigger:panel;},contains(n){return n===trigger||n===tile;},addEventListener(k,f){listeners.set(k,f);},removeEventListener(k,f){if(listeners.get(k)===f)listeners.delete(k);}};
 trigger.closest=()=>null;
 global.document={addEventListener(k,f){docListeners.set(k,f);},removeEventListener(k,f){if(docListeners.get(k)===f)docListeners.delete(k);}};
 try{
  const cleanup=P.bind(host,{select:id=>chosen.push(id)});
  listeners.get('click')({target:trigger});assert.equal(panel.hidden,false);assert.equal(trigger['aria-expanded'],'true');
  listeners.get('keydown')({key:'Escape'});assert.equal(panel.hidden,true);assert(focused>=2);
  listeners.get('click')({target:trigger});listeners.get('click')({target:tile});assert.deepEqual(chosen,['mail']);assert.equal(panel.hidden,true);
  listeners.get('click')({target:trigger});docListeners.get('click')({target:{}});assert.equal(panel.hidden,true);
  cleanup();assert.equal(listeners.size,0);assert.equal(docListeners.size,0);
 }finally{global.document=previous;}
});
