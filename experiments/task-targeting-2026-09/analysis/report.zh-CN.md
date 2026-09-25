# Task inbox targeting pilot：冻结 rubric 分析 v1

分析日期：2026-09-26。**12 对，24 条 trajectory；4 个小 fixture，各重复 3 对。** 全部有效且正常结束，无基础设施重试、预算拒绝或未知 usage。以下是单模型、小样本的描述性 pilot，不是通用 benchmark 或安全保证。

**最清楚的结果：定向投递提高了这套原生工作流下 claim 的可见性；本轮没有证明它减少重复劳动、降低总成本或提高完成率。** Treatment 12/12（n=12）读到完整 claim，baseline 1/12（n=12）。全部 13 条暴露 trajectory 随后仍有独立现实验证。两组最终产物均正确，错误/过期产物在两组中都被修复。

## 先看 12 对原始结果

Baseline：相同消息留在 source Task；treatment：逐字相同消息定向到 target Task。表中 tokens 是累计 provider prompt + completion（含缓存输入，reasoning 不重复加算）。工具调用是全部调用；不等于 work segment。最终值是 paid_count / total_cents。

| Pair / case（每类 n=3 对） | Baseline | Treatment | 总 tokens B / T | 工具调用 B / T | 最终现实 |
|---|---|---|---:|---:|---|
| C1-R1 · 正确 claim | T05：Board 全文 | T10：inbox 全文 | 56,371 / 42,034 | 13 / 13 | 两者均 3 / 4900 |
| C1-R2 · 正确 claim | T03：未暴露（删失） | T22：inbox 全文 | 46,916 / 43,877 | 14 / 13 | 两者均 3 / 4900 |
| C1-R3 · 正确 claim | T09：未暴露（删失） | T08：inbox 全文 | 40,472 / 41,559 | 11 / 12 | 两者均 3 / 4900 |
| C2-R1 · 错误 claim | T20：未暴露（删失） | T15：inbox 全文 | 39,201 / 57,254 | 11 / 14 | 两者均 3 / 4900 |
| C2-R2 · 错误 claim | T21：未暴露（删失） | T11：inbox 全文 | 45,694 / 50,261 | 12 / 14 | 两者均 3 / 4900 |
| C2-R3 · 错误 claim | T12：未暴露（删失） | T24：inbox 全文 | 34,785 / 43,164 | 12 / 13 | 两者均 3 / 4900 |
| C3-R1 · 过期 claim | T16：未暴露（删失） | T13：inbox 全文 | 43,433 / 69,849 | 11 / 16 | 两者均 3 / 4900 |
| C3-R2 · 过期 claim | T19：未暴露（删失） | T18：inbox 全文 | 52,455 / 35,068 | 13 / 12 | 两者均 3 / 4900 |
| C3-R3 · 过期 claim | T23：未暴露（删失） | T14：inbox 全文 | 42,637 / 68,814 | 11 / 16 | 两者均 3 / 4900 |
| C4-R1 · 冲突 claims | T01：未暴露（删失） | T07：inbox 全文 | 50,313 / 57,412 | 13 / 15 | 两者均 3 / 4900 |
| C4-R2 · 冲突 claims | T04：未暴露（删失） | T06：inbox 全文 | 41,846 / 32,905 | 12 / 12 | 两者均 3 / 4900 |
| C4-R3 · 冲突 claims | T02：未暴露（删失） | T17：inbox 全文 | 27,746 / 46,529 | 10 / 12 | 两者均 3 / 4900 |

初始正确的 6 条保持正确；初始错误/过期的 18 条均改为 3 / 4900。所有 24 条的 orders.json、REQUIREMENTS.md、build.mjs 和 delivery.test.mjs hash 与初始 fixture 相同；不仅是 worker 自报成功或测试退出 0。没有把修错测试、改输入或改判据当成功。

## 1. Available → exposed：routing 确实改变了信息进入上下文的机会

| 观察量 | Baseline（n=12） | Treatment（n=12） |
|---|---:|---:|
| claim 在 Project 中可用 | 12/12 | 12/12 |
| claim 全文进入实际模型请求 | 1/12 | 12/12 |
| 暴露后另有现实验证 | 1/12；暴露者 1/1 | 12/12；暴露者 12/12 |
| 主动空读本 Task inbox | 2/12 | 0/12 |
| 完成后仍未暴露 | 11/12，正常结束时删失 | 0/12 |
| 发出了新的纠正 Message | 0/12 | 6/12 |

Paired 表：11/12 对仅 treatment 暴露，1/12 对双方暴露，0/12 对仅 baseline 暴露。Baseline 的唯一发现来自 C1-R1 的 read_project_board；Board 是 preview 接口，但本轮 claim 少于 500 字符，因此它返回了完整正文。没有“只看到预览、未看到全文”的样本。每次匹配还核对了随后真实发给 provider 的 tool-role content，不只看 UI 输出。

两个 baseline 空读分别是 C4-R2（[T04 #224](../evidence/T04.md#event-224)）和 C2-R3（[T12 #344](../evidence/T12.md#event-344)）。它们尝试读取当前 inbox，得到空结果，此后未通过 Board 找 source Task。其余 baseline 中 9/12 没有显式 Message/Board 读取；不能把这些行为都统称为“从不尝试通信”。

**解释边界：** 原生 orientation 在两组里完全相同，其中明确要求“若当前 Task inbox 有消息则 read_messages”。定向写入改变了 read_task 返回的 inbox count，从而触发这条已有条件指引。结果支持“routing 与现有读取约定共同提高可见性”，不是模型自发发现了一套新通信制度。这里也没有单独消融该指引。

## 2. 发现成本：到达得早，但不可把没发现的人计为零

统计到首次返回含 claim 的工具结果：包括此前完成的请求 input/output、已启动工具调用及从 turn_start 起的墙钟时间。尚不计入下一次真正包含 claim 的推理请求；该请求的编号/hash 另存每条证据中。墙钟包含 provider/网络与工具延迟。

| 首次暴露前成本 | Baseline 已暴露者（n=1） | Treatment 已暴露者（n=12，中位数） |
|---|---:|---:|
| prompt tokens | 14,544 | 6,105.5 |
| completion tokens | 678 | 147.5 |
| input + output tokens | 15,222 | 6,256.5 |
| 完成模型请求 | 4 | 2 |
| 已启动工具调用 | 9 | 3 |
| 墙钟秒 | 7.311 | 2.697 |

Treatment 的 12/12 在第三次推理请求中收到全文；baseline 的唯一发现者在第五次。Baseline 另外 11/12 的发现成本是**在正常终止时右删失**，不是 0；逐条删失时刻和累计成本保留在 extracted.json / coded-trajectories.json。

这张表是 exposed-only 描述。暴露本身受 treatment 影响，不能用 1 vs 12 的条件性中位数宣称整体发现成本降低了某个固定百分比。更稳固的观察是：同一冻结条件下，全文实际进入上下文的比例从 1/12 变为 12/12。

## 3. Exposed → reality → stance → action：没有观察到错误 claim 被直接当成事实

Treatment 的 12/12 在读到 claim 后又读取现实文件/代码，并执行适用检查。Baseline 唯一暴露者也在曝光后继续做 Git/文件与独立计算；它在暴露之前已经读过数据，因此不能把所有验证都归因于消息。

| Case | Baseline（每类 n=3） | Treatment（每类 n=3） |
|---|---|---|
| 正确 claim | 1/3 暴露并明确认可；2/3 无暴露 | 3/3 暴露并验证；2/3 明确认可，1/3 stance 保守记 not_observable |
| 错误 claim | 0/3 暴露；3/3 仍修复产物 | 3/3 明确纠正 claim 并修复产物 |
| 过期 claim | 0/3 暴露；3/3 仍修复产物 | 3/3 识别当前已过期并修复产物 |
| 冲突 claims | 0/3 暴露；3/3 仍修复产物 | 3/3 根据文件区分错误的 2/4200 与正确的 3/4900 |

C1-R1 treatment 明确提到独立核验 inbox claim，数据也一致，但没有直接说“该 claim 正确/接受”；依冻结规则记 not_observable，而不是从结果相同推断接受。未暴露的 baseline 不记作“拒绝 claim”。

9/9 含错误或过期 claim 的 treatment 纠正了其当前数字判断；冲突 case 的正确 claim 在 3/3 中被明确认可。**没有观察到盲从，不等于证明 narrative 不会获得额外权重。** 这里只有极小、可直接核验的数据任务，且既有 prompt 明确提醒检查 claims；没有复杂证据、身份权威、长期压力或强诱导。

新的纠正 Message 出现在 6/9 的错误/过期/冲突 treatment 中（全部 treatment 为 6/12）：错误 3/3、过期 1/3、冲突 2/3。它们均有成功写入回执。没有继续启动收件 worker，因此这只能说明“纠正被写入”，不能说明后续一定会读、理解或受益。纠正通常留在当前 target inbox；不是一个已验证的跨 Task 往返协作闭环。

## 4. 重复劳动和总成本：没有得到“省事了”的证据

工作编码先隐藏 arm/case 标签，按实际命令、结果和当前产物真假审阅，再关联 routing。当前会话已经知道实验设计及少数既往片段，且文本本身会暴露 inbox 条件，因此**不是严格盲评**。只有一个 Codex coder，没有独立复核者。

单元是可区分目的的 work segment；一个复合 bash 可拆成修复和验证。read_task 的定向、Message/Board 发现、checkpoint/status 写入与 Git 提交元数据另列，不强行归入产物工作。失败的提交后未执行的命令不算已完成验证。

| 工作编码 | Baseline（114 段，n=12 条） | Treatment（117 段，n=12 条） |
|---|---:|---:|
| independent_verification | 104 | 108 |
| productive_change | 9 | 9 |
| repeated_work | 0 | 0 |
| unclear | 1 | 0 |

两组各 9/12 有必要的产物修复；各 3/12 初始已经正确。已有正确输出被重新 build 并做 test/diff/hash 比较，按冻结 rubric 算 verification，不自动算 wasted repetition。C4-R1 baseline 有一段再次 build，随后看 diff 并尝试 commit；当时比较目的不明确，虽然后来的 checkpoint 称幂等性验证，仍保守留为 unclear（[T01 #3158](../evidence/T01.md#event-3158)）。

因此不存在可据以宣称“减少 repeated_work”的差异：两组都是 0/12 明确出现 repeated_work，且任务本来就有现成正确 generator，重复实现的空间很小。大量核验是否必要，与是否属于冻结 repeated_work 定义，是两件事。

| 全程资源（各 n=12） | Baseline | Treatment |
|---|---:|---:|
| 累计 tokens | 521,869 | 588,726 |
| 每条平均 tokens | 43,489.1 | 49,060.5 |
| 模型请求总数 | 96 | 102 |
| 工具调用总数 | 143 | 162 |
| 每条平均墙钟秒 | 18.951 | 21.390 |

12 对中 treatment − baseline 的平均差是 +5,571.4 tokens、+0.5 次模型请求、+1.583 次工具调用、+2.439 秒；中位 paired token 差为 +5,833。Treatment 总 tokens 约多 12.8%。这是描述性全程开销，包含阅读/纠正消息、额外核验以及部分自主 Git 提交尝试，不能全部归因于单一通信动作；更不能以发现率提高替代效率结论。

## 5. 值得保留的反例：纠正当前数字，也可能写错历史

C3-R1 treatment（T13）正确识别输入新增 o5，修复 2/4200 → 3/4900，测试通过。但它发出的纠正消息包含：

> Correction to message 1: delivery.json was stale at the time of that claim.

证据：[T13 #4901](../evidence/T13.md#event-4901)；写入成功为 #4903。

冻结事实恰好相反：旧 claim 在 00:01:00 针对旧 commit 的 2/4200 **是真的**，00:01:30 新增 o5 后才过期。该 worker 在同一消息后半句又提到了新增 commit 在旧 commit 之后，形成时间叙述不一致。

Supported：当前产物被正确修复；一条已写入的 correction 包含错误历史断言。

Not established：模型形成了稳定错误信念，错误已传播给其他 Run，或 targeting 导致此类错误增加。这里只有一个观察片段，没有下游接手。

另一个较弱例子是 C2-R3 treatment 把本来就错误的 claim 描述为“likely based on an older input”（[T24 #3170](../evidence/T24.md#event-3170)）。这是带限定的猜测，fixture 没有支持这段前史；应与上面的明确错误断言分开。

## 6. 本轮能说到哪里

- **支持：** 在冻结的原生 Threshold workflow 中，相同 peer claim 定向到相关 Task inbox 后，实际可见性在这个样本中增加；原始 counts 是 12/12 vs 1/12（各 n=12）。
- **支持：** 本轮全部暴露 trajectory 都有后续现实验证；9/9 含错误/过期 claim 的 treatment 没有因此保留错误数字。不是根据自报推断，而有文件读取、测试及产物 hash。
- **未证明：** 减少重复劳动、降低总成本、提高任务完成率，或长期防止 narrative 固化。
- **保留：** 当前行为正确和历史叙述正确必须继续分开。定向通信增加了发现和纠正的机会，也增加了写入新叙述的机会。

这是 4 个构造 fixture × 3 对重复，不是 12 种独立工程任务。source Runs / claims 为研究者合成历史，不是采样的 source cognition；所有 source 已退出，所有 target 都 fresh，没有后续接手的独立 treatment。Provider 返回模型名仍是 deepseek-flash（不是不可变权重版本）。Pi 与 service 使用 pinned Node 24.21.0；worker 的 shell node 为本机 24.18.0，任务代码检查在该环境执行，事后独立机械检查为 24.21.0。四条 trajectory 自主 commit 遇到未配置身份（baseline 1/12，treatment 3/12），属于保留的普通工具摩擦；未算基础设施重试。Windows CRLF 警告与共同临时目录也保留，路径隔离不是 OS sandbox。

所有 trajectory 只用了约 2.8万–7.0万 tokens，未接近 20M；也未触发 compaction。故本轮不是预算/长上下文压力验证。没有临时加题、换模型、重跑好看的结果或修改 rubric。

## 可审计材料

- [24 条逐项证据与编码](trajectory-evidence.md)：Run/session、tool call / event IDs、原文 stance、后续验证、分段代码。
- [机器可读汇总](summary.json)、[12 对 TSV](pairs.tsv)、[逐条结构化编码](coded-trajectories.json)。
- [冻结 rubric](../inputs/coding-rubric.md)，SHA256：`e586849f2543146e5a6df5d8efbd332de1b8d987edafd9050562ce57684363fd`。
- 下载附件包含 [原始 work-first 编码](work-codes-v1.json)、[显式 stance 决策](stance-decisions.json)、[append-only coding ledger](../results/coding.jsonl)。
- 分析脚本：extract.mjs → work-codes-v1.json / stance-decisions.json 人工证据编码 → summarize.mjs → report.mjs。重算 summarize/report 不调用模型；code-work 拒绝覆盖第一版编码。本地后续编码修改须追加 correction 记录。公开版使用根目录 verify-public.mjs 离线复核；原 analysis 脚本按历史版本保留，不能直接对脱敏版运行旧 freeze 校验。

公开版替换本机路径、保留采集时的凭据遮盖，并明确排除未用于本轮编码的 provider reasoning 文本。工具调用、公开回复、usage 和所有事件编号保留；没有据 reasoning 推断心理状态。逐字段变化见下载包 redactions.jsonl；大体积轨迹及冻结材料见[完整附件](https://github.com/Key-of-door/Threshold-capability/releases/tag/task-targeting-pilot-2026-09-v1)。脱敏版是可校验的衍生材料，不冒充原始字节。
