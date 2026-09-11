(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TitanDataList=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ROLES=['control','key','value'];

function normalize(columns){
  if(!Array.isArray(columns)||!columns.length)throw Error('Data list requires at least one column');
  const cols=columns.map(column=>{
    if(!column||typeof column.key!=='string'||!column.key.trim())throw Error('Each data list column requires a key');
    const role=column.role||'value';
    if(!ROLES.includes(role))throw Error('Unsupported data list column role: '+role);
    return {key:column.key.trim(),label:column.label||'',role,width:column.width||'minmax(0, 1fr)'};
  });
  if(cols.filter(column=>column.role==='key').length!==1)throw Error('Data list requires exactly one key column');
  return cols;
}

// A cell renders supplied text, or an empty slot host the caller fills with a
// component instance. Slots are addressed as `[data-slot="<rowId>:<columnKey>"]`.
function cell(column,value,rowId,header=false){
  const slot=value&&typeof value==='object'&&value.slot;
  const inner=slot?'<span class="titan-data-list__slot" data-slot="'+esc(rowId)+':'+esc(column.key)+'"></span>':esc(value==null?'':value);
  const text=column.role==='key'&&!slot?'<span class="titan-data-list__key-text">'+inner+'</span>':inner;
  const lead=column.role==='key'&&slot&&value.text!=null?'<span class="titan-data-list__key-text">'+esc(value.text)+'</span>':'';
  return '<div class="titan-data-list__cell titan-data-list__cell--'+column.role+'" role="'+(header?'columnheader':'cell')+'">'+text+lead+'</div>';
}

// Control columns carry a slot in the header too, so a select-all control can
// mount there; other columns show their label text.
function head(columns){
  const cells=columns.map(column=>cell(column,column.role==='control'?{slot:true}:column.label,'head',true));
  return '<div class="titan-data-list__head" role="row">'+cells.join('')+'</div>';
}

function row(options={},columns){
  const cols=normalize(columns||options.columns);
  const id=options.id==null?'':String(options.id);
  const cells=options.cells||{};
  return '<div class="titan-data-list__row" role="row" data-row-id="'+esc(id)+'"'+(options.sharedTracks?' data-shared-tracks="true"':'')+' style="--titan-data-list-columns: '+esc(cols.map(column=>column.width).join(' '))+'">'+cols.map(column=>cell(column,cells[column.key],id)).join('')+'</div>';
}

function list(options={}){
  const columns=normalize(options.columns);
  const rows=Array.isArray(options.rows)?options.rows:[];
  const tracks=columns.map(column=>column.width).join(' ');
  const classes='titan-data-list';
  const label=options.label?' aria-label="'+esc(options.label)+'"':'';
  const body=rows.length?rows.map(item=>row({...item,sharedTracks:true},columns)).join(''):
    '<div class="titan-data-list__empty">'+esc(options.emptyText||'Nothing to show.')+'</div>';
  return '<div class="'+classes+'" role="table"'+label+' style="--titan-data-list-columns: '+esc(tracks)+'">'+
    (options.head===false?'':head(columns))+body+'</div>';
}

return {list,row,columns:normalize};
});
