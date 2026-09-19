import {createRequire} from 'node:module';
const require=createRequire('E:/Minecraft/Threshold-Experiment/package.json');
const {Vec3}=require('vec3');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export function blockFact(bot,p){const b=bot.blockAt(p);return {position:{x:p.x,y:p.y,z:p.z},name:b?.name??'unknown_unloaded',properties:b?.getProperties()};}
export async function waitEffect(test,label,signal,ms=2200){const end=Date.now()+ms;while(Date.now()<end){signal?.throwIfAborted();if(test())return;await sleep(100);}throw Error(`Effect not observed: ${label}. Request may have been sent; re-observe before retrying.`);}
export async function useVerified(bot,item,target,face=new Vec3(0,1,0),signal){
 const p=new Vec3(target.x,target.y,target.z),b=bot.blockAt(p);if(!b)throw Error('Unknown target');
 const above=p.offset(0,1,0),adjacent=p.plus(face);let expected,checkAt=p;
 if(item.endsWith('_hoe')){if(!['grass_block','dirt','dirt_path'].includes(b.name))throw Error(`Hoe needs grass/dirt/path, found ${b.name}`);expected='farmland';}
 else if(item==='wheat_seeds'){if(b.name!=='farmland')throw Error('Seeds need farmland target');expected='wheat';checkAt=above;}
 else if(item.endsWith('_sapling')){expected=item;checkAt=above;}
 else if(item==='water_bucket'){if(b.boundingBox!=='block')throw Error('Water bucket target must be a solid reference block; water appears on selected face');expected='water';checkAt=adjacent;}
 else if(item==='bucket'){if(b.name!=='water')throw Error('Empty bucket needs a water source target');expected='air';}
 else throw Error('Unsupported use item. Use place for blocks or interact for a door/container mechanism.');
 const before=blockFact(bot,checkAt);
 if(item==='water_bucket'||item==='bucket'){
  const aim=item==='water_bucket'?p.offset(.5+face.x*.49,.5+face.y*.49,.5+face.z*.49):p.offset(.5,.5,.5);
  await bot.lookAt(aim,true);bot.activateItem();
 }else await bot.activateBlock(b,face);
 await waitEffect(()=>bot.blockAt(checkAt)?.name===expected,`${item} should produce ${expected} at ${checkAt}`,signal);
 return {source:'client_world_update',before,after:blockFact(bot,checkAt),expectedObserved:true};
}
export async function step(bot,target,signal){
 const before=bot.entity.position.clone();const dx=target.x-before.x,dz=target.z-before.z;
 if(Math.hypot(dx,dz)>5)throw Error('step target must be within 5 horizontal blocks');
 bot.pathfinder?.setGoal(null);await bot.lookAt(new Vec3(target.x,before.y+bot.entity.height,target.z),true);
 try {bot.setControlState('forward',true);bot.setControlState('jump',true);for(let i=0;i<10;i++){signal?.throwIfAborted();await sleep(100);if(Math.hypot(bot.entity.position.x-target.x,bot.entity.position.z-target.z)<.7)break;}}
 finally{bot.clearControlStates();}
 return {source:'client_position',before,after:bot.entity.position.clone(),distance:bot.entity.position.distanceTo(before)};
}
