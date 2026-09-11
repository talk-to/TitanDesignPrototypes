'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../components/composer');
test('composer reuses shared controls, preserves actions and escapes sender text',()=>{
 const html=C.emailComposer({from:'<img onerror=alert(1)>'});
 for(const cls of ['titan-icon-button','titan-button--composer','titan-split-button--composer','titan-dropdown-trigger--composer','titan-formatting-toolbar','titan-composer-field'])assert(html.includes(cls));
 for(const action of ['Image','Emoji','Signature','Bookings','HTML','Attachment','Drive'])assert(html.includes('data-command="'+action+'"'));
 assert(html.includes('&lt;img'));assert(!html.includes('<img onerror'));
 for(const [,file] of html.matchAll(/src="\.\.\/icons\/assets\/([^"]+)"/g))assert(fs.existsSync(path.join(__dirname,'../icons/assets',file)),file);
 assert.throws(()=>C.fieldRow({}),/label/);
});
test('composer field row composes registered Buttons for Cc and Bcc',()=>{
 const A=require('../components/actions');const html=C.fieldRow({label:'To',recipient:true});
 assert(html.includes(A.button({label:'Cc',variant:'composer'})));
 assert(html.includes(A.button({label:'Bcc',variant:'composer'})));
 assert(html.includes('data-command="Cc"'));assert(html.includes('data-command="Bcc"'));
 assert(!html.includes('<button type="button" data-command="Cc">Cc</button>'));
});
test('composer routes split actions independently and supports minimize, close and cleanup',()=>{
 const classes=new Set(['comp-open']);const el={classList:{toggle(k){classes.has(k)?classes.delete(k):classes.add(k)},contains:k=>classes.has(k),remove(...keys){keys.forEach(k=>classes.delete(k))}},addEventListener(t,fn){this.handler=fn},removeEventListener(){this.handler=null}};
 const host={firstElementChild:el};const calls=[];const cleanup=C.mount(host,'emailComposer',{docked:true},{action:a=>calls.push(a)});
 const click=dataset=>{const button={dataset,textContent:'',disabled:false,closest:()=>dataset.command?{dataset}:null};el.handler({target:{closest:()=>button}});};
 click({action:'main'});click({action:'secondary'});assert.deepEqual(calls,['main','secondary']);
 click({command:'Minimize'});assert(classes.has('comp-minimized'));click({command:'Close'});assert(!classes.has('comp-open'));assert(!classes.has('comp-minimized'));cleanup();assert.equal(el.handler,null);
});

test('composer SVG assets preserve proportions instead of stretching into icon slots',()=>{
 const dir=path.join(__dirname,'../components/composer-assets');
 for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.svg'))){
  const svg=fs.readFileSync(path.join(dir,file),'utf8');
  assert(svg.includes('preserveAspectRatio="xMidYMid meet"'),file);
  assert(/viewBox="[^"]+"/.test(svg),file);
 }
});

test('standalone header emits window commands without mutating a composer',()=>{
 const el={addEventListener(t,fn){this.handler=fn},removeEventListener(){this.handler=null}};
 const calls=[];const cleanup=C.mount({firstElementChild:el},'composerHeader',{title:'Draft <one>'},{action:c=>calls.push(c)});
 for(const command of ['Minimize','Expand','Close']){
  const button={disabled:false,dataset:{action:'main'},closest:()=>({dataset:{command}})};
  el.handler({target:{closest:()=>button}});
 }
 assert.deepEqual(calls,['Minimize','Expand','Close']);cleanup();assert.equal(el.handler,null);
});
test('composer composes independent regions and preserves child renderer markup',()=>{
 const A=require('../components/actions');const html=C.emailComposer();
 for(const cls of ['titan-composer-header','titan-composer-tools','titan-composer-send-actions'])assert(html.includes(cls));
 assert(!html.includes('titan-action-group'));
 assert(C.composerTools().includes(A.button({label:'Track',icon:'track',variant:'composer'})));
 assert(C.composerHeader().includes(A.iconButton({label:'Close',icon:'close',variant:'dark',iconSize:18,iconColor:'currentColor'})));
 assert(C.composerSendActions().includes(A.splitButton({label:'Send',secondaryLabel:'Send options',variant:'composer'})));
});
