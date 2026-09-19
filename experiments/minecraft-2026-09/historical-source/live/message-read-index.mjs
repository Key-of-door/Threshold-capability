import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const root=process.argv[2];
const rows=f=>readFileSync(f,'utf8').split('\n').filter(Boolean).flatMap(l=>{try{return [JSON.parse(l)];}catch{return [];}});
const index={};
for(const bot of ['MicaA','MicaB','MicaC']){
 const calls=new Map();
 for(const e of rows(join(root,'traces',bot,'public-output.jsonl')))for(const c of e.content??[])if(c.type==='toolCall')calls.set(c.id,{name:c.name,args:c.arguments});
 index[bot]=rows(join(root,'traces',bot,'epistemic.jsonl')).filter(e=>e.event==='tool_result_available'&&e.tool==='read_messages').map(e=>{
  let body={};for(const c of e.content??[])if(c.type==='text'){try{body=JSON.parse(c.text);break;}catch{}}
  return {at:e.timestamp,actionId:e.action_id,args:calls.get(e.action_id)?.args,isError:e.isError,ids:body.messages?.map(m=>m.id)??[],nextAfter:body.nextAfter,hasMore:body.hasMore};
 });
}
writeFileSync(join(root,'message-observation-index.json'),JSON.stringify(index,null,2));
console.log(JSON.stringify(index));
