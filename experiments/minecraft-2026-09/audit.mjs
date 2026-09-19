// Offline integrity check. Does not start Minecraft, Threshold or a model.
import {createReadStream,readFileSync,existsSync} from 'node:fs';
import {resolve,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(process.argv[2]??'.'),group=process.argv[3];
const manifest=JSON.parse(readFileSync(resolve(root,'FILE-MANIFEST.json'),'utf8'));
let checked=0,bytes=0;const failures=[];
for(const m of manifest){
 if(group&&!m.path.startsWith(group+'/'))continue;
 const file=resolve(root,m.path),rel=relative(root,file);
 if(rel.startsWith('..'+sep)||rel==='..')throw Error('Path escapes archive');
 if(!existsSync(file)){failures.push({path:m.path,error:'missing'});continue;}
 const h=createHash('sha256');let size=0;
 for await(const b of createReadStream(file)){h.update(b);size+=b.length;}
 if(h.digest('hex')!==m.published_sha256||size!==m.bytes)failures.push({path:m.path,error:'hash/size mismatch'});
 checked++;bytes+=size;
}
if(!checked)throw Error('No files selected');
console.log(JSON.stringify({checked,bytes,failures},null,2));if(failures.length)process.exitCode=1;
