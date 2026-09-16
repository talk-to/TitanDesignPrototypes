const test=require('node:test');
const assert=require('node:assert/strict');
const ds=require('../components/data-list.js');
const columns=[{key:'select',role:'control',width:'auto'},{key:'name',role:'key',label:'Name',width:'minmax(0, 1fr)'}];
test('list composes the public row unchanged with shared tracks',()=>{
 const item={id:'one',cells:{select:{slot:true},name:{slot:true,text:'Ada'}}};
 assert.ok(ds.list({columns,rows:[item]}).includes(ds.row({...item,columns,sharedTracks:true})));
 assert.match(ds.row({...item,columns}),/--titan-data-list-columns: auto minmax\(0, 1fr\)/);
 assert.doesNotMatch(ds.row({...item,columns}),/data-shared-tracks/);
});
test('header semantics and caller slots are preserved',()=>{
 const html=ds.list({columns,rows:[{id:'one',cells:{select:{slot:true},name:'<script>'}}]});
 assert.equal((html.match(/role="columnheader"/g)||[]).length,2);
 assert.match(html,/data-slot="head:select"/);assert.match(html,/data-slot="one:select"/);assert.match(html,/&lt;script&gt;/);
});
test('standalone row validates the same column contract as list',()=>{
 assert.throws(()=>ds.row({columns:[{key:'name'}]}),/exactly one key/);
 assert.throws(()=>ds.list({columns:[]}),/at least one/);
 assert.doesNotMatch(ds.list({columns,head:false}),/columnheader/);
});
