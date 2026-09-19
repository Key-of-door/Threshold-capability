import {readFileSync,writeFileSync,createReadStream} from 'node:fs';
import {join} from 'node:path';
import readline from 'node:readline';
import {createRequire} from 'node:module';
import {scan} from '../resource-pair-01/scan-world.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/run-07/r01';
const rows=p=>readFileSync(p,'utf8').split('\n').filter(Boolean).flatMap(l=>{try{return[JSON.parse(l)]}catch{return[]}});
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const index=json(join(root,'observer-index.json')),summary=json(join(root,'summary-data.json')),iv=rows(join(root,'traces/interventions.jsonl'));
const initial=await scan(join(root,'snapshots/initial')),final=await scan(join(root,'snapshots/final'));
const nbt=createRequire('E:/Minecraft/Threshold-Experiment/package.json')('prismarine-nbt');
const clock=async path=>{const {Data}=nbt.simplify((await nbt.parse(readFileSync(join(path,'level.dat')))).parsed);return {time:Data.Time,dayTime:Data.DayTime};};
const facts=json(join(root,'world-facts.json'));
const result={start:iv.find(x=>x.event==='formal_start')?.timestamp,lastSettled:iv.filter(x=>x.event==='segment_settled').at(-1)?.timestamp,clocks:{initial:await clock(join(root,'snapshots/initial')),final:await clock(join(root,'snapshots/final'))},counts:{initial:facts.initial.counts,final:facts.final.counts},bots:{},initialContainers:initial.containers,finalContainers:final.containers,geometry:[]};
for(const bot of ['MicaA','MicaB','MicaC']){
 const folder=join(root,'traces',bot),actions=rows(join(folder,'actions.jsonl')),obs=rows(join(folder,'observations.jsonl')),pub=rows(join(folder,'public-output.jsonl'));
 const byId=new Map(actions.filter(x=>x.event==='requested').map(x=>[x.action_id,x]));
 let first;
 for await(const line of readline.createInterface({input:createReadStream(join(folder,'epistemic.jsonl')),crlfDelay:Infinity})){const e=JSON.parse(line);if(e.event==='provider_request_prepared'){first={at:e.timestamp,roles:e.payload.messages.map(m=>m.role),tools:e.payload.tools.map(t=>t.function?.name??t.name),assistantMessages:e.payload.messages.filter(m=>m.role==='assistant').length};break;}}
 const stat=summary.stats[bot];
 const calls=pub.flatMap(e=>(e.content??[]).filter(c=>c.type==='toolCall').map(c=>({at:e.timestamp,...c})));
 result.bots[bot]={stats:{calls:stat.modelRequestPrepared,actions:stat.actionCalls,actionErrors:stat.actionErrors.length,observationResults:stat.observations,maxContext:stat.maxContext,usage:stat.usage},firstRequest:first,firstObservations:obs.slice(0,7),firstObserveCalls:calls.filter(x=>x.name==='mc_observe').slice(0,7),materialTransfers:actions.filter(e=>e.event!=='requested'&&['deposit','withdraw','craft'].includes(byId.get(e.action_id)?.args.action)).map(e=>({...e,args:byId.get(e.action_id)?.args,observedInventory:obs.find(o=>o.action_id===e.action_id)?.inventory})),publicText:pub.flatMap(e=>{const text=(e.content??[]).filter(c=>c.type==='text').map(c=>c.text).join('\n');return text?[{at:e.timestamp,text}]:[]}),placementAttempts:actions.filter(e=>e.event!=='requested'&&byId.get(e.action_id)?.args.action==='place').map(e=>({...e,args:byId.get(e.action_id)?.args}))};
}
for(let y=-62;y<=-58;y++)for(let z=-6;z<=-1;z++){const cells=[];for(let x=8;x<=13;x++){const key=`${x},${y},${z}`;cells.push({x,block:final.blocks.get(key)?.Name??'minecraft:air'});}result.geometry.push({y,z,cells});}
writeFileSync(join(root,'selected-episodes.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({start:result.start,lastSettled:result.lastSettled,clocks:result.clocks,counts:result.counts,bots:Object.fromEntries(Object.entries(result.bots).map(([b,v])=>[b,{stats:v.stats,firstRequest:v.firstRequest,shovelTransfers:v.materialTransfers.filter(e=>e.args.item==='stone_shovel').map(e=>({at:e.timestamp,event:e.event,args:e.args})),breadCrafts:v.materialTransfers.filter(e=>e.args.action==='craft'&&e.args.item==='bread').map(e=>({at:e.timestamp,event:e.event,args:e.args}))}]))}));
