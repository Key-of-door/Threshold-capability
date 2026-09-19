import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {join} from 'node:path';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';
const require=createRequire('E:/Minecraft/Threshold-Experiment/package.json');const nbt=require('prismarine-nbt');const root=process.argv[2];
function uuid(name){const b=createHash('md5').update('OfflinePlayer:'+name).digest();b[6]=(b[6]&15)|48;b[8]=(b[8]&63)|128;const s=b.toString('hex');return[s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');}
const read=async p=>nbt.simplify((await nbt.parse(readFileSync(p))).parsed);
const out={};for(const stage of ['initial','final']){const path=join(root,'snapshots',stage);const level=await read(join(path,'level.dat'));out[stage]={gameTime:level.Data.Time,dayTime:level.Data.DayTime,players:{}};for(const name of ['MicaA','MicaB','MicaC']){const p=join(path,'playerdata',uuid(name)+'.dat');if(!existsSync(p))continue;const d=await read(p);out[stage].players[name]={uuid:uuid(name),position:d.Pos,inventory:d.Inventory,health:d.Health,foodLevel:d.foodLevel};}}
writeFileSync(join(root,'mechanical-player-state.json'),JSON.stringify(out,null,2));
console.log(JSON.stringify(out));
