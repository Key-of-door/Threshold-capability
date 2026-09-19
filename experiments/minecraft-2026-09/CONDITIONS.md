# Conditions, lineage, and limitations

`S02 → S03 → S05 → {RC, RI}; RI → {H0, H1}; H0 → G2`

组别是独立存档分支，不是按视频播放顺序共用一个被持续修改的世界。特别是 H1 不是 G2 的父代。

- **S02**: Initial formal run; history available; early narrow adapter.
- **S03**: Fresh worker continuation; broader adapter; own new conversations; history available.
- **S05**: Longer continuation after service restart; history available.
- **RC**: Resource control fork of S05 final; scarce above-ground stone; history available.
- **RI**: Independent same-source fork; 58 agreed resource blocks differ; history available.
- **H0**: Independent fork of RI final; project history tools and history view removed; current conversation retained.
- **H1**: Same source as H0; history available; independent branch, not H0 successor.
- **G2**: Fresh generation from H0 final; all three old conversations absent; same bot bodies/world; history remains off.

## Versions and operating conditions

- Threshold source commit: `c53006438588b0b43500fa2481278dda85ce3f4c` (0.2.0-alpha.3 checkout); inspect each fork manifest for its recorded provenance.
- Pi pinned 0.85.1 in that checkout; Mineflayer 4.39.0 and mineflayer-pathfinder 2.4.5, full resolved dependencies in historical-source/package-lock.json and S02 dependencies lock.
- Minecraft Java 1.21.1, local 127.0.0.1:25565, offline-mode server, peaceful superflat shared base, seed 20260918. Seed alone does not recreate constructed terrain, inventory or all settings: use initial snapshots and server.properties. Do not expose this offline-mode experiment server to the Internet.
- Provider/model: DeepSeek / deepseek-flash; this is the alias recorded in the experiment, not a guarantee of immutable backend weights. Exact model JSON, context/output limits, budgets and timestamps are in each ZIP. Large later values (1,000,000 configured context; 384,000 configured max output) are requested limits, not actual output per response. Cumulative token totals repeatedly count cached input.
- Human observer used spectator mode. Initial placement/provisioning, tick freeze/unfreeze, repeated continuation prompts and ordinary technical repairs between rounds are documented interventions. No mid-run manual role assignment or retrospective belief repair is claimed. Read each report before generalizing.
- S01 did not reach formal model work; S04 encountered authentication failures with zero world actions. These are not treated as additional successful trials; their private credential/error setup is not included.

## Channels and claims

H0/G2 selected tools are read_work / mc_observe / mc_action. H1 additionally exposes read_messages / send_message / save_checkpoint. A study-local gate filters Task responses and routes; the original database retains history for the observer. This is workflow/tool isolation, not OS or cryptographic isolation. Inspect actual prepared requests, not CLI screenshots, to determine what a worker received.

The mechanical channel is periodic server sampling, action outcomes and coherent saved snapshots, not a continuous omniscient event ledger. Item pickup chains without entity/item identity are described as strong evidence rather than proven item-level ownership. Missing search results are not proof of absence.

## Confounders / not established

Single model family, small sequential exploratory sample, no statistical significance, shared objective and game priors, model nondeterminism, asynchronous scheduling, bounded observations, observation lag, adapter quirks, pre-existing resource depletion and accumulated construction. Interfaces changed between earlier rounds; compare only the explicitly matched forks. G2 has no matched retained-conversation control. Fresh Run is not a blank model and does not erase the persistent bot body.

Tool errors, stale observation and incorrect statements must not be relabeled as deception without evidence. The stone shovel was deposited and remained unused during this arm; that supports a supply attempt, not realized assistance or social intent. Building continued while causal explanations were wrong; this does not establish a general distributed-error-correction theory.
