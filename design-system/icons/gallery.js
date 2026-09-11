(async()=>{
'use strict';
const grid=document.getElementById('grid'),nav=document.querySelector('nav'),search=document.querySelector('input[type=search]'),status=document.getElementById('status');
let category='All',timer,selectedId=null;
const feedbackTimers=new WeakMap();
function feedback(target,message){if(!target)return;target.dataset.feedback=message;clearTimeout(feedbackTimers.get(target));feedbackTimers.set(target,setTimeout(()=>delete target.dataset.feedback,4000));}
function announce(message){status.textContent=message;clearTimeout(timer);timer=setTimeout(()=>status.textContent='',2500)}
async function copy(text){try{await navigator.clipboard.writeText(text)}catch{const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;left:-9999px';document.body.append(field);field.select();const success=document.execCommand('copy');field.remove();if(!success)throw Error('Copy failed')}}
try{
const response=await fetch('catalog.json');if(!response.ok)throw Error('Unable to load icons');const icons=await response.json();
const tagHost=document.createElement('details');const tagSummary=document.createElement('summary');tagSummary.textContent='Search tags';tagHost.append(tagSummary);document.getElementById('icon-sidebar').append(tagHost);
const tagForm=document.createElement('div');tagHost.append(tagForm);
document.addEventListener('titan-icon-selected',event=>{tagForm.replaceChildren();StudioTagEditor.mount(tagForm,event.detail.icon,'icon-assets');});
StudioGroupReference.mount(document.querySelector('h1'),()=>StudioGroupReference.reference('Iconography','icons',icons,'design-system/icons/catalog.json'));
const selectedIcons=new Set();
const selectionBar=document.createElement('section');selectionBar.id='icon-selection-bar';selectionBar.hidden=true;selectionBar.setAttribute('aria-label','Selected icons');
selectionBar.innerHTML='<span id="icon-selection-count" role="status" aria-live="polite"></span><button type="button" id="copy-icon-selection">Copy references</button><button type="button" id="clear-icon-selection" aria-label="Clear icon selection">×</button>';
document.body.append(selectionBar);
const batchCopy=selectionBar.querySelector('#copy-icon-selection');
function positionSelectionBar(){
 if(selectionBar.hidden)return;
 try{if(window.parent!==window&&window.frameElement){const r=window.frameElement.getBoundingClientRect();selectionBar.style.top=Math.max(8,Math.min(innerHeight-selectionBar.offsetHeight-16,window.parent.innerHeight-r.top-selectionBar.offsetHeight-16))+'px';selectionBar.style.bottom='auto';}}
 catch{}
}
let selectionFrame=0;
const queueSelectionPosition=()=>{if(!selectionFrame)selectionFrame=requestAnimationFrame(()=>{selectionFrame=0;positionSelectionBar();});};
const selectionResize=new ResizeObserver(queueSelectionPosition);selectionResize.observe(selectionBar);
try{if(window.frameElement)selectionResize.observe(window.frameElement);}catch{}
window.addEventListener('pagehide',()=>selectionResize.disconnect(),{once:true});
window.addEventListener('resize',queueSelectionPosition);
try{if(window.parent!==window){window.parent.addEventListener('scroll',queueSelectionPosition,true);window.parent.addEventListener('resize',queueSelectionPosition);window.addEventListener('pagehide',()=>{window.parent.removeEventListener('scroll',queueSelectionPosition,true);window.parent.removeEventListener('resize',queueSelectionPosition);if(selectionFrame)cancelAnimationFrame(selectionFrame);},{once:true});}}catch{}
function syncSelection(){
 grid.querySelectorAll('.tile').forEach(b=>{const picked=selectedIcons.has(b.dataset.iconId);b.classList.toggle('is-multi-selected',picked);b.setAttribute('aria-pressed',String(selectedIcons.size?picked:b.dataset.iconId===selectedId));});
 selectionBar.hidden=!selectedIcons.size;
 selectionBar.querySelector('#icon-selection-count').textContent=selectedIcons.size+' icon'+(selectedIcons.size===1?'':'s')+' selected';
 batchCopy.textContent='Copy references';positionSelectionBar();
}
selectionBar.querySelector('#clear-icon-selection').onclick=()=>{selectedIcons.clear();syncSelection();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selectedIcons.size){selectedIcons.clear();syncSelection();}});
batchCopy.onclick=async()=>{const selected=[...selectedIcons].map(id=>icons.find(icon=>icon.id===id)).filter(Boolean);if(!selected.length)return;const text=['Design-system icon references: use these icons together as context for my request. Check all connected usages before changing their shared assets.','Catalog: design-system/icons/catalog.json',...selected.map((icon,i)=>`\n${i+1}. ${icon.name}\nID: ${icon.id}\nAsset: design-system/icons/${icon.src}`)].join('\n');try{await copy(text);batchCopy.textContent='References copied';announce('Copied '+selected.length+' icon references');}catch{batchCopy.textContent='Copy failed — retry';}};

for(const label of ['All',...new Set(icons.map(icon=>icon.category))]){const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(label===category));button.onclick=()=>{category=label;nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render()};nav.append(button)}
function render(){grid.replaceChildren();const query=search.value.trim().toLowerCase();const filtered=icons.filter(i=>(category==='All'||category===i.category)&&StudioModel.searchScore(StudioModel.searchMetadata(i),query));filtered.sort((a,b)=>StudioModel.searchScore(StudioModel.searchMetadata(b),query)-StudioModel.searchScore(StudioModel.searchMetadata(a),query));document.getElementById('empty').hidden=!!filtered.length;
for(const group of [...new Set(filtered.map(icon=>icon.category))]){const section=document.createElement('section');section.className='icon-section';const heading=document.createElement('h2');heading.textContent=group;StudioGroupReference.mount(heading,()=>StudioGroupReference.reference(group,'icons',icons.filter(icon=>icon.category===group),'design-system/icons/catalog.json'));const items=document.createElement('div');items.className='icon-group';section.append(heading,items);grid.append(section);
for(const icon of filtered.filter(icon=>icon.category===group)){const tile=document.createElement('div');tile.className='tile-wrap';const button=document.createElement('button');button.type='button';button.className='tile';button.title='Copy '+icon.name+' reference · Shift-click to add or remove from selection';button.setAttribute('aria-label','Copy '+icon.name+' reference');const art=document.createElement('span');art.className='art '+(icon.colorMode==='monochrome'?'monochrome ':'')+icon.background+(icon.kind==='app-artwork'?' app':'');const img=icon.colorMode==='monochrome'?document.createElementNS('http://www.w3.org/2000/svg','svg'):document.createElement('img');if(icon.colorMode==='monochrome'){img.setAttribute('viewBox','0 0 24 24');img.setAttribute('preserveAspectRatio','xMidYMid meet');img.setAttribute('aria-hidden','true');img.classList.add('titan-icon');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href',icon.src+'#titan-artwork');img.append(use);}else{img.src=icon.src;img.alt='';}if(icon.rotation)img.style.transform=`rotate(${icon.rotation}deg)`;art.append(img);const name=document.createElement('span');name.className='name';name.textContent=icon.name;const glyph=document.createElement('button');glyph.type='button';glyph.className='copy';glyph.title='Copy '+icon.name+' SVG';glyph.setAttribute('aria-label',glyph.title);glyph.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M3 11H2V2h9v1"/></svg>';button.append(art,name);const copySVG=async(target=glyph)=>{feedback(target,'Copying…');try{const response=await fetch(icon.src);if(!response.ok)throw Error('Unable to load SVG');await copy(await response.text());feedback(target,'SVG copied');announce('Copied '+icon.name+' SVG')}catch{feedback(target,'Copy failed — retry');announce('Could not copy SVG. Please try again.')}};glyph.onclick=event=>{event.stopPropagation();copySVG(glyph)};const copyReference=async(target=button)=>{feedback(target,'Copying…');const text=`Design-system icon reference: use this icon as context for my request. Check usages before changing its shared DS asset.\nIcon: ${icon.name}\nID: ${icon.id}\nAsset: design-system/icons/${icon.src}\nCatalog: design-system/icons/catalog.json`;try{await copy(text);feedback(target,'Reference copied');announce('Copied '+icon.name+' reference')}catch{feedback(target,'Copy failed — retry');announce('Could not copy. Please try again.')}};button.dataset.iconId=icon.id;button.setAttribute('aria-pressed',String(selectedId===icon.id));const selectIcon=()=>{selectedId=icon.id;grid.querySelectorAll('.tile').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.dispatchEvent(new CustomEvent('titan-icon-selected',{detail:{icon,copyReference,copySVG}}));};button.onclick=event=>{if(event.shiftKey){if(selectedIcons.has(icon.id))selectedIcons.delete(icon.id);else selectedIcons.add(icon.id);selectIcon();syncSelection();}else{selectedIcons.clear();selectIcon();syncSelection();copyReference();}};tile.append(button,glyph);items.append(tile);if(selectedId===icon.id||selectedId===null)selectIcon()}}syncSelection();}
let searchTimer;search.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(render,120);});render();
const dialog=document.getElementById('import-dialog'),form=document.getElementById('import-form'),source=document.getElementById('icon-svg'),preview=document.getElementById('import-preview'),error=document.getElementById('import-error'),save=document.getElementById('save-icon'),select=document.getElementById('icon-category');
for(const group of [...new Set(icons.map(i=>i.category))]){const option=document.createElement('option');option.value=option.textContent=group;select.append(option)}
let normalized='',previewURL;
// Native dialogs center in their own document viewport. In the auto-height
// studio iframe, translate the visible outer viewport into this document first.
function positionImportDialog(){
 let top=innerHeight/2,left=innerWidth/2,height=innerHeight;
 try{if(window.parent!==window&&window.frameElement){const r=window.frameElement.getBoundingClientRect();height=window.parent.innerHeight;top=height/2-r.top;const halfWidth=Math.min(440,innerWidth-32)/2;left=Math.max(halfWidth+16,Math.min(innerWidth-halfWidth-16,window.parent.innerWidth/2-r.left));}}
 catch{}
 dialog.style.setProperty('--import-center-y',top+'px');
 dialog.style.setProperty('--import-center-x',left+'px');
 dialog.style.setProperty('--import-max-height',Math.max(120,height-32)+'px');
}
let importFrame=0;
const queueImportPosition=()=>{if(dialog.open&&!importFrame)importFrame=requestAnimationFrame(()=>{importFrame=0;positionImportDialog();});};
window.addEventListener('resize',queueImportPosition);
try{if(window.parent!==window){window.parent.addEventListener('scroll',queueImportPosition,true);window.parent.addEventListener('resize',queueImportPosition);window.addEventListener('pagehide',()=>{window.parent.removeEventListener('scroll',queueImportPosition,true);window.parent.removeEventListener('resize',queueImportPosition);if(importFrame)cancelAnimationFrame(importFrame);},{once:true});}}catch{}
document.getElementById('add-icon').onclick=()=>{positionImportDialog();dialog.showModal();positionImportDialog();};document.getElementById('cancel-import').onclick=()=>dialog.close();
source.addEventListener('input',()=>{
 normalized='';save.disabled=true;preview.replaceChildren();if(previewURL)URL.revokeObjectURL(previewURL);
 try{
  const doc=new DOMParser().parseFromString(source.value,'image/svg+xml'),svg=doc.documentElement;
  if(doc.querySelector('parsererror')||svg.localName!=='svg')throw Error('Paste valid SVG markup.');
  if(/<!DOCTYPE|<!ENTITY/i.test(source.value))throw Error('SVG document declarations are not supported.');
  const box=(svg.getAttribute('viewBox')||'').trim().split(/[ ,]+/).map(Number);
  if(box.length!==4||box.some(v=>!Number.isFinite(v))||box[2]<=0||box[3]<=0)throw Error('Include a valid viewBox in your SVG export.');
  if(Math.abs(box[2]-box[3])>0.001)throw Error('Use a square canvas. Export the full frame, not cropped artwork.');
  const tags=new Set('svg g path rect circle ellipse line polyline polygon defs linearGradient radialGradient stop clipPath mask title desc'.split(' '));
  const attrs=new Set('xmlns viewBox width height x y x1 y1 x2 y2 cx cy r rx ry d points fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset stroke-opacity opacity transform id clip-path clip-rule mask offset stop-color stop-opacity gradientUnits gradientTransform spreadMethod preserveAspectRatio'.split(' '));
  for(const el of [svg,...svg.querySelectorAll('*')]){
   if(!tags.has(el.localName))throw Error('Use vector shapes only. Unsupported element: '+el.localName);
   if(el.hasAttribute('style')){for(const prop of el.style){if(attrs.has(prop)&&!el.hasAttribute(prop))el.setAttribute(prop,el.style.getPropertyValue(prop));}el.removeAttribute('style');}
   for(const attr of [...el.attributes]){if(!attrs.has(attr.name)){if(['class','version','overflow'].includes(attr.name)){el.removeAttribute(attr.name);continue;}throw Error('Unsupported SVG attribute: '+attr.name);}if(/url\(/i.test(attr.value)&&!/^url\(#[\w-]+\)$/.test(attr.value))throw Error('External references are not supported.');}
  }
  svg.setAttribute('width','24');svg.setAttribute('height','24');svg.setAttribute('x','0');svg.setAttribute('y','0');svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  normalized='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" preserveAspectRatio="xMidYMid meet">'+new XMLSerializer().serializeToString(svg)+'</svg>';
  previewURL=URL.createObjectURL(new Blob([normalized],{type:'image/svg+xml'}));const img=document.createElement('img');img.src=previewURL;img.alt='Normalized icon preview';preview.append(img);error.textContent=box[2]+' × '+box[3]+' → 24 × 24 · proportions and padding preserved';save.disabled=false;
 }catch(e){error.textContent=e.message;}
});
form.addEventListener('submit',async e=>{e.preventDefault();if(!normalized)return;save.disabled=true;try{const response=await fetch('/api/icons',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('icon-name').value,category:select.value,svg:normalized})});const entry=await response.json();if(!response.ok)throw Error(entry.error||'Unable to save icon');icons.push(entry);category='All';nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent==='All')));search.value='';render();dialog.close();form.reset();preview.replaceChildren();normalized='';announce('Added '+entry.name);}catch(e){error.textContent=e.message;save.disabled=false;}});

}catch(error){document.getElementById('empty').hidden=false;document.getElementById('empty').textContent=error.message}
})();
