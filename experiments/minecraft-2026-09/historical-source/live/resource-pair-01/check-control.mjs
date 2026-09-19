import {scan} from './scan-world.mjs';import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const root='E:/Minecraft/Threshold-Experiment/live/resource-pair-01';
const a=await scan(root+'/preparation-03/shared-world'),b=await scan(root+'/control/snapshots/initial');
const expected=JSON.parse(readFileSync(root+'/fork-manifest.json','utf8')).blockChanges;
const differences=[];for(const[p,v]of a.blocks)if(JSON.stringify(v)!==JSON.stringify(b.blocks.get(p)))differences.push(p);
assert.equal(differences.length,58);assert.deepEqual(new Set(differences),new Set(expected.map(x=>x.position)));assert.deepEqual(a.containers,b.containers);
const conditions=JSON.parse(readFileSync(root+'/conditions.json','utf8'));for(const f of ['minecraft.ts','minecraft-actions.mjs','minecraft-windows.mjs'])assert.equal(createHash('sha256').update(readFileSync(root+'/control/'+f)).digest('hex'),conditions.hashes['adapter/'+f]);
writeFileSync(root+'/control/prelaunch-check.json',JSON.stringify({at:new Date().toISOString(),passed:true,initialWorldAdditionalChangesBeyondResourceRemoval:0,containersEqual:true,adapterHashesMatch:true},null,2));
console.log('Control prelaunch world has no extra block/container changes; adapter hashes match.');
