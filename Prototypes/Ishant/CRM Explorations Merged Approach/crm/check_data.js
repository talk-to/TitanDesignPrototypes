global.window = global;
const fs=require('fs'),p=require('path');
const base='/Users/ishant.p/Documents/Titan Design Git/Prototypes/Ishant/CRM Explorations Merged Approach/crm';
['data/pipelines.js','data/companies.js','data/contacts.js','data/opportunities.js','data/links.js','data/activities.js','data/accounts/maya.js','crm_data.js']
  .forEach(f=>eval(fs.readFileSync(p.join(base,f),'utf8')));
const Q=window.CrmData;
let fail=0; const ok=(c,m)=>{ if(!c){console.log('  ✗ '+m);fail++;} else console.log('  ✓ '+m); };

console.log('\n— referential integrity —');
window.CRM.opportunities.forEach(o=>{
  ok(!!Q.pipeline(o.pipelineId), `${o.id} pipeline ${o.pipelineId} exists`);
  ok(!!Q.stage(o.pipelineId,o.stageId), `${o.id} stage ${o.stageId} valid in ${o.pipelineId}`);
});
window.CRM.links.forEach(l=>{
  ok(!!Q.opportunity(l.opportunityId), `link → ${l.opportunityId} exists`);
  l.contactIds.forEach(c=>ok(!!Q.contact(c),`  contact ${c} exists`));
  l.companyIds.forEach(c=>ok(!!Q.company(c),`  company ${c} exists`));
  l.threadIds.forEach(t=>ok(!!Q.thread(t),`  thread ${t} exists`));
});
window.CRM.activities.forEach(a=>{
  if(!Q.contact(a.contactId)){console.log('  ✗ activity '+a.id+' bad contact');fail++;}
  if(a.opportunityId && !Q.opportunity(a.opportunityId)){console.log('  ✗ activity '+a.id+' bad opp');fail++;}
});
console.log('  ✓ all '+window.CRM.activities.length+' activities resolve');
window.CRM.contacts.forEach(c=>{ if(c.companyId && !Q.company(c.companyId)){console.log('  ✗ '+c.id+' bad companyId');fail++;} });

console.log('\n— NO INHERITANCE (the core rule) —');
const twc=Q.contactsForOpportunity('opp_tw_wholesale').map(c=>c.id);
ok(twc.includes('ct_rohan'),'Rohan IS linked to opp_tw_wholesale');
ok(!twc.includes('ct_ayesha'),'Ayesha NOT linked despite her company being linked');
const lum=Q.contactsForOpportunity('opp_lumen_gifting').map(c=>c.id);
ok(!lum.includes('ct_devang'),'Devang NOT linked despite his company being linked');
ok(Q.contactsForCompany('co_thirdwave').length===2,'but co_thirdwave still groups 2 contacts');

console.log('\n— one thread, many opportunities —');
const wOpps=Q.opportunitiesForThread('th_wholesale');
ok(wOpps.length===2,'th_wholesale → 2 opportunities: '+wOpps.map(o=>o.pipeline.name).join(' + '));
ok(Q.opportunitiesNotOnThread('th_wholesale').length===4,'→ 4 offerable in "add to other opportunities"');

console.log('\n— separate feeds, same contact —');
const a=Q.activitiesForOpportunity('opp_tw_wholesale'), b=Q.activitiesForOpportunity('opp_tw_gifting');
ok(a.length>=12 && b.length>=5, `wholesale ${a.length} vs gifting ${b.length} — not merged`);
ok(Q.activitiesForContact('ct_rohan').length===18,'Rohan across everything: 18');

console.log('\n— time split —');
['opp_tw_wholesale','opp_lumen_gifting','opp_tara_hiring','opp_finca_sourcing'].forEach(id=>{
  const s=Q.splitByTime(Q.activitiesForOpportunity(id));
  const n=Q.nextDue(id);
  ok(s.upcoming.length>0 && s.older.length>0, `${id}: ${s.upcoming.length} upcoming / ${s.older.length} older · next: ${n?n.title:'—'} · quiet ${Q.daysSinceLastActivity(id)}d`);
});

console.log('\n— company feed = union of contacts —');
ok(Q.activitiesForCompany('co_thirdwave').length===19,'co_thirdwave rolls up 19 (18 Rohan + 1 Ayesha)');
ok(Q.activitiesForCompany('co_lumen').length===8,'co_lumen rolls up 8');

console.log('\n— address resolution —');
const cps=Q.counterparties('th_cafe');
cps.forEach(r=>console.log(`  ${r.name.padEnd(14)} contact:${r.isCandidate?'CANDIDATE':'known    '} company:${r.company?r.company.name:(r.companyIsCandidate?'CANDIDATE '+r.candidateCompanyName:'none')}`));
ok(cps.length===3,'self excluded from th_cafe (4 participants → 3)');
ok(Q.companiesFromThread('th_cafe').length===1,'th_cafe → 1 inferrable company (gmail skipped)');
ok(Q.companiesFromThread('th_cafe')[0].isCandidate,'  and it is a candidate, not a record');
ok(Q.companiesFromThread('th_hiring').length===0,'th_hiring → 0 companies (free-mail only)');

console.log('\n— addable from thread —');
const add=Q.addableContactsFromThread('th_wholesale','opp_tw_wholesale');
ok(add.length===1 && add[0].name==='Ayesha Khan','"Add from this thread" offers exactly Ayesha');

console.log('\n— root scenario per thread —');
window.CRM.threads.forEach(t=>{
  const r=Q.rootScenario(t.id);
  console.log(`  ${t.id.padEnd(14)} → ${r.page}${r.contactId?' ('+Q.contact(r.contactId).name+')':''}`);
});
ok(Q.rootScenario('th_wholesale').page==='opportunities','th_wholesale → opportunities list');
ok(Q.rootScenario('th_cafe').page==='participants','th_cafe → participants list');
ok(Q.rootScenario('th_wedding').page==='contact','th_wedding → contact record');
ok(Q.opportunitiesForContact('ct_sneha').length===0,'  and Sneha has 0 opportunities (empty-state CTA)');

console.log('\n— email headers / thread identity —');
const emails = window.CRM.activities.filter(a=>a.kind==='email');
ok(emails.every(a=>a.messageId), 'every email has a messageId ('+emails.length+')');
const ids = emails.map(a=>a.messageId);
ok(new Set(ids).size===ids.length, 'messageIds are unique');
emails.forEach(a=>(a.references||[]).forEach(r=>{
  if(!ids.includes(r)){console.log('  ✗ '+a.id+' references unknown '+r);fail++;}
}));
console.log('  ✓ every reference resolves to a known message');
ok(Q.threadForMessage(['<tw-001@thirdwavebandra.com>','<eo-001@emberandoak.com>'])==='th_wholesale',
   'References chain → th_wholesale, deterministically');
ok(Q.threadForMessage(['<nope@nowhere.com>'])===null, 'unknown chain → null (new thread)');
ok(Q.threadForMessage([])===null, 'empty chain → null');

console.log('\n— arity decides what happens to an arriving message —');
const c1=Q.classifyIncoming({references:['<lm-001@lumensystems.com>'],fromEmail:'priya.nair@lumensystems.com'});
ok(c1.mode==='auto' && c1.threadId==='th_gifting',
   'reply into a 1-deal thread → AUTO, filed silently');
const c2=Q.classifyIncoming({references:['<tw-003@thirdwavebandra.com>'],fromEmail:'rohan@thirdwavebandra.com'});
ok(c2.mode==='suggest' && c2.opportunities.length===2,
   'reply into a 2-deal thread → SUGGEST, '+c2.opportunities.length+' options, never guessed');
const c3=Q.classifyIncoming({references:['<si-001@gmail.com>'],fromEmail:'sneha.iyer@gmail.com'});
ok(c3.mode==='none', 'reply into a 0-deal thread → NONE, stays unattached');
const c4=Q.classifyIncoming({references:[],fromEmail:'rohan@thirdwavebandra.com'});
ok(c4.mode==='suggest' && c4.basis==='contact',
   'NEW thread from known contact → SUGGEST via contact, never auto');
const c5=Q.classifyIncoming({references:[],fromEmail:'someone@unknown.com'});
ok(c5.mode==='none' && c5.basis==='unknown', 'new thread from a stranger → NONE');

console.log('\n— shared thread: generous timeline, strict quiet signal —');
const wAll=Q.activitiesForOpportunity('opp_tw_wholesale');
const gAll=Q.activitiesForOpportunity('opp_tw_gifting');
const shared=wAll.filter(a=>a.id==='act_045').length && gAll.filter(a=>a.id==='act_045').length;
ok(!!shared, 'act_045 (un-narrowed) appears in BOTH Third Wave deals');
ok(Q.activitiesForOpportunity('opp_tw_wholesale',{strict:true}).every(a=>a.id!=='act_045'),
   '  but strict:true excludes it');
ok(Q.daysSinceLastActivity('opp_tw_wholesale')===7,
   'wholesale still quiet 7d — the shared reply did NOT reset it');
ok(Q.daysSinceLastActivity('opp_tw_gifting')===4,
   'gifting still quiet 4d — likewise');
ok(Q.isInherited(window.CRM.activities.find(a=>a.id==='act_045')), 'act_045 reads as inherited');
ok(!Q.isInherited(window.CRM.activities.find(a=>a.id==='act_013')), 'act_013 (narrowed) does not');
// Narrowing is the only way an id gets assigned.
window.CRM.activities.find(a=>a.id==='act_045').opportunityId='opp_tw_gifting';
ok(Q.activitiesForOpportunity('opp_tw_wholesale').every(a=>a.id!=='act_045'),
   'after narrowing → leaves the wholesale feed');
ok(Q.activitiesForOpportunity('opp_tw_gifting').some(a=>a.id==='act_045'),
   'after narrowing → stays in gifting only');
window.CRM.activities.find(a=>a.id==='act_045').opportunityId=null;

console.log('\n— files lens —');
const f=Q.filesFrom(Q.activitiesForOpportunity('opp_lumen_gifting'));
ok(f.length===2,'opp_lumen_gifting → 2 files: '+f.map(x=>x.name).join(', '));

console.log(fail? `\n✗ ${fail} FAILURES\n` : '\n✓ all checks passed\n');
process.exit(fail?1:0);
