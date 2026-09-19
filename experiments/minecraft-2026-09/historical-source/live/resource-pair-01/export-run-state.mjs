import {readFileSync,writeFileSync} from 'node:fs';import {join} from 'node:path';
const root=process.argv[2],data=JSON.parse(readFileSync(join(root,'final-database-state.json'),'utf8')),ids=new Set(JSON.parse(readFileSync(join(root,'finished.json'),'utf8')).runIds);
const runs=data.runs.filter(r=>ids.has(r.id));writeFileSync(join(root,'run-identities.json'),JSON.stringify(runs.map(r=>({id:r.id,session_id:r.session_id,workspace_path:r.workspace_path,status:r.status,exit_code:r.exit_code,error:r.error,capabilities:JSON.parse(r.capabilities_json??'{}')})),null,2));
const cps=data.checkpoints.filter(c=>ids.has(c.run_id));writeFileSync(join(root,'checkpoints.md'),'# Agent checkpoints — interpretations, not independent verification\n\n'+cps.map(c=>'## '+c.run_id+' · '+(c.created_at??'')+'\n\n'+(c.body??c.summary??JSON.stringify(c,null,2))+'\n').join('\n'));
console.log(JSON.stringify({newRuns:runs.length,checkpoints:cps.length}));
