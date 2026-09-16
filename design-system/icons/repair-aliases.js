// Preserve old URLs after an editor atomically replaces a canonical SVG.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const aliases=JSON.parse(fs.readFileSync(path.join(root,'design-system/decisions/icon-normalization-aliases.json')));
for(const [legacy,canonical] of Object.entries(aliases)){
 const old=path.join(root,legacy),shared=path.join(root,canonical);
 if(fs.existsSync(old)&&fs.statSync(old).ino===fs.statSync(shared).ino)continue;
 if(fs.existsSync(old)||fs.lstatSync(path.dirname(old)).isDirectory()){try{fs.unlinkSync(old)}catch(e){if(e.code!=='ENOENT')throw e}}
 if(legacy.startsWith('Prototypes/'))fs.linkSync(shared,old);else fs.symlinkSync(path.relative(path.dirname(old),shared),old);
}
console.log(`Verified ${Object.keys(aliases).length} legacy icon aliases.`);
