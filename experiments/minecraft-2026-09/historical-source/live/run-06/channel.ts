import {Type} from 'typebox';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
export default function(pi:any){
 const root=process.env.MC_EXPERIMENT_ROOT!;
 const enabled=JSON.parse(readFileSync(join(root,'experiment.json'),'utf8')).historyAvailable===true;
 pi.registerTool({name:'read_work',label:'Read work',description:'Read the current project and task. Any available history is an Agent summary or collaboration input, not automatically current truth.',parameters:Type.Object({}),execute:async()=>{
  const response=await fetch(process.env.THRESHOLD_SERVICE_URL+'/agent/task',{headers:{authorization:`Bearer ${process.env.THRESHOLD_RUN_TOKEN}`},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('Project request failed: HTTP '+response.status);
  const data=await response.json();return {content:[{type:'text',text:JSON.stringify(data)}],details:data};
 }});
 pi.on('session_start',()=>{
  pi.setActiveTools(['read_work',...(enabled?['read_messages','send_message','save_checkpoint']:[]),'mc_observe','mc_action']);
  writeFileSync(join(root,'traces',`active-tools-${process.cwd().split(/[\\/]/).pop()}.json`),JSON.stringify({active:pi.getActiveTools(),schemas:pi.getAllTools().filter((t:any)=>pi.getActiveTools().includes(t.name))},null,2));
 });
}
