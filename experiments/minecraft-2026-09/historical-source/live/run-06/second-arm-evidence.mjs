import {readFileSync,writeFileSync} from 'node:fs';import {join} from 'node:path';
const root='E:/Minecraft/Threshold-Experiment/live/run-06/r42',rows=p=>readFileSync(p,'utf8').split('\n').filter(Boolean).map(JSON.parse);
const index=JSON.parse(readFileSync(join(root,'observer-index.json'),'utf8'));
const output={messageReads:Object.fromEntries(Object.entries(index).map(([b,v])=>[b,v.messageReads])),furnace:{},sword:{},timeBelief:{}};
for(const bot of ['MicaA','MicaC']){const a=rows(join(root,'traces',bot,'actions.jsonl')),o=rows(join(root,'traces',bot,'observations.jsonl'));const ids=new Set(a.filter(e=>e.event==='requested'&&(e.args.action.startsWith('furnace')||['charcoal','oak_log'].includes(e.args.item))).map(e=>e.action_id));output.furnace[bot]={actions:a.filter(e=>ids.has(e.action_id)),results:o.filter(e=>ids.has(e.action_id))};}
const pub=rows(join(root,'traces/MicaB/public-output.jsonl'));
output.sword.publicClaims=pub.filter(e=>e.content?.some(c=>c.type==='text'&&/石剑|木剑/.test(c.text))).map(e=>({at:e.timestamp,text:e.content.filter(c=>c.type==='text').map(c=>c.text).join('\n')}));
output.sword.actualBoxObservations=rows(join(root,'traces/MicaB/observations.jsonl')).filter(e=>e.container?.items?.some(i=>i.name==='stone_sword')).map(e=>({at:e.timestamp,actionId:e.action_id,container:e.container}));
output.timeBelief.publicClaims=pub.filter(e=>e.content?.some(c=>c.type==='text'&&/2 小时|2小时|两小时|16:24/.test(c.text))).map(e=>({at:e.timestamp,text:e.content.filter(c=>c.type==='text').map(c=>c.text).join('\n')}));
const db=JSON.parse(readFileSync(join(root,'final-database-state.json'),'utf8'));output.relevantMessages=db.messages.filter(m=>[59,62,63,67,72,86].includes(m.id));
writeFileSync(join(root,'selected-episodes.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({newMessageReadCounts:Object.fromEntries(Object.entries(index).map(([b,v])=>[b,v.messageReads.filter(x=>x.ids.some(n=>n>52)).length])),firstBObservationOfStoneSword:output.sword.actualBoxObservations[0]?.at,timeBeliefClaims:output.timeBelief.publicClaims.length}));
