import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root='E:/Minecraft/Threshold-Experiment/live/run-07/r01';
const since=process.argv[2]??'';
function rows(p){return existsSync(p)?readFileSync(p,'utf8').split('\n').filter(Boolean).flatMap(l=>{try{return[JSON.parse(l)]}catch{return[]}}):[];}
for(const bot of ['MicaA','MicaB','MicaC']){
 const pub=rows(join(root,'traces',bot,'public-output.jsonl'));
 for(const e of pub.filter(e=>e.timestamp>since)){
  const texts=(e.content??[]).filter(c=>c.type==='text').map(c=>c.text).join('\n');
  if(texts)console.log(JSON.stringify({bot,at:e.timestamp,text:texts}));
 }
}
