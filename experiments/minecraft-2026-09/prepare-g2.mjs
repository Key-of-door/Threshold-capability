// Prepare a NEW local G2 rerun from public exports. Does not start any process.
// Usage: node prepare-g2.mjs DATA CORE NEW_DIRECTORY SERVER_JAR JAVA_EXECUTABLE
import {mkdirSync,existsSync,readFileSync,writeFileSync,cpSync,copyFileSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const args=process.argv.slice(2);if(args.length!==5)throw Error('Expected DATA CORE NEW_DIRECTORY SERVER_JAR JAVA_EXECUTABLE');
const [data,core,dest,jar,java]=args.map(p=>resolve(p));
const here=dirname(fileURLToPath(import.meta.url));
if(existsSync(dest))throw Error('Destination must not exist; never overwrite an experiment');
for(const p of [join(data,'G2/snapshots/initial/level.dat'),join(data,'H0/final-database-state.json'),join(core,'src/service.mjs'),jar,java])if(!existsSync(p))throw Error('Missing prerequisite: '+p);
const revision=execFileSync('git',['-C',core,'rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();
if(revision!=='c53006438588b0b43500fa2481278dda85ce3f4c')throw Error('Use the recorded Threshold commit (see REPRODUCE.md)');
const pair=join(dest,'live/run-07'),prior=join(dest,'live/run-06/r17'),arm=join(pair,'r01');
for(const p of [pair,prior,join(arm,'home'),join(arm,'server'),join(dest,'server')])mkdirSync(p,{recursive:true});
const forward=p=>p.replaceAll('\\','/');
const rewrites=[['file:///E:/Threshold%20lite',pathToFileURL(core).href],['E:/Minecraft/Threshold-Experiment',forward(dest)],['E:/Threshold lite',forward(core)],['E:/Threshold-film-2/recording/package.json',forward(join(here,'package.json'))]];
const adapt=s=>rewrites.reduce((v,[a,b])=>v.replaceAll(a,b),s);
const source=join(here,'historical-source/live/run-07');
for(const name of ['run-world.mjs','shared.mjs','channel.ts'])writeFileSync(join(pair,name),adapt(readFileSync(join(source,name),'utf8')));
mkdirSync(join(pair,'adapter'),{recursive:true});
for(const name of ['minecraft.ts','minecraft-actions.mjs','minecraft-windows.mjs'])writeFileSync(join(pair,'adapter',name),adapt(readFileSync(join(source,'adapter',name),'utf8')));
// The copied adapter resolves its dependencies here, without changing archived source.
writeFileSync(join(dest,'package.json'),JSON.stringify({private:true,type:'module'}));
// A local node_modules junction/symlink is avoided; redirect only its require anchor.
const adapter=join(pair,'adapter/minecraft.ts');writeFileSync(adapter,readFileSync(adapter,'utf8').replaceAll(forward(join(dest,'package.json')),forward(join(here,'package.json'))));
for(const name of ['minecraft-actions.mjs','minecraft-windows.mjs']){const p=join(pair,'adapter',name);writeFileSync(p,readFileSync(p,'utf8').replaceAll(forward(join(dest,'package.json')),forward(join(here,'package.json'))));}
cpSync(join(data,'G2/snapshots/initial'),join(arm,'server/shared-world'),{recursive:true});
copyFileSync(jar,join(dest,'server/server.jar'));
writeFileSync(join(dest,'local-config.json'),JSON.stringify({java:forward(java)}));
mkdirSync(join(prior,'pi'),{recursive:true});copyFileSync(join(data,'G2/pi/models.json'),join(prior,'pi/models.json'));
const repo=join(dest,'repo');mkdirSync(repo);writeFileSync(join(repo,'README.md'),'# Shared Minecraft base\nThe work product is the external world.\n');
const git=(...a)=>execFileSync('git',['-C',repo,...a],{encoding:'utf8',windowsHide:true});git('init');git('add','README.md');git('-c','user.name=Experiment','-c','user.email=experiment@localhost','commit','-m','Prepare replay workspace');
const state=JSON.parse(readFileSync(join(data,'H0/final-database-state.json'),'utf8'));
const {openStore}=await import(pathToFileURL(join(core,'src/store.mjs')).href);const store=openStore(join(arm,'home/project.sqlite'));
try{store.db.exec('BEGIN');for(const table of ['projects','tasks','runs','messages','checkpoints'])for(const record of state[table]??[]){
 const r={...record};if(table==='projects')r.repo_path=forward(repo);
 if(table==='runs'){r.workspace_path=forward(repo);if(['starting','running'].includes(r.status))throw Error('Historical Run not stopped');}
 const keys=Object.keys(r);const cols=keys.map(k=>'"'+k+'"').join(',');store.db.prepare(`INSERT INTO ${table} (${cols}) VALUES (${keys.map(()=>'?').join(',')})`).run(...keys.map(k=>r[k]??null));
}store.db.exec('COMMIT');}finally{store.db.close();}
const pt=JSON.parse(readFileSync(join(data,'G2/project-task.json'),'utf8'));pt.project.repo_path=forward(repo);writeFileSync(join(prior,'project-task.json'),JSON.stringify(pt,null,2));
writeFileSync(join(pair,'fork-manifest.json'),JSON.stringify({conditions:[{id:'r01',historyAvailable:false}],source:'Public G2 initial snapshot + H0 final logical database export',changes:'Private human player files omitted; database reconstructed; paths changed; all new Run/session IDs on launch; this is a reproduction setup, not the original experiment.'},null,2));
writeFileSync(join(dest,'PREPARED.json'),JSON.stringify({coreRevision:revision,runner:forward(join(pair,'run-world.mjs')),startFlag:forward(join(arm,'start.flag')),startsNoProcesses:true},null,2));
console.log('Prepared only. Read REPRODUCE.md before running; runner writes eula=true, starts a local server and later makes paid model requests. No process was started.');
