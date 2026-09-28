(() => {
  const trigger = document.querySelector('#toolbar-sidebar-host button');
  const area = document.querySelector('.content-area');
  const panel = document.createElement('aside');
  panel.id = 'mail-productivity-panel';
  panel.className = 'mail-productivity-panel';
  panel.setAttribute('aria-label', 'Calendar and tasks');
  panel.hidden = true;
  panel.innerHTML = `<header class="productivity-heading"><div id="productivity-tabs"></div><div id="productivity-close"></div></header>
    <section id="productivity-calendar" role="tabpanel" aria-label="Calendar">
      <div class="productivity-date-toolbar"><div id="productivity-month"></div><div id="productivity-prev"></div><div id="productivity-next"></div><div id="productivity-open"></div><div id="productivity-today"></div></div>
      <div class="productivity-week" id="productivity-week"></div>
      <div class="productivity-timezone">GMT +05:30</div>
      <div class="productivity-agenda" id="productivity-agenda"><div class="productivity-hours">${Array.from({length:24},(_,hour)=>`<div class="productivity-hour"><span>${hour%12||12} ${hour<12?'AM':'PM'}</span></div>`).join('')}<div class="productivity-now" hidden></div></div></div>
    </section>
    <section id="productivity-tasks" role="tabpanel" aria-label="Tasks" hidden><p>No tasks yet</p></section>`;
  area.append(panel);
  function setMode(mode) {
    panel.dataset.mode = mode === 'floating' ? 'floating' : 'embedded';
  }
  setMode(new URLSearchParams(location.search).get('right-sidebar'));
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'app-sidebar:productivity-mode') return;
    setMode(event.data.mode);
  });
  trigger.setAttribute('aria-controls', panel.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', 'Open Calendar and Tasks sidebar');
  trigger.title = 'Calendar and Tasks';
  const dateFormat = {timeZone:'Asia/Kolkata'};
  const today = new Date(new Date().toLocaleString('en-US',dateFormat));
  let selected = new Date(today);
  function drawWeek() {
    document.getElementById('productivity-month').innerHTML = TitanSelection.dropdown({label:selected.toLocaleDateString('en-US',{month:'short',year:'numeric'}),variant:'composer',expanded:false});
    const start = new Date(selected); start.setDate(start.getDate()-start.getDay());
    document.getElementById('productivity-week').innerHTML = Array.from({length:7},(_,i)=>{
      const date = new Date(start); date.setDate(start.getDate()+i);
      return `<div class="productivity-week-day"><span>${['S','M','T','W','T','F','S'][i]}</span><span class="productivity-date${date.toDateString()===selected.toDateString()?' is-selected':''}">${date.getDate()}</span></div>`;
    }).join('');
    const now = panel.querySelector('.productivity-now');
    now.hidden = selected.toDateString()!==today.toDateString();
    now.style.top = `${(today.getHours()+today.getMinutes()/60)*52}px`;
  }
  function scrollAgenda() { document.getElementById('productivity-agenda').scrollTop = Math.max(0,today.getHours()-1)*52; }
  function setOpen(open, restoreFocus=false) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded',String(open));
    trigger.setAttribute('aria-label',`${open?'Close':'Open'} Calendar and Tasks sidebar`);
    if(open) {scrollAgenda(); panel.querySelector('[role="tab"][aria-selected="true"]').focus();}
    else if(restoreFocus) trigger.focus();
  }
  trigger.addEventListener('click',()=>setOpen(panel.hidden));
  document.getElementById('productivity-close').innerHTML=TitanActions.iconButton({label:'Close Calendar and Tasks sidebar',icon:'close',iconColor:'currentColor',variant:'compact'});
  // Controls use shared implementations; the page owns panel and date state.
  document.getElementById('productivity-close').addEventListener('click',()=>setOpen(false,true));
  TitanSelection.mount(document.getElementById('productivity-tabs'),'tabs',{label:'Calendar and Tasks',variant:'underline',items:[{id:'calendar',label:'Calendar',panel:'productivity-calendar'},{id:'tasks',label:'Tasks',panel:'productivity-tasks'}]},{change:id=>{
    document.getElementById('productivity-calendar').hidden=id!=='calendar';
    document.getElementById('productivity-tasks').hidden=id!=='tasks';
  }});
  for(const [id,label,icon,action] of [
    ['prev','Previous week','next-arrow',()=>selected.setDate(selected.getDate()-7)],
    ['next','Next week','next-arrow',()=>selected.setDate(selected.getDate()+7)],
    ['today','Today','app-calendar',()=>selected=new Date(today)]
  ]) {
    const host=document.getElementById(`productivity-${id}`);
    host.innerHTML=TitanActions.iconButton({label,icon,iconColor:id!=='today'?'var(--titan-color-grey-800)':undefined,variant:'compact'});
    host.addEventListener('click',()=>{action();drawWeek();});
  }
  document.getElementById('productivity-open').innerHTML = TitanActions.iconButton({label:'Open calendar in new window',icon:'open-in-window',iconColor:'currentColor',variant:'compact'});
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();setOpen(false,true);}});
  drawWeek();
})();
