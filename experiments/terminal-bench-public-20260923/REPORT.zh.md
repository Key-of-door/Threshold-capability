# Threshold × Terminal-Bench：从紧预算结果到高预算复验

2026-09-23 整理的综合说明，属于新写的阅读层，不替代各轮原报告。[English](REPORT.en.md)

## 先看完整任务结果

高预算轮：A0 原生 Pi、A1 Threshold 不换代、B1 Threshold 一次早期 fresh replacement，各 10/12，n=12。每题每条件只采一次；36 条 grader 全部有效，记录覆盖范围内均为 no_contamination_observed。

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


## 1. 研究问题与样本

A0→A1 观察正常 Project 接入，A1→B1 观察在规定边界结束旧 worker 后的任务接续。A1/B1 为独立匹配轨迹，不是相同前缀的反事实。A0 不加载 Threshold Project 工具，但遵循共同实验预算、重试和执行政策，不代表所有开箱 Pi 默认值。

正式 subset 在看到成绩前冻结：seed 为 threshold-tb21-pilot-20260921-v1，按 SHA256(seed/task) 字典序从 62 个 eligible tasks 选 12 个；开发题排除。完整抽样框、规则、任务元信息和顺序保存在 [formal-subset-v1.json (in evidence ZIP)](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip)。不能自动外推到全部 TB2.1。

## 2. 原始 v1 保持成立，但有明确条件

原始 B=120k，R=B/2；36 个位置中启动 30 条，6 个 setup-invalid，1 条 grader-invalid。有效通过分别为 A0 4/9、A1 2/10、B1 1/10。25 条在输入预留处终止，4 条以 length 响应结束，1 条正常结束。失败、准备错误、无效原始 reward 都保留。

这是**紧预算及冻结的保守 admission 规则下**的结果，不是后来表现改善就应作废的数据；也不是每条都恰好有 120k 的有效计算量。

## 3. 诊断改变解释，不改旧数据

时间顺序：formal v1 异常 → integration/input 调查 → P0/P1 → 识别预算门的主动截断 → Q0/Q1 → 回到原 A0/A1/B1 做高预算复验 → 完整性审计。

P0/P1 只放松启动 **user turn** 中四处 post-orientation 工作流要求，system、首读 read_task、间接题面交付不变。4 个事后选题、每组每题 3 次，没有建立稳定的 P1 改善；23 条有效轨迹全被输入预留门终止。FEAL P1 有一条生成了匹配 32 个公开样本的 key，却没有最终 plaintext 文件，下一推理被门挡住。它不证明唯一隐藏 key，也不改成部分分。

Q0/Q1 两组都直接获得完整题目，预算充足，只改变 read_task 必须/按需的提示。24 条中 23 条有效并全部通过，1 条 transport-invalid 保留；无有效轨迹到达 deadline 或 quota。Q1 有 9/12 自发读取，其中 6/12 首轮读取。Q0 是提示要求，不是硬排序 hook。这测的是直接交付条件下 orientation guidance 的总效应，不是纯 goal salience，也不是旧新预算的因果对照。

| Study | Condition | Planned | Pass / valid | Invalid | Normal | Budget stops |
| --- | --- | --- | --- | --- | --- | --- |
| P | P0 | 12 | 8/12, n=12 | 0 | 0 | 12 |
| P | P1 | 12 | 8/11, n=11 | 1 | 0 | 11 |
| Q | Q0 | 12 | 11/11, n=11 | 1 | 11 | 0 |
| Q | Q1 | 12 | 12/12, n=12 | 0 | 12 | 0 |

Each study: four tasks, three repeats per condition; repetitions are not distinct benchmark tasks. No pooling across P and Q.


## 4. 高预算轮改了什么

BB 从 120k 提到 20M；RR 与 B/2 解耦，固定原名义 60k。若保留 R=0.5B，换代会推迟到 10M，可能失去早期扰动。这是 budget-relaxed replication，不是 literal replication。

沿用原条件、任务顺序、启动与投递语义、80 请求上限、任务 deadline、模型及运行政策；没有混入 P1/Q 提示或 1000 请求上限。重新 preflight 后 12 题全部有效，与旧轮 coverage 不同。同一名义 R 不等于相同实际前缀或时刻；放开剩余预算对输出的 clamp 也可能使边界前响应变长。

模型 deepseek-flash / max，C=1,048,576，O=393,216；Pi0.85.1，core c53006438588b0b43500fa2481278dda85ce3f4c。fingerprint 是观测值，不是未来后端版本锁。CPU1/RAM2GiB/memory+swap4GiB；10GiB 存储未硬限制。细则以 policy、as-run adapter 和 manifest 为准。

## 5. 预算、终止与换代

共 33,381,912 tokens：输入 31,691,797，输出 1,690,115，938 请求。无 unknown reserve、compaction、provider/stream/adapter error 或预算/请求/授权门终止。32 条正常结束，4 条到达原任务 deadline；最大单条 5,195,459。没有权威金额账单。

![各轨迹终止时用量，n=36，每组n=12](figures/01-trajectory-usage.png)

12 次 B1 均在达到 >=60k 后首个 eligible completed batch 换代，实际 60,624–97,365；旧 runtime 先退出，新 runtime 后启动，fresh 首请求均无旧 assistant/tool conversation。这不意味着持久 Project/文件/Message 被抹掉，也不意味着清空 provider 内部状态。

![B1换代与接任者用量，n=12](figures/02-replacement.png)

13 个旧代终末批次工具结果没有进入旧代下一次推理。它们的效果仍可能留在环境中供重建；换代语义不承诺旧代最后再观察一次。持久 Project 记录也可能描述效果，不能说 fresh 只能读取文件。后继用量不全是重建开销；[完整表](tables/D-replacement.md)分别保留 token 余量、实际用量、剩余请求与时间。

## 6. 新旧对照的边界

| Study | Condition | Planned | Pass / valid | Pass / common valid (n=9) |
| --- | --- | --- | --- | --- |
| original-formal-v1 | A0 | 12 | 4/9, n=9 | 4/9, n=9 |
| original-formal-v1 | A1 | 12 | 2/10, n=10 | 2/9, n=9 |
| original-formal-v1 | B1 | 12 | 1/10, n=10 | 1/9, n=9 |
| formal-v1-high-budget | A0 | 12 | 10/12, n=12 | 8/9, n=9 |
| formal-v1-high-budget | A1 | 12 | 10/12, n=12 | 8/9, n=9 |
| formal-v1-high-budget | B1 | 12 | 10/12, n=12 | 8/9, n=9 |

Historical descriptive comparison, not a causal budget-effect estimate. Original failures and invalid cells remain in their dataset.

Common task intersection (determined only by validity):

- write-compressor
- break-filter-js-from-html
- mteb-retrieve
- polyglot-rust-c
- chess-best-move
- bn-fit-modify
- extract-elf
- feal-linear-cryptanalysis
- kv-store-grpc


共同有效交集只按两轮三组共六个位置是否有效定义，不按通过率筛选，共 9 题；排除旧轮两个 setup-invalid task 和 A0 grader-invalid 的视频题。时间、网络/后端实现、覆盖和随机轨迹仍不同，不能把分数差当作预算单因素的随机因果估计。

## 7. 审计与限制

完整审阅 1,095 个工具调用序列并展开可疑项，机械核对 938 请求、同代结果投递、fresh 输入、生命周期、usage 与 grader；93 个评分文件与冻结原件匹配。三条轨迹六次未成功的 /tests 探查保留为 attempted-access，没有因未返回隐藏材料就删掉。

在记录范围内未观察到禁止输入污染；审阅者是同一 Codex 主审，不是独立第三方。没有完整 syscall/packet 监控、私有 reasoning 审阅或预训练污染排除。runtime/config 元数据和作用域 token 部分可见，是合作式边界，不是对抗安全沙箱。

冻结配置是 text-only，9 次图像读取投递为固定省略提示；相关失败仍在分母。三组同分不证明统计等价、换代免费、普遍优越，也不证明所有旧失败都由预算造成。仅一个模型/provider，每题每组一次。

## 8. 看、审、复核

[证据导航](EVIDENCE-MAP.md)连接报告、trace、grader、manifest；[claims table](claims.md)限定措辞。[复核说明](REPRODUCTION.md)把无 API 的离线重算与新的模型实验分开，后者不是已验证的一键跨机复现，也不保证随机输出一致。

中文原报告保留，英文是翻译；这份综合说明明确属于新阅读层。公开脱敏逐项记录，不用来隐藏失败。封存证据包保留打包时的审阅状态；这个网页阅读版提供已公开的访问入口。
