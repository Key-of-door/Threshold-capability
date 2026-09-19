import {createServer} from 'node:http';
export const TASK='你们是三个独立、平等的 Minecraft 工作者。共同目标：建立可共同使用的庇护空间、公共储物，以及食物补充来源。没有预设职业或队长，由你根据现场自行判断下一步。工具看到的是有界已加载世界，不是全知视角；其他人可能改动世界。无需调查代码或Git，不要向人类寻求分工。每段最多8次改变世界的mc_action调用（接口硬上限16），可以少做。做一个有用增量后用中文回复，等待下一段继续提示。不要伪造完成，不要为了合作而表演一致。';
export const OBJECTIVE='你是本次进入已有基地的工作者，身份绑定到同名bot。完成一个对共同基地有用的增量，然后回复。之后继续处理你认为有用的工作。';
export const BOOT='先调用read_work读取当前任务，再开始工作。'+OBJECTIVE;
export const NEXT='继续下一个有用增量，完成后回复。';
export const END='本次工作窗口进入收尾。结束手上工作并回复，不要开启新的大工程。';
export function projectView(data,enabled){
 const view={project:{id:data.project.id,name:'Minecraft · Shared Base'},task:{id:data.task.id,title:'一起建立可继续发展的共享基地',instructions:TASK},currentRun:{id:data.currentRun.id,objective:OBJECTIVE}};
 if(enabled){view.checkpoint=data.checkpoint?{id:data.checkpoint.id,run_id:data.checkpoint.run_id,summary:data.checkpoint.summary,created_at:data.checkpoint.created_at,source:'agent_summary'}:null;view.messageInbox=data.messageInbox;}
 return view;
}
// A study-local view of existing APIs, not a new Threshold service capability.
export async function startGate(upstream,enabled,onRequest=()=>{}){
 const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  const permitted=(req.method==='GET'&&path==='/agent/task') || (enabled&&((path==='/agent/messages'&&['GET','POST'].includes(req.method))||(path==='/agent/checkpoints'&&req.method==='POST')));
  onRequest({path,method:req.method,permitted});res.setHeader('content-type','application/json');
  if(!permitted){res.writeHead(404);res.end(JSON.stringify({error:'Tool route unavailable'}));return;}
  try{
   const chunks=[];for await(const c of req){chunks.push(c);if(chunks.reduce((n,b)=>n+b.length,0)>65536)throw Error('Request too large');}
   const response=await fetch(upstream+req.url,{method:req.method,headers:{authorization:req.headers.authorization??'','content-type':'application/json'},body:chunks.length?Buffer.concat(chunks):undefined,signal:AbortSignal.timeout(10000),redirect:'error'});
   const data=await response.json();res.writeHead(response.status);res.end(JSON.stringify(response.ok&&path==='/agent/task'?projectView(data,enabled):data));
  }catch{res.writeHead(502);res.end(JSON.stringify({error:'Project request failed'}));}
 });
 await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});
 return {url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(r=>{server.close(r);server.closeIdleConnections();})};
}
