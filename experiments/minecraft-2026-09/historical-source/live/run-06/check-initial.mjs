import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {scan} from '../resource-pair-01/scan-world.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/run-06',id=process.argv[2];
const manifest=JSON.parse(readFileSync(join(root,'fork-manifest.json'),'utf8'));
const source=join(manifest.source,'snapshots/final'),current=join(root,id,'snapshots/initial');
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const require=createRequire('E:/Minecraft/Threshold-Experiment/package.json'),nbt=require('prismarine-nbt');
const time=async p=>{const {Data}=nbt.simplify((await nbt.parse(readFileSync(join(p,'level.dat')))).parsed);return {gameTime:Data.Time,dayTime:Data.DayTime};};
const a=await scan(source),b=await scan(current);let blockChanges=0;
for(const [p,v]of a.blocks)if(JSON.stringify(v)!==JSON.stringify(b.blocks.get(p)))blockChanges++;
assert.equal(blockChanges,0,'Startup changed blocks before workers');assert.deepEqual(b.containers,a.containers);
const players={};for(const name of ['MicaA','MicaB','MicaC']){
 const bytes=createHash('md5').update('OfflinePlayer:'+name).digest();bytes[6]=(bytes[6]&15)|48;bytes[8]=(bytes[8]&63)|128;const s=bytes.toString('hex'),uid=[s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');
 players[name]=hash(join(source,'playerdata',uid+'.dat'))===hash(join(current,'playerdata',uid+'.dat'));assert.ok(players[name]);
}
const result={id,checkedAt:new Date().toISOString(),blockChanges,containersEqual:true,playersUnchanged:players,sourceTime:await time(source),initialTime:await time(current)};
const other=id==='r17'?'r42':'r17';if(existsSync(join(root,other,'initial-check.json'))){const prev=JSON.parse(readFileSync(join(root,other,'initial-check.json'),'utf8'));result.pairedTimeEqual=JSON.stringify(prev.initialTime)===JSON.stringify(result.initialTime);}
writeFileSync(join(root,id,'initial-check.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
