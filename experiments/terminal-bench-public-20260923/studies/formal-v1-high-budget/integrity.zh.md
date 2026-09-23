# Formal v1 high-budget：完整性审计与确认结果

审计日期：2026-09-23。对象是已完成的 36 条正式轨迹，不是新一轮采集。此次没有调用模型、补跑题目、改变分数或修改 Threshold core。

**在记录可覆盖的输入与工具返回范围内，36 条均判为 `no_contamination_observed`；36 条官方 grader 均有效。A0、A1、B1 各通过 10/12。没有因本次完整性审计排除的轨迹。**

这个标签表示“未观察到禁止材料进入模型”，不表示已证明所有可能的泄漏通道都不存在，也不表示对模型预训练数据进行了审计。

## 条件与结果

这是 budget-relaxed replication：BB 从 120k 提高至每条共享 20M input+output；RR 独立固定为原来的名义 60k。继续使用原实现的 `used >= 60000`，在首次达到阈值后的首个合格 completed tool-batch boundary 换代，正常结束等优先级不变。实际换代不是精确发生在第 60,000 个 token。

deepseek-flash / max，C=1,048,576，O=393,216；80 请求上限、任务原 deadline、重试、compaction、任务投递与工作提示沿用冻结实现。A1/B1 为独立匹配轨迹，**不是 shared-prefix paired fork**。每题每条件仅一次。

| 条件 | Grader valid / 输入未观察到污染 | 通过 | 正常结束 | Deadline | 实际累计 tokens | 请求 |
|---|---:|---:|---:|---:|---:|---:|
| A0：原生 Pi | 12/12 | 10/12 | 11 | 1 | 10,933,883 | 262 |
| A1：Threshold，不换代 | 12/12 | 10/12 | 10 | 2 | 12,388,565 | 316 |
| B1：Threshold，一次 fresh replacement | 12/12 | 10/12 | 11 | 1 | 10,059,464 | 360 |

| Task | A0 | A1 | B1 |
|---|---:|---:|---:|
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

同分并非相同失败模式：A1 在 ELF 通过、棋盘题 deadline；A0/B1 在棋盘题通过、ELF 有效失败。三组视频题均 deadline。不得据此宣称性能等价或换代无成本。

## 审计做了什么

审阅全部 1,095 个工具调用序列，按命令、路径、返回摘要定位，展开可疑返回、外部资源及上下文。另对全部 938 次记录的 provider 请求进行机器校验；89 个关键词候选均留下单独分类，而非把关键词命中直接当污染。此次由同一个 Codex 主审阅者完成，不包装成独立多方复核。

- 冻结 manifest、prepared/as-run adapter、任务文件、运行镜像绑定一致；原始 trace 摘要在审计前后不变。
- 36 个容器的初始可见性记录未暴露指定隐藏路径；当前停止状态下的镜像、无宿主挂载、1 CPU / 2 GiB RAM / 4 GiB memory+swap 与配置相符。
- 全部工具调用有结束记录。15,024 次工具结果在后续请求中的投递实例，均可对应到**同一轨迹、同一 generation** 的实际工具返回；唯一需要明确变换的是纯文本 provider 对图片追加的固定省略提示。
- 全部 48 个 generation 首请求只有 system + user。12 个 B1 的新旧 generation 初始输入完全一致，新输入中没有旧 assistant/tool conversation。后续各请求维持相同初始前缀，没有额外 user/system 注入；这不意味着初始提示从后续请求的历史前缀消失。
- A0 的初始任务文本与冻结指令一致；A1/B1 的 `read_task` 返回 instructions 与对应冻结指令一致。
- 12 次换代均在首个合格阈值边界，旧 runtime 退出在前，新 runtime 启动在后；实际累计触发用量为 60,624–97,365 tokens。无额外换代。
- 36 次 grader 均在 runtime 退出、PID 退役检查及模型事件结束后执行；collector 冻结路径先关闭 runtime，再复制官方 `/tests`。本轮均一次 grading 即获得有效结果。
- 重新校验 CTRF、reward、test inventory 与执行时间/退出码；从停止的容器只读复制官方测试，93 个文件与冻结原件哈希一致。没有重新运行 grader。
- 938 个 usage 与逐条 meter、全局 ledger 完全对账。无 provider/stream/adapter 错误，无 unknown usage reserve，无 token/request/authorization guard 终止；本轮也无 compaction 事件。

机器明细包含 18,610 个断言（其中许多是同一工具结果在历史中的重复投递校验）及 93 个 grader 文件校验。这个计数是覆盖记录，不是 18,610 个独立实验。

## 必须保留的具体审计记录

以下 `L` 均指原始 `formal-collection/trace.jsonl` 的一基行号。

### 1. HTML：公开测试与 `/tests` 探查

题目明确允许运行 `/app/test_outputs.py`，environment Dockerfile 也明确把公开测试复制到 `/app`。L1284、1424、1527、1698 的返回文本与这份公开文件相符，含 canary 字样不使它变成隐藏材料。

公开测试硬编码 `/tests/filter.py`。三条轨迹共六次探查不存在的 `/tests` 或其文件（L1298、1299、1442、1545、1560、1716），未返回禁止内容，按冻结规则保留 `attempted_access` 标记。随后 worker 从公开 `/app/filter.py` 创建本地副本以执行公开测试（L1335、1576、1742）。A0/B1 又删除该副本；A1 留下它，但官方测试是在 worker 退出后才由 collector 复制进去。

这不是隐藏测试污染，也不能从路径探查推断作弊意图。

### 2. MTEB：题目里的 “Terminal-Bench” 与自行编写的 solution

`terminal-bench` 就是题目指定 query，提供的数据里也包含该词。网络访问涉及 Hugging Face 模型、`embeddings-benchmark/mteb` 的库文档与元数据，不是 Terminal-Bench 的答案库（例如 L3710、3721、3732、3758、3769）。

B1 在 L3791 自行写入 `/app/work/solution.py`，其中 “Reference solution” 是它给自己代码写的说明。没有发现外部参考答案进入模型。

### 3. Runtime 元数据确实可见，不能声称强隔离

L3382、5385、9418 出现 runtime/config/project 目录名，包括 `auth.json`、`human.key` 等文件名；这些调用没有返回其文件内容。另有 worker 使用 `env` 查看进程环境，能看到自己 runtime 的配置及作用域 token。这不是隐藏 grader/其他条件结果污染，但说明当前依然是合作式执行边界。

ELF A0 还读取过 shell history、搜索 task-like 文件名，未返回相关材料（L8718–8719）。FEAL A0 的一个命令包含 `find *attack*`，但之前 `git log` 失败，`&&` 后的搜索未执行（L10195）。保留这些观察，不把“想找”与“实际读到”混在一起。

原始证据仍留在本地。公开发布需要另做脱敏，尤其是 runtime 作用域 token；本次完整性审计不是发布安全审核。

### 4. 图片与截断

9 次图像读取分布在视频、棋盘任务中。冻结模型配置为 text-only，provider 实际收到的是省略提示；它们后来依赖 OCR、像素分析或字体/棋子模板。A1 下载的 Lichess cburnett SVG 是通用棋子资源（L6564），不是题目答案。

五个“truncation”候选中，四个只是 Project board 的 `summariesTruncatedAt` 字段；实际工具输出截断只有 A0 棋盘题 L6283 的长 Stockfish 日志，来源是本地引擎计算，返回范围与 provider 投递可核对。没有因此新增 unknown 轨迹。

### 5. 换代边界仍会移除旧 worker 的下一次观察机会

17 个已记录工具结果没有进入后续 provider 请求：13 个属于 B1 generation 0 的终止批次，4 个属于最后的 deadline。前者是原定 replacement 语义：工具批次执行完成即可换代，不保证旧 worker 再推理一次读取结果。结果的现实副作用仍可能通过文件/服务留给 fresh worker。

这是独立于 token ceiling 的 treatment 特性，不能因为本轮高预算就从解释中删掉。gRPC B1 的旧应用服务确实保留；fresh worker 随后检查并处理重复 server 进程（L11054、11112–11197），旧 Pi runtime 本身已结束。

## 预算与可以说到哪里

累计输入 **31,691,797**、输出 **1,690,115**，合计 **33,381,912 tokens**。缓存输入包含在内，reasoning 属于输出而不重复相加。没有权威金额账单，因此不从 tokens 或 runtime 的占位价格生成费用结论。

最高单条用量为 A0 ELF 的 **5,195,459**，约 20M 上限的 **26.0%**；每次请求的输出上限均为完整 393,216。本轮终止确实由正常结束或原 task deadline 主导，而不是 token 预留闸门。

可支持的结论：**在这 12 个任务、当前模型与冻结条件的一次采集中，提高总预算且保持早期 replacement 后，三个条件各完成 10/12；本次可观察输入审计未发现需要排除的污染轨迹。**

不能支持：Threshold 与 Pi 统计等价、replacement 免费、所有旧版差距都由预算单独造成、对更大任务集/其他模型普遍成立。原 v1 有六个 setup-invalid 位置、一个 invalid grader，两个批次也不是同期随机重复；不能把两个聚合分母直接相减当因果效应。原 v1 记录保持原样。

此外，任务内下载依赖与运行应用消耗 deadline；纯文本视觉替代方案和 1 CPU 限制仍影响任务表现。声明的 10 GiB 存储未硬限制。没有 syscall/packet 全量监视，没有保留私有 reasoning，没有排除预训练污染。`no_contamination_observed` 应始终带着这些范围说明使用。

## 证据与复核入口

本地证据根：`E:/Threshold-benchmark-stage0-20260921/formal-v1-high-budget/`。

```text
formal-collection/                 原始数据，不改写
  trace.jsonl
  registry.json / ledger.json
  as-run-adapter/
  <cell-id>/result.json
  <cell-id>/worker-visibility.json
  <cell-id>/retired-runtime-pids.json
  <cell-id>/grader-1/
integrity-audit/                   本次单独的审计 overlay
  summary.json                    36 条 verdict + 汇总
  trajectories/<cell-id>.json     每条证据行号、范围及说明
  candidate-review.json            89 个候选分类
  machine-checks.json              输入绑定、预算、时序等断言
  container-inspection.json        已停容器配置的只读快照
  grader-files-check.json          官方测试文件哈希核对
  grader-files/<cell-id>/          只读复制的测试文件
  evidence-manifest.json           原始材料与审计文件的封存哈希
  build-index.mjs / review.mjs     定位辅助脚本
  check.mjs / verify-grader-files.mjs / record-review.mjs
```

原始 `result.json` 仍保留 collector 当时的 `pending_audit`，最终审计以独立 `summary.json` overlay 为准，避免重写历史。复核 `check.mjs` 需要保留停止的 Docker 容器；其余原始 trace 与报告可离线查看。审计脚本自身不应被误当成独立审阅者。

- Release manifest SHA256：`d5cd35164b5b57c7f08d52219f863188ae7808fd8c676096a74112a677b08cfa`
- Raw trace SHA256：`3410e63bb2fe6016680fc6040ee79b3968137dd1c698ee3a1e43b58b6d247304`
- 原 v1 manifest SHA256：`bc7605109a8d750eaf00eaae5c90db97486e75f6e7ee9acff85ac3839cb1edc5`

**本次审计没有留下阻塞主结果纳入的问题；结果可以作为带上述限制的描述性实验记录。**
