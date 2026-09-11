"""Source inventory, not a cascade/coverage score. Run from the workspace root."""
import json,re
from pathlib import Path
root=Path('design-system')
registry=json.loads((root/'registry.json').read_text())
files=sorted({e['css'] for e in registry['components']})
records=[]
for file in files:
 text=(root/file).read_text()
 clean=re.sub(r'/\*.*?\*/',lambda m:'\n'*m.group().count('\n'),text,flags=re.S)
 for rule in re.finditer(r'([^{}]+)\{([^{}]*)\}',clean):
  selector=re.sub(r'@(?:import|charset)[^;]+;', '', rule.group(1)).strip()
  for decl in re.finditer(r'([\w-]+)\s*:\s*([^;]+)(?:;|$)',rule.group(2)):
   prop,value=decl.group(1),decl.group(2).strip()
   if prop.startswith('--'):category='component-token-definition'
   elif prop in ['font','font-size','font-weight','font-family','line-height','letter-spacing']:category='typography'
   elif prop.startswith(('padding','margin')) or prop in ['gap','row-gap','column-gap']:category='spacing-or-reservation'
   elif prop in ['color','background','background-color','border','border-color','border-top','border-bottom','border-left','border-right','border-block','box-shadow','outline','accent-color']:category='paint-or-border'
   elif prop=='border-radius':category='radius'
   else:continue
   hasvar='var(' in value
   literals=re.findall(r'#[\da-fA-F]{3,8}\b|rgba?\([^)]*\)|(?<![\w-])(?:\d*\.)?\d+(?:px|rem|em|%)?\b',re.sub(r'var\([^)]*\)','',value))
   status='token-reference' if hasvar else 'literal-review' if literals else 'structural-or-inherited'
   if hasvar and literals:status='token-reference-with-literal-geometry'
   if category=='component-token-definition':status='scoped-default'
   records.append(dict(file=file,selector=selector,property=prop,value=value,category=category,status=status,line=clean[:rule.start(2)+decl.start()].count('\n')+1))
report={'scope':'19 registered components; shared CSS declarations including legacy compatibility selectors; excludes consumer overrides and specimen layout. Counts are source inventory, not computed compliance.', 'components':[{'id':e['id'],'name':e['name'],'css':e['css'],'renderer':e.get('module'),'preview':e['preview']} for e in registry['components']], 'declarations':records}
(root/'audits/tokenization-inventory.json').write_text(json.dumps(report,indent=2)+'\n')
print('Inventoried',len(registry['components']),'components in',len(files),'shared stylesheets;',len(records),'relevant declarations')
for file in files:
 rows=[r for r in records if r['file']==file]
 print(file,':',sum(r['status'].startswith('token-reference') for r in rows),'token-bearing;',sum(r['status']=='literal-review' for r in rows),'literal review candidates (not necessarily gaps)')
