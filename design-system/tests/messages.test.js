const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../components/messages');
test('message content is escaped and variants and required sender are validated',()=>{
 assert.throws(()=>M.row({}),/sender/);
 assert.throws(()=>M.list({variant:'invented'}),/variants/);
 assert.throws(()=>M.card({sender:'Alex',variant:'invented'}),/variants/);
 const html=M.card({sender:'<script>',paragraphs:['<img src=x onerror=alert(1)>'],actions:[{id:'" onclick="bad',label:'<Reply>'}]});
 assert(!html.includes('<script>'));assert(!html.includes('<img src=x'));assert(html.includes('&lt;Reply&gt;'));
 assert.throws(()=>M.card({sender:'Alex',headerActions:[{label:'Reply',icon:'javascript:bad'}]}),/image path/);
});
test('list supports two layouts and composes the shared Checkbox and Icon button',()=>{
 const html=M.list({variant:'wide',messages:[{id:'a',sender:'Alex',unread:true,selected:true,checked:true,starred:true}]});
 assert(html.includes('titan-message-list--wide'));assert(html.includes('aria-current="true"'));
 assert(html.includes('titan-checkbox'));assert(html.includes('titan-icon-button'));
 assert(html.includes('titan-icon-button--toggle'));
 assert(html.includes('titan-message-row__star'));assert(html.includes('data-message-action="star"'));
 assert(html.includes('aria-pressed="true"'));assert(html.includes(' checked'));assert(html.includes('aria-label="Unread"'));
 assert(html.includes('star-outline.svg#titan-artwork'));assert(html.includes('star.svg#titan-artwork'));
 assert(!html.includes('★'));assert(!html.includes('tile-star'));
 assert.equal((html.match(/<button /g)||[]).length,2);
 assert(!M.list({messages:[]}).includes('undefined'));
});
test('message card supports collapsed, expanded and omitted optional regions',()=>{
 const closed=M.card({sender:'Alex',variant:'collapsed',preview:'Hello'});assert(closed.includes('data-message-action="expand"'));assert(!closed.includes('expanded-body'));
 const open=M.card({sender:'Alex',paragraphs:['Hello']});assert(open.includes('expanded-body'));assert(!open.includes('expanded-footer'));assert(!open.includes('exp-to'));
 const footer=M.card({sender:'Alex',actions:[{id:'reply',label:'Reply',disabled:true}]});assert(footer.includes('disabled'));
});
test('events route independently and cleanup removes listeners',()=>{
 const events={},calls=[];const host={addEventListener:(k,v)=>events[k]=v,removeEventListener:k=>delete events[k],contains:()=>true};
 const item={dataset:{messageId:'a'}};const star={dataset:{messageAction:'star'},getAttribute:()=> 'false',setAttribute:(k,v)=>calls.push([k,v]),closest:()=>item};
 const cleanup=M.bind(host,{star:(id,value)=>calls.push(['star',id,value]),open:()=>assert.fail('star must not open')});
 events.click({target:{closest:()=>star}});assert.deepEqual(calls,[['aria-pressed','true'],['star','a',true]]);cleanup();assert.deepEqual(events,{});
});
test('received-message footer composes the shared Button unchanged behind its action wrapper',()=>{
 const Actions=require('../components/actions');
 const action={id:'reply',label:'Reply',icon:'./reply.svg',disabled:true};
 const child=Actions.button(action),html=M.card({sender:'Alex',actions:[action]});
 assert(html.includes('<span class="titan-message-card__action" data-message-action="reply">'+child));
 assert(!html.includes('data-message-action="reply" data-action'));
 assert.throws(()=>M.card({sender:'Alex',actions:[{id:'reply',label:''}]}),/label/);
});
test('received-message header actions compose the shared Icon button unchanged',()=>{
 const Actions=require('../components/actions');
 const child=Actions.iconButton({label:'Reply',icon:'reply',variant:'compact',disabled:undefined});
 const html=M.card({sender:'Alex',headerActions:[{id:'reply',label:'Reply',icon:'reply'}]});
 assert(html.includes('<span class="titan-message-card__action" data-message-action="reply">'+child));
 assert(html.includes('titan-icon-button--compact'));assert(!html.includes('class="exp-icon"'));
});
