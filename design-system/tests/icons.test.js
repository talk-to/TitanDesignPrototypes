'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),ds=path.join(root,'design-system');
test('registered icons have stable square canvases and live canonical aliases',()=>{
 const catalog=JSON.parse(fs.readFileSync(path.join(ds,'icons/catalog.json')));assert.equal(new Set(catalog.map(i=>i.id)).size,catalog.length);
 for(const i of catalog){const file=path.join(ds,'icons',i.src),svg=fs.readFileSync(file,'utf8');assert.match(svg,/viewBox="0 0 24 24"/,i.id);assert.match(svg,/preserveAspectRatio="xMidYMid meet"/,i.id);assert(!svg.includes('preserveAspectRatio="none"'),i.id);if(i.canonicalId){const canonical=catalog.find(c=>c.id===i.canonicalId);assert.equal(fs.realpathSync(file),fs.realpathSync(path.join(ds,'icons',canonical.src)));}}
 const aliases=JSON.parse(fs.readFileSync(path.join(ds,'decisions/icon-normalization-aliases.json')));
 for(const [legacy,canonical] of Object.entries(aliases))assert.equal(fs.statSync(path.join(root,legacy)).ino,fs.statSync(path.join(root,canonical)).ino,legacy);
});
test('composer resolves every image from shared assets without undefined mappings',()=>{
 const html=require('../components/composer').emailComposer();const images=[...html.matchAll(/<img[^>]* src="([^"]+)"/g)];assert(images.length>0);
 for(const [,src] of images){assert.match(src,/^\.\.\/icons\/assets\/[^/]+\.svg$/);assert(fs.existsSync(path.resolve(ds,'components',src)),src);}
 assert(!html.includes('composer-assets'));
});
test('external SVG uses reference existing shared artwork fragments',()=>{
 const renderers=[require('../components/actions').splitButton({label:'Send',secondaryLabel:'Options'}),require('../components/selection').dropdown({label:'All'}),require('../components/navigation-input').searchField({label:'Search',filter:true})];
 for(const html of renderers)for(const [,src] of html.matchAll(/<use href="([^"]+)"/g)){const [file,id]=src.split('#');assert(fs.readFileSync(path.resolve(ds,'components',file),'utf8').includes('id="'+id+'"'));}
});
test('monochrome catalog entries expose reusable paint while multicolor art stays separate',()=>{
 const catalog=JSON.parse(fs.readFileSync(path.join(ds,'icons/catalog.json')));
 for(const i of catalog.filter(i=>i.colorMode==='monochrome')){const svg=fs.readFileSync(path.join(ds,'icons',i.src),'utf8');assert(svg.includes('id="titan-artwork"'),i.id);assert(svg.includes('--titan-icon-color'),i.id);}
 for(const id of ['edit','colors','app-mail'])assert.equal(catalog.find(i=>i.id===id).colorMode,'multicolor');
 const A=require('../components/actions');for(const kind of ['iconButton','button','splitButton']){const html=A[kind]({label:'Close',secondaryLabel:'Options',icon:'../icons/assets/close.svg',iconColor:'#2170f4'});assert(html.includes('close.svg#titan-artwork'));assert(html.includes('--titan-icon-color:#2170f4'));assert(!html.includes('<img'));}
});
test('iconography token adoption preserves every recorded rendered dimension',()=>{
 const files=['tokens/iconography.css','components/actions.css','components/selection.css','components/navigation-input.css','components/messages.css','components/app-switcher.css'];
 const values=new Map();for(const file of files)for(const [,key,value] of fs.readFileSync(path.join(ds,file),'utf8').matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g))values.set(key,value.trim());
 function resolve(value,seen=new Set()){const m=value.match(/^var\((--[\w-]+)\)$/);if(!m)return value;assert(!seen.has(m[1]),'Token cycle');assert(values.has(m[1]),m[1]);return resolve(values.get(m[1]),new Set([...seen,m[1]]));}
 const audit=JSON.parse(fs.readFileSync(path.join(ds,'decisions/iconography-adoption.json')));
 for(const item of audit){const before=new Map([...item.before.matchAll(/((?:max-)?(?:width|height)):\s*([^;]+)/g)].map(m=>[m[1],m[2].trim()]));for(const [,prop,value] of item.after.matchAll(/((?:max-)?(?:width|height)):\s*([^;]+)/g)){if(value.includes('--titan-icon-size-'))assert.equal(resolve(value.trim()),before.get(prop),item.selector+' '+prop);}}
});
