import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';import {join} from 'node:path';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';
import {scan} from '../resource-pair-01/scan-world.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/run-06/r17';
const rows=p=>readFileSync(p,'utf8').split('\n').filter(Boolean).map(JSON.parse);
const data={fenceChain:{},mining:{},craftAnomaly:{}};
const initial=await scan(join(root,'snapshots/initial'));
data.fenceChain.initialFences=[...initial.blocks].filter(([p,b])=>b.Name==='minecraft:oak_fence').map(([position,block])=>({position,block}));
data.fenceChain.claims=rows(join(root,'traces/MicaB/public-output.jsonl')).filter(e=>e.content?.some(c=>c.type==='text'&&/围栏|栅栏/.test(c.text))).map(e=>({at:e.timestamp,text:e.content.filter(c=>c.type==='text').map(c=>c.text).join('\n')}));
for(const bot of ['MicaB','MicaC']){const a=rows(join(root,'traces',bot,'actions.jsonl')),o=rows(join(root,'traces',bot,'observations.jsonl'));const ids=new Set(a.filter(e=>e.event==='requested'&&e.args.item==='oak_fence').map(e=>e.action_id));data.fenceChain[bot]={actions:a.filter(e=>ids.has(e.action_id)),results:o.filter(e=>ids.has(e.action_id))};}
const a=rows(join(root,'traces/MicaA/actions.jsonl')),o=rows(join(root,'traces/MicaA/observations.jsonl'));
data.mining.actions=a.filter(e=>e.event==='requested'&&(e.args.action==='dig'||e.args.action==='equip'||['iron_pickaxe','cobblestone','stone_axe','stone_hoe'].includes(e.args.item)));
data.mining.publicClaims=rows(join(root,'traces/MicaA/public-output.jsonl')).filter(e=>e.content?.some(c=>c.type==='text'&&/石镐|铁镐|石头|圆石/.test(c.text))).map(e=>({at:e.timestamp,text:e.content.filter(c=>c.type==='text').map(c=>c.text).join('\n')}));
const require=createRequire('E:/Minecraft/Threshold-Experiment/package.json'),nbt=require('prismarine-nbt');const b=createHash('md5').update('OfflinePlayer:MicaA').digest();b[6]=(b[6]&15)|48;b[8]=(b[8]&63)|128;const s=b.toString('hex'),uuid=[s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');
data.mining.selectedHandSnapshots=[];for(const stage of readdirSync(join(root,'snapshots'))){const p=join(root,'snapshots',stage,'playerdata',uuid+'.dat');if(!existsSync(p))continue;const d=nbt.simplify((await nbt.parse(readFileSync(p))).parsed);data.mining.selectedHandSnapshots.push({stage,at:stage.startsWith('during-')?new Date(Number(stage.slice(7))).toISOString():stage,slot:d.SelectedItemSlot,item:d.Inventory.find(i=>i.Slot===d.SelectedItemSlot)??null});}
data.craftAnomaly.observations=rows(join(root,'traces/MicaC/observations.jsonl')).filter(e=>e.timestamp>='2026-09-18T18:23:20'&&e.timestamp<='2026-09-18T18:23:45');
data.craftAnomaly.server=rows(join(root,'traces/mechanical.jsonl')).filter(e=>e.timestamp>='2026-09-18T18:23:20'&&e.timestamp<='2026-09-18T18:23:50'&&e.line?.includes('MicaC has the following entity data'));
data.craftAnomaly.registry={item848:require('minecraft-data')('1.21.1').items[848].name,item132:require('minecraft-data')('1.21.1').items[132].name,causalLimit:'Temporal request/result/state association; source of unexpected logs and window transaction root cause not established.'};
writeFileSync(join(root,'selected-episodes.json'),JSON.stringify(data,null,2));console.log(JSON.stringify({selectedHandSnapshots:data.mining.selectedHandSnapshots,fenceActors:Object.keys(data.fenceChain)}));
