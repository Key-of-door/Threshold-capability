import {spawn} from 'node:child_process';
import {mkdirSync,copyFileSync,readFileSync,writeFileSync,appendFileSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import mineflayer from 'mineflayer';
import pf from 'mineflayer-pathfinder';
import {Vec3} from 'vec3';
import {useVerified,step,waitEffect} from './minecraft-actions.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/adapter-check-'+Date.now();mkdirSync(root,{recursive:true});
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
 send('tp AdapterCheck 0.5 -60 2.5');send('fill -3 -61 -3 7 -61 7 minecraft:grass_block');send('setblock 1 -61 0 air');
 for(const item of ['water_bucket','wooden_hoe','wheat_seeds','oak_sapling'])send('give AdapterCheck minecraft:'+item+' 1');
 await waitEffect(()=>bot.inventory.items().some(i=>i.name==='oak_sapling'),'inventory ready',undefined,8000);
 await bot.equip(bot.inventory.items().find(i=>i.name==='water_bucket'),'hand');
 const water=await useVerified(bot,'water_bucket',new Vec3(1,-62,0));
 await proof('execute if block 1 -61 0 water run say CHECK_WATER_PRESENT','CHECK_WATER_PRESENT');check('bucket placement',water);
 await bot.equip(bot.inventory.items().find(i=>i.name==='wooden_hoe'),'hand');
 const hoe=await useVerified(bot,'wooden_hoe',new Vec3(2,-61,0));await proof('execute if block 2 -61 0 farmland run say CHECK_FARMLAND','CHECK_FARMLAND');check('hoe confirmed',hoe);
 await assert.rejects(()=>useVerified(bot,'wooden_hoe',new Vec3(2,-60,0)),/Hoe needs/);check('hoe on air rejected',true);
 await bot.equip(bot.inventory.items().find(i=>i.name==='wheat_seeds'),'hand');await useVerified(bot,'wheat_seeds',new Vec3(2,-61,0));
 await proof('execute if block 2 -60 0 wheat run say CHECK_WHEAT','CHECK_WHEAT');check('seed placement',true);
 await bot.equip(bot.inventory.items().find(i=>i.name==='bucket'),'hand');await useVerified(bot,'bucket',new Vec3(1,-61,0));
 await proof('execute if block 1 -61 0 air run say CHECK_WATER_REMOVED','CHECK_WATER_REMOVED');check('bucket pickup',true);
 send('fill 0 -61 2 4 -61 4 farmland[moisture=7]');await sleep(500);
 await Promise.race([bot.pathfinder.goto(new pf.goals.GoalNear(5,-60,3,1)),sleep(10000).then(()=>{throw Error('Farmland move timeout');})]);bot.pathfinder.setGoal(null);check('ordinary farmland movement',bot.entity.position);
 send('tp AdapterCheck 2.5 -61 3.5');await sleep(500);
 const move=await step(bot,new Vec3(4,-60,3));assert.ok(move.distance>.5);check('explicit jump-step out of embedded position',move);
 await proof('data get entity AdapterCheck Pos','AdapterCheck has the following entity data');passed=true;
}catch(e){console.error(e.message);log('errors.jsonl',{message:e.message});process.exitCode=1;}
finally{bot?.clearControlStates();bot?.quit();send('stop');await waitEffect(()=>exited,'server stopped',undefined,30000);writeFileSync(join(root,'result.json'),JSON.stringify({passed,checks,root},null,2));console.log(JSON.stringify({passed,root}));}
