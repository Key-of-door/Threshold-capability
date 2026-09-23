# Formal v1 high-budget：结果说明

2026-09-23 从已经完成的采集和独立保存的审计 overlay 整理的新结果说明，不覆盖任何历史报告。英文为 [忠实对应版](results.en.md)。

每题每组一次；12 个任务，36 条。A0/A1/B1 各 10/12，n=12；全部 grader 有效。失败题必须同时看：

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


| Condition | Pass / valid (n) | Normal | Deadline | Input | Output | Total tokens | Requests | Replacements |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A0 | 10/12, n=12 | 11 | 1 | 10443662 | 490221 | 10933883 | 262 | 0 |
| A1 | 10/12, n=12 | 10 | 2 | 11879706 | 508859 | 12388565 | 316 | 0 |
| B1 | 10/12, n=12 | 11 | 1 | 9368429 | 691035 | 10059464 | 360 | 12 |


B=20M；R 独立固定 60k，保留 >= 比较和首个合格 completed tool-batch 边界，正常结束优先。80 请求上限、原任务 deadline、原启动与任务投递保留；A1/B1 为独立轨迹，不是 shared-prefix fork。12 次 B1 换代均发生，actual R 为 60,624–97,365。

共 33,381,912 tokens / 938 请求。32 条正常结束、4 条 deadline；无 token/request/authorization gate 终止。相同总分不代表相同失败，不证明等价或换代免费。原 v1 保留，不将历史差距全部归因为预算。

完整方法、例外、审计范围及证据链接见 [中文原审计](integrity.zh.md)、[English audit](integrity.en.md)、[综合说明](../../REPORT.zh.md) 和 [逐轨迹机器数据](../../tables/high-budget-trajectories.json)。
