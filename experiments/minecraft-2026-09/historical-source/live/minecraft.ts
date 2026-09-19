import { Type } from 'typebox';
import { createRequire } from 'node:module';
import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
const require = createRequire('E:/Minecraft/Threshold-Experiment/package.json');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');

export default function (pi: any) {
  const base = process.env.MC_EXPERIMENT_ROOT!;
  const cfg = JSON.parse(readFileSync(join(base, 'experiment.json'), 'utf8'));
  const identity = cfg.bots[basename(process.cwd())];
  if (!identity) throw new Error('No bot binding for this workspace');
  const dir = join(base, 'traces', identity); mkdirSync(dir, { recursive: true });
  let bot: any, connecting: Promise<any> | undefined, runId: string | null = null, counter = 0, call = 0, actions = 0, busy = false;
  const sanitize = (value: any): any => JSON.parse(JSON.stringify(value, (k, v) => {
    if (/^(thinking|reasoning_content|signature|thinkingSignature|thoughtSignature)$/i.test(k)) return '[not retained]';
    if (/^(apiKey|authorization|accessToken)$/i.test(k)) return '[redacted]';
    return v;
  }));
  function log(file: string, value: any) { appendFileSync(join(dir, file), JSON.stringify({ timestamp: new Date().toISOString(), run_id: runId, bot_id: identity, ...sanitize(value) }) + '\n'); }
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  async function timed(p: Promise<any>, signal?: AbortSignal, ms = 15000) {
    let timer: any, abort: any;
    try { return await Promise.race([p, new Promise((_, reject) => {
      abort = () => reject(new Error('Action interrupted; effects may be partial. Re-observe.'));
      if (signal?.aborted) return abort();
      signal?.addEventListener('abort', abort, { once: true });
      timer = setTimeout(() => reject(new Error('Action timed out; effects may be partial. Re-observe.')), ms);
    })]); } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  }
  async function ready() {
    if (bot?.entity && bot.health !== undefined) return bot;
    return connecting ??= (async () => {
      const context = await fetch(process.env.THRESHOLD_SERVICE_URL + '/agent/task', { headers: { authorization: `Bearer ${process.env.THRESHOLD_RUN_TOKEN}` }, signal: AbortSignal.timeout(10000) }).then(r => r.json());
      runId = context.currentRun.id;
      log('lifecycle.jsonl', { event: 'identity_binding', workspace: process.cwd(), session: 'native identity is recorded by Threshold' });
      bot = mineflayer.createBot({ host: '127.0.0.1', port: cfg.port, username: identity, auth: 'offline', version: '1.21.1', hideErrors: true });
      bot.on('error', (e: any) => log('lifecycle.jsonl', { event: 'error', message: e.message }));
      bot.on('end', (reason: any) => log('lifecycle.jsonl', { event: 'end', reason }));
      bot.on('death', () => log('lifecycle.jsonl', { event: 'death' }));
      await timed(new Promise((resolve, reject) => { bot.once('spawn', resolve); bot.once('kicked', (reason: any) => reject(new Error(JSON.stringify(reason)))); bot.once('error', reject); }), undefined, 30000);
      await timed(bot.waitForChunksToLoad(), undefined, 15000);
      bot.loadPlugin(pathfinder); const m = new Movements(bot); m.canDig = false; m.allow1by1towers = false; m.scafoldingBlocks = []; bot.pathfinder.setMovements(m);
      await sleep(600); return bot;
    })();
  }
  const xyz = (v: any) => ({ x: v.x, y: v.y, z: v.z });
  const items = (list: any[]) => list.map(i => ({ name: i.name, count: i.count, slot: i.slot }));
  const state = () => ({ observed_at: new Date().toISOString(), position: xyz(bot.entity.position), health: bot.health, food: bot.food, inventory: items(bot.inventory.items()) });
  const pos = (p: any) => new Vec3(p.x, p.y, p.z);
  const near = (p: any) => { if (bot.entity.position.distanceTo(pos(p)) > 5) throw new Error('Target out of interaction range; move closer and re-observe.'); };
  const position = Type.Object({ x: Type.Integer({ minimum: -60, maximum: 60 }), y: Type.Integer({ minimum: -64, maximum: -40 }), z: Type.Integer({ minimum: -60, maximum: 60 }) });
  const result = (id: string, value: any) => {
    const observation_id = `${identity}-obs-${++counter}`;
    const body = { observation_id, action_id: id, ...value };
    log('observations.jsonl', { event: 'tool_result_prepared', ...body });
    return { content: [{ type: 'text', text: JSON.stringify(body) }], details: body };
  };
  pi.registerTool({ name: 'mc_observe', label: 'Minecraft observe', description: 'Read YOUR bot and nearby loaded world (not human line of sight). Optional block names search <=24 blocks, max 24 results; inspect exact positions or open a nearby container. No game chat. Missing unloaded data is unknown. Returns timestamped observations; other bots can change reality afterwards.',
    parameters: Type.Object({ blocks: Type.Optional(Type.Array(Type.String(), { maxItems: 8 })), at: Type.Optional(Type.Array(position, { maxItems: 24 })), container: Type.Optional(position) }),
    async execute(id: string, p: any, signal: AbortSignal) {
      await ready(); const value: any = { ...state(), entities: Object.values(bot.entities).filter((e: any) => e.id !== bot.entity.id && e.position.distanceTo(bot.entity.position) <= 24).slice(0, 20).map((e: any) => ({ name: e.username ?? e.name, position: xyz(e.position), type: e.type })), coverage: 'loaded client world, radius <=24; entities max20, blocks max24' };
      const names = p.blocks ?? ['oak_log', 'chest', 'crafting_table', 'wheat', 'water', 'farmland'];
      const ids = names.map((n: string) => bot.registry.blocksByName[n]?.id).filter((n: any) => n !== undefined);
      value.blocks = bot.findBlocks({ matching: ids, maxDistance: 24, count: 24 }).map((v: any) => ({ name: bot.blockAt(v)?.name, ...xyz(v) }));
      if (p.at) value.inspected = p.at.map((v: any) => { const b = bot.blockAt(pos(v)); return { ...v, name: b?.name ?? 'unknown_unloaded', properties: b?.getProperties() }; });
      if (p.container) { near(p.container); const c = await timed(bot.openContainer(bot.blockAt(pos(p.container))), signal); try { value.container = { at: p.container, items: items(c.containerItems()) }; } finally { c.close(); } }
      return result(id, value);
    } });
  pi.registerTool({ name: 'mc_action', label: 'Minecraft action', description: 'Operate only YOUR bot. move uses pathfinding without digging/building (20s limit). dig or place use explicit positions (max12); no implicit approach. place requires item and target empty position, with adjacent supporting block. craft count is recipe repetitions (max16), within reach of a crafting table if needed. equip/use: use a named held item (hoe on grass/dirt, seeds on farmland, bucket on block); container transfers use item/count at nearby chest. Actions can partially succeed. Stop/re-observe after error. Maximum 10 action calls per work round; report/checkpoint then wait.',
    parameters: Type.Object({ action: Type.Union(['move','dig','place','craft','equip','use','deposit','withdraw','stop'].map(v => Type.Literal(v))), target: Type.Optional(position), positions: Type.Optional(Type.Array(position, { maxItems: 12 })), item: Type.Optional(Type.String()), count: Type.Optional(Type.Integer({ minimum: 1, maximum: 16 })) }),
    async execute(id: string, p: any, signal: AbortSignal) {
      await ready(); if (busy) throw new Error('Another action is active'); if (++actions > 10) throw new Error('Round action budget reached. Save checkpoint / communicate if useful, then end this round.'); busy = true;
      log('actions.jsonl', { event: 'requested', action_id: id, args: p });
      const targets = p.positions ?? (p.target ? [p.target] : []); const completed: any[] = [];
      try {
        if (p.action === 'stop') { bot.pathfinder.setGoal(null); bot.clearControlStates(); }
        else if (p.action === 'move') { if (!p.target) throw new Error('target required'); await timed(bot.pathfinder.goto(new goals.GoalNear(p.target.x, p.target.y, p.target.z, 1)), signal, 20000); }
        else if (p.action === 'craft') { const item = bot.registry.itemsByName[p.item]; if (!item) throw new Error('Unknown item'); const table = bot.findBlock({ matching: bot.registry.blocksByName.crafting_table.id, maxDistance: 4 }); const recipes = bot.recipesFor(item.id, null, 1, table); if (!recipes.length) throw new Error('No available recipe: check materials / nearby crafting table'); await timed(bot.craft(recipes[0], p.count ?? 1, table), signal); }
        else if (p.action === 'deposit' || p.action === 'withdraw') { if (!p.target) throw new Error('target required'); near(p.target); const item = bot.registry.itemsByName[p.item]; if (!item) throw new Error('Unknown item'); const c = await timed(bot.openContainer(bot.blockAt(pos(p.target))), signal); try { await timed(c[p.action](item.id, null, p.count ?? 1), signal); } finally { c.close(); } }
        else {
          if (p.action !== 'dig') { const item = bot.inventory.items().find((i: any) => i.name === p.item); if (!item) throw new Error('Item not in YOUR inventory'); await timed(bot.equip(item, 'hand'), signal); }
          if (p.action === 'equip') { /* equipped */ }
          else if (p.action === 'use' && !targets.length) { await timed(bot.consume(), signal); }
          else {
            if (!targets.length) throw new Error('target or positions required');
            for (const t of targets) {
              signal?.throwIfAborted(); near(t); const v = pos(t); const block = bot.blockAt(v); if (!block) throw new Error('Unknown unloaded target');
              if (p.action === 'dig') await timed(bot.dig(block), signal);
              else if (p.action === 'use') await timed(bot.activateBlock(block, new Vec3(0, 1, 0)), signal);
              else if (p.action === 'place') {
                if (!['air','short_grass','tall_grass'].includes(block.name)) throw new Error(`Target occupied by ${block.name}`);
                const offsets = [new Vec3(0,-1,0),new Vec3(1,0,0),new Vec3(-1,0,0),new Vec3(0,0,1),new Vec3(0,0,-1),new Vec3(0,1,0)];
                const ref = offsets.map(o => ({ b: bot.blockAt(v.plus(o)), face: o.scaled(-1) })).find(r => r.b?.boundingBox === 'block');
                if (!ref) throw new Error('No supporting adjacent block');
                await timed(bot.placeBlock(ref.b, ref.face), signal);
              }
              completed.push(t);
            }
          }
        }
        await sleep(200); log('actions.jsonl', { event: 'completed', action_id: id, completed }); return result(id, { ...state(), completed });
      } catch (e: any) { log('actions.jsonl', { event: 'error', action_id: id, completed, error: String(e.message).slice(0,600) }); return { ...result(id, { ...state(), completed, technical_error: String(e.message).slice(0,600), effects: 'may be partial; re-observe' }), isError: true }; }
      finally { bot.pathfinder.setGoal(null); bot.clearControlStates(); try { bot.stopDigging(); } catch {} busy = false; }
    } });
  pi.on('session_start', async () => { pi.setActiveTools(['read_task','read_messages','send_message','read_project_board','save_checkpoint','update_task_status','mc_observe','mc_action']); });
  pi.on('before_agent_start', (e: any) => { actions = 0; log('epistemic.jsonl', { event: 'round_input', prompt: e.prompt, systemPrompt: e.systemPrompt }); });
  pi.on('context', (e: any) => { log('epistemic.jsonl', { event: 'context_prepared', observation_id: `${identity}-context-${++call}`, messages: e.messages.map((m: any) => ({ ...m, content: Array.isArray(m.content) ? m.content.filter((x: any) => x.type !== 'thinking') : m.content })) }); });
  pi.on('before_provider_request', (e: any) => { const payload = sanitize(e.payload); log('epistemic.jsonl', { event: 'provider_request_prepared', model_call_id: `${identity}-call-${call}`, payload }); });
  pi.on('after_provider_response', (e: any) => { log('epistemic.jsonl', { event: 'provider_response_headers_received', model_call_id: `${identity}-call-${call}`, status: e.status }); });
  pi.on('tool_result', (e: any) => { log('epistemic.jsonl', { event: 'tool_result_available', action_id: e.toolCallId, tool: e.toolName, content: e.content, isError: e.isError }); });
  pi.on('message_end', (e: any) => { if (e.message.role === 'assistant') log('public-output.jsonl', { event: 'assistant', content: e.message.content.filter((x: any) => x.type !== 'thinking'), usage: e.message.usage, stopReason: e.message.stopReason }); });
  pi.on('session_shutdown', async () => { if (bot) { bot.pathfinder?.setGoal(null); bot.clearControlStates(); bot.quit('Run ending'); } });
}
