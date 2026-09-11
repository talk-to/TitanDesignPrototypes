(()=>{
const q=new URLSearchParams(location.search),part=q.get('part')||'app-switcher',state=q.get('state')||'live',target=q.get('target');
const options={...TitanAppSwitcherOptions('mail'),open:state!=='closed'},apps=options.apps,tools=options.tools,footer=options.footer;
const kinds={'app-switcher':'appSwitcher','app-grid':'appGrid','app-switcher-panel':'appSwitcherPanel','app-tile':'appTile','launcher-item':'launcherItem'};
const host=document.getElementById('sample');if(part==='app-switcher'){host.innerHTML=TitanAppSwitcherPattern.render(options);TitanAppSwitcherPattern.bind(host);}else TitanLauncher.mount(host,kinds[part],part==='app-tile'?{...apps[0],selected:state==='selected'}:part==='launcher-item'?(target==='footer'?{...footer[0],variant:'footer'}:tools[0]):options);
if(part==='launcher-item'&&!q.has('state')){
 const first=document.createElement('section');while(host.firstChild)first.append(host.firstChild);host.append(first);
 const caption=document.createElement('p');caption.className='launcher-caption';caption.textContent='Tool';first.prepend(caption);
 const second=document.createElement('section');second.style.marginTop='24px';host.append(second);
 const title=document.createElement('p');title.className='launcher-caption';title.textContent='Supporting link';second.append(title);
 const mount=document.createElement('div');second.append(mount);TitanLauncher.mount(mount,'launcherItem',{...footer[0],variant:'footer'});
}
if(['hover','focus'].includes(state)){
 const control=host.querySelector('button');
 function held(sheet){let css='';try{for(const r of sheet.cssRules){if(r.styleSheet)css+=held(r.styleSheet);else if(r.selectorText&&/:(hover|focus-visible)/.test(r.selectorText))css+=r.selectorText.replace(/:hover/g,'[data-held-hover]').replace(/:focus-visible/g,'[data-held-focus]')+'{'+r.style.cssText+'}';}}catch{}return css;}
 const style=document.createElement('style');style.textContent=[...document.styleSheets].map(held).join('');document.head.append(style);
 if(state==='hover')control.dataset.heldHover='';if(state==='focus')control.dataset.heldFocus='';host.style.pointerEvents='none';host.querySelectorAll('button').forEach(b=>b.tabIndex=-1);
}
})();
