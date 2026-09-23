> **Web reading edition.** [Complete sealed evidence ZIP](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip) · [SHA-256](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.sha256). Raw files, frozen source, offline verification scripts and their manifests are inside the ZIP. Historical review-time status labels inside it are preserved; they do not indicate that this public release is pending.

# Threshold × Terminal-Bench 实验档案

**公开实验档案 · 2026-09-23。** [English](README.md)

这套材料研究一个具体问题：同一任务分别由原生 Pi、保持会话的 Threshold worker、以及经历一次强制换代的 Threshold fresh worker 执行，会发生什么？保留原始紧预算实验、两轮诊断、高预算复验和完整性审计，不拼成一个新分数，也不作排行榜提交。

高预算结果：**A0 10/12，n=12；A1 10/12，n=12；B1 10/12，n=12。** A0 是采用共同实验运行政策的原生 Pi，A1 不换代，B1 换一次 fresh worker。三组同分，但失败题不同：

| Task (12 tasks; one trajectory per cell) | A0 (n=12) | A1 (n=12) | B1 (n=12) |
| --- | --- | --- | --- |
| write-compressor | 1 | 1 | 1 |
| break-filter-js-from-html | 1 | 1 | 1 |
| extract-moves-from-video | 0 | 0 | 0 |
| mteb-retrieve | 1 | 1 | 1 |
| polyglot-rust-c | 1 | 1 | 1 |
| polyglot-c-py | 1 | 1 | 1 |
| chess-best-move | 1 | 0 | 1 |
| bn-fit-modify | 1 | 1 | 1 |
| extract-elf | 0 | 1 | 0 |
| feal-differential-cryptanalysis | 1 | 1 | 1 |
| feal-linear-cryptanalysis | 1 | 1 | 1 |
| kv-store-grpc | 1 | 1 | 1 |

1 = official pass; 0 = valid failure. All 36 graders valid. Equal totals do not mean identical failures.


全部 36 条 grader 有效，12 次 B1 换代均发生；每题每条件只采一次，A1/B1 是独立轨迹，不是共享前缀分叉。没有高预算轨迹被 token/request/authorization gate 截止，4 条到达任务 deadline。它不证明三组等价、换代免费，或旧差距全部由预算造成。

## 阅读入口

**[全部 120 个预定位置与逐条证据索引](TRAJECTORIES.md)**：四个数据集分开，包含 setup-invalid 和 invalid。

- [完整综合说明](REPORT.zh.md) / [English synthesis](REPORT.en.md)
- 原始 v1：[中文原版](studies/original-formal-v1/report.zh.md) / [英文翻译](studies/original-formal-v1/report.en.md)
- P0/P1：[中文原版](studies/post-orientation-diagnostic/report.zh.md) / [英文翻译](studies/post-orientation-diagnostic/report.en.md)
- Q0/Q1：[中文原版](studies/direct-task-orientation-diagnostic/report.zh.md) / [英文翻译](studies/direct-task-orientation-diagnostic/report.en.md)
- 高预算：[中文结果说明](studies/formal-v1-high-budget/results.zh.md) / [英文](studies/formal-v1-high-budget/results.en.md)；[中文原审计](studies/formal-v1-high-budget/integrity.zh.md) / [英文翻译](studies/formal-v1-high-budget/integrity.en.md)
- [Discussion 英文草稿](DISCUSSION.en.md)、[证据导航](EVIDENCE-MAP.md)、[结论措辞表](claims.md)、[复核与重跑步骤](REPRODUCTION.md)
- [逐文件清单](source-inventory.json)、[机器可读脱敏记录](redactions.jsonl)、[发布安全说明](PUBLICATION-SAFETY.md)

中文原报告保持原字节，实验原件未改。脱敏公开副本有独立哈希和逐处 ledger。读取轨迹时必须同时使用 study 和 cell ID；旧新两轮会复用 cell ID。公开包是 observer 材料，不应暴露给新的 benchmark worker。
