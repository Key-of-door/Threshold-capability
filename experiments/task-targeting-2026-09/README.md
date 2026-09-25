# Task inbox targeting pilot / Task 收件箱定向投递实验

**12 pairs / 12 对，24 trajectories，4 fixtures × 3 repeats.** September 2026.

Does placing the identical peer claim in the relevant Task inbox change how it is
discovered and used? Baseline leaves it in the source Task; treatment addresses the
target Task. Source identities, text, references, reality and native orientation are
otherwise held fixed within each pair, apart from necessary isolated paths and new IDs.

问题很窄：同一条 peer claim 留在 source Task，或定向写入 target Task，是否改变
它被发现和使用的方式？定向的是消息，不是完成状态或批准权。

| Observation / 观察 | Baseline (n=12) | Treatment (n=12) |
|---|---:|---:|
| Full claim in actual model input / 完整 claim 进入模型输入 | 1/12 | 12/12 |
| Reality checked after exposure / 暴露后核验现实 | 1/1 exposed | 12/12 exposed |
| New corrective Message written / 写入纠正消息 | 0/12 | 6/12 |
| Final artifact correct / 最终产物正确 | 12/12 | 12/12 |
| Total tokens / 累计 tokens | 521,869 | 588,726 |

**Visibility increased; lower total cost, less repeated work and higher completion
were not established.** Existing orientation explicitly instructed workers to read a
nonempty current inbox. This is routing plus that existing convention, not evidence
of spontaneous communication habits. A worker repaired current data correctly while
writing an incorrect account of when an earlier claim became stale. That counterexample
is retained, not edited away.

**可见性提高，但没有证明省成本、减少重复劳动或提高完成率。** 两组共享原生
“inbox 有消息则读取”的指引。一个 worker 修对了当前产物，却把“后来过期”写成
“当时就过期”；报告保留这条反例，区分当前操作正确和历史叙述正确。

## Read / 看

- [中文完整报告](analysis/report.zh-CN.md)
- [Full English report](analysis/report.en.md)
- [12-pair table / 12 对结果](analysis/pairs.tsv)
- [Per-trajectory coding and evidence / 逐条编码与证据](analysis/trajectory-evidence.md)
- [Summary JSON / 结构化汇总](analysis/summary.json)
- [Frozen rubric / 冻结编码规则](inputs/coding-rubric.md)

## Audit and reproduce / 审与复现

- [Download the full archive / 下载完整档案](https://github.com/Key-of-door/Threshold-capability/releases/tag/task-targeting-pilot-2026-09-v1)
- [Offline verification and replication notes / 离线核验与重新采样说明](REPRODUCTION.md)
- [Discussion / 讨论入口](https://github.com/Key-of-door/Threshold-capability/discussions)

The repository contains the readable reports, evidence pages and small audit files.
The downloadable ZIP additionally contains all 24 redacted traces, fixture Git bundles,
frozen source/settings, actual collector/observer implementation, preflight evidence,
per-field redaction ledger and the offline verifier. Run `node verify-public.mjs` from
the **extracted full archive**, not the smaller repository subset. No model calls are made.

仓库放可阅读材料，完整 ZIP 另含全部脱敏轨迹、初始 Git bundle、冻结源码/配置、
实际 collector/observer、preflight、逐字段脱敏清单和离线核验脚本。从完整附件中运行
核验，不是从仓库的精简子集运行；核验不会调用模型。

The original local freeze digest is
`d848ab7b27c64c22eba61590d22fc992c15810ea3146d8323cd3b921be8a848e`.
The rubric digest is
`e586849f2543146e5a6df5d8efbd332de1b8d987edafd9050562ce57684363fd`.
These are recorded local identities, not external timestamps. Public derivative hashes
are listed separately. No credentials, live home/database or private reasoning text
are distributed; the latter is explicitly documented as a publication-scope exclusion.

The sampled runtime was Pi 0.85.1 with frozen unreleased Threshold source, DeepSeek
`deepseek-flash` / thinking max, 1M configured context, 384K output ceiling and 20M/30min
per trajectory. The model name is an alias, not immutable weights. Service/Pi Node was
24.21.0 on Windows; task-shell Node was 24.18.0. Each source was a synthetic ended Run;
each target was fresh. This is not a live-source collaboration or downstream handoff study.

此次采样来自发布前冻结源码，不能把 npm alpha.5 当作原实验的字节身份。它是单模型、
四个很小 fixture、单编码者的 pilot；没有长程协作、复杂叙述安全或普遍效率保证。

Product release / 产品版本：
[threshold-lite 0.2.0-alpha.5](https://www.npmjs.com/package/threshold-lite/v/0.2.0-alpha.5).
The software release and this experiment archive are separate artifacts.
