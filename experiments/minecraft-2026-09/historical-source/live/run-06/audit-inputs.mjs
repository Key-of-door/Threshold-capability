import {createReadStream,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import readline from 'node:readline';
import assert from 'node:assert/strict';
import {BOOT,NEXT,END,TASK} from './shared.mjs';
const root=process.argv[2],cfg=JSON.parse(readFileSync(join(root,'experiment.json'),'utf8'));
const expected=['read_work',...(cfg.historyAvailable?['read_messages','send_message','save_checkpoint']:[]),'mc_observe','mc_action'].sort();
const out={historyAvailable:cfg.historyAvailable,bots:{},violations:[]};
for(const bot of ['MicaA','MicaB','MicaC']){
 const p=join(root,'traces',bot,'epistemic.jsonl');if(!existsSync(p))continue;
 const v={requests:0,workReads:0,historyReads:[],tools:{},firstRequestAt:null};out.bots[bot]=v;
 for await(const line of readline.createInterface({input:createReadStream(p),crlfDelay:Infinity})){
  let e;try{e=JSON.parse(line);}catch{continue;}
  try{
   if(e.event==='provider_request_prepared'){
    v.requests++;v.firstRequestAt??=e.timestamp;
    assert.deepEqual((e.payload.tools??[]).map(t=>t.function?.name??t.name).sort(),expected);
    const users=(e.payload.messages??[]).filter(m=>m.role==='user');
    for(let i=0;i<users.length;i++){const c=users[i].content;const text=typeof c==='string'?c:c.filter(x=>x.type==='text').map(x=>x.text).join('');assert.ok([BOOT,NEXT,END].includes(text),'Unexpected user prompt');}
   }
   if(e.event==='tool_result_available'){
    v.tools[e.tool]=(v.tools[e.tool]??0)+1;assert.ok(expected.includes(e.tool));
    let body;try{body=JSON.parse(e.content.filter(x=>x.type==='text').map(x=>x.text).join('\n'));}catch{}
    if(e.tool==='read_work'&&!e.isError){v.workReads++;assert.equal(body.task.instructions,TASK);assert.deepEqual(Object.keys(body.task).sort(),['id','instructions','title']);assert.deepEqual(Object.keys(body.currentRun).sort(),['id','objective']);
     if(!cfg.historyAvailable)assert.deepEqual(Object.keys(body).sort(),['currentRun','project','task']);
     else v.historyReads.push({at:e.timestamp,checkpointId:body.checkpoint?.id??null,checkpointRun:body.checkpoint?.run_id??null});
    }
   }
  }catch(error){out.violations.push({bot,at:e.timestamp,event:e.event,error:error.message});}
 }
}
writeFileSync(join(root,'input-audit.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out));if(out.violations.length)process.exitCode=1;
