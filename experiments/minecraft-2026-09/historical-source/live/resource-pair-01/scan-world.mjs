import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {inflateSync,gunzipSync} from 'node:zlib';
import {join} from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire('E:/Minecraft/Threshold-Experiment/package.json');
const nbt=require('prismarine-nbt');

export async function scan(folder){const blocks=new Map(),containers=[];
 for(let cx=-4;cx<=3;cx++)for(let cz=-4;cz<=3;cz++){
  const rx=Math.floor(cx/32),rz=Math.floor(cz/32),path=join(folder,'region',`r.${rx}.${rz}.mca`);if(!existsSync(path))continue;
  const region=readFileSync(path),slot=((cx&31)+(cz&31)*32)*4,offset=region.readUIntBE(slot,3)*4096;if(!offset)continue;
  const len=region.readUInt32BE(offset),kind=region[offset+4],raw=region.subarray(offset+5,offset+4+len);
  const {parsed}=await nbt.parse(kind===2?inflateSync(raw):kind===1?gunzipSync(raw):raw);const chunk=nbt.simplify(parsed);
  for(const entity of chunk.block_entities??[])containers.push(entity);
  for(const section of chunk.sections??[]){if(section.Y<-4||section.Y>-2||!section.block_states)continue;
   const palette=section.block_states.palette,bits=Math.max(4,Math.ceil(Math.log2(palette.length))),perLong=Math.floor(64/bits),mask=(1n<<BigInt(bits))-1n;
   for(let y=0;y<16;y++)for(let z=0;z<16;z++)for(let x=0;x<16;x++){
    let p=0;if(palette.length>1){const index=y*256+z*16+x,pair=section.block_states.data[Math.floor(index/perLong)];const v=(BigInt(pair[0]>>>0)<<32n)|BigInt(pair[1]>>>0);p=Number((v>>BigInt(index%perLong*bits))&mask);}
    const value=palette[p];blocks.set(`${cx*16+x},${section.Y*16+y},${cz*16+z}`,value);
   }
  }
 }return {blocks,containers};}
