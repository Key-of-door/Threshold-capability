import {createReadStream,readFileSync,writeFileSync,existsSync} from 'node:fs';import readline from 'node:readline';import {join} from 'node:path';
const root=process.argv[2];
const small=f=>existsSync(f)?readFileSync(f,'utf8').split('\n').filter(Boolean).flatMap(l=>{try{return[JSON.parse(l)]}catch{return[]}}):[];
const index={};
for(const bot of ['MicaA','MicaB','MicaC']){
 const folder=join(root,'traces',bot);if(!existsSync(join(folder,'epistemic.jsonl')))continue;
 const calls=new Map();for(const e of small(join(folder,'public-output.jsonl')))for(const c of e.content??[])if(c.type==='toolCall')calls.set(c.id,{name:c.name,args:c.arguments});
 const value={messageReads:[],taskReads:[],boardReads:0,toolErrors:[],preparedRequests:0,toolSets:[],unexpectedInput:[]};
 for await(const line of readline.createInterface({input:createReadStream(join(folder,'epistemic.jsonl')),crlfDelay:Infinity})){
  let e;try{e=JSON.parse(line)}catch{continue;}
  if(e.event==='provider_request_prepared'){
 value.preparedRequests++;
 const tools=(e.payload.tools??[]).map(t=>t.function?.name??t.name).sort();
 if(!value.toolSets.some(x=>JSON.stringify(x)===JSON.stringify(tools)))value.toolSets.push(tools);
 const text=JSON.stringify(e.payload.messages??[]);
 if(text.includes('Call read_task first.'))value.unexpectedInput.push({at:e.timestamp,issue:'core bootstrap visible'});
}
  if(e.event!=='tool_result_available')continue;
  const texts=(e.content??[]).filter(c=>c.type==='text').map(c=>c.text);let body;try{body=JSON.parse(texts.join('\n'));}catch{}
  const base={at:e.timestamp,actionId:e.action_id,args:calls.get(e.action_id)?.args,isError:!!e.isError};
  if(e.tool==='read_messages')value.messageReads.push({...base,ids:body?.messages?.map(m=>m.id)??[],nextAfter:body?.nextAfter,hasMore:body?.hasMore});
  if(['read_task','read_work'].includes(e.tool))value.taskReads.push({...base,body});
  if(e.tool==='read_project_board')value.boardReads++;
  if(e.isError)value.toolErrors.push({...base,tool:e.tool,text:texts.join('\n').slice(0,800)});
 }
 value.actions=small(join(folder,'actions.jsonl')).filter(e=>e.event==='requested').map(e=>({at:e.timestamp,actionId:e.action_id,...e.args}));
 index[bot]=value;
}
writeFileSync(join(root,'observer-index.json'),JSON.stringify(index,null,2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(index).map(([bot,v])=>[bot,{requests:v.preparedRequests,messageReads:v.messageReads,taskReads:v.taskReads.length,boardReads:v.boardReads,errors:v.toolErrors.length,actionCounts:v.actions.reduce((o,a)=>(o[a.action]=(o[a.action]??0)+1,o),{})}]))));
