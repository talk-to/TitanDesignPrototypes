const test=require('node:test'),assert=require('node:assert/strict'),C=require('../components/mini-calendar');
test('dates validate strictly and leap days render in their actual month',()=>{
 assert.throws(()=>C.render({value:'2026-02-29'}));
 assert.match(C.render({value:'2024-02-29'}),/data-date="2024-02-29"[^>]*aria-pressed="true"/);
 assert.match(C.render({value:'2026-12-31'}),/data-date="2027-01-01"/);
});
test('no selection, disabled and long accessible labels are represented safely',()=>{
 const html=C.render({value:null,month:'2026-09',disabled:true,label:'Pick <date>'});
 assert(!html.includes('aria-pressed="true"'));assert(html.includes('Pick &lt;date&gt;'));
 assert.equal((html.match(/ disabled/g)||[]).length,37);
 assert.equal((html.match(/tabindex="0"/g)||[]).length,1);
});
test('calendar day owns its date button states behind documented inputs',()=>{
 assert.throws(()=>C.day({}),/date/);
 assert.throws(()=>C.day({date:'2026-09-09'}),/label/);
 const html=C.day({date:'2026-09-09',label:'Wednesday, September 9, 2026',selected:true,outside:true,focus:true,disabled:true});
 assert(html.includes('titan-calendar-day--outside'));assert(html.includes('aria-pressed="true"'));
 assert(html.includes('tabindex="0"'));assert(html.includes(' disabled'));assert(html.includes('>9</button>'));
});
test('mount updates without emitting and destroy detaches listeners',()=>{
 const listeners=new Map(),host={innerHTML:'',addEventListener:(t,f)=>listeners.set(t,f),removeEventListener:(t,f)=>{if(listeners.get(t)===f)listeners.delete(t);},dispatchEvent:()=>{throw Error('unexpected signal');}};
 const c=C.mount(host,{value:'2026-09-09'});c.update({value:'2026-10-10'});assert(host.innerHTML.includes('October 2026'));assert.equal(listeners.size,2);c.destroy();assert.equal(listeners.size,0);const html=host.innerHTML;c.update({value:'2026-11-11'});assert.equal(host.innerHTML,html);
});
