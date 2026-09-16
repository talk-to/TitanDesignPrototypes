'use strict';

const $=id=>document.getElementById(id);
const localAssets=new URL('assets/',location.href).href;
const logo=new URL('../TitanEmailShell/assets/fa36f613-977c-444a-bef5-e1b5f5f1b340.svg',location.href).href;

const items=[
  {id:'checking',name:'Checking',modified:'Apr 25, 2026',size:'–'}
];
let visibleItems=[...items];
let noticeTimer;

function announce(message){
  const node=$('status-message');
  node.textContent=message;
  node.hidden=false;
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>{node.hidden=true;},2200);
}

function renderNav(){
  const views=[
    ['nav-my-drive','My Drive','my-drive.svg',true],
    ['nav-transfers','Transfers','transfers.svg',false],
    ['nav-branding','Branding','branding.svg',false],
    ['nav-trash','Trash','trash.svg',false]
  ];
  for(const [host,label,icon,selected] of views){
    TitanNavigationInput.mount($(host),'sidebarItem',{label,icon:localAssets+icon,selected},{activate:()=>selectView(label)});
  }
  TitanActions.mount($('nav-footer'),'footerActions',{label:'Feedback and help',items:[
    {id:'feedback',label:'Feedback',icon:localAssets+'feedback.svg'},
    {id:'help',label:'Help',icon:localAssets+'help-outline.svg'}
  ]},{feedback:()=>announce('Feedback selected'),help:()=>announce('Help selected')});
}

function selectView(label){
  document.querySelectorAll('.drive-nav .titan-sidebar-item').forEach(item=>{
    const selected=item.querySelector('.nav-item-label')?.textContent===label;
    item.classList.toggle('active',selected);
    item.querySelector('.nav-item-label')?.classList.toggle('active',selected);
    if(selected)item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current');
  });
  announce(`${label} selected`);
}

// Column contract for the Drive listing. The shared data list owns the tracks,
// column gap, control insets and row separators; this screen owns which columns
// exist and what goes in each cell.
const DRIVE_COLUMNS=[
  {key:'select',role:'control',width:'auto'},
  {key:'name',role:'key',label:'Name',width:'minmax(260px, 1.6fr)'},
  {key:'modified',label:'Date modified',width:'minmax(180px, 1fr)'},
  {key:'size',label:'File size',width:'minmax(140px, 0.7fr)'},
  {key:'actions',role:'control',width:'auto'}
];

function renderRows(){
  const host=$('drive-table');
  host.innerHTML=TitanDataList.list({
    columns:DRIVE_COLUMNS,
    label:'My Drive files',
    emptyText:'Nothing in this folder yet.',
    rows:visibleItems.map(item=>({
      id:item.id,
      cells:{
        select:{slot:true},
        name:{slot:true,text:item.name},
        modified:item.modified,
        size:item.size,
        actions:{slot:true}
      }
    }))
  });
  const selectAll=host.querySelector('[data-slot="head:select"]');
  if(selectAll)TitanSelection.mount(selectAll,'checkbox',{label:'Select all items',size:'large'},{change:toggleSelectAll});
  host.querySelectorAll('.titan-data-list__row').forEach(row=>{
    const item=items.find(entry=>entry.id===row.dataset.rowId);
    if(!item)return;
    // Folder artwork tints from the cell's text colour rather than a fixed hue.
    row.querySelector('[data-slot$=":name"]').innerHTML='<span class="drive-folder-icon">'+TitanIcons.render(localAssets+'folder.svg','currentColor')+'</span>';
    TitanSelection.mount(row.querySelector('[data-slot$=":select"]'),'checkbox',{label:`Select ${item.name}`,size:'large'},{change:updateSelectAllState});
    TitanActions.mount(row.querySelector('[data-slot$=":actions"]'),'iconButton',{label:`More actions for ${item.name}`,icon:'more'},{main:()=>announce(`${item.name} actions`)});
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

function filterItems(value){
  const query=String(value||'').trim().toLowerCase();
  visibleItems=items.filter(item=>item.name.toLowerCase().includes(query));
  renderRows();
}

// The shared App switcher owns the trigger, panel and selected app; Drive only
// supplies the app data and says which app it is on.
$('sidebar-header-host').outerHTML=TitanSidebarHeader.render({logo,trigger:TitanAppSwitcherPattern.render(TitanAppSwitcherOptions('drive'))});
TitanAppSwitcherPattern.bind(document.querySelector('.titan-sidebar-header'),{select:id=>announce(id+' selected')});
renderNav();

TitanActions.mount($('upload-host'),'button',{label:'Upload',variant:'primary',icon:localAssets+'upload.svg',iconColor:'currentColor'},{main:()=>announce('Upload action selected')});
TitanNavigationInput.mount($('search-host'),'searchField',{label:'Search in Drive',placeholder:'Search in Drive',icon:'search-outline'},{change:filterItems,search:filterItems});
TitanSelection.mount($('filters-host'),'dropdown',{label:'Filters',icon:'search-filter'},{open:()=>announce('Filters opened')});
TitanSelection.mount($('account-picker-host'),'dropdown',{label:'ishantp@titan.email',variant:'account-light'},{open:()=>announce('Account switcher opened')});
TitanActions.mount($('new-folder-host'),'button',{label:'New Folder',variant:'outlined-primary',icon:localAssets+'new-folder.svg',iconColor:'currentColor'},{main:()=>announce('New folder action selected')});

renderRows();
