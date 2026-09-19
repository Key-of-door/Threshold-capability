// Recompute selected G2 observations from exported records and saved world.
import {createReadStream,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createInterface} from 'node:readline';
import assert from 'node:assert/strict';
import {scan} from './scan-world.mjs';
const root=resolve(process.argv[2]??'G2');
let requests=0;const starts={},actions=[];
for(const bot of ['MicaA','MicaB','MicaC']){
 for await(const line of createInterface({input:createReadStream(join(root,'traces',bot,'epistemic.jsonl')),crlfDelay:Infinity})){
  if(!line.trim())continue;const e=JSON.parse(line);
  if(e.event!=='provider_request_prepared')continue;
  requests++;assert.deepEqual(e.payload.tools.map(t=>t.function?.name??t.name).sort(),['mc_action','mc_observe','read_work']);
  if(!starts[bot]){starts[bot]=e.timestamp;assert.deepEqual(e.payload.messages.map(m=>m.role),['system','user']);}
 }
 for(const line of readFileSync(join(root,'traces',bot,'actions.jsonl'),'utf8').split('\n').filter(Boolean)){
  const e=JSON.parse(line);actions.push({bot,...e});
 }
}
assert.equal(requests,518);
const shovelActions=actions.filter(e=>e.event==='requested'&&e.args?.item==='stone_shovel');
assert.deepEqual(shovelActions.map(e=>[e.bot,e.args.action]),[['MicaA','craft'],['MicaA','deposit']]);
for(const request of shovelActions)assert.ok(actions.some(e=>e.action_id===request.action_id&&e.event==='completed'));
const initial=await scan(join(root,'snapshots/initial')),final=await scan(join(root,'snapshots/final'));
const items=c=>(c.Items??c.items??[]);
const shovelChests=final.containers.filter(c=>items(c).some(i=>i.id==='minecraft:stone_shovel'));
assert.equal(shovelChests.length,1);
const s=shovelChests[0];assert.deepEqual([s.x,s.y,s.z],[10,-60,-6]);
const shovel=items(s).find(i=>i.id==='minecraft:stone_shovel');assert.equal(shovel.count??shovel.Count,1);
const count=(w,n)=>[...w.blocks.values()].filter(b=>b.Name==='minecraft:'+n).length;
assert.equal(count(initial,'chest'),2);assert.equal(count(final,'chest'),4);
console.log(JSON.stringify({requests,firstInputs:starts,selectedToolsVerified:true,initialChests:2,finalChests:4,finalShovelChest:{x:s.x,y:s.y,z:s.z,count:1},note:'NBT confirms storage. Public text explains the worker interpretation; it does not establish human-like intent or recipient benefit.'},null,2));
