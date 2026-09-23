# Threshold × Terminal-Bench 2.1：正式采集 v1 结果

生成于 2026-09-21T17:41:23.229Z。采集已结束；这是冻结子集的一次描述性实验，不是排行榜提交，也不证明性能等价。

预定 36 条；实际启动 30 条；setup-invalid 6 条。有效且输入审计未观察到污染的轨迹 29 条，其中通过 7 条。其余单列，不补跑、不换题。

## 冻结条件

- A0：原生 Pi，单 worker；A1：Threshold 单 worker；B1：Threshold 在首个符合条件的完整响应/工具批次边界结束旧 Run，再启动 fresh Run。
- A1/B1 是独立匹配轨迹，不是 shared-prefix paired fork。每题每条件仅一次。
- deepseek-flash / MAX；context 1048576，单响应配置上限393216；每条共享总预算120000 tokens（输入含缓存+输出），最多80请求，原任务 deadline；B1最多一次换代。
- 目标换代阈值50%；实际比例受不可拆分响应影响。正常结束优先；fresh不获额外预算。
- Pi0.85.1，Threshold c53006438588b0b43500fa2481278dda85ce3f4c；CPU1、RAM2GiB，内存+swap总上限4GiB；声明10GiB存储未硬限制。
- Release manifest SHA256：`bc7605109a8d750eaf00eaae5c90db97486e75f6e7ee9acff85ac3839cb1edc5`。全部 as-run adapter 源码及哈希随材料保存。

## 全部预定位置

| Task | 条件 | Collector 状态 | Grader valid | 原始 reward | 有效分数 | 输入审计 | 实际 tokens | 换代 |
|---|---|---|---|---|---|---|---:|---|
| write-compressor | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 96,480 | 否 |
| write-compressor | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 97,565 | 否 |
| write-compressor | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 117,669 | 86.3% |
| break-filter-js-from-html | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 103,820 | 否 |
| break-filter-js-from-html | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 108,017 | 57.2% |
| break-filter-js-from-html | A1 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 106,604 | 否 |
| extract-moves-from-video | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 107,577 | 否 |
| extract-moves-from-video | A0 | invalid | false | 0 | — | no_contamination_observed | 112,311 | 否 |
| extract-moves-from-video | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 113,191 | 55.6% |
| mteb-retrieve | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 112,138 | 否 |
| mteb-retrieve | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 110,338 | 55.4% |
| mteb-retrieve | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 111,535 | 否 |
| polyglot-rust-c | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 98,868 | 58.0% |
| polyglot-rust-c | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 92,260 | 否 |
| polyglot-rust-c | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 89,201 | 否 |
| polyglot-c-py | B1 | setup-invalid | 未运行 | — | — | 未运行 | — | 否 |
| polyglot-c-py | A1 | setup-invalid | 未运行 | — | — | 未运行 | — | 否 |
| polyglot-c-py | A0 | setup-invalid | 未运行 | — | — | 未运行 | — | 否 |
| chess-best-move | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 114,461 | 否 |
| chess-best-move | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 101,424 | 否 |
| chess-best-move | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 112,732 | 51.5% |
| bn-fit-modify | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 116,917 | 否 |
| bn-fit-modify | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 110,585 | 53.1% |
| bn-fit-modify | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 108,042 | 否 |
| extract-elf | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 99,641 | 否 |
| extract-elf | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 112,370 | 否 |
| extract-elf | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 117,205 | 71.6% |
| feal-differential-cryptanalysis | A1 | setup-invalid | 未运行 | — | — | 未运行 | — | 否 |
| feal-differential-cryptanalysis | B1 | setup-invalid | 未运行 | — | — | 未运行 | — | 否 |
| feal-differential-cryptanalysis | A0 | setup-invalid | 未运行 | — | — | 未运行 | — | 否 |
| feal-linear-cryptanalysis | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 97,039 | 57.1% |
| feal-linear-cryptanalysis | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 115,658 | 否 |
| feal-linear-cryptanalysis | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 107,447 | 否 |
| kv-store-grpc | B1 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 116,562 | 58.2% |
| kv-store-grpc | A1 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 106,792 | 否 |
| kv-store-grpc | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 62,522 | 否 |

## 分条件与匹配结果

| 条件 | 预定 | 启动 | Clean valid | 通过 | 有效失败 |
|---|---:|---:|---:|---:|---:|
| A0 | 12 | 10 | 9 | 4 | 5 |
| A1 | 12 | 10 | 10 | 2 | 8 |
| B1 | 12 | 10 | 10 | 1 | 9 |

A1/B1 两边均 clean-valid 的匹配任务：10。双方通过 1，仅A1通过 1，仅B1通过 0，双方失败 8。

全部匹配行及实际触发标记保存在 analysis.json/pairs；触发子集是条件性描述，不能当成随机、无偏的换代效应估计。

## 用量与预算边界

已知累计输入 2,589,448，输出 587,523，合计 3,176,971 tokens；请求 339 次。未知 total reserve 0，未知 output reserve 0。

全局授权15M累计tokens / 5M输出 / 3200请求，含保守未知用量余量。单条上限不随全局余额缩小。缓存计入输入；reasoning已含输出不重复计费。费用来源为provider usage/cache数据；未取得权威账单金额，runtime中的零价格占位不作为实际费用。

| 条件 | 实际预算利用率 min / median / max | 请求前输入预留停止数 |
|---|---|---:|
| A0 | 52.1% / 93.6% / 97.4% | 8 |
| A1 | 74.3% / 89.0% / 93.4% | 10 |
| B1 | 80.9% / 93.9% / 98.1% | 7 |

30条中25条由输入预留停止，4条以length响应结束且meter terminal为空，只有gRPC A0记录normal_completion。结束状态不等于成功交付。估算误差按A0/A1/B1旧代/fresh代保存在 budget-summary.json，逐请求原始估算/实际prompt/cap/cache/reasoning计数在 analysis.json/requestRows。低于B停止不等于资金不足；保守输入预留及上下文增长仍可能消耗有效计算空间。

## 换代、连续性与测量边界

实际换代 10 条。

| Task | 实际比例 | Fresh首请求延迟ms | Fresh初始roles |
|---|---:|---:|---|
| write-compressor | 86.3% | 359 | system, user |
| break-filter-js-from-html | 57.2% | 338 | system, user |
| extract-moves-from-video | 55.6% | 352 | system, user |
| mteb-retrieve | 55.4% | 338 | system, user |
| polyglot-rust-c | 58.0% | 347 | system, user |
| chess-best-move | 51.5% | 383 | system, user |
| bn-fit-modify | 53.1% | 326 | system, user |
| extract-elf | 71.6% | 330 | system, user |
| feal-linear-cryptanalysis | 57.1% | 364 | system, user |
| kv-store-grpc | 58.2% | 361 | system, user |

analysis.json保留每代用量、首工具、显式read/write/edit和冻结测试命令识别器命中、实际read_task/read_messages调用、runtime结束及替换时间。shell内部全部文件访问未被完整仪器化；未观察到不能写成没有发生。fresh后的全部消耗不是“重建开销”。

已结束的Agent PID在评分前独立检查；应用进程保留在同一容器。峰值Agent runtime为1；A0没有Threshold Run实体。provider缓存不等同旧会话，不声称清除provider内部状态。

## 必须一起阅读的限制

- 有效reward0是任务结果；官方测试未实际执行则grading invalid，即使脚本写reward0或exit0。
- 视频A0后台apt持有dpkg锁，导致grader无法安装依赖和执行测试；原始输出与无效判据保留，不作为隐藏断言失败。
- extract-elf A0 在 length 响应后出现一次标记 overflow 的 compaction 尝试；摘要请求在推理前被预算门拒绝，没有完成压缩，也没有新增付费请求。该标签不证明1M上下文已用满。
- read / image输出中有图像省略提示；配置为text-only的模型通过OCR/像素工具工作，不声称直接视觉输入。
- 请求前估算保守、累积reasoning输入、官方网络下载和deadline均可能影响轨迹；不能据此直接推断Threshold独立效果。
- 部分protocol停止在Project recentRuns显示为通用model error，fresh能够观察；host meter另有精确停止原因。
- Rust/C++官方image报告g++13.3.0而题面写13.2.0；未中途替换编译器。
- 公开测试、任务提供的数据、普通安装库源代码是允许输入。污染判据依据来源，不依据benchmark/test等关键词。
- no_contamination_observed仅覆盖已记录输入及返回，不是完整网络/文件系统安全隔离证明。
- 小型、单模型家族、单次匹配轨迹和非硬存储配额限制外推；无大规模泛化或优越性结论。

## 三个具体观察

- kv-store-grpc：三个条件均通过7项官方测试。B1旧代留下运行中的Python服务，fresh在没有checkpoint的情况下读取文件并调用同一PID86服务成功；最后checkpoint因输出截断未执行（trace 4505 / 4599 / 4641 / 4653）。
- feal-linear-cryptanalysis：A0写出攻击程序，恢复密钥并生成100行明文，官方测试通过；A1/B1未交付。单次结果不支持稳定的框架优劣判断（trace 4248–4285）。
- mteb / bn-fit / extract-elf 等B1轨迹保留了环境或文件，但旧代没有形成checkpoint/最终产物，fresh重复调查。持久化与有效接手不是同一个结论。

## 原始材料与复核入口

证据根目录：`E:/Threshold-benchmark-stage0-20260921/formal-preflight-v1/formal-collection`。

- registry.json：全部预定位置与collector原始状态。
- trace.jsonl：模型可见内容、工具与请求/usage时间序列；不保留私有推理正文。
- 每条 result.json、worker-visibility.json、retired-runtime-pids.json、grader-*/execution.json/CTRF/reward/validity.json。
- integrity-audit/*.json + candidate-review.json：人工来源核对与轨迹行号；不覆盖原始reward。
- observer-validation.json：从trace独立重算请求与用量，并检查工具调用配对。
- final-integrity-check.json：30条审计覆盖、运行时PID结束、容器停止、20个冻结源码哈希及core未改的收尾检查。
- post-grading-container-diff.txt：每条评分后的容器文件变更路径；包含grader的影响，不能当成纯worker diff。完整容器仍在Docker中停止保留。
- analysis.json / budget-summary.json：全表、配对、时序、预算与cache统计。
- as-run-adapter/ + release-manifest.json：冻结源码、参数与任务镜像信息。
- formal-run-notes-v1.md：采集过程中保留的问题与具体episode。
