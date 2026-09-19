import {readFileSync,existsSync,writeFileSync,statSync} from 'node:fs';import {join,resolve} from 'node:path';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const root='E:/Minecraft/Threshold-Experiment/live/run-06',json=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,'')),hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex'),m=json(join(root,'fork-manifest.json'));
assert.equal(hash(join(m.source,'home/project.sqlite')),m.sourceDatabaseSha256);for(const[p,h]of Object.entries(m.sourceWorldHashes))assert.equal(hash(join(m.source,'snapshots/final',p)),h);
const core='E:/Threshold lite';assert.equal(execFileSync('git',['-C',core,'status','--porcelain'],{encoding:'utf8'}),'');assert.equal(execFileSync('git',['-C',core,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),m.coreCommit);
const data={checkedAt:new Date().toISOString(),sourceWorldAndDatabaseUnchanged:true,coreUnchanged:true,arms:{},missingLinks:[]};
for(const {id,historyAvailable}of m.conditions){const dir=join(root,id),db=json(join(dir,'final-database-state.json')),f=json(join(dir,'finished.json')),audit=json(join(dir,'input-audit.json')),ids=new Set(f.runIds),runs=db.runs.filter(r=>ids.has(r.id));
 assert.equal(f.serverExited,true);assert.equal(runs.length,3);for(const r of runs){assert.equal(r.status,'ended');assert.equal(r.exit_code,0);}assert.deepEqual(audit.violations,[]);
 for(const [file,h]of Object.entries(m.adapterHashes))assert.equal(hash(join(dir,file)),h);
 const scan=readFileSync(join(dir,'analysis/analyze-v2.mjs.log'),'utf8').trim().split('\n').at(-1);assert.deepEqual(JSON.parse(scan).credentialLiteralMatches,[]);
 const service=json(join(dir,'service-info.json'));let serviceReachable=false;try{await fetch(service.url+'/health',{signal:AbortSignal.timeout(1500)});serviceReachable=true;}catch{}assert.equal(serviceReachable,false);
 const checkpoints=db.checkpoints.filter(c=>ids.has(c.run_id)).length,newMessages=db.messages.filter(x=>x.id>52).length;if(!historyAvailable){assert.equal(checkpoints,0);assert.equal(newMessages,0);}
 data.arms[id]={historyAvailable,calls:f.calls,checkpoints,newMessages,workers:runs.map(r=>({id:r.id,session:r.session_id,exitCode:r.exit_code})),inputAuditPassed:true,serviceStopped:true,serverExited:true,credentialLiteralMatches:[],videoBytes:statSync(join(dir,'recording/threshold-cli-overview.mp4')).size,initialCheck:json(join(dir,'initial-check.json'))};
}
assert.equal(data.arms.r42.initialCheck.pairedTimeEqual,true);
for(const match of readFileSync(join(root,'report.md'),'utf8').matchAll(/\]\(([^)]+)\)/g))if(!existsSync(resolve(root,match[1])))data.missingLinks.push(match[1]);assert.deepEqual(data.missingLinks,[]);
writeFileSync(join(root,'final-checks.json'),JSON.stringify(data,null,2));console.log(JSON.stringify(data));
