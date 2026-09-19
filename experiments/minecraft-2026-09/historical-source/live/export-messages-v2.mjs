import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const root=process.argv[2]??'E:/Minecraft/Threshold-Experiment/live/session-03';
const data=JSON.parse(readFileSync(join(root,'final-database-state.json'),'utf8'));
const fresh=JSON.parse(readFileSync(join(root,'runs.json'),'utf8'));
const names=Object.fromEntries(fresh.map((r,i)=>[r.id,['MicaA','MicaB','MicaC'][i]]));
const messages=data.messages??[];
writeFileSync(join(root,'messages.md'),`# 完整 Project Message 历史\n\n保留旧实验消息与本轮消息；正文都是 Agent 协作输入，不等同于事实核验。时间为 UTC。\n\n`+messages.map(m=>`## ${m.id} · ${names[m.from_run_id]??'previous Run'} · ${m.created_at}\n\nRun: \`${m.from_run_id}\`\n\n${m.body}\n`).join('\n'));
console.log(JSON.stringify({messages:messages.length,freshMessages:messages.filter(m=>names[m.from_run_id]).length}));
