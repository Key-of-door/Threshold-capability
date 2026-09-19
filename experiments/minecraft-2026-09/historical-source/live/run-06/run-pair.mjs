import {startGate,BOOT,OBJECTIVE,NEXT,END} from './shared.mjs';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync, copyFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { startService } from 'file:///E:/Threshold%20lite/src/service.mjs';
import { startPi } from 'file:///E:/Threshold%20lite/src/pi.mjs';

const base = 'E:/Minecraft/Threshold-Experiment/live';
const core = 'E:/Threshold lite';
const config = JSON.parse(readFileSync('E:/Minecraft/Threshold-Experiment/local-config.json','utf8').replace(/^\uFEFF/,''));
const arm=process.env.MC_ARM;
if(!['r17','r42'].includes(arm))throw Error('Unknown arm');
const pair=join(base,'run-06');
const root=join(pair,arm);
const historyAvailable=JSON.parse(readFileSync(join(pair,'fork-manifest.json'),'utf8')).conditions.find(x=>x.id===arm).historyAvailable;
const prior=join(base,'resource-pair-01/intervention');
if(!existsSync(join(pair,'fork-manifest.json')))throw Error('Prepare and verify matched forks first');
if (existsSync(join(root, 'experiment.json'))) throw new Error('Session already exists; do not overwrite history');
for (const d of ['server','repo','pi','traces','recording','snapshots']) mkdirSync(join(root,d),{recursive:true});
process.env.MC_EXPERIMENT_ROOT = root;
// Use only process environment; never persist the credential in the experiment.
if (!process.env.DEEPSEEK_API_KEY) throw new Error('Set authorized experiment key in process environment');
const modelConfig = JSON.parse(readFileSync(join(prior,'pi/models.json'),'utf8'));
modelConfig.providers.deepseek.models[0].maxTokens = 384000;
modelConfig.providers.deepseek.models[0].contextWindow = 1000000;
writeFileSync(join(root,'pi/models.json'),JSON.stringify(modelConfig,null,2));
const bots = { a:'MicaA', b:'MicaB', c:'MicaC' };
writeFileSync(join(root,'experiment.json'),JSON.stringify({ port:25565,bots,historyAvailable,model:'deepseek-flash',conditions:'Paired project history availability; same prior resource-arm world; identical mechanics and common task/prompts; no roles or required messaging',arm,maxModelCalls:600,maxMinutes:30,segmentsPerWorker:12,maxOutputTokens:384000,contextWindow:1000000,softStop:{calls:500,minutes:25,cumulativeTokens:60000000,outputTokens:750000},hardStop:{calls:600,minutes:30,cumulativeTokens:80000000,outputTokens:1000000} },null,2));
for(const file of ['minecraft.ts','minecraft-actions.mjs','minecraft-windows.mjs'])copyFileSync(join(pair,'adapter',file),join(root,file));
// Prepared world and database are independent immutable-source forks; never
// seed the second arm from the first arm's newly created history.
if(!existsSync(join(root,'server/shared-world/level.dat'))||!existsSync(join(root,'home/project.sqlite')))throw Error('Prepared fork missing');
copyFileSync('E:/Minecraft/Threshold-Experiment/server/server.jar',join(root,'server/server.jar'));
writeFileSync(join(root,'server/eula.txt'),'eula=true\n');
writeFileSync(join(root,'server/server.properties'),`server-ip=127.0.0.1\nserver-port=25565\nonline-mode=false\nenforce-secure-profile=false\nenable-rcon=false\ngamemode=survival\ndifficulty=peaceful\npvp=false\nspawn-protection=0\nmax-players=8\nview-distance=6\nsimulation-distance=6\nlevel-name=shared-world\nlevel-seed=20260918\nlevel-type=minecraft\\:flat\ngenerate-structures=false\nmotd=Threshold shared-world experiment\n`);
writeFileSync(join(root,'repo/README.md'),'# Shared Minecraft base\nThe work product is the external game world, not source code. Use mc_observe/mc_action and normal Threshold project tools.\n');
const git = (...a) => execFileSync('git',['-C',JSON.parse(readFileSync(join(prior,'project-task.json'),'utf8')).project.repo_path,...a],{encoding:'utf8',windowsHide:true}).trim();
for (const label of Object.keys(bots)) git('worktree','add','--detach',join(root,label));

const stamp = () => new Date().toISOString();
const log = (f, row) => appendFileSync(join(root,f),JSON.stringify({timestamp:stamp(),...row})+'\n');
const pause = ms => new Promise(r=>setTimeout(r,ms));
async function until(fn, ms, label) { const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(500);}throw new Error(label+' timeout'); }
let server, service, serverExited=false, saves=0, exiting=false, textBuffer='', calls=0, experimentStarted=false,totalTokens=0,outputTokens=0,deadline=Infinity,softDeadline=Infinity;
const runs=[], workers=[], provisioned=new Set(), observers=new Set();
const send = command => { log('traces/mechanical.jsonl',{source:'server-command',command});server.stdin.write(command+'\n'); };
function playerJoined(name) {
  if (Object.values(bots).includes(name)) {
    if (provisioned.has(name)) return; provisioned.add(name);
    log('traces/interventions.jsonl',{event:'existing_bot_rejoined',name,inventory:'preserved from previous world; no provisioning or teleport'});
  } else {
    observers.add(name); send(`gamemode spectator ${name}`);send(`tp ${name} 2 -48 10 180 55`);
    log('traces/interventions.jsonl',{event:'human_observer_join',name,change:'spectator only'});
  }
}
const require = createRequire('E:/Threshold-film-2/recording/package.json');
const pty = require('node-pty');
let cliSequence=0;
const castFile=join(root,'recording/threshold.cast'), castStart=Date.now();
writeFileSync(castFile,JSON.stringify({version:2,width:118,height:42,timestamp:Math.floor(castStart/1000),env:{TERM:'xterm-256color'},title:'Threshold Minecraft — actual CLI snapshots'})+'\n');
function cast(data){appendFileSync(castFile,JSON.stringify([(Date.now()-castStart)/1000,'o',data])+'\n');}
async function captureCLI(args,label) {
  const id=++cliSequence, at=stamp();
  cast('\x1b[2J\x1b[H'+`Threshold Minecraft | ${at}\r\n> threshold ${label}\r\n\r\n`);
  return new Promise(resolve=>{
    const cliEnv={...process.env,DEEPSEEK_API_KEY:'',FORCE_COLOR:'1'};delete cliEnv.NO_COLOR;
    const term=pty.spawn(process.execPath,[join(core,'src/cli.mjs'),...args,'--home',join(root,'home')],{name:'xterm-256color',cols:118,rows:42,cwd:core,env:cliEnv,useConpty:true});
    let output='';term.onData(data=>{output+=data;cast(data);});
    const killTimer=setTimeout(()=>{try{term.kill();}catch{}},12000);killTimer.unref();
    term.onExit(({exitCode})=>{clearTimeout(killTimer);log('recording/cli.jsonl',{id,label,args,at,exitCode,output});resolve();});
  });
}
async function api(path,body) {const response=await fetch(service.url+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)}); const data=await response.json();if(!response.ok)throw new Error(`${response.status} ${JSON.stringify(data)}`);return data;}
let task,project, sampler, recorder, gate;
async function allMessages(){const messages=[];let after=0,more=true;while(more){const page=await api(`/tasks/${task.id}/messages?after=${after}&limit=20`);messages.push(...page.messages);more=page.hasMore;after=page.nextAfter;}return {messages,nextAfter:after,hasMore:false};}

async function sample(){
  if(exiting)return;
  send('time query gametime');
  for(const name of provisioned){send(`data get entity ${name} Pos`);send(`data get entity ${name} Inventory`);}
  send('data get block 0 -60 0 Items');send('data get block 3 -60 2 Items');send('data get block -1 -60 0');
  if(task){const messages=[];let after=0,more=true;while(more){const page=await api(`/tasks/${task.id}/messages?after=${after}&limit=20`);messages.push(...page.messages);more=page.hasMore;after=page.nextAfter;}
    const observation={at:stamp(),board:await api(`/projects/${project.id}/board`),task:await api(`/tasks/${task.id}`),messages,runs:await Promise.all(runs.map(r=>api(`/runs/${r.id}`)))};log('traces/project.jsonl',observation);writeFileSync(join(root,'observed-project.json'),JSON.stringify(observation,null,2));}
}
let recordingBusy=false,recordIndex=0;
async function recordCLI(){if(!task||recordingBusy||exiting)return;recordingBusy=true;try{
  const pick=recordIndex++%4;
  if(pick===0)await captureCLI(['board','--project',project.id],'board');
  else if(pick===1){const p=await allMessages();await captureCLI(['message','read','--task',task.id,'--after',String(Math.max(0,(p.nextAfter??0)-6)),'--limit','20'],'message read (recent)');}
  else {const run=runs.filter(r=>r.task_id===task.id)[(recordIndex>>1)%Math.max(1,runs.filter(r=>r.task_id===task.id).length)];if(run)await captureCLI(['status','--run',run.id],`status --run ${run.id.slice(0,8)}`);}
}finally{recordingBusy=false;}}
async function launch(taskId, label, objective) {
  const run=await api(`/tasks/${taskId}/runs`,{provider:'deepseek',model:'deepseek-flash',objective,interactive:true,workspacePath:join(root,label),extensions:[join(root,'minecraft.ts'),join(pair,'channel.ts')]});
  runs.push(run);writeFileSync(join(root,'runs.json'),JSON.stringify(runs,null,2));console.log(JSON.stringify({event:'run_started',label,id:run.id}));return run;
}
async function settled(run,timeout=240000){await until(async()=>{const s=await api(`/runs/${run.id}/live`);if(!s.active)throw new Error(`Run ended: ${JSON.stringify(s.run)}`);return s.phase==='waiting for input';},timeout,'Run settle');}
try {
  server=spawn(config.java,['-Xms512M','-Xmx2G','-jar','server.jar','nogui'],{cwd:join(root,'server'),windowsHide:true,stdio:['pipe','pipe','pipe']});
  let ready=false,frozen=false;
  for(const stream of [server.stdout,server.stderr])stream.on('data',chunk=>{
    appendFileSync(join(root,'traces/server.log'),chunk);textBuffer+=chunk.toString();const lines=textBuffer.split(/\r?\n/);textBuffer=lines.pop();
    for(const line of lines){log('traces/mechanical.jsonl',{source:'server-console',line});if(/Done \(.+\)!/.test(line)){ready=true;send('tick freeze');}if(/The game is frozen/.test(line))frozen=true;if(line.includes('Saved the game'))saves++;const m=line.match(/: (\w+) joined the game/);if(m)playerJoined(m[1]);}
  });
  server.on('exit',code=>{serverExited=true;log('traces/interventions.jsonl',{event:'server_exit',code});});
  server.on('error',e=>{log('traces/interventions.jsonl',{event:'server_spawn_error',error:e.message});serverExited=true;});
  await until(()=>ready&&frozen,120000,'server startup and tick freeze');
  send('time query gametime');
  // The fork has its pre-verified resource condition. No runtime provisioning or repairs.
  // Keep ticks frozen during the human recording wait in BOTH arms.
  const priorSave=saves;send('save-all flush');await until(()=>saves>priorSave,30000,'initial world save');
  // Freeze a coherent initial save while file copying; resume immediately.
  send('save-off');const frozenSave=saves;send('save-all flush');await until(()=>saves>frozenSave,30000,'frozen world save');cpSync(join(root,'server/shared-world'),join(root,'snapshots/initial'),{recursive:true,filter:source=>!source.endsWith('session.lock')});send('save-on');
  service=await startService({home:join(root,'home'),agentDir:join(root,'pi'),port:0,maxParallelRuns:3,maxRuns:20,workerFactory(options){
    let worker;
    worker=startPi({...options,env:{...options.env,THRESHOLD_SERVICE_URL:gate.url},onEvent(event){options.onEvent(event);
      if(event.type==='turn_start'){calls++;log('traces/runtime.jsonl',{event:'model_turn',pid:worker?.pid,calls,workspace:options.cwd});}
      if(event.type==='message_end'&&event.message?.role==='assistant'){totalTokens+=event.message.usage?.totalTokens??0;outputTokens+=event.message.usage?.output??0;log('traces/runtime.jsonl',{event:'assistant',workspace:options.cwd,content:event.message.content.filter(p=>p.type!=='thinking'),usage:event.message.usage,stopReason:event.message.stopReason});}
      if(['agent_start','agent_end','agent_settled','tool_execution_start','tool_execution_end'].includes(event.type)) log('traces/runtime.jsonl',{event:event.type,workspace:options.cwd,tool:event.toolName,failed:event.isError});
    }});workers.push(worker);let first=true;return {...worker,turn(message,...args){if(first){first=false;log('traces/interventions.jsonl',{event:'bootstrap_replaced',workspace:options.cwd,original:message,actual:BOOT});message=BOOT;}return worker.turn(message,...args);}};
  }});
  gate=await startGate(service.url,historyAvailable,row=>log('traces/channel.jsonl',row));
  writeFileSync(join(root,'service-info.json'),JSON.stringify({url:service.url,home:join(root,'home'),serverPid:server.pid,operatorPid:process.pid}));
  ({project,task}=JSON.parse(readFileSync(join(prior,'project-task.json'),'utf8')));
  writeFileSync(join(root,'project-task.json'),JSON.stringify({project,task},null,2));
  sampler=setInterval(()=>sample().catch(e=>log('traces/interventions.jsonl',{event:'sampling_error',error:e.message})),10000);
  recorder=setInterval(()=>recordCLI().catch(e=>log('traces/interventions.jsonl',{event:'record_error',error:e.message})),15000);
  await captureCLI(['board','--project',project.id],'board');
  writeFileSync(join(root,'READY.json'),JSON.stringify({ready:true,url:service.url,server:'127.0.0.1:25565',projectId:project.id,taskId:task.id}));
  console.log('READY_FOR_RECORDING: waiting for start.flag');
  await until(()=>existsSync(join(root,'start.flag')),1200000,'recording start');
  send('tick unfreeze');send('time query gametime');
  experimentStarted=true;deadline=Date.now()+30*60000;softDeadline=Date.now()+25*60000;
  log('traces/interventions.jsonl',{event:'formal_start'});
  for(const label of ['a','b','c'])await launch(task.id,label,OBJECTIVE);
  const segments=new Map(runs.map(r=>[r.id,{count:1,seenWorking:false,finishing:false,done:false}]));
  let lastSnapshot=Date.now();
  while([...segments.values()].some(s=>!s.done)){
    if(calls>=600||Date.now()>deadline||totalTokens>=80000000||outputTokens>=1000000){log('traces/interventions.jsonl',{event:'hard_budget_stop',calls,totalTokens,outputTokens});break;}
    const closing=calls>=500||Date.now()>softDeadline||totalTokens>=60000000||outputTokens>=750000;
    for(const run of runs){const s=segments.get(run.id);if(s.done)continue;const view=await api(`/runs/${run.id}/live`);
      if(!view.active){s.done=true;continue;}if(view.phase!=='waiting for input'){s.seenWorking=true;continue;}if(!s.seenWorking)continue;
      log('traces/interventions.jsonl',{event:'segment_settled',runId:run.id,segment:s.count,calls,finishing:s.finishing});
      if(s.finishing||s.count>=12){s.done=true;continue;}
      s.finishing=closing||s.count===11;s.count++;s.seenWorking=false;
      await api(`/runs/${run.id}/input`,{message:s.finishing?END:NEXT});
      log('traces/interventions.jsonl',{event:'segment_input',runId:run.id,segment:s.count,finishing:s.finishing});
    }
    if(Date.now()-lastSnapshot>90000){send('save-off');const last=saves;send('save-all flush');await until(()=>saves>last,30000,'periodic world save');cpSync(join(root,'server/shared-world'),join(root,'snapshots',`during-${Date.now()}`),{recursive:true,filter:s=>!s.endsWith('session.lock')});send('save-on');lastSnapshot=Date.now();}
    await pause(500);
  }
  writeFileSync(join(root,'segments.json'),JSON.stringify(Object.fromEntries(segments),null,2));
  await sample();
  writeFileSync(join(root,'final-project.json'),JSON.stringify({task:await api(`/tasks/${task.id}`),board:await api(`/projects/${project.id}/board`),messages:await allMessages()},null,2));
  console.log('EXPERIMENT_FINISHED');
}catch(e){log('traces/interventions.jsonl',{event:'operator_error',error:e.message});console.error(e.message);process.exitCode=1;}
finally{
  exiting=true;clearInterval(sampler);clearInterval(recorder);
  if(service){for(const r of runs)try{await api(`/runs/${r.id}/stop`,{});}catch{}try{await service.close();}catch{}}
  if(gate)await gate.close();
  if(server&&!serverExited){send('stop');try{await until(()=>serverExited,30000,'server stop');}catch{server.kill();}}
  if(existsSync(join(root,'server/shared-world')))cpSync(join(root,'server/shared-world'),join(root,'snapshots/final'),{recursive:true});
  writeFileSync(join(root,'finished.json'),JSON.stringify({at:stamp(),calls,totalTokens,outputTokens,experimentStarted,serverExited,runIds:runs.map(r=>r.id)},null,2));
}
