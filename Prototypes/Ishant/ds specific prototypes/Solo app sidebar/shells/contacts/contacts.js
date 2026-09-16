'use strict';

const $=id=>document.getElementById(id);
const icons=new URL(dsBase+'icons/assets/',location.href).href;
const localAssets=new URL('assets/',location.href).href;
const logo=new URL('../mail/assets/fa36f613-977c-444a-bef5-e1b5f5f1b340.svg',location.href).href;

const contacts=[
  {id:'ishant',initials:'I',name:'ishant.jp@gmail.com',email:'ishant.jp@gmail.com',phone:'09034401875'},
  {id:'ada',initials:'AL',name:'Ada Lovelace',email:'ada.lovelace@titan.email',phone:'09811204413'},
  {id:'grace',initials:'GH',name:'Grace Hopper',email:'grace.hopper@titan.email',phone:'09765330128'},
  {id:'alan',initials:'AT',name:'Alan Turing',email:'alan.turing@titan.email',phone:'09920145577'},
  {id:'radia',initials:'RP',name:'Radia Perlman',email:'radia.perlman@titan.email',phone:'09604471290'},
  {id:'karen',initials:'KS',name:'Karen Spärck Jones',email:'karen.sparck.jones@titan.email',phone:'09143398021'}
];
let visibleContacts=[...contacts];
let noticeTimer;

function announce(message){
  const node=$('status-message');
  node.textContent=message;
  node.hidden=false;
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>{node.hidden=true;},2200);
}

function renderNav(){
  const items=[
    ['nav-my-contacts','My Contacts','contacts.svg',true],
    ['nav-all-contacts','All Contacts','all-contacts.svg',false],
    ['nav-contact-groups','Contact Groups','contact-groups.svg',false]
  ];
  for(const [host,label,icon,selected] of items){
    TitanNavigationInput.mount($(host),'sidebarItem',{
      label,icon:localAssets+icon,selected,
      action:{icon:localAssets+'info.svg',label:`About ${label}`,variant:'dark-quiet'}
    },{activate:()=>selectView(label),action:()=>announce(`${label} information`)});
  }
}

function selectView(label){
  document.querySelectorAll('.contacts-nav .titan-sidebar-item').forEach(item=>{
    const selected=item.querySelector('.nav-item-label')?.textContent===label;
    item.classList.toggle('active',selected);
    item.querySelector('.nav-item-label')?.classList.toggle('active',selected);
    if(selected)item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current');
  });
  announce(`${label} selected`);
}

// Column contract for the contacts table. The shared data list owns the tracks,
// column gap, cell insets and row rhythm; this screen owns which columns exist
// and their content.
const CONTACT_COLUMNS=[
  {key:'select',role:'control',width:'auto'},
  {key:'name',role:'key',label:'Name',width:'minmax(240px, 1.35fr)'},
  {key:'email',label:'Email',width:'minmax(220px, 1fr)'},
  {key:'phone',label:'Phone',width:'minmax(190px, 1fr)'}
];

function renderRows(){
  const host=$('contact-table');
  host.innerHTML=TitanDataList.list({
    columns:CONTACT_COLUMNS,
    label:'My contacts',
    emptyText:'No contacts match your search.',
    rows:visibleContacts.map(contact=>({
      id:contact.id,
      cells:{
        select:{slot:true},
        name:{slot:true,text:contact.name},
        email:contact.email,
        phone:contact.phone
      }
    }))
  });
  // Fill the head control slot with select-all, then each row's slots with the
  // shared avatar and checkbox instances.
  const selectAll=host.querySelector('[data-slot="head:select"]');
  if(selectAll)TitanSelection.mount(selectAll,'checkbox',{label:'Select all contacts',size:'large'},{change:toggleSelectAll});
  host.querySelectorAll('.titan-data-list__row').forEach(row=>{
    const contact=contacts.find(item=>item.id===row.dataset.rowId);
    if(!contact)return;
    row.querySelector('[data-slot$=":name"]').innerHTML=TitanAvatar.render({initials:contact.initials,label:contact.name});
    TitanSelection.mount(row.querySelector('[data-slot$=":select"]'),'checkbox',{label:`Select ${contact.name}`,size:'large'},{change:updateSelectAllState});
  });
  updateSelectAllState();
}

const rowCheckboxes=()=>[...document.querySelectorAll('.titan-data-list__row [data-slot$=":select"] input')];
const selectAllCheckbox=()=>document.querySelector('.titan-data-list__head [data-slot$=":select"] input');

function toggleSelectAll(checked){
  rowCheckboxes().forEach(input=>{input.checked=checked;});
  updateSelectAllState();
}

function updateSelectAllState(){
  const all=rowCheckboxes();
  const checked=all.filter(input=>input.checked).length;
  const selectAll=selectAllCheckbox();
  if(!selectAll)return;
  selectAll.checked=all.length>0&&checked===all.length;
  selectAll.indeterminate=checked>0&&checked<all.length;
}

function filterContacts(value){
  const query=String(value||'').trim().toLowerCase();
  visibleContacts=contacts.filter(contact=>[contact.name,contact.email,contact.phone].some(field=>field.toLowerCase().includes(query)));
  renderRows();
}

$('sidebar-header-host').outerHTML=TitanSidebarHeader.render({trigger:TitanAppSwitcherPattern.render(TitanAppSwitcherOptions('contacts')),logo});
TitanAppSwitcherPattern.bind(document.querySelector('.titan-sidebar-header'));
TitanSelection.mount($('account-picker-host'),'dropdown',{label:'ishantp@titan.email',variant:'account'},{open:()=>announce('Account switcher opened')});
renderNav();

TitanActions.mount($('new-contact-host'),'button',{label:'New Contact',variant:'primary'},{main:()=>announce('New contact action selected')});
TitanNavigationInput.mount($('search-host'),'searchField',{label:'Search contacts',placeholder:'Search in ishantp@titan.email',icon:'search-outline'},{change:filterContacts,search:filterContacts});
TitanActions.mount($('import-contacts-host'),'button',{label:'Import contacts',variant:'outlined-primary',icon:localAssets+'import.svg',iconColor:'currentColor'},{main:()=>announce('Import contacts action selected')});
TitanNavigationInput.mount($('export-contacts-host'),'sidebarItem',{label:'Export contacts',icon:localAssets+'export.svg'},{activate:()=>announce('Export contacts action selected')});
renderRows();
