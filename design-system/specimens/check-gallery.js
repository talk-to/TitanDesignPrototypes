/* Registration gate for the shared component gallery contract. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),catalog=JSON.parse(fs.readFileSync(path.join(root,'registry.json'),'utf8'));
const failures=[];let count=0,configurations=0;
for(const entry of [...catalog.components,...(catalog.compositions||[])]){
 count++;const file=path.join(root,entry.preview.split('?')[0]);const html=fs.readFileSync(file,'utf8');
 if(!html.includes('href="gallery.css"')||!html.includes('src="gallery.js"'))failures.push(entry.id+': missing shared gallery adapter');
 if(![1,2].includes(entry.previewLayout?.columns))failures.push(entry.id+': choose one or two preview columns');
 const configs=entry.previewConfigurations||[];configurations+=configs.length;
 if(!configs.length)failures.push(entry.id+': declare named preview configurations');
 if(new Set(configs.map(c=>c.id)).size!==configs.length)failures.push(entry.id+': duplicate configuration IDs');
 if(configs.some(c=>!c.name?.trim()||(configs.length>1&&!c.selector)))failures.push(entry.id+': configurations need names and multi-example selectors');
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`Gallery contract passed: ${count} components, ${configurations} configurations.`);
