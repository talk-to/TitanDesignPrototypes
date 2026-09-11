const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const M=require('../../Prototypes/Ishant/design ops/design system/framework/workbench/model.js');
const registry=JSON.parse(fs.readFileSync(path.join(root,'registry.json')));
const base=registry.tokenFiles.flatMap(file=>M.parseTokens(fs.readFileSync(path.join(root,file),'utf8'),file));
function themeRows(id){const theme=registry.themes.find(t=>t.id===id);return [...base,...M.parseTokens(fs.readFileSync(path.join(root,theme.file),'utf8'),theme.file)];}
function value(rows,name){return M.resolveLiteral(rows.filter(r=>r.name===name&&r.isRoot).at(-1),rows);}
test('themes change reading surfaces while preserving dark navigation and inverse text',()=>{
 const light=themeRows('light'),dark=themeRows('dark');
 for(const name of ['--titan-surface-base','--titan-surface-reading','--titan-text-primary','--border-color'])assert.notEqual(value(light,name),value(dark,name),name);
 for(const name of ['--titan-surface-navigation','--titan-surface-composer-header','--titan-text-inverse','--titan-action-primary'])assert.equal(value(light,name),value(dark,name),name);
 assert(!dark.filter(r=>r.file==='themes/dark.css').some(r=>r.name.startsWith('--titan-color-')),'themes must not redefine primitives');
});
test('primary and secondary text retain readable contrast on both base surfaces',()=>{
 const lum=hex=>{let h=hex.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const c=h.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 for(const id of ['light','dark']){const rows=themeRows(id);for(const token of ['--titan-text-primary','--titan-text-secondary']){const a=lum(value(rows,token)),b=lum(value(rows,'--titan-surface-base'));assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,id+' '+token);}}
});
test('every registered color role resolves through a primitive in each theme',()=>{
 for(const theme of registry.themes){const rows=themeRows(theme.id);for(const role of registry.foundationPresentation.colorRoles){let name=role.token;const seen=new Set();while(!seen.has(name)){seen.add(name);const row=rows.filter(r=>r.isRoot&&r.name===name).at(-1);const alias=row?.value.match(/^var\((--[\w-]+)\)$/);if(!alias)break;name=alias[1];}assert.equal(registry.foundationPresentation.tokens[name]?.layer,'primitive',theme.id+' '+role.token);}}
});
