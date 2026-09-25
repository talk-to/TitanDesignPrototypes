(()=>{
 const q=new URLSearchParams(location.search),part=q.get('part'),mode=q.get('state')||'live',target=q.get('target')||'main',host=document.getElementById('sample'),feedback=document.getElementById('feedback');
 document.body.dataset.part=part;document.body.dataset.held=String(mode!=='live');

 const reply='reply',settings='settings';
 const say=()=>{};let control;
 const actions={main:()=>{say('Main action');if(part==='icon-button'){const b=host.querySelector('button');b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));}},secondary:()=>say('Secondary action')};
 if(part==='icon-button'){const toggle=target==='toggle';TitanActions.mount(host,'iconButton',{label:toggle?'Star message':target==='window'?'Close':target==='composer'?'Bold':'Settings',icon:toggle?'star-outline':target==='window'?'close':target==='composer'?'bold':settings,pressedIcon:toggle?'star':undefined,variant:toggle?'toggle':['composer','dark','dark-quiet','compact'].includes(target)?target:undefined,iconColor:toggle||target==='dark'?'currentColor':undefined,size:toggle||['dark','dark-quiet'].includes(target)?undefined:target==='large'?40:32,pressed:mode==='pressed',disabled:mode==='disabled'},actions);}
 else if(part==='button'){const iconVariants={'primary-icon':{label:'New Event',variant:'primary',icon:'add-calendar'},'outlined-primary-icon':{label:'Import contacts',variant:'outlined-primary',icon:'groups'}};const cfg=iconVariants[target]?{...iconVariants[target],iconColor:'currentColor'}:{label:target==='dark'?'Add calendar':target==='primary'?'New Event':target==='outlined'?'Help':target==='outlined-primary'?'Import contacts':target==='toolbar'?'Mark unread':'Reply',iconColor:target==='dark'?'currentColor':undefined,icon:target==='dark'?'add-calendar':['label-only','outlined','primary','outlined-primary'].includes(target)?undefined:target==='toolbar'?'mark-unread':reply,variant:target==='dark'?'dark':target==='primary'?'primary':target==='outlined'?'outlined':target==='outlined-primary'?'outlined-primary':target==='composer'?'composer':target==='toolbar'?'toolbar':undefined};TitanActions.mount(host,'button',{...cfg,disabled:mode==='disabled'},actions);}
 else if(part==='split-button')TitanActions.mount(host,'splitButton',{variant:target.startsWith('composer')?'composer':undefined,label:target.startsWith('composer')?'Send':'New email',icon:target.startsWith('composer')?undefined:'compose',secondaryLabel:'More email actions',disabled:mode==='disabled'},actions);
 else if(part==='half-button'){
  const chevron={icon:'chevron-down',iconColor:'currentColor'};
  const modes={
   'icon-text-left':{side:'left',label:'New email',icon:'compose'},
   'text-left':{side:'left',label:'New email'},
   'icon-left':{side:'left',label:'New email',icon:'compose',labelHidden:true},
   'icon-text-right':{side:'right',label:'More email actions',...chevron},
   'text-right':{side:'right',label:'More email actions'},
   'icon-right':{side:'right',label:'More email actions',labelHidden:true,haspopup:'menu',...chevron},
   'composer-left':{side:'left',label:'Send',size:'composer'},
   'composer-right':{side:'right',label:'Send options',labelHidden:true,haspopup:'menu',size:'composer',...chevron}
  };
  TitanActions.mount(host,'halfButton',{...(modes[target]||modes['icon-text-left']),disabled:mode==='disabled'},actions);
 }
 else if(part==='search-field')TitanNavigationInput.mount(host,'searchField',{label:'Search messages',placeholder:'Search messages',filter:target!=='search-only',disabled:mode==='disabled',readOnly:mode==='read-only'},{change:()=>say(''),search:value=>say(value?'Search: '+value:'Enter a search'),filter:()=>say('Filter action')});
 else if(part==='sidebar-item'){const config={default:{label:'Sent',icon:'sent'},'with-count':{label:'Inbox',icon:'inbox',count:18},'trailing-action':{label:'My Contacts',icon:'inbox',action:{icon:'help',label:'About My Contacts',variant:'dark-quiet',disabled:mode==='disabled'}}}[target]||{label:'Sent',icon:'sent'};TitanNavigationInput.mount(host,'sidebarItem',{...config,selected:mode==='selected',muted:mode==='muted',disabled:mode==='disabled'},{activate:event=>{event.currentTarget.classList.toggle('active');event.currentTarget.querySelector('.nav-item-label').classList.toggle('active');const active=event.currentTarget.classList.contains('active');if(active)event.currentTarget.setAttribute('aria-current','page');else event.currentTarget.removeAttribute('aria-current');say('Inbox selected');}});}
 else if(part==='tab'){control=TitanSelection.mount(host,'tab',{id:'category',label:'Priority',count:25,variant:target==='underline'?'underline':'filled',selected:mode==='selected',tabIndex:0},{activate:()=>{control.update({selected:true});}});}
 else if(part==='tabs')control=TitanSelection.mount(host,'tabs',{label:'Categories',variant:target==='underline'?'underline':'filled',items:[{id:'priority',label:'Priority',count:25},{id:'other',label:'Other',count:50}]},{change:value=>say(value)});
 else if(part==='dropdown-trigger')TitanSelection.mount(host,'dropdown',{label:target==='account'?'alex@example.com':target==='app'?'Switch app':target==='search'?'Search filters':'All mails',variant:target==='account'?'account':target==='account-light'?'account-light':target==='composer'?'composer':target==='app'?'app-switcher':target==='search'?'search':undefined,icon:'app-switcher'},{open:()=>say('Menu content is not defined.')});
 else if(part==='footer-actions')TitanActions.mount(host,'footerActions',{label:'Feedback and settings',items:(target==='one'?[{id:'settings',label:'Settings',icon:'settings'}]:[{id:'bug',label:'Bug',icon:'report-bug'},{id:'feature',label:'Feature',icon:'request-feature'},...(target==='three'?[{id:'settings',label:'Settings',icon:'settings'}]:[])]).map(item=>({...item,disabled:mode==='disabled'}))},{});
 else if(part==='avatar')host.innerHTML=TitanAvatar.render({initials:'AM',label:'Alex Morgan',variant:target==='small'?'small':'default'});
 else if(part==='account-header')TitanAccountHeader.mount(host,{id:'ella',email:'ella.henderson@avontechlabs.com',initials:'E',expanded:mode!=='collapsed'},{});
 else if(part==='data-list-row'){host.innerHTML='<div role="table" aria-label="People">'+TitanDataList.row({id:'ada',columns:[{key:'name',role:'key',width:'minmax(160px,1fr)'},{key:'email',width:'minmax(160px,1fr)'}],cells:{name:'Ada Lovelace',email:'ada.lovelace@titan.email'}})+'</div>';}
 else if(part==='data-list'){const base={columns:[{key:'name',role:'key',label:'Name',width:'minmax(160px,1fr)'},{key:'email',label:'Email',width:'minmax(160px,1fr)'}],label:'People'},rows=[{id:'ada',cells:{name:'Ada Lovelace',email:'ada@titan.email'}},{id:'grace',cells:{name:'Grace Hopper with a very long display name that must clip',email:'grace.hopper@titan.email'}}];host.innerHTML=target==='plain'?TitanDataList.list({head:false,label:'Details',columns:[{key:'label',role:'key',width:'minmax(160px,1fr)'},{key:'value',width:'minmax(160px,1fr)'}],rows:[{id:'r1',cells:{label:'Company',value:'Titan'}},{id:'r2',cells:{label:'Role',value:'Design'}}]}):target==='empty'?TitanDataList.list({...base,rows:[],emptyText:'No contacts match your search.'}):TitanDataList.list({...base,rows});}
 else if(part==='calendar-day'){host.innerHTML='<section class="titan-mini-calendar" style="width:max-content;padding:var(--titan-space-8)" aria-label="Calendar day"><div class="titan-mini-calendar__days" style="grid-template-columns:32px">'+TitanMiniCalendar.day({date:'2026-09-30',label:'Wednesday, September 30, 2026',selected:mode==='selected',outside:mode==='outside',focus:true,disabled:mode==='disabled'})+'</div></section>';}
 else if(part==='checkbox')TitanSelection.mount(host,'checkbox',{label:'Select messages',size:target==='large'?'large':'default',checked:mode==='checked'},{change:value=>say(value?'Selected':'Cleared')});
 else if(part==='message-row')TitanMessages.mount(host,'row',{variant:target==='wide'?'wide':'stacked',id:'alex',sender:'Alex Morgan',subject:'Project roadmap',preview:'Here are the updates for our next release.',time:'10:30 AM',selected:mode==='selected',unread:mode==='unread',starred:mode==='starred',checked:mode==='checked'},{open:(id)=>{const row=host.querySelector('.titan-message-row');row.classList.add('selected');row.querySelector('.titan-message-row__open').setAttribute('aria-current','true');},star:()=>{},check:()=>{}});
 else if(part==='message-list')TitanMessages.mount(host,'list',{variant:target==='wide'?'wide':'stacked',messages:[{id:'alex',sender:'Alex Morgan',subject:'Project roadmap',preview:'Here are the updates for our next release.',time:'10:30 AM',selected:mode==='selected'},{id:'sam',sender:'Sam Rivera',subject:'Design review',preview:'Thanks for sharing the latest direction.',time:'Yesterday',starred:true}]},{open:()=>say('Message opened'),star:(id,on)=>say(on?'Starred':'Unstarred'),check:(id,on)=>say(on?'Checked':'Unchecked')});
 else if(part==='message-card'){
  const options={id:'alex',sender:'Alex Morgan',initials:'AM',recipients:'To: you',time:'Jun 12',preview:'Let’s review the roadmap on Monday.',paragraphs:['Hi team,','Let’s review the roadmap on Monday.'],actions:[{id:'reply',label:'Reply',icon:reply},{id:'forward',label:'Forward'}]};
  let cleanup;
  const render=variant=>{cleanup?.();cleanup=TitanMessages.mount(host,'card',{...options,variant},{expand:()=>render('expanded')});};
  render(mode==='expanded'||(mode==='live'&&target==='expanded')?'expanded':'collapsed');
 }
 if(['icon-button','button'].includes(part)&&['dark','dark-quiet'].includes(target)){host.style.background='#1c1c1c';host.style.padding='12px';}
 if(part==='dropdown-trigger'&&target==='app'){host.style.background='#1c1c1c';host.style.padding='12px';}
 // Selection in Live is caller-owned; blank preview space clears it.
 if(mode==='live'&&part==='message-row'){
  const clear=()=>{host.querySelectorAll('.titan-message-row.selected').forEach(row=>{row.classList.remove('selected');row.querySelector('.titan-message-row__open')?.removeAttribute('aria-current');});};
  document.addEventListener('click',event=>{if(!event.target.closest('.titan-message-row'))clear();});
  window.addEventListener('message',event=>{if(event.source===parent&&event.origin===location.origin&&event.data?.type==='titan-clear-preview-selection')clear();});
 }
 const selectors={
  'tab':'[role=tab]','tabs':'[role=tab]','dropdown-trigger':'button','checkbox':'input','account-header':'button','data-list-row':'.titan-data-list__row','data-list':'.titan-data-list','calendar-day':'.titan-calendar-day',
  'icon-button':'button','button':'button','split-button':target.endsWith('secondary')?'.titan-half-button--right':'.titan-half-button--left',
  'half-button':target.includes('right')?'.titan-half-button--right':'.titan-half-button--left',
  'search-field':'input',
  // Row-level fills belong to the row, as with message-row; focus and disabled
  // stay on the item button that actually owns them.
  'sidebar-item':target==='trailing-action'&&['hover','active'].includes(mode)?'.titan-sidebar-item-row':'button',
  'message-row':mode==='hover'?'.titan-message-row':'.titan-message-row__open',
  'message-list':mode==='hover'?'.titan-message-row':'.titan-message-row__open',
  'message-card':'.titan-message-card'
 };
 control=host.querySelector(selectors[part]||'button');
 if(!control)return;
 if(mode==='disabled')control.disabled=true;
 // Hold pseudo-states using the same declarations from the real stylesheets.
 // Rules are copied only into this disposable specimen, never into product CSS.
 function heldRules(sheet){let output='';try{for(const rule of sheet.cssRules){if(rule.styleSheet)output+=heldRules(rule.styleSheet);else if(rule.selectorText&&/:(hover|active|focus-visible|focus-within)\b/.test(rule.selectorText))output+=rule.selectorText.replace(/:hover\b/g,'[data-held-hover]').replace(/:active\b/g,'[data-held-active]').replace(/:focus-visible\b/g,'[data-held-focus]').replace(/:focus-within\b/g,'[data-held-focus-within]')+'{'+rule.style.cssText+'}';else if(rule.cssRules&&rule.conditionText)output+='@media '+rule.conditionText+'{'+heldRules(rule)+'}';}}catch{}return output;}
 const style=document.createElement('style');style.textContent=[...document.styleSheets].map(heldRules).join('\n');document.head.append(style);
 if(mode==='hover')control.dataset.heldHover='';
 if(mode==='active')control.dataset.heldActive='';
 if(mode==='focus'){control.dataset.heldFocus='';let p=control;while(p&&p!==host.parentElement){p.dataset.heldFocusWithin='';p=p.parentElement;}}
 if(mode!=='live')host.querySelectorAll('button,input').forEach(el=>el.tabIndex=-1);
})();
