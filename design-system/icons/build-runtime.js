// Regenerate the synchronous browser catalog after editing catalog.json.
const fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'runtime.js'),catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'catalog.json')));
const line='const BROWSER_CATALOG='+JSON.stringify(catalog.map(({id,src})=>({id,src})))+';';
let source=fs.readFileSync(file,'utf8');source=source.replace(/\/\* GENERATED_CATALOG \*\/(?:\nconst BROWSER_CATALOG=.*;)?/,'/* GENERATED_CATALOG */\n'+line);fs.writeFileSync(file,source);
