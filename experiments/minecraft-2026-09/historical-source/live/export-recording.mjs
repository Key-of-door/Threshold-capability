import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const root=process.argv[2]??'E:/Minecraft/Threshold-Experiment/live/session-02';
const recording=join(root,'recording');
const cast=readFileSync(join(recording,'threshold.cast'),'utf8').trim().split('\n').map(JSON.parse);
const meta=cast.shift();
const rows=readFileSync(join(recording,'cli.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const events=readFileSync(join(root,'traces/interventions.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const start=events.find(e=>e.event==='formal_start')?.timestamp??rows[0].at;
const selected=rows.filter(r=>r.at>=start);
const xtermRoot='E:/Minecraft/Threshold-Experiment/node_modules/@xterm/xterm';
const css=readFileSync(join(xtermRoot,'css/xterm.css'),'utf8');
const js=readFileSync(join(xtermRoot,'lib/xterm.js'),'utf8');
const safe=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const html=`<!doctype html><html lang="zh"><meta charset="utf-8"><title>Threshold × Minecraft · CLI recording</title><style>${css}
body{margin:0;background:#111719;color:#d9e7e5;font:15px "Segoe UI","Microsoft YaHei",sans-serif;padding:24px}header{display:flex;align-items:center;gap:20px;margin-bottom:14px}h1{font-size:20px;color:#8ad1c1;margin:0}small{color:#91a1a5}button,select{background:#243035;color:#deece8;border:1px solid #455b60;padding:7px;border-radius:4px}#terminal{padding:14px;border:1px solid #344749;border-radius:8px;width:max-content}footer{margin-top:12px;color:#8a9b9e}input{width:360px}</style>
<header><h1>Threshold × Minecraft</h1><small>真实 CLI 采样 · 无剧情改写</small><button id="play">播放</button><select id="speed"><option value="1">1×</option><option value="4">4×</option><option value="10">10×</option></select><input id="seek" type="range" min="0" step="0.1"><span id="clock"></span></header>
<div id="terminal"></div><footer>后台 PTY 原始输出；Board / Message / Run 状态每约 15 秒轮换。可暂停并滚动。独立于游戏录屏。</footer>
<script>${js.replaceAll('</script>','<\\/script>')}</script><script>
const events=${safe(cast)},snapshots=${safe(selected)},meta=${safe(meta)};
window.term=new Terminal({cols:118,rows:42,fontSize:17,fontFamily:'Consolas, "Microsoft YaHei", monospace',lineHeight:1.04,scrollback:10000,disableStdin:true,theme:{background:'#111719',foreground:'#d9e7e5',cursor:'#8ad1c1'}});term.open(document.getElementById('terminal'));
let index=0,t=0,playing=false,last=performance.now();const end=events.at(-1)?.[0]??0;document.getElementById('seek').max=end;
async function write(s){await new Promise(r=>term.write(s,r));}
window.showSnapshot=async i=>{playing=false;term.reset();await write(snapshots[i].output);document.getElementById('clock').textContent=snapshots[i].at+' · '+snapshots[i].label;return snapshots[i];};
window.seekTime=async target=>{playing=false;term.reset();index=0;t=target;let text='';while(index<events.length&&events[index][0]<=t){if(events[index][1]==='o')text+=events[index][2];index++;}await write(text);};
document.getElementById('play').onclick=()=>{playing=!playing;last=performance.now();};document.getElementById('seek').oninput=e=>seekTime(+e.target.value);
function tick(now){if(playing){t=Math.min(end,t+(now-last)/1000*+document.getElementById('speed').value);let text='';while(index<events.length&&events[index][0]<=t){if(events[index][1]==='o')text+=events[index][2];index++;}if(text)term.write(text);if(t===end)playing=false;}last=now;document.getElementById('play').textContent=playing?'暂停':'播放';document.getElementById('seek').value=t;requestAnimationFrame(tick);}requestAnimationFrame(tick);
seekTime(${(Date.parse(start)-meta.timestamp*1000)/1000});
</script></html>`;
writeFileSync(join(recording,'replay.html'),html);
writeFileSync(join(recording,'snapshots.json'),JSON.stringify(selected,null,2));
console.log(JSON.stringify({snapshots:selected.length,castSeconds:cast.at(-1)?.[0],html:join(recording,'replay.html')}));
if(process.argv.includes('--frames')){
 const require=createRequire('C:/Users/LOCAL_USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
 const {chromium}=require('playwright');
 const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1360,height:950},deviceScaleFactor:1});
 await page.goto(new URL('file:///'+join(recording,'replay.html').replaceAll('\\','/')).href);await page.waitForFunction(()=>typeof window.showSnapshot==='function');
 mkdirSync(join(recording,'frames'),{recursive:true});const concat=[];
 for(let i=0;i<selected.length;i++){await page.evaluate(i=>window.showSnapshot(i),i);await page.waitForTimeout(80);const name=String(i).padStart(4,'0')+'.png';await page.screenshot({path:join(recording,'frames',name)});concat.push(`file 'frames/${name}'`, 'duration 3');}
 if(selected.length)concat.push(`file 'frames/${String(selected.length-1).padStart(4,'0')}.png'`);
 writeFileSync(join(recording,'frames.txt'),concat.join('\n'));await browser.close();
}
