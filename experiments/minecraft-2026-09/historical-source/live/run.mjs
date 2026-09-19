import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync, copyFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { startService } from 'file:///E:/Threshold%20lite/src/service.mjs';
import { startPi } from 'file:///E:/Threshold%20lite/src/pi.mjs';

const base = 'E:/Minecraft/Threshold-Experiment/live';
const core = 'E:/Threshold lite';
const config = JSON.parse(readFileSync('E:/Minecraft/Threshold-Experiment/local-config.json','utf8').replace(/^\uFEFF/,''));
const root = join(base, process.env.MC_SESSION ?? 'session-02');
if (existsSync(join(root, 'experiment.json'))) throw new Error('Session already exists; do not overwrite history');
for (const d of ['server','repo','pi','traces','recording','snapshots']) mkdirSync(join(root,d),{recursive:true});
process.env.MC_EXPERIMENT_ROOT = root;
// Use only process environment; never persist the credential in the experiment.
if (!process.env.DEEPSEEK_API_KEY) {
  const auth = JSON.parse(readFileSync('C:/Users/LOCAL_USER/.pi/agent/auth.json','utf8'));
  if (!auth.deepseek?.key) throw new Error('No configured DeepSeek credential');
  process.env.DEEPSEEK_API_KEY = auth.deepseek.key;
}
const modelConfig = JSON.parse(readFileSync(join(core,'examples/pi/models.json'),'utf8'));
modelConfig.providers.deepseek.models[0].maxTokens = 8192;
writeFileSync(join(root,'pi/models.json'),JSON.stringify(modelConfig,null,2));
const bots = { probe:'MicaProbe', a:'MicaA', b:'MicaB', c:'MicaC' };
writeFileSync(join(root,'experiment.json'),JSON.stringify({ port:25565,bots,model:'deepseek-flash',conditions:'C-prime: Threshold Task/checkpoint/Message allowed; game chat and shell tools not exposed',maxModelCalls:120,maxMinutes:20,rounds:3 },null,2));
copyFileSync(join(base,'minecraft.ts'),join(root,'minecraft.ts'));
copyFileSync('E:/Minecraft/Threshold-Experiment/server/server.jar',join(root,'server/server.jar'));
writeFileSync(join(root,'server/eula.txt'),'eula=true\n');
writeFileSync(join(root,'server/server.properties'),`server-ip=127.0.0.1\nserver-port=25565\nonline-mode=false\nenforce-secure-profile=false\nenable-rcon=false\ngamemode=survival\ndifficulty=peaceful\npvp=false\nspawn-protection=0\nmax-players=8\nview-distance=6\nsimulation-distance=6\nlevel-name=shared-world\nlevel-seed=20260918\nlevel-type=minecraft\\:flat\ngenerate-structures=false\nmotd=Threshold shared-world experiment\n`);
writeFileSync(join(root,'repo/README.md'),'# Shared Minecraft base\nThe work product is the external game world, not source code. Use mc_observe/mc_action and normal Threshold project tools.\n');
const git = (...a) => execFileSync('git',['-C',join(root,'repo'),...a],{encoding:'utf8',windowsHide:true}).trim();
git('init');git('add','README.md');git('-c','user.name=Threshold experiment','-c','user.email=experiment@localhost','commit','-m','Record shared world objective');
for (const label of Object.keys(bots)) git('worktree','add','--detach',join(root,label));

const stamp = () => new Date().toISOString();
const log = (f, row) => appendFileSync(join(root,f),JSON.stringify({timestamp:stamp(),...row})+'\n');
const pause = ms => new Promise(r=>setTimeout(r,ms));
async function until(fn, ms, label) { const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(500);}throw new Error(label+' timeout'); }
let server, service, serverExited=false, saves=0, exiting=false, textBuffer='', calls=0, experimentStarted=false;
const runs=[], workers=[], provisioned=new Set(), observers=new Set();
const send = command => { log('traces/mechanical.jsonl',{source:'server-command',command});server.stdin.write(command+'\n'); };
function playerJoined(name) {
  if (Object.values(bots).includes(name)) {
    if (provisioned.has(name)) return; provisioned.add(name);
    const index = Object.values(bots).indexOf(name);
    for (const command of [`tp ${name} -4 -60 ${index*2+2}`,`give ${name} minecraft:wooden_axe`,`give ${name} minecraft:wooden_pickaxe`,`give ${name} minecraft:wooden_hoe`,`give ${name} minecraft:bread 4`]) send(command);
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
    const term=pty.spawn(process.execPath,[join(core,'src/cli.mjs'),...args,'--home',join(root,'home')],{name:'xterm-256color',cols:118,rows:42,cwd:core,env:{...process.env,DEEPSEEK_API_KEY:'',FORCE_COLOR:'1'},useConpty:true});
    let output='';term.onData(data=>{output+=data;cast(data);});
    const killTimer=setTimeout(()=>{try{term.kill();}catch{}},12000);killTimer.unref();
    term.onExit(({exitCode})=>{clearTimeout(killTimer);log('recording/cli.jsonl',{id,label,args,at,exitCode,output});resolve();});
  });
}
async function api(path,body) {const response=await fetch(service.url+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)}); const data=await response.json();if(!response.ok)throw new Error(`${response.status} ${JSON.stringify(data)}`);return data;}
let task,project, sampler, recorder;
async function sample(){
  if(exiting)return;
  send('time query gametime');
  for(const name of provisioned){send(`data get entity ${name} Pos`);send(`data get entity ${name} Inventory`);}
  send('data get block 0 -60 0 Items');
  if(task){log('traces/project.jsonl',{board:await api(`/projects/${project.id}/board`),messages:await api(`/tasks/${task.id}/messages?after=0&limit=20`)});}
}
let recordingBusy=false,recordIndex=0;
async function recordCLI(){if(!task||recordingBusy||exiting)return;recordingBusy=true;try{
  const pick=recordIndex++%4;
  if(pick===0)await captureCLI(['board','--project',project.id],'board');
  else if(pick===1)await captureCLI(['message','read','--task',task.id,'--limit','20'],'message read');
  else {const run=runs.filter(r=>r.task_id===task.id)[(recordIndex>>1)%Math.max(1,runs.filter(r=>r.task_id===task.id).length)];if(run)await captureCLI(['status','--run',run.id],`status --run ${run.id.slice(0,8)}`);}
}finally{recordingBusy=false;}}
async function launch(taskId, label, objective) {
  const run=await api(`/tasks/${taskId}/runs`,{provider:'deepseek',model:'deepseek-flash',objective,interactive:true,workspacePath:join(root,label),extensions:[join(root,'minecraft.ts')]});
  runs.push(run);writeFileSync(join(root,'runs.json'),JSON.stringify(runs,null,2));console.log(JSON.stringify({event:'run_started',label,id:run.id}));return run;
}
async function settled(run,timeout=240000){await until(async()=>{const s=await api(`/runs/${run.id}/live`);if(!s.active)throw new Error(`Run ended: ${JSON.stringify(s.run)}`);return s.phase==='waiting for input';},timeout,'Run settle');}
try {
  server=spawn(config.java,['-Xms512M','-Xmx2G','-jar','server.jar','nogui'],{cwd:join(root,'server'),windowsHide:true,stdio:['pipe','pipe','pipe']});
  let ready=false;
  for(const stream of [server.stdout,server.stderr])stream.on('data',chunk=>{
    appendFileSync(join(root,'traces/server.log'),chunk);textBuffer+=chunk.toString();const lines=textBuffer.split(/\r?\n/);textBuffer=lines.pop();
    for(const line of lines){log('traces/mechanical.jsonl',{source:'server-console',line});if(/Done \(.+\)!/.test(line))ready=true;if(line.includes('Saved the game'))saves++;const m=line.match(/: (\w+) joined the game/);if(m)playerJoined(m[1]);}
  });
  server.on('exit',code=>{serverExited=true;log('traces/interventions.jsonl',{event:'server_exit',code});});
  server.on('error',e=>{log('traces/interventions.jsonl',{event:'server_spawn_error',error:e.message});serverExited=true;});
  await until(()=>ready,120000,'server startup');
  for(const cmd of ['time set day','gamerule doDaylightCycle false','gamerule doWeatherCycle false','gamerule doMobSpawning false','gamerule keepInventory true','setworldspawn -4 -60 4','setblock 0 -60 0 minecraft:chest','setblock 1 -60 0 minecraft:crafting_table',
    'item replace block 0 -60 0 container.0 with minecraft:oak_planks 32','item replace block 0 -60 0 container.1 with minecraft:bread 12','item replace block 0 -60 0 container.2 with minecraft:wheat_seeds 12','item replace block 0 -60 0 container.3 with minecraft:water_bucket 1','item replace block 0 -60 0 container.4 with minecraft:cobblestone 16','item replace block 0 -60 0 container.5 with minecraft:oak_sapling 4'])send(cmd);
  for(const [x,z]of[[8,0],[12,4],[8,8],[-10,-4],[-12,4],[0,-12]]){send(`fill ${x-2} -57 ${z-2} ${x+2} -55 ${z+2} minecraft:oak_leaves[persistent=true]`);send(`fill ${x} -60 ${z} ${x} -56 ${z} minecraft:oak_log`);}
  const priorSave=saves;send('save-all flush');await until(()=>saves>priorSave,30000,'initial world save');
  // Freeze a coherent initial save while file copying; resume immediately.
  send('save-off');const frozenSave=saves;send('save-all flush');await until(()=>saves>frozenSave,30000,'frozen world save');cpSync(join(root,'server/shared-world'),join(root,'snapshots/initial'),{recursive:true,filter:source=>!source.endsWith('session.lock')});send('save-on');
  service=await startService({home:join(root,'home'),agentDir:join(root,'pi'),port:0,maxParallelRuns:3,maxRuns:4,workerFactory(options){
    let worker;
    worker=startPi({...options,onEvent(event){options.onEvent(event);
      if(event.type==='turn_start'){calls++;log('traces/runtime.jsonl',{event:'model_turn',pid:worker?.pid,calls,workspace:options.cwd});if(calls>120)queueMicrotask(()=>worker.stop());}
      if(event.type==='message_end'&&event.message?.role==='assistant')log('traces/runtime.jsonl',{event:'assistant',workspace:options.cwd,content:event.message.content.filter(p=>p.type!=='thinking'),usage:event.message.usage,stopReason:event.message.stopReason});
      if(['agent_start','agent_end','agent_settled','tool_execution_start','tool_execution_end'].includes(event.type)) log('traces/runtime.jsonl',{event:event.type,workspace:options.cwd,tool:event.toolName,failed:event.isError});
    }});workers.push(worker);return worker;
  }});
  writeFileSync(join(root,'service-info.json'),JSON.stringify({url:service.url,home:join(root,'home'),serverPid:server.pid,operatorPid:process.pid}));
  project=await api('/projects',{name:'Minecraft · Shared Base',repoPath:join(root,'repo')});
  const pilot=await api('/tasks',{projectId:project.id,title:'接入检查（不参与协作）',instructions:'这是单 worker 接入检查。你控制自己的 Minecraft bot。调用 read_task，再 mc_observe，使用 mc_action move 移动约2格，再 mc_observe。不要改变方块或公共箱子。存 checkpoint 并简短报告；不用读文件、Git 或编写代码。不要声称社会实验已成功。'});
  const pilotRun=await launch(pilot.id,'probe','验证真实模型通过工具观察和移动；完成后结束本轮回复。');
  await settled(pilotRun);const pilotState=await api(`/runs/${pilotRun.id}`);writeFileSync(join(root,'pilot.json'),JSON.stringify(pilotState,null,2));
  if(!pilotState.runtimeObservation.toolNames.includes('mc_action') || !readFileSync(join(root,'traces/MicaProbe/actions.jsonl'),'utf8').split('\n').filter(Boolean).map(JSON.parse).some(a=>a.event==='completed'))throw new Error('Pilot did not use real Minecraft action');
  await api(`/runs/${pilotRun.id}/stop`,{});
  task=await api('/tasks',{projectId:project.id,title:'一起建立可继续发展的共享基地',instructions:'你们是三个独立、平等的 Minecraft 工作者。共同目标：建立可共同使用的庇护空间、公共储物，以及食物补充来源。没有预设职业或队长，由你根据现场自行判断下一步；可以交流，也可以独立行动。所有人初始工具相同。场景是受控平坦草地，固定白天、和平、无怪物；中央(0,-60,0)有公共箱子，旁边有工作台，周围六棵测试树。箱子初始材料只是起始条件，当前内容必须重新检查。工具看到的是有界已加载世界，不是全知视角。其他人可能改动世界；Message/checkpoint只是协作输入。游戏聊天、shell和文件工具本轮未暴露；通过正常项目工具沟通，用mc工具工作。无需调查代码或Git。不要读取其他任务（接入检查与协作无关）。不要向人类寻求分工。每轮最多8次改变世界的mc_action调用（接口硬上限10），可以少做；需要时先观察、核对。做一个有用增量后保存简洁checkpoint并回复，等待下一轮中性继续提示。不要伪造完成、不要为了合作而表演一致。允许不同意其他人的判断，说明实际观察。用中文写Message和工作摘要。'});
  writeFileSync(join(root,'project-task.json'),JSON.stringify({project,task},null,2));
  sampler=setInterval(()=>sample().catch(e=>log('traces/interventions.jsonl',{event:'sampling_error',error:e.message})),10000);
  recorder=setInterval(()=>recordCLI().catch(e=>log('traces/interventions.jsonl',{event:'record_error',error:e.message})),15000);
  await captureCLI(['board','--project',project.id],'board');
  writeFileSync(join(root,'READY.json'),JSON.stringify({ready:true,url:service.url,server:'127.0.0.1:25565',projectId:project.id,taskId:task.id,pilotRun:pilotRun.id}));
  console.log('READY_FOR_RECORDING: waiting for start.flag');
  await until(()=>existsSync(join(root,'start.flag')),1200000,'recording start');
  experimentStarted=true;const deadline=Date.now()+20*60000;
  log('traces/interventions.jsonl',{event:'formal_start'});
  for(const label of ['a','b','c'])await launch(task.id,label,'独立观察当前世界，为共同基地选择一个有用增量并行动；没有分配给你的固定角色。遵守每轮动作预算，用事实区分计划和已完成。');
  for(let round=1;round<=3;round++){
    const peers=runs.filter(r=>r.task_id===task.id);
    await until(async()=>{if(calls>=120||Date.now()>deadline)throw new Error('Experiment budget reached');const states=await Promise.all(peers.map(r=>api(`/runs/${r.id}/live`)));return states.every(s=>!s.active||s.phase==='waiting for input');},Math.max(1000,deadline-Date.now()),'peer round');
    log('traces/interventions.jsonl',{event:'round_settled',round,calls});console.log(JSON.stringify({round,calls}));await captureCLI(['board','--project',project.id],'board');
    if(round<3)for(const r of peers){const s=await api(`/runs/${r.id}/live`);if(s.active)await api(`/runs/${r.id}/input`,{message:`第${round+1}轮。重新观察现实和需要的项目信息，自行选择下一个有用增量。每轮最多8个改变世界的动作调用；不要求必须合作或采纳他人的判断。完成后checkpoint并回复。`});}
  }
  await sample();
  writeFileSync(join(root,'final-project.json'),JSON.stringify({task:await api(`/tasks/${task.id}`),board:await api(`/projects/${project.id}/board`),messages:await api(`/tasks/${task.id}/messages?after=0&limit=20`)},null,2));
  console.log('EXPERIMENT_FINISHED');
}catch(e){log('traces/interventions.jsonl',{event:'operator_error',error:e.message});console.error(e.message);process.exitCode=1;}
finally{
  exiting=true;clearInterval(sampler);clearInterval(recorder);
  if(service){for(const r of runs)try{await api(`/runs/${r.id}/stop`,{});}catch{}try{await service.close();}catch{}}
  if(server&&!serverExited){send('stop');try{await until(()=>serverExited,30000,'server stop');}catch{server.kill();}}
  if(existsSync(join(root,'server/shared-world')))cpSync(join(root,'server/shared-world'),join(root,'snapshots/final'),{recursive:true});
  writeFileSync(join(root,'finished.json'),JSON.stringify({at:stamp(),calls,experimentStarted,serverExited,runIds:runs.map(r=>r.id)},null,2));
}
