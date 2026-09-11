(()=>{
 const kind=new URLSearchParams(location.search).get('part')||'icon-button';
 document.body.dataset.part=kind;
 const gallery=new URLSearchParams(location.search).get('gallery')==='1';
 if(gallery)document.body.dataset.gallery='true';

 const settings='settings',reply='reply',compose='compose';
 const choices={
 'icon-button':[['Default · 32px','iconButton',{label:'Settings',icon:settings}],['Default · 40px','iconButton',{label:'Settings',icon:settings,size:40}],['Pressed','iconButton',{label:'Settings',icon:settings,pressed:true}],['Disabled','iconButton',{label:'Settings',icon:settings,disabled:true}]],
 'button':[['Default · With icon','button',{label:'Reply',icon:reply}],['Default · Label only','button',{label:'Reply'}],['Toolbar','button',{label:'Mark unread',icon:'mark-unread',variant:'toolbar'}],['Disabled','button',{label:'Reply',icon:reply,disabled:true}]],
 'split-button':[['Default','splitButton',{label:'New email',secondaryLabel:'More email actions',icon:compose}],['Secondary disabled','splitButton',{label:'New email',secondaryLabel:'More email actions',icon:compose,secondaryDisabled:true}],['Disabled','splitButton',{label:'New email',secondaryLabel:'More email actions',icon:compose,disabled:true}]]};
 choices['icon-button'].push(['Composer','iconButton',{label:'Bold',icon:'bold',variant:'composer'}]);
 choices['icon-button'].push(['Compact','iconButton',{label:'Previous week',icon:'next-arrow',iconColor:'currentColor',variant:'compact'}]);
 choices['icon-button'].push(['Dark','iconButton',{label:'Next month',icon:'next-arrow',iconColor:'currentColor',variant:'dark'}]);
 choices['icon-button'].push(['Dark quiet','iconButton',{label:'About Inbox',icon:'help',variant:'dark-quiet'}]);
 choices['icon-button'].push(['Icon toggle','iconButton',{label:'Star message',icon:'star-outline',pressedIcon:'star',variant:'toggle',pressed:false,iconColor:'currentColor'}],['Icon toggle · On','iconButton',{label:'Star message',icon:'star-outline',pressedIcon:'star',variant:'toggle',pressed:true,iconColor:'currentColor'}]);
 choices['button'].push(['Dark','button',{label:'Add calendar',variant:'dark',icon:'add-calendar',iconColor:'currentColor'}]);
 choices['button'].push(['Primary','button',{label:'New Event',variant:'primary'}],['Primary · With icon','button',{label:'New Event',variant:'primary',icon:'add-calendar',iconColor:'currentColor'}],['Outlined','button',{label:'Help',variant:'outlined'}],['Outlined primary','button',{label:'Import contacts',variant:'outlined-primary'}],['Outlined primary · With icon','button',{label:'Import contacts',variant:'outlined-primary',icon:'groups',iconColor:'currentColor'}],['Composer','button',{label:'Track',icon:'track',variant:'composer'}]);
 choices['split-button'].push(['Composer','splitButton',{label:'Send',secondaryLabel:'Send options',variant:'composer'}]);
 const examples=(choices[kind]||choices['icon-button']).filter(([caption])=>!/(pressed|disabled)/i.test(caption));
 for(const [caption,type,opts] of examples){
  const group=document.createElement('div');group.className='example';const label=document.createElement('span');label.className='caption';label.textContent=caption;const host=document.createElement('div');host.className='mount';group.append(label,host);document.getElementById('examples').append(group);
  if(opts.variant==='dark'){host.style.background='var(--titan-surface-navigation)';host.style.padding='var(--titan-space-12)';}
  TitanActions.mount(host,type,opts,{main:event=>{if(typeof opts.pressed==='boolean'){const b=event.currentTarget;b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));}document.getElementById('result').textContent='Main action selected';},secondary:()=>{document.getElementById('result').textContent='Secondary action selected';}});
 }
})();
