import {spawn} from 'node:child_process';
import {mkdirSync,copyFileSync,readFileSync,writeFileSync,appendFileSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import mineflayer from 'mineflayer';
import pf from 'mineflayer-pathfinder';
import {Vec3} from 'vec3';
import {waitEffect} from './minecraft-actions.mjs';
import {readContainer, transferContainer, readFurnace, operateFurnace, craftWithWindow} from './resource-pair-01/adapter/minecraft-windows.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/resource-pair-01/window-check-'+Date.now();mkdirSync(root,{recursive:true});
copyFileSync('E:/Minecraft/Threshold-Experiment/server/server.jar',join(root,'server.jar'));
writeFileSync(join(root,'eula.txt'),'eula=true');
writeFileSync(join(root,'server.properties'),'server-ip=127.0.0.1\nserver-port=25566\nonline-mode=false\nenforce-secure-profile=false\nlevel-type=minecraft\\:flat\ngenerate-structures=false\ndifficulty=peaceful\nspawn-protection=0\n');
const cfg=JSON.parse(readFileSync('E:/Minecraft/Threshold-Experiment/local-config.json','utf8').replace(/^\uFEFF/,''));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ready=false,exited=false,buf='',bot;const checks=[],watchers=[];
const server=spawn(cfg.java,['-Xms512M','-Xmx1G','-jar','server.jar','nogui'],{cwd:root,windowsHide:true,stdio:['pipe','pipe','pipe']});
const log=(file,row)=>appendFileSync(join(root,file),JSON.stringify({at:new Date().toISOString(),...row})+'\n');
for(const stream of [server.stdout,server.stderr])stream.on('data',b=>{appendFileSync(join(root,'server.log'),b);buf+=b;const lines=buf.split(/\r?\n/);buf=lines.pop();for(const line of lines){if(/Done \(.+\)!/.test(line))ready=true;for(const w of [...watchers])if(line.includes(w.marker)){watchers.splice(watchers.indexOf(w),1);w.resolve(line);}}});
server.on('exit',()=>exited=true);
function send(s){server.stdin.write(s+'\n');}
async function proof(command,marker){const response=new Promise(resolve=>watchers.push({marker,resolve}));send(command);const line=await Promise.race([response,sleep(5000).then(()=>{throw Error('Missing server verification '+marker);})]);log('checks.jsonl',{command,line});return line;}
const check=(name,value)=>{checks.push({name,value});console.log(name+': passed');};
let passed=false;
try{
 await waitEffect(()=>ready,'server ready',undefined,120000);
 bot=mineflayer.createBot({host:'127.0.0.1',port:25566,username:'AdapterCheck',version:'1.21.1',auth:'offline',hideErrors:true});bot.on('error',e=>log('errors.jsonl',{message:e.message}));
 await new Promise((r,j)=>{bot.once('spawn',r);bot.once('error',j);});await bot.waitForChunksToLoad();
 bot.loadPlugin(pf.pathfinder);const m=new pf.Movements(bot);m.canDig=false;m.allow1by1towers=false;m.scafoldingBlocks=[];bot.pathfinder.setMovements(m);
 send('tp AdapterCheck 0.5 -60 2.5');send('fill -3 -61 -3 7 -61 7 minecraft:grass_block');
 send('gamerule doDaylightCycle false');send('time set day');
 send('setblock 0 -60 0 chest{Items:[{Slot:0b,id:"minecraft:bread",count:3}]}');
 send('setblock 2 -60 0 chest{Items:[{Slot:0b,id:"minecraft:oak_log",count:7}]}');
 send('setblock -1 -60 0 furnace');send('setblock 1 -60 0 crafting_table');
 await sleep(1200);
 let left=bot.blockAt(new Vec3(0,-60,0)),right=bot.blockAt(new Vec3(2,-60,0)),furnace=bot.blockAt(new Vec3(-1,-60,0));
 // Reproduce the exact old pattern before testing serialization. Expected truth
 // is independently inspected through server NBT, not inferred from this client.
 await proof('data get block 0 -60 0 Items','has the following block data');
 await proof('data get block 2 -60 0 Items','has the following block data');
 const unsafe=async block=>{const w=await bot.openContainer(block);try{return w.containerItems().map(i=>({name:i.name,count:i.count}));}finally{w.close();}};
 const old=await Promise.allSettled([unsafe(left),unsafe(right)]);
 log('checks.jsonl',{name:'old concurrent read observation',results:old});
 check('old concurrency reproduced or recorded without assuming',old);
 bot.quit();await sleep(500);
 bot=mineflayer.createBot({host:'127.0.0.1',port:25566,username:'AdapterCheck',version:'1.21.1',auth:'offline',hideErrors:true});
 bot.on('error',e=>log('errors.jsonl',{message:e.message}));
 await new Promise((r,j)=>{bot.once('spawn',r);bot.once('error',j);});await bot.waitForChunksToLoad();
 bot.loadPlugin(pf.pathfinder);const freshMovement=new pf.Movements(bot);freshMovement.canDig=false;freshMovement.allow1by1towers=false;freshMovement.scafoldingBlocks=[];bot.pathfinder.setMovements(freshMovement);
 left=bot.blockAt(new Vec3(0,-60,0));right=bot.blockAt(new Vec3(2,-60,0));furnace=bot.blockAt(new Vec3(-1,-60,0));
 for(let n=0;n<3;n++){
   const [a,b]=await Promise.all([readContainer(bot,left),readContainer(bot,right)]);
   assert.equal(a.items[0].name,'bread');assert.equal(a.items[0].count,3);
   assert.equal(b.items[0].name,'oak_log');assert.equal(b.items[0].count,7);
 }
 check('three concurrent pairs retain distinct chest contents',true);
 // Real survival extraction/crafting: no ingot/raw iron is provisioned.
 send('setblock 0 -60 4 stone');send('setblock 1 -60 4 stone');send('setblock 2 -60 4 stone');
 send('setblock -1 -60 4 coal_ore');send('setblock 3 -60 4 iron_ore');
 send('give AdapterCheck wooden_pickaxe 1');send('give AdapterCheck stick 2');
 await waitEffect(()=>bot.inventory.items().some(i=>i.name==='wooden_pickaxe'),'pickaxe ready',undefined,8000);
 await bot.equip(bot.inventory.items().find(i=>i.name==='wooden_pickaxe'),'hand');
 for(const v of [[0,-60,4],[1,-60,4],[2,-60,4],[-1,-60,4]])await bot.dig(bot.blockAt(new Vec3(...v)));
 await bot.pathfinder.goto(new pf.goals.GoalNear(1,-60,4,0));
 await bot.pathfinder.goto(new pf.goals.GoalNear(-1,-60,4,0));
 await waitEffect(()=>bot.inventory.items().filter(i=>i.name==='cobblestone').reduce((n,i)=>n+i.count,0)>=3 && bot.inventory.items().some(i=>i.name==='coal'),'mined materials picked up',undefined,8000);
 check('wooden pickaxe mined stone and coal',bot.inventory.items().map(i=>({name:i.name,count:i.count})));
 await bot.pathfinder.goto(new pf.goals.GoalNear(1,-60,2,0));
 const table=bot.blockAt(new Vec3(1,-60,0));
 const recipe=bot.recipesFor(bot.registry.itemsByName.stone_pickaxe.id,null,1,table)[0];assert.ok(recipe);
 await craftWithWindow(bot,recipe,1,table);await bot.equip(bot.inventory.items().find(i=>i.name==='stone_pickaxe'),'hand');
 await bot.dig(bot.blockAt(new Vec3(3,-60,4)));
 await bot.pathfinder.goto(new pf.goals.GoalNear(3,-60,4,0));
 await waitEffect(()=>bot.inventory.items().some(i=>i.name==='raw_iron'),'raw iron picked up',undefined,8000);
 await bot.pathfinder.goto(new pf.goals.GoalNear(0,-60,2,0));
 await operateFurnace(bot,furnace,'furnace_input',bot.registry.itemsByName.raw_iron,1);
 await operateFurnace(bot,furnace,'furnace_fuel',bot.registry.itemsByName.coal,1);
 await proof('data get block -1 -60 0 Items','has the following block data');
 await sleep(11000);
 const f=await readFurnace(bot,furnace);assert.equal(f.output[0]?.name,'iron_ingot');
 await proof('execute if items block -1 -60 0 container.2 minecraft:iron_ingot run say CHECK_IRON_OUTPUT','CHECK_IRON_OUTPUT');
 await operateFurnace(bot,furnace,'furnace_take_output');
 assert.ok(bot.inventory.items().some(i=>i.name==='iron_ingot'));
 await proof('execute if items entity AdapterCheck inventory.* minecraft:iron_ingot run say CHECK_IRON_INVENTORY','CHECK_IRON_INVENTORY');
 check('stone pickaxe to raw iron to actual smelted ingot',true);
 await assert.rejects(()=>operateFurnace(bot,furnace,'furnace_take_output'),/output is empty/);
 const final=await readContainer(bot,right);assert.equal(final.items[0].name,'oak_log');
 check('empty furnace reports ordinary error; queue remains usable',true);
 passed=true;
}catch(e){console.error(e.message);log('errors.jsonl',{message:e.message});process.exitCode=1;}
finally{bot?.clearControlStates();bot?.quit();send('stop');await waitEffect(()=>exited,'server stopped',undefined,30000);writeFileSync(join(root,'result.json'),JSON.stringify({passed,checks,root},null,2));console.log(JSON.stringify({passed,root}));}
