import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root='E:/Minecraft/Threshold-Experiment/live/session-02';
const info=JSON.parse(readFileSync(join(root,'service-info.json'),'utf8'));
const {project,task}=JSON.parse(readFileSync(join(root,'project-task.json'),'utf8'));
const get=async path=>{const r=await fetch(info.url+path,{signal:AbortSignal.timeout(4000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json();};
while(!existsSync(join(root,'finished.json'))){
 try{
  const runs=JSON.parse(readFileSync(join(root,'runs.json'),'utf8'));
  const details=await Promise.all(runs.map(r=>get('/runs/'+r.id)));
  const messages=[];let after=0,more=true;while(more){const page=await get(`/tasks/${task.id}/messages?after=${after}&limit=20`);messages.push(...page.messages);more=page.hasMore;after=page.nextAfter;}
  writeFileSync(join(root,'observed-project.json'),JSON.stringify({observedAt:new Date().toISOString(),task:await get('/tasks/'+task.id),board:await get('/projects/'+project.id+'/board'),messages,runs:details},null,2));
 }catch(e){if(!existsSync(join(root,'finished.json')))console.log(e.message);}
 await new Promise(r=>setTimeout(r,3000));
}
