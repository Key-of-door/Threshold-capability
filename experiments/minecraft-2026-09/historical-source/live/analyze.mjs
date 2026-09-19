import {readFileSync,writeFileSync,readdirSync,statSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
const root='E:/Minecraft/Threshold-Experiment/live/session-02';
const lines=f=>readFileSync(f,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const db=new DatabaseSync(join(root,'home/project.sqlite'),{readOnly:true});
const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name);
const snapshots={};for(const table of ['projects','tasks','runs','messages','checkpoints'])if(tables.includes(table))snapshots[table]=db.prepare(`SELECT * FROM ${table}`).all();
db.close();
// Export only selected ordinary collaboration state, never credential or token tables.
for(const run of snapshots.runs??[])for(const key of Object.keys(run))if(/token|secret/i.test(key))delete run[key];
writeFileSync(join(root,'final-database-state.json'),JSON.stringify(snapshots,null,2));
const runtime=lines(join(root,'traces/runtime.jsonl')),stats={};
for(const bot of ['MicaProbe','MicaA','MicaB','MicaC']){
 const folder=join(root,'traces',bot),epistemic=lines(join(folder,'epistemic.jsonl')),pub=lines(join(folder,'public-output.jsonl')),actions=lines(join(folder,'actions.jsonl'));
 const observations=lines(join(folder,'observations.jsonl'));
 const usage={input:0,cacheRead:0,output:0,reasoning:0,totalTokens:0};let maxContext=0;
 for(const e of pub){for(const key of Object.keys(usage))usage[key]+=e.usage?.[key]??0;maxContext=Math.max(maxContext,(e.usage?.input??0)+(e.usage?.cacheRead??0));}
 stats[bot]={modelRequestPrepared:epistemic.filter(e=>e.event==='provider_request_prepared').length,responseHeaders:epistemic.filter(e=>e.event==='provider_response_headers_received').length,assistantMessages:pub.length,actionCalls:actions.filter(e=>e.event==='requested').length,actionErrors:actions.filter(e=>e.event==='error').map(e=>({at:e.timestamp,id:e.action_id,error:e.error})),observations:observations.length,messageReads:epistemic.filter(e=>e.event==='tool_result_available'&&e.tool==='read_messages').length,usage,maxContext};
}
const world=JSON.parse(readFileSync(join(root,'world-diff.json'),'utf8'));
const checks={};for(const y of [-60,-59,-58]){checks[y]=[];for(let z=3;z<=6;z++){let row='';for(let x=-2;x<=1;x++){row+=world.changes.some(c=>c.position===`${x},${y},${z}`&&c.after.Name==='minecraft:oak_planks')?'#':'.';}checks[y].push(row);}}
writeFileSync(join(root,'summary-data.json'),JSON.stringify({stats,roofLayers:checks,worldChanges:world.counts,finalRuns:snapshots.runs.map(r=>({id:r.id,session_id:r.session_id,status:r.status,exit_code:r.exit_code,error:r.error})),messages:snapshots.messages.length},null,2));
console.log(JSON.stringify({stats,roofLayers:checks,finalRuns:snapshots.runs.map(r=>({id:r.id,status:r.status,exit_code:r.exit_code,error:r.error})),messages:snapshots.messages.length},null,2));
// Check text artifacts for accidental credential literals; report paths only.
const found=[];function scan(path){for(const name of readdirSync(path)){const p=join(path,name);if(statSync(p).isDirectory()){if(!['.git','snapshots','server','home','frames'].includes(name))scan(p);}else if(/\.(?:jsonl?|mjs|ts|md|html|cast|txt)$/.test(name)&&/sk-[a-zA-Z0-9]{20,}/.test(readFileSync(p,'utf8')))found.push(p);}}scan(root);console.log(JSON.stringify({credentialLiteralMatches:found}));
