import {readFileSync,writeFileSync} from 'node:fs';import {join} from 'node:path';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';import {scan} from '../resource-pair-01/scan-world.mjs';
const root=process.argv[2],require=createRequire('E:/Minecraft/Threshold-Experiment/package.json'),nbt=require('prismarine-nbt');
const names=['stone','oak_planks','oak_fence','oak_fence_gate','torch','farmland','wheat','water','furnace','chest','oak_sapling','oak_log','cobblestone'];
const out={};for(const stage of ['initial','final']){
 const path=join(root,'snapshots',stage),world=await scan(path),counts=Object.fromEntries(names.map(n=>[n,0])),wheat=[],players={};
 for(const [pos,b]of world.blocks){const n=b.Name.replace('minecraft:','');if(n in counts)counts[n]++;if(n==='wheat')wheat.push({pos,age:Number(b.Properties?.age)});}
 for(const name of ['MicaA','MicaB','MicaC']){const bytes=createHash('md5').update('OfflinePlayer:'+name).digest();bytes[6]=(bytes[6]&15)|48;bytes[8]=(bytes[8]&63)|128;const s=bytes.toString('hex'),id=[s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');const d=nbt.simplify((await nbt.parse(readFileSync(join(path,'playerdata',id+'.dat')))).parsed);players[name]={gameMode:d.playerGameType,selectedSlot:d.SelectedItemSlot,selectedItem:d.SelectedItem,inventory:d.Inventory};}
 out[stage]={counts,wheat,players};
}
writeFileSync(join(root,'world-facts.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({initial:out.initial.counts,final:out.final.counts,initialSelectedItems:Object.fromEntries(Object.entries(out.initial.players).map(([k,v])=>[k,{slot:v.selectedSlot,item:v.selectedItem}]))}));
