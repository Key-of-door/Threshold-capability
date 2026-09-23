# Q0/Q1 direct-task orientation diagnostic v1 — 结果与执行审计

2026-09-22。探索性诊断，非公开榜单结果。本报告由实际采集、官方 grader、公开工具轨迹和完整性检查生成。校准四条单独报告，不并入正式 24 条。报告生成时间 2026-09-22T04:17:11.018Z；首条正式请求 2026-09-22T03:04:29.457Z（UTC）。

## 结论边界

正式计划 24 条全部结束。有效轨迹 23 条，其中 23 条通过原官方 grader；无效 1 条。正常完成 23，任务 deadline 0，token/request 预算截断 0。逐条原始 reward 与轨迹有效性分开保留。

当前样本未观察到 mandatory orientation 在“完整题目已直接交付且预算充分”条件下导致交付失败的差异。这不等于证明两种方式等效，也不排除旧实验中 mandatory orientation 与延迟 task delivery 的交互。只有四个任务、每条件每题三次重复，成功率存在天花板；不能据此自动修改产品默认值。

这次测量的是 orientation 要求在直接任务交付条件下的总效应，不是纯 goal salience。它也不是旧预算与新预算的随机对照：相对旧诊断，预算、交付方式、样本和运行时间同时不同。不得把跨版本提升全部归因于预算、read_task 或 Threshold。

## 冻结条件

- 两组首条 user message 都有同一完整原题、同一 generic objective、同一 P1 后续工作提示、同一 system prompt 与 11 个工具；只有 orientation 那一句不同。Q0 要求先 read_task，Q1 允许按需读取。Q1 主动读取不重分组。
- 每条 B=20,000,000 累计 input+output（包含缓存 input），最多 1000 请求；context 1,048,576、单请求输出上限 393,216；deepseek-flash、MAX。没有按全局余额缩减额度。
- 原任务 deadline（900/1200/1800 秒）、单请求 300 秒、CPU1/RAM2GiB 保持冻结；Docker memorySwap4GiB。10GiB storage 仍未硬限制。
- native compaction 开启，reserve16384/keep20000；session/provider retry 关闭，只有可判定未发送的连接失败按 2s/4s 重试。grader 暂态网络重试按冻结规则最多两次。无自动无效轨迹重跑。
- 独立 fresh containers，三次重复、两组相邻交错且首组顺序平衡；不是同一 provider seed/shared-prefix 配对。不增加 A0/B1 或 replacement。

## 全部结果

表内分母是有效轨迹；无效数显式展示，不把失联后 grader 的 0 算作模型失败，也不把无效样本补成成功。

| 任务 | Q0（成功/有效） | Q1（成功/有效） |
|---|---|---|
| feal-linear-cryptanalysis | 3/3；无效 0 | 3/3；无效 0 |
| kv-store-grpc | 3/3；无效 0 | 3/3；无效 0 |
| break-filter-js-from-html | 2/2；无效 1 | 3/3；无效 0 |
| polyglot-rust-c | 3/3；无效 0 | 3/3；无效 0 |

- Q0：计划 12，结束 12，有效 11，成功 11；正常 11，deadline 0，预算截断 0。
- Q1：计划 12，结束 12，有效 12，成功 12；正常 12，deadline 0，预算截断 0。

完整 24 行表和 cell ID 在 [measurement-summary.md](E:/Threshold-benchmark-stage0-20260921/orientation-diagnostic-v1/formal/collection/measurement-summary.md)；原始状态仍保留 completed_pending_integrity_audit 字段，独立 integrity-audit 文件记录最终审计结果，未篡改原始 result。

## 用量与终止

正式已知 input 9,963,705、output 657,271，合计 10,620,976 tokens / 372 请求。未知用量的安全预留单列为 total 471,336、output 393,216；不是已确认账单，也不能当作零。校准已知 1,792,746 tokens / 59 请求另计。

最大已知单轨迹 1,826,772，为 B 的 9.13%。用量用于解释轨迹，不作为压缩实验的理由；每条均保留完整冻结额度。

| 任务 | 条件 | 有效 n | 已知累计 tokens 中位数 | 范围 |
|---|---|---:|---:|---:|
| feal-linear-cryptanalysis | Q0 | 3 | 597,945 | 391,170–614,022 |
| feal-linear-cryptanalysis | Q1 | 3 | 642,649 | 295,928–670,512 |
| kv-store-grpc | Q0 | 3 | 149,545 | 131,016–200,352 |
| kv-store-grpc | Q1 | 3 | 117,270 | 95,111–145,935 |
| break-filter-js-from-html | Q0 | 2 | 189,430 | 148,931–229,929 |
| break-filter-js-from-html | Q1 | 3 | 154,861 | 141,160–168,658 |
| polyglot-rust-c | Q0 | 3 | 532,093 | 397,774–881,711 |
| polyglot-rust-c | Q1 | 3 | 1,259,463 | 729,361–1,826,772 |

这些用量仅作描述；n 很小、轨迹随机、不同条件可能有不同的推理、自测及任务内纠错长度，不能宣称某组稳定更省或更强。Invalid 的已知用量仍在总账，未混进有效轨迹的中位数。

返回模型：deepseek-flash；fingerprint：aeb56401ca74e127821c4f9126dcb669。实际 compaction 事件 0 次。完整请求时长、input estimator/actual 比率分布在 request-statistics.json；估算仍保守，但本轮未造成 quota censoring。输出上限是上限，不是实际输出长度。

## 实际 orientation 行为

- Q0：read_task 12/12；首次模型调用即调用 12；与第一批普通任务行动同批 1。
- Q1：read_task 9/12；首次模型调用即调用 6；与第一批普通任务行动同批 6。

Q0 的“先读”是提示要求，没有新增硬执行 hook。有的 worker 将 read_task 和任务 shell 一起提交，不能把它描述为每条都多一个严格独立的往返。测量按原分组保留，不进行事后依从性筛选。启动提示只注入一次，后续作为历史保留；未每轮追加。first input、system/tools、每请求配置和 exact tool-result delivery 均机械核对。

## 交付链的可观察证据

以下 L 指 formal/collection/trace.jsonl 的 1-based 行号。工具成功、进入请求、完成模型响应是三个不同事件，不假定 admission 就代表模型完成处理。

| Cell / episode | 可观察链 | 解释范围 |
|---|---|---|
| FEAL Q0 r1 / 75389533132922639bcc | L62 恢复 key → L68 请求携带结果 → L71 完成响应 → L72/73 单独写明文 | 有独立的成功后交付步骤；非一次脚本同时写出 |
| FEAL Q1 r2 / d1b4e3f4a387779d8bb6 | L1599 key → L1605/1608 请求/完成响应 → L1661/1662 明文 | 中间还发生验证错误并纠正；没有 read_task |
| HTML Q1 r3 / cc268b71faea64030132 | L3171 七候选中一条 alert → L3177/3180 请求/完成响应 → L3181/3182 写出 out.html | 观察到候选成功后选取和交付 |
| Rust Q1 r3 / 7a730d550e0f56136ff9 | L3467 编译通过 → L3511 自测溢出 → L3521 重写 → L3533 验证通过 | 最早成功不是完整正确性；后续修正可观察 |
| HTML Q0 r3 / eff3202fd6aac7cd867a | L3366 两候选 alert → L3372 携带结果的请求 → L3375 ECONNRESET，无完成响应 | 无法归因为看到结果后主动不交付 |

其他 cell 的 first artifact write/confirmation、success result、下一 admitted request/完成响应、剩余预算、后续请求数以及最后两次请求的行为标注，都在 delivery-audit/。部分 FEAL solver 在同一调用完成 key 与 plaintext，不能硬拆成两次模型决策。artifact-milestones.json 另记题目已提供的路径、首次公开 assistant 精确路径提及与工具参数提及；相对路径写入以人工执行/结果核对为准，路径被提及不等于发生写入。源码/文件存在也不等于测试通过；gRPC 另有 runtime 退出后的官方 live RPC 验证。

## 基础设施事件与有效性

HTML Q0 第三次在 2026-09-22T03:55:32.725Z（北京时间 11:55:32）响应流 ECONNRESET；deadlineReached=false，usage unknown。该轨迹正常执行到候选探测，但下一响应未完成，目标文件未写出。官方 grader 本身有效并给出 0；整条 trajectory 因 transport invalid 不纳入模型 task failure。没有选择性补跑。

用户较早报告本机网络异常恢复，已写 operator-events.jsonl；缺乏精确的 outage 起止测量，不能证明该次 ECONNRESET 的根因在本机还是上游。后续条目按原冻结规则继续。Unknown envelope 完整预留，未挤占任何下一条的完整额度。

还观察到普通任务内摩擦：缺少 Python/ps/pgrep/pytest、模型自写检查的解析错误或数值类型错误、并行编译写同一产物的链接失败。能继续观察并修正的任务内错误没有任意升级为 infrastructure invalid。HTML 的 /app/test_outputs.py 是原题明确公开的辅助文件，不是隐藏测试泄漏；官方 grader 后装且原文件哈希未变。

## 完整性与限制

- 102 项哈希检查通过；新 adapter/as-run snapshot、任务/grader、前序冻结材料均未改变；所有 runtime 控制进程已退出，实验容器停止，应用状态留到 grader 完成。
- 全部 24 条已审阅公开工具输入/输出来源，未观察到隐藏 grader、参考解或其他条件结果污染。不是穷尽的文件系统/网络安全隔离审计，不包含私有 reasoning 文本语义审阅。
- core HEAD c53006438588b0b43500fa2481278dda85ce3f4c，工作区干净。未修改 Threshold core、未改产品默认值、未推送/发布。
- 小样本、单模型/provider、少数任务、非同 seed，不能代表整个 TB2.1 或其他任务。无效观测使条件有效 n 不完全相同。nproc 可见宿主 CPU 数、storage 非硬限额、真实网络波动等限制保留。
- 充分预算消除了本轮观察到的预算截断，不证明所有未来轨迹都能自由完成；长时间、不同任务、上下文压缩或更复杂交付仍未经本轮验证。

## 索引与复核

- [冻结执行稿](E:/Threshold-capability/experiments/terminal-bench-2026-09/orientation-diagnostic-v1/README.md)
- [校准报告](E:/Threshold-benchmark-stage0-20260921/orientation-diagnostic-v1/calibration-report.md)
- [24 条测量表](E:/Threshold-benchmark-stage0-20260921/orientation-diagnostic-v1/formal/collection/measurement-summary.md)
- [结构化测量](E:/Threshold-benchmark-stage0-20260921/orientation-diagnostic-v1/formal/collection/measurement-summary.json)
- [请求统计与传输错误](E:/Threshold-benchmark-stage0-20260921/orientation-diagnostic-v1/formal/collection/request-statistics.json)
- [最终完整性检查](E:/Threshold-benchmark-stage0-20260921/orientation-diagnostic-v1/formal/collection/final-check.json)
- 原始 trace、每条 result/task-artifacts/grader-*、integrity-audit/、delivery-audit/ 均保存在同一 collection 目录。

正式 manifest SHA-256：80af35f2562505f3a64a7b1f3c603cb592564693ce27e26a6a4d5e31d11fb296。最终 trace SHA-256：a3cb82ab60a9ad25f79602d488f59983450022cfa4c3e7a22607ce904d9a5c96。
