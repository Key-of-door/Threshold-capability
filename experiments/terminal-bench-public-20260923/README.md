> **Web reading edition.** [Complete sealed evidence ZIP](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip) · [SHA-256](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.sha256). Raw files, frozen source, offline verification scripts and their manifests are inside the ZIP. Historical review-time status labels inside it are preserved; they do not indicate that this public release is pending.

# Threshold × Terminal-Bench: experiment archive

**Published experiment archive · 2026-09-23.** [中文入口](README.zh.md)

What happens when native Pi, Threshold continuation, and a forced fresh Threshold worker attempt the same tasks? This archive preserves the original tight-budget experiment, two diagnostics, a budget-relaxed replication and the final input-integrity audit. It is a small exploratory study, not a leaderboard submission.

High-budget result: **A0 10/12, n=12; A1 10/12, n=12; B1 10/12, n=12.** A0 is native Pi under shared experimental runtime policies; A1 uses Threshold without replacement; B1 performs one early fresh-worker replacement. The equal totals hide different failures:

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


All 36 high-budget graders were valid. All 12 B1 replacements actually occurred. Each task/condition has one independently sampled trajectory, not a shared-prefix fork. No token/request/authorization gate ended a high-budget trajectory; four reached their task deadline. This does not establish equivalence, cost-free replacement or budget as the sole cause of historical differences.

## Read, inspect, reproduce

**[All 120 planned slots and per-cell evidence](TRAJECTORIES.md)** — four separate collections; invalid and setup-invalid records retained.

- **Read:** [full synthesis](REPORT.en.md), [中文综合说明](REPORT.zh.md), [English Discussion draft](DISCUSSION.en.md).
- **Original formal v1:** [中文原报告](studies/original-formal-v1/report.zh.md) · [English translation](studies/original-formal-v1/report.en.md).
- **P0/P1:** [中文原报告](studies/post-orientation-diagnostic/report.zh.md) · [English translation](studies/post-orientation-diagnostic/report.en.md).
- **Q0/Q1:** [中文原报告](studies/direct-task-orientation-diagnostic/report.zh.md) · [English translation](studies/direct-task-orientation-diagnostic/report.en.md).
- **High-budget:** [中文结果说明](studies/formal-v1-high-budget/results.zh.md) · [English results](studies/formal-v1-high-budget/results.en.md) · [中文原完整性审计](studies/formal-v1-high-budget/integrity.zh.md) · [English audit translation](studies/formal-v1-high-budget/integrity.en.md).
- **Inspect:** [evidence map](EVIDENCE-MAP.md), [source inventory](source-inventory.json), [redaction ledger](redactions.jsonl), [claims boundaries](claims.md), [publication safety](PUBLICATION-SAFETY.md).
- **Recompute / rerun:** [reproduction checklist](REPRODUCTION.md). `python scripts/verify.py` is read-only; `python scripts/derive.py` regenerates tables without model calls or Docker.

The original Chinese reports and original experimental records remain preserved. Public copies are safety-redacted where needed; historical hashes and publication hashes are separately recorded. Dataset identity is `(study, cell_id)`, because cell IDs repeat between original and high-budget collections. Do not mount this observer archive into a benchmark worker.
