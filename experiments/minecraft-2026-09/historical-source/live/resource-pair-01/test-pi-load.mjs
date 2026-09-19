import {mkdirSync,writeFileSync,copyFileSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {startPi} from 'file:///E:/Threshold%20lite/src/pi.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/resource-pair-01',probe=join(root,'pi-load-check');
mkdirSync(join(probe,'a'),{recursive:true});mkdirSync(join(probe,'pi'),{recursive:true});
copyFileSync('E:/Minecraft/Threshold-Experiment/live/session-05/pi/models.json',join(probe,'pi/models.json'));
writeFileSync(join(probe,'experiment.json'),JSON.stringify({bots:{a:'ProbeOnly'},port:25566}));
writeFileSync(join(probe,'probe.ts'),`import {writeFileSync} from 'node:fs'; export default function(pi:any){pi.registerCommand('probe-tools',{description:'local test only',handler:async()=>{writeFileSync(${JSON.stringify(join(probe,'tools.json'))},JSON.stringify({active:pi.getActiveTools(),all:pi.getAllTools()},null,2));}});}`);
const worker=startPi({cwd:join(probe,'a'),agentDir:join(probe,'pi'),provider:'deepseek',model:'deepseek-flash',env:{MC_EXPERIMENT_ROOT:probe,DEEPSEEK_API_KEY:''},capabilities:{skills:[],extensions:[{path:join(root,'adapter/minecraft.ts')},{path:join(probe,'probe.ts')}]}});
try{
 await worker.request('get_state');await worker.request('prompt',{message:'/probe-tools'});
 await new Promise(r=>setTimeout(r,250));const t=JSON.parse(readFileSync(join(probe,'tools.json'),'utf8'));
 assert.ok(t.active.includes('mc_observe'));assert.ok(t.active.includes('mc_action'));assert.ok(!t.active.includes('bash'));
 const obs=t.all.find(x=>x.name==='mc_observe'),action=t.all.find(x=>x.name==='mc_action');
 assert.ok(obs.parameters.properties.furnace);assert.ok(JSON.stringify(action.parameters).includes('furnace_take_output'));
 console.log('Real pinned Pi loaded paired extension and furnace schemas; no model request or bot connection.');
}finally{await worker.stop();}
