import {execFileSync} from 'node:child_process';import {join,basename} from 'node:path';import {mkdirSync,writeFileSync} from 'node:fs';
const root=process.argv[2],base='E:/Minecraft/Threshold-Experiment/live',pair=join(base,'resource-pair-01');mkdirSync(join(root,'analysis'),{recursive:true});
for(const [script,args]of[[join(pair,'world-diff.mjs'),[]],[join(pair,'player-state.mjs'),[]],[join(base,'run-06/index-traces.mjs'),[]],[join(base,'analyze-v2.mjs'),[]],[join(base,'export-messages-v2.mjs'),[]],[join(base,'export-recording.mjs'),['--frames']]]){
 const name=basename(script);const output=execFileSync(process.execPath,['--max-old-space-size=8192',script,root,...args],{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});writeFileSync(join(root,'analysis',name+'.log'),output);console.log(name+' complete');
}
execFileSync('E:/Threshold-demo-tools/python/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe',['-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i','frames.txt','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-r','12','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','threshold-cli-overview.mp4'],{cwd:join(root,'recording'),windowsHide:true,stdio:'pipe'});
console.log('CLI video exported: '+root);
