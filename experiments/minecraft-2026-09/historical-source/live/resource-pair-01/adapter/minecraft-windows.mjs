// One Minecraft client has one inventory window. Serialize its window operations;
// this does not serialize different bots or assign any shared-world work.
const queues = new WeakMap();
const items = list => list.filter(Boolean).map(i => ({name:i.name,count:i.count,slot:i.slot}));
const furnaceState = w => ({input:items([w.inputItem()]),fuel:items([w.fuelItem()]),output:items([w.outputItem()]),progress:w.progress,fuelRemaining:w.fuel});
async function windowOperation(bot, open, work, signal) {
  const previous=queues.get(bot)??Promise.resolve();
  const operation=previous.catch(()=>{}).then(async()=>{
    signal?.throwIfAborted();
    const window=await open();
    try {signal?.throwIfAborted();return await work(window);}
    finally {window.close();}
  });
  // Keep ownership until the underlying operation actually settles, even if an
  // outer caller times out. A timeout alone does not cancel network activity.
  queues.set(bot,operation.catch(()=>{}));
  return operation;
}
export function readContainer(bot,block,signal){
  return windowOperation(bot,()=>bot.openContainer(block),w=>({items:items(w.containerItems())}),signal);
}
export function transferContainer(bot,block,action,item,count,signal){
  return windowOperation(bot,()=>bot.openContainer(block),async w=>{const before=items(w.containerItems());await w[action](item.id,null,count);return {before,after:items(w.containerItems())};},signal);
}
export function readFurnace(bot,block,signal){
  return windowOperation(bot,()=>bot.openFurnace(block),w=>furnaceState(w),signal);
}
export function operateFurnace(bot,block,action,item,count,signal){
  return windowOperation(bot,()=>bot.openFurnace(block),async w=>{
    const before=furnaceState(w);
    if(action==='furnace_input') await w.putInput(item.id,null,count);
    else if(action==='furnace_fuel') await w.putFuel(item.id,null,count);
    else if(action==='furnace_take_output') {if(!w.outputItem())throw Error('Furnace output is empty; observe progress before retrying.');await w.takeOutput();}
    else throw Error('Unsupported furnace operation');
    return {before,after:furnaceState(w)};
  },signal);
}
export function craftWithWindow(bot,recipe,count,table,signal){
  // Crafting can open a crafting-table window too.
  const previous=queues.get(bot)??Promise.resolve();
  const operation=previous.catch(()=>{}).then(()=>{signal?.throwIfAborted();return bot.craft(recipe,count,table);});
  queues.set(bot,operation.catch(()=>{}));return operation;
}
