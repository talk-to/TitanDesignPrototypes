(()=>{const params=new URLSearchParams(location.search),part=params.get('part')||'search-field',host=document.getElementById('examples');if(params.get('gallery')==='1')document.body.dataset.gallery='true';
document.body.dataset.part=part;
const result=document.createElement('p');result.className='result';result.setAttribute('role','status');
const searchIcon='search';
const samples=part==='search-field'?[
['With filters',{label:'Search mail',placeholder:'Search in alex@example.com',filter:true,icon:searchIcon}],
['Search only',{label:'Search mail',placeholder:'Search messages',icon:searchIcon}],
['Disabled',{label:'Search mail',placeholder:'Search messages',icon:searchIcon,filter:true,disabled:true}]
]:[['With count',{label:'Inbox',icon:'inbox',count:18}],['Default',{label:'Sent',icon:'sent'}],['Muted action',{label:'More',icon:'sidebar-more',muted:true,expanded:false}],['With trailing action',{label:'My Contacts',icon:'inbox',action:{icon:'help',label:'About My Contacts',variant:'dark-quiet'}}]];
for(const [caption,options] of samples.filter(([caption])=>!/(disabled|muted)/i.test(caption))){const section=document.createElement('section'),heading=document.createElement('p'),mount=document.createElement('div');heading.className='caption';heading.textContent=caption;if(part==='sidebar-item')mount.className='navigation';section.append(heading,mount);host.append(section);TitanNavigationInput.mount(mount,part==='search-field'?'searchField':'sidebarItem',options,{search:value=>result.textContent=value?'Search: '+value:'Enter a search',filter:()=>result.textContent='Filter action selected',activate:event=>{if(event.currentTarget.hasAttribute('aria-expanded'))event.currentTarget.setAttribute('aria-expanded',String(event.currentTarget.getAttribute('aria-expanded')!=='true'));result.textContent=options.label+' selected';},action:()=>{result.textContent=options.label+' information';}});}host.append(result);
})();
