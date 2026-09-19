import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=process.argv[2];
const rows=p=>existsSync(p)?readFileSync(p,'utf8').split('\n').filter(Boolean).flatMap(l=>{try{return [JSON.parse(l)];}catch{return [];}}):[];
const runtime=rows(join(root,'traces/runtime.jsonl'));
const iv=rows(join(root,'traces/interventions.jsonl'));
const project=existsSync(join(root,'observed-project.json'))?JSON.parse(readFileSync(join(root,'observed-project.json'),'utf8')):{};
const segments={};for(const e of iv.filter(e=>e.event==='segment_settled'))segments[e.runId]=e.segment;
const usage=runtime.filter(e=>e.event==='assistant').reduce((a,e)=>({total:a.total+(e.usage?.totalTokens??0),output:a.output+(e.usage?.output??0)}),{total:0,output:0});
console.log(JSON.stringify({now:new Date().toISOString(),calls:runtime.filter(e=>e.event==='model_turn').length,usage,segments,messageCount:project.messages?.length,latestMessages:(project.messages??[]).filter(m=>m.id>47).slice(-2).map(m=>({id:m.id,body:m.body.slice(0,250)})),finished:existsSync(join(root,'finished.json')),errors:iv.filter(e=>/error|budget/.test(e.event)).slice(-3)}));
for(const bot of ['MicaA','MicaB','MicaC']){
 const actions=rows(join(root,'traces',bot,'actions.jsonl'));
 const pub=rows(join(root,'traces',bot,'public-output.jsonl'));
 const latest=pub.filter(e=>e.content?.some(c=>c.type==='text')).at(-1);
 console.log(JSON.stringify({bot,actions:actions.filter(e=>e.event==='requested').length,errors:actions.filter(e=>e.event==='error').length,lastAction:actions.at(-1)&&{at:actions.at(-1).timestamp,event:actions.at(-1).event,args:actions.at(-1).args,error:actions.at(-1).error},lastText:latest?.content.filter(c=>c.type==='text').map(c=>c.text).join('\n').slice(0,420)}));
}
