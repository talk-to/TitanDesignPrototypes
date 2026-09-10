'use strict';
const $=id=>document.getElementById(id);
const referenceDate=new Date(2026,8,9), days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const selected=new Date(referenceDate),visible=true;
const events=[{id:1,title:'Design Sync',date:'2026-09-09',start:'13:00',end:'13:45'},{id:2,title:'Salary Structure Changes',date:'2026-09-09',start:'15:00',end:'15:45'}];
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const monthText=d=>d.toLocaleDateString('en-US',{month:'long',year:'numeric'});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const minutes=s=>Number(s.slice(0,2))*60+Number(s.slice(3));
const timeText=s=>{const h=Number(s.slice(0,2));return `${h%12||12}:${s.slice(3)} ${h<12?'AM':'PM'}`;};
function render(){
 const start=new Date(selected);start.setDate(start.getDate()-start.getDay());
 $('current-month').textContent=monthText(selected);
 const dates=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d;});
 $('day-headers').innerHTML='<div class="timezone">Asia/Calcutta<br>GMT+05:30</div>'+dates.map(d=>`<div class="day-header ${dateKey(d)===dateKey(referenceDate)?'today':''}">${days[d.getDay()]}<strong>${d.getDate()}</strong></div>`).join('');
 $('all-day').innerHTML='<div></div>'+dates.map(d=>`<div class="${dateKey(d)===dateKey(referenceDate)?'today-column':''}"></div>`).join('');
 $('time-grid').innerHTML='<div class="time-labels">'+Array.from({length:15},(_,i)=>`<div class="time-label">${(i+9)%12||12} ${i+9<12?'AM':'PM'}</div>`).join('')+'</div>'+dates.map(d=>`<div class="day-column ${dateKey(d)===dateKey(referenceDate)?'today-column':''}" data-date="${dateKey(d)}">${visible?events.filter(e=>e.date===dateKey(d)).map(e=>`<button class="event" data-event="${e.id}" style="top:calc(var(--calendar-hour) * ${(minutes(e.start)-540)/60} + 2px);height:calc(var(--calendar-hour) * ${(minutes(e.end)-minutes(e.start))/60} - 2px)" aria-label="${esc(e.title)}, ${timeText(e.start)} to ${timeText(e.end)}"><span class="event-title">${esc(e.title)}</span><span class="event-time">${timeText(e.start)} - ${timeText(e.end)}</span></button>`).join(''):''}${dateKey(d)===dateKey(referenceDate)?'<div class="now" aria-label="Current time: 5 PM"></div>':''}</div>`).join('');
}
// Render shared controls once, without handlers. This is a static screenshot study.
$('new-event').innerHTML=TitanActions.button({label:'New Event',variant:'primary'});
$('today').innerHTML=TitanActions.button({label:'Today',variant:'outlined'});
$('help').innerHTML=TitanActions.button({label:'Help',variant:'outlined'});
for(const [id,label,icon] of [['previous-week','Previous week','next-arrow'],['next-week','Next week','next-arrow'],['settings','Settings','settings']]){
 $(id).innerHTML=TitanActions.iconButton({label,icon,iconColor:'currentColor',variant:id.endsWith('-month')?'dark':id.endsWith('-week')?'compact':undefined});
 if(id.startsWith('previous'))$(id).classList.add('previous');
}
$('view-picker').innerHTML=TitanSelection.dropdown({label:'Week'});
$('sidebar-header-host').outerHTML=TitanSidebarHeader.render({appSwitcher:TitanAppSwitcherOptions('calendar'),logo:'../TitanEmailShell/assets/fa36f613-977c-444a-bef5-e1b5f5f1b340.svg'});
TitanSidebarHeader.bind(document.querySelector('.titan-sidebar-header'));
$('calendar-checkbox').innerHTML=TitanSelection.checkbox({label:'ishant@titan.email calendar',checked:true});
$('calendar-checkbox').setAttribute('inert','');
render();

$('account-picker-host').outerHTML=TitanSelection.dropdown({label:'ishant@titan.email',variant:'account'}).replace('<button ', '<button id="account-picker" ');

// Component-local selection is live; its output is intentionally not wired to the week grid.
const miniCalendar=TitanMiniCalendar.mount($('mini-calendar-host'),{value:'2026-09-09',month:'2026-09'});
$('add-calendar-host').innerHTML=TitanActions.button({label:'Add calendar',variant:'dark',icon:'add-calendar',iconColor:'currentColor'});
$('add-calendar-host').firstElementChild.id='add-calendar';
