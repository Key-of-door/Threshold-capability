import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=process.argv[2]??'E:/Minecraft/Threshold-Experiment/live/session-03';
const rows=p=>existsSync(p)?readFileSync(p,'utf8').split('\n').filter(Boolean).flatMap(l=>{try{return [JSON.parse(l)];}catch{return [];}}):[];
const runtime=rows(join(root,'traces/runtime.jsonl'));
const interventions=rows(join(root,'traces/interventions.jsonl'));
const project=existsSync(join(root,'observed-project.json'))?JSON.parse(readFileSync(join(root,'observed-project.json'),'utf8')):{};
const usage=runtime.filter(e=>e.event==='assistant').reduce((a,e)=>({total:a.total+(e.usage?.totalTokens??0),output:a.output+(e.usage?.output??0)}),{total:0,output:0});
console.log(JSON.stringify({now:new Date().toISOString(),calls:runtime.filter(e=>e.event==='model_turn').length,usage,runs:(project.runs??[]).map(r=>({id:r.id??r.run?.id,status:r.status??r.run?.status})),segments:interventions.filter(e=>e.event==='segment_settled').slice(-6),messages:(project.messages??[]).slice(-5),finished:existsSync(join(root,'finished.json'))},null,2));
for(const name of ['MicaA','MicaB','MicaC']){
 const actions=rows(join(root,'traces',name,'actions.jsonl'));
 const publicRows=rows(join(root,'traces',name,'public-output.jsonl'));
 const latest=publicRows.filter(x=>x.content?.some?.(c=>c.type==='text')).at(-1);
 console.log(JSON.stringify({bot:name,lastActions:actions.slice(-2),lastText:latest?{at:latest.timestamp,text:latest.content.filter(c=>c.type==='text').map(c=>c.text).join('\n')}:null},null,2));
}
