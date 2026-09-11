'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../components/actions');
test('labels are required and untrusted content remains text',()=>{
 assert.throws(()=>A.iconButton({icon:'./icon.svg'}),/label/);
 assert.throws(()=>A.iconButton({label:'Settings'}),/icon/);
 assert.throws(()=>A.button({label:' '}),/label/);
 assert.throws(()=>A.splitButton({label:'Send'}),/label/);
 assert(!A.button({label:'<img src=x onerror=alert(1)>'}).includes('<img'));
 assert.throws(()=>A.iconButton({label:'Test',icon:'javascript:alert(1)'}),/image path/);
});
test('split controls compose two registered half buttons with independent disabled state',()=>{
 const html=A.splitButton({label:'Send',secondaryLabel:'More actions',disabled:true});
 assert.equal((html.match(/<button /g)||[]).length,2);
 assert.equal((html.match(/ disabled/g)||[]).length,2);
 assert(html.includes('</button><button'));
 assert.equal((html.match(/titan-half-button--left/g)||[]).length,1);
 assert.equal((html.match(/titan-half-button--right/g)||[]).length,1);
 const partial=A.splitButton({label:'Send',secondaryLabel:'More actions',secondaryDisabled:true});
 assert.equal((partial.match(/ disabled/g)||[]).length,1);
 assert(!partial.split('</button>')[0].includes(' disabled'));
});
test('half buttons own their side geometry and content instances',()=>{
 assert.throws(()=>A.halfButton({side:'center',label:'Send'}),/left or right/);
 assert.throws(()=>A.halfButton({side:'left',label:' '}),/label/);
 assert.throws(()=>A.halfButton({side:'left',label:'More',labelHidden:true}),/icon/);
 assert.throws(()=>A.halfButton({side:'left',label:'Send',size:'large'}),/sizes/);
 const iconOnly=A.halfButton({side:'right',label:'More email actions',labelHidden:true,icon:'chevron-down',haspopup:'menu',expanded:false});
 assert(iconOnly.includes('aria-label="More email actions"'));assert(iconOnly.includes('aria-haspopup="menu"'));
 assert(iconOnly.includes('aria-expanded="false"'));assert(!iconOnly.includes('titan-half-button__label'));
 const textOnly=A.halfButton({side:'left',label:'Send'});
 assert(textOnly.includes('titan-half-button__label'));assert(!textOnly.includes('titan-half-button__icon'));
 assert(A.halfButton({side:'left',label:'Send',icon:'reply'}).includes('titan-half-button__icon'));
 assert(A.halfButton({side:'left',label:'Send',size:'composer'}).includes('titan-half-button--composer'));
});
test('icon state and observed size are explicit rather than inferred',()=>{
 const html=A.iconButton({label:'Settings',icon:'./settings.svg',size:40,pressed:false});
 assert(html.includes('aria-label="Settings"'));assert(html.includes('aria-pressed="false"'));
 assert(!A.iconButton({label:'Settings',icon:'./settings.svg'}).includes('aria-pressed'));
 assert.throws(()=>A.iconButton({label:'Settings',icon:'./settings.svg',size:64}),/sizes/);
});
test('icon toggle swaps supplied artwork under an explicit caller-owned pressed state',()=>{
 assert.throws(()=>A.iconButton({label:'Star',icon:'star-outline',variant:'toggle',pressed:false}),/pressedIcon/);
 assert.throws(()=>A.iconButton({label:'Star',icon:'star-outline',pressedIcon:'star',variant:'toggle'}),/pressed state/);
 assert.throws(()=>A.iconButton({label:'Star',icon:'star-outline',pressedIcon:'star',variant:'toggle',pressed:false,size:40}),/24px/);
 const html=A.iconButton({label:'Star message',icon:'star-outline',pressedIcon:'star',variant:'toggle',pressed:true,iconColor:'currentColor'});
 assert(html.includes('titan-icon-button--toggle'));assert(html.includes('aria-pressed="true"'));
 assert(html.includes('titan-icon-button__icon-off'));assert(html.includes('titan-icon-button__icon-on'));
 assert(html.includes('star-outline.svg#titan-artwork'));assert(html.includes('star.svg#titan-artwork'));
});
test('mounted actions route independently and disabled controls do not invoke callbacks',()=>{
 let main=0,secondary=0;
 const controls=['main','secondary'].map(action=>({dataset:{action},disabled:false,addEventListener(type,fn){this.click=fn;}}));
 const host={innerHTML:'',firstElementChild:{},querySelectorAll(){return controls;}};
 A.mount(host,'splitButton',{label:'Send',secondaryLabel:'More actions'},{main:()=>main++,secondary:()=>secondary++});
 controls[1].click({});assert.equal(main,0);assert.equal(secondary,1);
 controls[0].click({});assert.equal(main,1);
 controls[0].disabled=true;controls[0].click({});assert.equal(main,1);
});

test('action group composes shared buttons unchanged behind action wrappers',()=>{
 const A=require('../components/actions.js');
 const items=[{id:'archive',label:'Archive'},{id:'unread',label:'Mark unread'}];
 const html=A.actionGroup({label:'Message actions',items});
 assert(html.includes('role="group"'));
 assert(html.includes('<span class="titan-action-group__item" data-action="archive">'+A.button({...items[0],variant:'toolbar'})));
 assert(html.includes('<span class="titan-action-group__item" data-action="unread">'+A.button({...items[1],variant:'toolbar'})));
 assert.equal((html.match(/titan-button--toolbar/g)||[]).length,2);
});
test('mounted action groups route by wrapper id without disabling the child',()=>{
 const A=require('../components/actions.js'),calls=[];
 const children=[{disabled:false},{disabled:false}];
 const wrappers=[{dataset:{action:'archive'}},{dataset:{action:'unread'}}].map((wrapper,index)=>({dataset:wrapper.dataset,matches:()=>false,querySelector:()=>children[index],addEventListener(type,fn){this.click=fn;}}));
 const host={innerHTML:'',firstElementChild:{},querySelectorAll:selector=>selector==='.titan-action-group__item'?wrappers:[]};
 A.mount(host,'actionGroup',{label:'Actions',items:[{id:'archive',label:'Archive'},{id:'unread',label:'Mark unread'}]},{archive:()=>calls.push('archive'),unread:()=>calls.push('unread')});
 wrappers[1].click({});assert.deepEqual(calls,['unread']);
 children[0].disabled=true;wrappers[0].click({});assert.deepEqual(calls,['unread']);
});

test('three footer actions reserve the final action for an accessible icon-only control',()=>{
 const items=[{id:'bug',label:'Bug',icon:'report-bug',labelHidden:true},{id:'feature',label:'Feature',icon:'request-feature'},{id:'settings',label:'Settings',icon:'settings',labelHidden:false,disabled:true}];
 const html=A.footerActions({label:'Feedback',items});
 assert.equal((html.match(/class="titan-footer-actions__label"/g)||[]).length,2);
 assert(html.includes('>Bug</span>'));assert(html.includes('>Feature</span>'));
 assert(html.includes('aria-label="Settings" disabled'));
 assert(!html.includes('>Settings</span>'));
 assert.equal((html.match(/titan-footer-actions__item--icon-only/g)||[]).length,1);
 assert.throws(()=>A.footerActions({label:'Feedback',items:[]}),/one to three/);
 assert.throws(()=>A.footerActions({label:'Feedback',items:[...items,items[0]]}),/one to three/);
});

test('button identifies its complete registered preview configuration',()=>{
 const A=require('../components/actions.js');
 for(const [options,id] of [[{},'label-only'],[{icon:'app-mail'},'main'],[{variant:'primary'},'primary'],[{variant:'primary',icon:'app-mail'},'primary-icon'],[{variant:'outlined-primary',icon:'app-mail'},'outlined-primary-icon']]){
  assert(A.button({label:'Example',...options}).includes('data-inspector-variant="'+id+'"'));
 }
});
