'use strict';

const $=id=>document.getElementById(id);
const icons=new URL(dsBase+'icons/assets/',location.href).href;
const localAssets=new URL('assets/',location.href).href;
const logo=new URL('../TitanEmailShell/assets/fa36f613-977c-444a-bef5-e1b5f5f1b340.svg',location.href).href;

const contacts=[
  {id:'ishant',initials:'I',name:'ishant.jp@gmail.com',email:'ishant.jp@gmail.com',phone:'09034401875'}
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
    TitanNavigationInput.mount($(host),'sidebarItem',{label,icon:localAssets+icon,selected},{activate:()=>selectView(label)});
  }
  document.querySelectorAll('.nav-entry').forEach(entry=>{
    entry.querySelector('.nav-info').addEventListener('click',()=>announce(`${entry.dataset.view==='my'?'My Contacts':entry.dataset.view==='all'?'All Contacts':'Contact Groups'} information`));
  });
}

function selectView(label){
  document.querySelectorAll('.nav-entry .titan-sidebar-item').forEach(item=>{
    const selected=item.querySelector('.nav-item-label')?.textContent===label;
    item.classList.toggle('active',selected);
    item.querySelector('.nav-item-label')?.classList.toggle('active',selected);
    if(selected)item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current');
  });
  announce(`${label} selected`);
}

function renderRows(){
  const host=$('contact-rows');
  if(!visibleContacts.length){
    host.innerHTML='<div class="empty-state">No contacts match your search.</div>';
    updateSelectAllState();
    return;
  }
  host.innerHTML=visibleContacts.map(contact=>`<div class="contact-row contact-grid" role="row" data-contact-id="${contact.id}">
    <div class="select-cell" role="cell"><span class="row-checkbox"></span></div>
    <div class="name-cell" role="cell"><span class="avatar-host"></span><span class="contact-name">${escapeHtml(contact.name)}</span></div>
    <div class="contact-value" role="cell">${escapeHtml(contact.email)}</div>
    <div class="contact-value" role="cell">${escapeHtml(contact.phone)}</div>
  </div>`).join('');
  host.querySelectorAll('.contact-row').forEach(row=>{
    const contact=contacts.find(item=>item.id===row.dataset.contactId);
    row.querySelector('.avatar-host').innerHTML=TitanAvatar.render({initials:contact.initials,label:contact.name});
    TitanSelection.mount(row.querySelector('.row-checkbox'),'checkbox',{label:`Select ${contact.name}`},{change:updateSelectAllState});
  });
  updateSelectAllState();
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function updateSelectAllState(){
  const all=[...document.querySelectorAll('.row-checkbox input')];
  const checked=all.filter(input=>input.checked).length;
  const selectAll=$('select-all-host input');
  if(!selectAll)return;
  selectAll.checked=all.length>0&&checked===all.length;
  selectAll.indeterminate=checked>0&&checked<all.length;
}

function filterContacts(value){
  const query=String(value||'').trim().toLowerCase();
  visibleContacts=contacts.filter(contact=>[contact.name,contact.email,contact.phone].some(field=>field.toLowerCase().includes(query)));
  renderRows();
}

$('sidebar-header-host').outerHTML=TitanSidebarHeader.render({icon:'app-contacts',logo});
TitanSelection.mount($('account-picker-host'),'dropdown',{label:'ishantp@titan.email',variant:'account'},{open:()=>announce('Account switcher opened')});
renderNav();

TitanActions.mount($('new-contact-host'),'button',{label:'New Contact',variant:'primary'},{main:()=>announce('New contact action selected')});
TitanNavigationInput.mount($('search-host'),'searchField',{label:'Search contacts',placeholder:'Search in ishantp@titan.email',icon:'search-outline'},{change:filterContacts,search:filterContacts});
// Local derived adaptation: reuses the shared Button's Outlined variant and
// owns only the primary-blue treatment needed by the Contacts screen.
const importContactsButton=TitanActions.mount($('import-contacts-host'),'button',{label:'Import contacts',variant:'outlined',icon:localAssets+'import.svg',iconColor:'currentColor'},{main:()=>announce('Import contacts action selected')});
importContactsButton.classList.add('contacts-import-button','titan-button--derived-local-unregistered-primary-outlined');
importContactsButton.setAttribute('data-inspector-variant','Derived from Button · Primary outlined · Local, unregistered');
importContactsButton.setAttribute('data-derived-from','button');
importContactsButton.setAttribute('data-derivation-status','local-unregistered');
importContactsButton.setAttribute('data-derivation-definition','derivations.json');
TitanActions.mount($('export-contacts-host'),'button',{label:'Export contacts',variant:'dark',icon:localAssets+'export.svg',iconColor:'currentColor'},{main:()=>announce('Export contacts action selected')});
TitanSelection.mount($('select-all-host'),'checkbox',{label:'Select all contacts'},{change:checked=>{
  document.querySelectorAll('.row-checkbox input').forEach(input=>{input.checked=checked;});
  updateSelectAllState();
}});
renderRows();
