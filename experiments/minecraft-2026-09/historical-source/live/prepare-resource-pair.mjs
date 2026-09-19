import {spawn} from 'node:child_process';
import {mkdirSync,cpSync,copyFileSync,readFileSync,writeFileSync,appendFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import {scan} from './resource-pair-01/scan-world.mjs';
const root='E:/Minecraft/Threshold-Experiment/live/resource-pair-01',prior='E:/Minecraft/Threshold-Experiment/live/session-05';
if(existsSync(join(root,'fork-manifest.json')))throw Error('Prepared fork exists; do not overwrite');
const prep=join(root,'preparation-03');mkdirSync(prep,{recursive:true});
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const tree=p=>Object.fromEntries(readdirSync(p,{withFileTypes:true}).flatMap(e=>e.name==='session.lock'?[]:e.isDirectory()?Object.entries(tree(join(p,e.name))).map(([k,v])=>[e.name+'/'+k,v]):[[e.name,hash(join(p,e.name))]]));
const sourceHashes=tree(join(prior,'snapshots/final'));
cpSync(join(prior,'snapshots/final'),join(prep,'shared-world'),{recursive:true,filter:s=>!s.endsWith('session.lock')});
copyFileSync('E:/Minecraft/Threshold-Experiment/server/server.jar',join(prep,'server.jar'));
writeFileSync(join(prep,'eula.txt'),'eula=true\n');
writeFileSync(join(prep,'server.properties'),'server-ip=127.0.0.1\nserver-port=25566\nonline-mode=false\nenforce-secure-profile=false\nlevel-name=shared-world\ndifficulty=peaceful\nspawn-protection=0\nview-distance=6\nsimulation-distance=6\n');
for(const arm of ['control','intervention']){const d=join(root,arm);mkdirSync(join(d,'home'),{recursive:true});mkdirSync(join(d,'server'),{recursive:true});copyFileSync(join(prior,'home/project.sqlite'),join(d,'home/project.sqlite'));const db=new DatabaseSync(join(d,'home/project.sqlite'));assert.equal(db.prepare('PRAGMA quick_check').get().quick_check,'ok');db.close();}
const cfg=JSON.parse(readFileSync('E:/Minecraft/Threshold-Experiment/local-config.json','utf8').replace(/^\uFEFF/,''));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ready=false,stopped=false,buf='',server;const watchers=[];
const log=(f,v)=>appendFileSync(join(prep,f),JSON.stringify({at:new Date().toISOString(),...v})+'\n');
function send(s){log('commands.jsonl',{command:s});server.stdin.write(s+'\n');}
async function until(fn,ms=120000){const end=Date.now()+ms;while(Date.now()<end){if(fn())return;await sleep(100);}throw Error('Preparation timeout');}
function proof(command,marker){return new Promise((resolve,reject)=>{const w={marker,resolve:line=>{clearTimeout(timer);resolve(line);}};const timer=setTimeout(()=>{watchers.splice(watchers.indexOf(w),1);reject(Error('No server confirmation '+marker));},30000);watchers.push(w);send(command);});}
try{
 server=spawn(cfg.java,['-Xms512M','-Xmx2G','-jar','server.jar','nogui'],{cwd:prep,windowsHide:true,stdio:['pipe','pipe','pipe']});server.on('exit',()=>stopped=true);
 for(const stream of [server.stdout,server.stderr])stream.on('data',b=>{appendFileSync(join(prep,'server.log'),b);buf+=b;const lines=buf.split(/\r?\n/);buf=lines.pop();for(const line of lines){if(/Done \(.+\)!/.test(line))ready=true;for(const w of [...watchers])if(line.includes(w.marker)){watchers.splice(watchers.indexOf(w),1);w.resolve(line);}}});
 await until(()=>ready);await proof('tick freeze','The game is frozen');await proof('save-off','saving is now disabled');await proof('save-all flush','Saved the game');
 cpSync(join(prep,'shared-world'),join(root,'control/server/shared-world'),{recursive:true,filter:s=>!s.endsWith('session.lock')});
 const before=await scan(join(root,'control/server/shared-world'));const resources=[];
 for(const [x0,z0]of[[-16,-4],[14,0]]){
  const positions=[];for(let y=-60;y<=-59;y++)for(let x=x0;x<x0+4;x++)for(let z=z0;z<z0+4;z++)if(positions.length<29)positions.push({x,y,z});
  for(let i=0;i<positions.length;i++){const p=positions[i],type=i>=24?(i<26?'coal_ore':'iron_ore'):'stone';assert.equal(before.blocks.get(`${p.x},${p.y},${p.z}`)?.Name,'minecraft:air');resources.push({...p,type});send(`setblock ${p.x} ${p.y} ${p.z} minecraft:${type}`);}
 }
 await proof('save-all flush','Saved the game');
 cpSync(join(prep,'shared-world'),join(root,'intervention/server/shared-world'),{recursive:true,filter:s=>!s.endsWith('session.lock')});
 const after=await scan(join(root,'intervention/server/shared-world')),changes=[];
 for(const[p,v]of after.blocks){const b=before.blocks.get(p);if(JSON.stringify(b)!==JSON.stringify(v))changes.push({position:p,before:b,after:v});}
 assert.equal(changes.length,58);assert.deepEqual(before.containers,after.containers);
 for(const r of resources)assert.equal(after.blocks.get(`${r.x},${r.y},${r.z}`).Name,'minecraft:'+r.type);
 assert.equal(hash(join(root,'control/home/project.sqlite')),hash(join(root,'intervention/home/project.sqlite')));
 const controlTree=tree(join(root,'control/server/shared-world')),interventionTree=tree(join(root,'intervention/server/shared-world'));
 for(const p of Object.keys(controlTree).filter(p=>p.startsWith('playerdata/')))assert.equal(controlTree[p],interventionTree[p]);
 assert.deepEqual(tree(join(prior,'snapshots/final')),sourceHashes);
 const manifest={preparedAt:new Date().toISOString(),source:prior,sourceDatabaseSha256:hash(join(prior,'home/project.sqlite')),sourceWorldFileHashes:sourceHashes,commonPreparation:'No bots connected. Clone booted once then tick-frozen; both snapshots taken frozen. Preparation may advance source world before freeze equally for both arms.',arms:['control','intervention'],resources,blockChanges:changes,containersEqual:true,playerDataEqual:true,projectDatabaseEqual:true,worldFileHashes:{control:controlTree,intervention:interventionTree}};
 writeFileSync(join(root,'fork-manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify({prepared:true,changes:changes.length,resources:resources.reduce((o,r)=>(o[r.type]=(o[r.type]??0)+1,o),{}),root}));
}finally{if(server&&!stopped){send('stop');await until(()=>stopped,30000);}}
