const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../specimens/interactions.js'),'utf8');
test('held states use the original CSS declarations, including imported styles and media conditions',()=>{
 const start=source.indexOf(' function heldRules('),end=source.indexOf(' const style=',start);
 const compile=vm.runInNewContext(source.slice(start,end)+';heldRules');
 const result=compile({cssRules:[{styleSheet:{cssRules:[{selectorText:'.button:hover:not(:disabled)',style:{cssText:'background: var(--hover-bg); transform: scale(1.1);'}}]}},{conditionText:'(prefers-reduced-motion: reduce)',cssRules:[{selectorText:'.button:active',style:{cssText:'transition: none;'}}]},{selectorText:'.input:focus-within',style:{cssText:'outline: 2px solid blue;'}}]});
 assert(result.includes('.button[data-held-hover]:not(:disabled){background: var(--hover-bg); transform: scale(1.1);}'));
 assert(result.includes('@media (prefers-reduced-motion: reduce){.button[data-held-active]{transition: none;}}'));
 assert(result.includes('.input[data-held-focus-within]'));
});
test('interaction targets expose only supported states and independent split actions',()=>{
 const entries=JSON.parse(fs.readFileSync(path.join(__dirname,'../registry.json'))).components;
 const search=entries.find(e=>e.id==='search-field');assert(search.interactions.targets.every(t=>!t.states.includes('hover')));
 const split=entries.find(e=>e.id==='split-button');assert.deepEqual(split.interactions.targets.map(t=>t.id),['default','composer']);
 for(const e of entries){if(!e.interactions){assert.deepEqual(e.states,['default']);continue;}assert(fs.existsSync(path.join(__dirname,'..',e.interactions.preview.split('?')[0])));assert(e.interactions.targets.every(t=>(t.states.length>0||t.previewOnly===true)&&t.owner===e.id));}
});

test('message states belong to the message, not its nested buttons',()=>{
 const entries=JSON.parse(fs.readFileSync(path.join(__dirname,'../registry.json'))).components;
 const message=entries.find(e=>e.id==='message-card');
 assert(message.dependencies.includes('button'));
 assert.deepEqual(message.interactions.targets.map(t=>t.id),['main']);
 assert.deepEqual(message.interactions.targets[0].states,['collapsed','expanded']);
 for(const entry of entries)assert(entry.anatomy.interactionOwnership);
});

test('layout tabs remain reachable without inventing child interaction states',()=>{
 const entries=JSON.parse(fs.readFileSync(path.join(__dirname,'../registry.json'))).components;
 const list=entries.find(e=>e.id==='message-list');
 assert.deepEqual(list.interactions.targets.map(t=>t.name),list.variants);
 assert(list.interactions.targets.every(t=>t.previewOnly&&t.states.length===0));
 assert(entries.find(e=>e.id==='dropdown-trigger').interactions.targets.some(t=>t.id==='account'));
 const icons=entries.find(e=>e.id==='icon-button').interactions.targets.map(t=>t.id);
 assert(icons.includes('dark'));assert(!icons.includes('window'));assert(!icons.includes('dark-compact'));
});
