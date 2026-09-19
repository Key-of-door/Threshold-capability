import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {join} from 'node:path';
const root=process.argv[2],rows=p=>existsSync(p)?readFileSync(p,'utf8').split('\n').filter(Boolean).flatMap(s=>{try{return[JSON.parse(s)]}catch{return[]}}):[];
const iv=rows(join(root,'traces/interventions.jsonl')),start=iv.find(e=>e.event==='formal_start')?.timestamp;
const out={start,bots:{}};
for(const bot of ['MicaA','MicaB','MicaC']){
 const dir=join(root,'traces',bot),actions=rows(join(dir,'actions.jsonl')),obs=rows(join(dir,'observations.jsonl')),pub=rows(join(dir,'public-output.jsonl'));
 const runId=actions.find(x=>x.run_id)?.run_id??obs.find(x=>x.run_id)?.run_id;
 const boundaries=iv.filter(x=>x.runId===runId&&x.event==='segment_settled');
 const map=new Map(actions.filter(x=>x.event==='requested').map(x=>[x.action_id,x]));
 const timeline=actions.filter(x=>['completed','error'].includes(x.event)).map(x=>({at:x.timestamp,actionId:x.action_id,args:map.get(x.action_id)?.args,result:x.event,error:x.error,effects:x.effects,inventory:obs.find(o=>o.action_id===x.action_id)?.inventory}));
 const first=actions.find(x=>x.event==='requested');
 out.bots[bot]={runId,firstActionAt:first?.timestamp,secondsToFirstAction:first?(Date.parse(first.timestamp)-Date.parse(start))/1000:null,observationsBeforeFirstAction:obs.filter(x=>x.timestamp<(first?.timestamp??'')).length,segments:boundaries.map((b,i)=>{const from=i?boundaries[i-1].timestamp:start;return {segment:b.segment,end:b.timestamp,seconds:(Date.parse(b.timestamp)-Date.parse(from))/1000,requested:actions.filter(x=>x.event==='requested'&&x.timestamp>=from&&x.timestamp<=b.timestamp).length,technicalErrors:actions.filter(x=>x.event==='error'&&x.timestamp>=from&&x.timestamp<=b.timestamp).length};}),timeline,publicText:pub.filter(x=>x.content?.some(p=>p.type==='text')).map(x=>({at:x.timestamp,text:x.content.filter(p=>p.type==='text').map(p=>p.text).join('\n')}))};
}
writeFileSync(join(root,'action-timeline.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(Object.fromEntries(Object.entries(out.bots).map(([b,v])=>[b,{secondsToFirstAction:v.secondsToFirstAction,observationsBeforeFirstAction:v.observationsBeforeFirstAction,segments:v.segments.length}]))));
