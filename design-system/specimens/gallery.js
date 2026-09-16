/* Catalog-driven scaffolding. Move real examples; never recreate controls. */
(()=>{
 async function setup(){
  if(new URLSearchParams(location.search).get('gallery')!=='1')return;
  const main=document.querySelector('main');if(!main)return;
  try{
   const response=await fetch(new URL('../registry.json',location.href));if(!response.ok)throw Error('Cannot load gallery catalog');
   const catalog=await response.json();
   const entry=[...(catalog.components||[]),...(catalog.compositions||[])].find(entry=>{
    const url=new URL(entry.preview,new URL('../',location.href));
    return url.pathname===location.pathname&&[...url.searchParams].every(([key,value])=>new URLSearchParams(location.search).get(key)===value);
   });if(!entry)return;
   const configs=entry.previewConfigurations?.length?entry.previewConfigurations:[{id:'default',name:'Default'}];
   // Resolve every selector before any wrapper is moved (including nth-child selectors).
   const examples=configs.map(config=>{
    if(!config.selector){if(configs.length!==1)throw Error('Multiple examples need selectors');const source=document.createElement('div');while(main.firstChild)source.append(main.firstChild);main.append(source);return {config,source};}
    const matches=main.querySelectorAll(config.selector);if(matches.length!==1)throw Error('Expected one example for '+config.name);return {config,source:matches[0]};
   });
   const gallery=document.createElement('div');gallery.className='specimen-gallery';gallery.style.setProperty('--gallery-columns',entry.previewLayout?.columns||1);
   for(const {config,source} of examples){
    const width=Math.max(source.getBoundingClientRect().width,source.scrollWidth);
    const cell=document.createElement('div');cell.className='specimen-gallery-cell';cell.dataset.configuration=config.id;
    const caption=source.querySelector(':scope > .caption, :scope > .launcher-caption');caption?.remove();
    const name=document.createElement('p');name.className='specimen-gallery-caption';name.textContent=config.name;
    const content=document.createElement('div');content.className='specimen-gallery-content';
    source.classList.add('specimen-gallery-source');
    if(width>0)source.style.setProperty('--specimen-source-width',width+'px');
    content.append(source);cell.append(name,content);gallery.append(cell);
   }
   main.replaceChildren(gallery);document.body.dataset.gallery='true';main.dataset.galleryReady='true';
  }catch(error){console.error(error);main.dataset.galleryError=error.message;}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
