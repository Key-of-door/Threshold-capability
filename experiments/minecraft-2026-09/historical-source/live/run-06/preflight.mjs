import {createServer} from 'node:http';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {startPi} from 'file:///E:/Threshold%20lite/src/pi.mjs';
import {startGate,BOOT,TASK} from './shared.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/run-06';
const base=join(root,'preflight-'+Date.now());mkdirSync(base,{recursive:true});
const listen=s=>new Promise(r=>s.listen(0,'127.0.0.1',()=>r(`http://127.0.0.1:${s.address().port}`)));
const close=s=>new Promise(r=>{s.close(r);s.closeIdleConnections();});
const results=[];
for(const enabled of [false,true]){
 const p=join(base,enabled?'02':'01');for(const d of ['a','pi','traces'])mkdirSync(join(p,d),{recursive:true});
 const incoming=[],upstreamRequests=[],gateRequests=[];let turn=0;
 const upstream=createServer(async(req,res)=>{
  let body='';for await(const c of req)body+=c;
  upstreamRequests.push({url:req.url,method:req.method,body});res.setHeader('content-type','application/json');
  if(req.headers.authorization!=='Bearer test-only'){res.writeHead(401);res.end('{}');return;}
  if(req.url==='/agent/task')res.end(JSON.stringify({project:{id:'p',name:'OLD_PROJECT_NARRATIVE',repo_path:'HIDDEN_PATH'},task:{id:'t',instructions:'OLD_TASK_NARRATIVE',status_update:{note:'HIDDEN_STATUS_NOTE'}},currentRun:{id:'r',objective:'HIDDEN_OBJECTIVE'},recentRuns:[{error:'HIDDEN_RUN_ERROR'}],checkpoint:{id:'cp',summary:'HISTORY_CHECKPOINT_SENTINEL',git:{diff:'HIDDEN_GIT'}},messageInbox:{count:1,latestId:1}}));
  else if(req.url.startsWith('/agent/messages')&&req.method==='GET')res.end(JSON.stringify({messages:[{id:1,body:'HISTORY_MESSAGE_SENTINEL'}],hasMore:false,nextAfter:1}));
  else res.end(JSON.stringify({saved:true}));
 });
 const upstreamUrl=await listen(upstream);const gate=await startGate(upstreamUrl,enabled,row=>gateRequests.push(row));
 const provider=createServer(async(req,res)=>{
  let body='';for await(const c of req)body+=c;incoming.push(JSON.parse(body));
  const tool=turn===0?'read_work':enabled&&turn===1?'read_messages':enabled&&turn===2?'save_checkpoint':null;
  const args=tool==='save_checkpoint'?{summary:'Local stub checkpoint'}:{};
  const delta=tool?{role:'assistant',tool_calls:[{index:0,id:'test_'+turn,type:'function',function:{name:tool,arguments:JSON.stringify(args)}}]}:{role:'assistant',content:'Local protocol check complete.'};
  res.writeHead(200,{'content-type':'text/event-stream'});
  const chunk=(d,finish=null)=>({id:'probe',object:'chat.completion.chunk',created:1,model:'deepseek-flash',choices:[{index:0,delta:d,finish_reason:finish}]});
  res.write('data: '+JSON.stringify(chunk(delta))+'\n\n');res.write('data: '+JSON.stringify({...chunk({},tool?'tool_calls':'stop'),usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}})+'\n\n');res.end('data: [DONE]\n\n');turn++;
 });
 const providerUrl=await listen(provider);
 writeFileSync(join(p,'pi/models.json'),JSON.stringify({providers:{deepseek:{baseUrl:providerUrl+'/v1',api:'openai-completions',apiKey:'local-probe-only',models:[{id:'deepseek-flash',name:'Local probe',reasoning:false,input:['text'],contextWindow:1000000,maxTokens:384000,compat:{supportsStore:false,supportsDeveloperRole:false,maxTokensField:'max_tokens'}}]}}}));
 writeFileSync(join(p,'experiment.json'),JSON.stringify({historyAvailable:enabled,bots:{a:'ProbeOnly'},port:25566,maxOutputTokens:384000}));
 let worker;
 try{
  worker=startPi({cwd:join(p,'a'),agentDir:join(p,'pi'),provider:'deepseek',model:'deepseek-flash',env:{MC_EXPERIMENT_ROOT:p,DEEPSEEK_API_KEY:'',THRESHOLD_SERVICE_URL:gate.url,THRESHOLD_RUN_TOKEN:'test-only'},capabilities:{skills:[],extensions:[{path:join(root,'adapter/minecraft.ts')},{path:join(root,'channel.ts')}]}});
  await worker.request('get_state');await worker.turn(BOOT,30000);
  const active=JSON.parse(readFileSync(join(p,'traces/active-tools-a.json'),'utf8')).active;
  const expected=['read_work',...(enabled?['read_messages','send_message','save_checkpoint']:[]),'mc_observe','mc_action'];
  assert.deepEqual(active.toSorted(),expected.toSorted());assert.ok(incoming.length>=2);
  for(const payload of incoming){assert.deepEqual(payload.tools.map(t=>t.function.name).toSorted(),expected.toSorted());}
  const all=JSON.stringify(incoming);
  for(const forbidden of ['OLD_PROJECT_NARRATIVE','OLD_TASK_NARRATIVE','HIDDEN_PATH','HIDDEN_STATUS_NOTE','HIDDEN_OBJECTIVE','HIDDEN_RUN_ERROR','HIDDEN_GIT','Call read_task first'])assert.ok(!all.includes(forbidden),forbidden);
  assert.ok(all.includes(TASK));assert.equal(all.includes('HISTORY_CHECKPOINT_SENTINEL'),enabled);assert.equal(all.includes('HISTORY_MESSAGE_SENTINEL'),enabled);
  const before=upstreamRequests.length;
  for(const path of ['/agent/project/board','/agent/project/runs/other','/agent/task/status']){const r=await fetch(gate.url+path,{headers:{authorization:'Bearer test-only'}});assert.equal(r.status,404);}
  if(!enabled)for(const [path,method]of[['/agent/messages','GET'],['/agent/messages','POST'],['/agent/checkpoints','POST']]){const r=await fetch(gate.url+path,{method,headers:{authorization:'Bearer test-only'}});assert.equal(r.status,404);}
  assert.equal(upstreamRequests.length,before);
  const bad=await fetch(gate.url+'/agent/task',{headers:{authorization:'Bearer wrong'}});assert.equal(bad.status,401);
  writeFileSync(join(p,'provider-inputs.json'),JSON.stringify(incoming,null,2));writeFileSync(join(p,'route-checks.json'),JSON.stringify({upstreamRequests,gateRequests},null,2));
  results.push({historyAvailable:enabled,active,localProviderCalls:incoming.length,historyVisibleOnlyWhenEnabled:true,blockedRoutesDoNotReachService:true,realPi:true});
 }finally{if(worker)await worker.stop();await gate.close();await close(provider);await close(upstream);}
}
writeFileSync(join(root,'preflight-result.json'),JSON.stringify({at:new Date().toISOString(),base,externalModelCalls:0,results},null,2));console.log(JSON.stringify({passed:true,base,results}));
