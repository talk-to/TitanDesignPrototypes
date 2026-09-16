(()=>{
'use strict';
const panel=document.getElementById('icon-sidebar');
// The studio auto-sizes this provider's iframe; scrolling happens in its parent.
// Keep the sidebar aligned with the visible parent viewport without changing studio code.
if(window.parent!==window){
 try{
  const frame=window.frameElement,host=window.parent;
  let pending=false;
  const sync=()=>{pending=false;if(!frame?.isConnected)return;const top=frame.getBoundingClientRect().top;panel.style.setProperty('--sidebar-sticky-top',`${Math.max(12,12-top)}px`);panel.style.setProperty('--sidebar-visible-height',`${Math.max(120,host.innerHeight-Math.max(12,top+12)-12)}px`);};
  const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(sync);}};
  host.addEventListener('scroll',schedule,true);host.addEventListener('resize',schedule);
  const observer=new ResizeObserver(schedule);observer.observe(frame);sync();
  window.addEventListener('pagehide',()=>{host.removeEventListener('scroll',schedule,true);host.removeEventListener('resize',schedule);observer.disconnect();},{once:true});
 }catch{/* Standalone sticky positioning remains available across origins. */}
}

const sizes=[24,20,18,16,12],roles={12:'Simple carets and indicators. Detailed artwork needs review.',16:'Search and compact supporting actions.',18:'Sidebar and window controls.',20:'Standard buttons and composer actions.',24:'Larger controls and supporting artwork.'};
const colors=[['neutral','Gray','--titan-text-muted'],['active','Active','--titan-action-primary'],['inverse','Inverse','--titan-text-inverse']];
let selected,color='neutral';
function artwork(icon){let art;if(icon.colorMode==='monochrome'){art=document.createElementNS('http://www.w3.org/2000/svg','svg');art.setAttribute('viewBox','0 0 24 24');art.setAttribute('preserveAspectRatio','xMidYMid meet');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href',icon.src+'#titan-artwork');art.append(use);}else{art=document.createElement('img');art.src=icon.src;art.alt='';}art.setAttribute('aria-hidden','true');if(icon.rotation)art.style.transform=`rotate(${icon.rotation}deg)`;return art;}
function render(){if(!selected)return;const mono=selected.icon.colorMode==='monochrome';panel.dataset.color=mono?color:'neutral';
 panel.querySelectorAll('.size-stage').forEach(stage=>stage.replaceChildren(artwork(selected.icon)));
 panel.querySelectorAll('[data-color]').forEach(b=>{b.disabled=!mono;b.setAttribute('aria-pressed',String(mono&&b.dataset.color===color));});
 document.getElementById('color-token').textContent=mono?colors.find(c=>c[0]===color)[2]:'';document.getElementById('color-note').textContent=mono?'':'Original palette preserved.';
}
for(const n of sizes){const row=document.createElement('li');row.className='size-row';const stage=document.createElement('span');stage.className='size-stage';stage.style.setProperty('--sample-icon-size',`var(--titan-icon-size-${n})`);const info=document.createElement('div');info.className='size-info';const label=document.createElement('span');label.textContent=n+' px';const token=document.createElement('code');token.textContent=`--titan-icon-size-${n}`;info.append(label,token);row.title=roles[n];row.append(stage,info);document.getElementById('size-examples').append(row);}
for(const [mode,label] of colors){const b=document.createElement('button');b.type='button';b.dataset.color=mode;b.className='color-option '+mode;const dot=document.createElement('span');dot.className='color-dot';dot.setAttribute('aria-hidden','true');b.append(dot,document.createTextNode(label));b.onclick=()=>{color=mode;render();};document.getElementById('color-examples').append(b);}
document.addEventListener('titan-icon-selected',event=>{selected=event.detail;document.getElementById('selected-name').textContent=selected.icon.name;document.getElementById('icon-review').textContent=selected.icon.review||'';render();});
document.getElementById('copy-selected-svg').onclick=event=>selected?.copySVG(event.currentTarget);document.getElementById('copy-selected-reference').onclick=event=>selected?.copyReference(event.currentTarget);
})();
