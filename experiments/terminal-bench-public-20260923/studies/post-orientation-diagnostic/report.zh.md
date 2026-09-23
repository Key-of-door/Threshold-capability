# Post-orientation workflow diagnostic v1

完成于 2026-09-21T19:21:03.233Z。formal v1 保持原样；以下是新诊断数据，不回填旧分数。

## 做了什么

四个事后选择的任务，每个 P0/P1 各三次，共24条独立轨迹。按预定顺序相邻交错，六个区块P0先、六个P1先。不是共享前缀分叉，没有同期A0，也不把这些重复看作24个独立任务。

P0保留原启动消息；P1只把后续 inbox/Git顺序/checkpoint/status四处规定改为按需。首读read_task、完整题面的交付方式、质量验证、objective、所有tool schemas和风险/状态含义保持。P0/P1启动正文1397/1388字节，不是通过大幅压缩prompt节省预算。它们都是Pi的启动user turn；Pi system不变。

相同 deepseek-flash/MAX、Pi0.85.1、B=120000输入+输出、80请求、原任务deadline、compaction/retry/estimator及官方评分规则。每条使用全新原始prepared image容器，无跨条件状态继承；无B1换代。

## 结果

| Task | P0 三次原始有效结果 | P1 三次原始有效结果 |
|---|---|---|
| kv-store-grpc | 1 / 1 / 1 | 1 / 1 / 1 |
| break-filter-js-from-html | 1 / 1 / 1 | 1 / 1 / 1 |
| feal-linear-cryptanalysis | 0 / 0 / 0 | 0 / 0 / 0 |
| polyglot-rust-c | 1 / 0 / 1 | invalid / 1 / 1 |

| 条件 | 有效 | 通过 | 无效 | 有效轨迹tokens中位数 | 正常结束 | 输入预留停止 |
|---|---:|---:|---:|---:|---:|---:|
| P0 | 12 | 8 | 0 | 104806.5 | 0 | 12 |
| P1 | 11 | 8 | 1 | 109110 | 0 | 11 |

逐区块结果：{"both_pass":7,"both_fail":3,"invalid":1,"P1_only":1}。这是相邻运行的独立样本配对，不是相同随机轨迹的反事实。

## 当前判断

本轮没有形成稳定、跨任务的 P1 改善证据；也没有证明 P0/P1 等效。有效的11个相邻配对中，7个同过、3个同败，只有Rust第二轮是P1过/P0败；另一个Rust配对因P1 usage unknown不进入有效比较。不要把8/11与8/12的不同分母当成明确收益。

更关键的是实际行为分离很弱：P0没有调用checkpoint或status，P1反而主动保存了一次checkpoint；P0额外2次Message+1次board，P1额外2次board+1次checkpoint。工具次数相等不表示成本相等，但足以反驳“旧组普遍忙于记账，新组删掉记账后恢复能力”这一描述。P1仍多次主动观察Git、检查环境、重复验证。两种提示都保留工具说明和首读Task，所以这不是对所有workflow约束的否定。

23条有效轨迹全部由冻结的输入预留门终止，没有自然结束。该门依据下一请求的保守输入估计及输出预留工作，因此used低于120K不等于全局授权不足，也不等于刚好用完120K。全局余额未缩减任何单条预算。P1有效轨迹tokens中位数109110，高于P0的104806.5；不能从这个小样本推断普遍更省或更贵。

## 值得保留的交付现象

- **Rust不是稳定的旧prompt失败。** 原formal v1的A1未交付；本轮相同P0提示已2/3通过。第二轮P0确实写出代码，但Rust编译失败（L1103–1104），不是被metadata调用挤到完全没写代码。P1的两次通过均没有对最终文件进行worker编译；后续官方grader确认了成功。第三轮P0首次实现56917tokens，P1为95236tokens，P1并不总是更早交付。
- **HTML两组均3/3通过。** P1后两轮更早写出目标文件，第一轮却没有明显tokens优势。第三轮P1在已验证成功后主动checkpoint（L2447）；P0表示准备checkpoint，却在下一请求被预算门挡住，不能把这句话计成调用。公共测试中的路径引用导致部分worker自己复制公开filter到/tests运行公开测试；隐藏grader此前不存在，来源审计没有观察到隐藏答案获取。
- **gRPC两组均3/3通过。** 常见额外工作是缺少ps/ss/netstat时查/proc、重启自己的server、处理protoc输出文件名、补import路径。P1同样会做。这些与Project bookkeeping应分开归类。评分在agent runtime退场之后实际验证服务，7个官方测试均通过。
- **FEAL两组均0/3，但失败过程不同。** 有的停在调查，有的写出attack/solver却未执行，有的执行后逆函数自测失败（P0第二轮L1027–1028）。不能把它们统一描述为模型不会解题或adapter没有送达题面。
- **FEAL P1第三轮完成了中间成果，却漏了最终交付。** L2817–2818运行自己的solver并输出recovered_key.txt。采集结束后，从已停止容器只读复制key、公开pairs及feal.c；独立JavaScript实现按原C语义加密，32/32已知样本匹配（collection/posthoc-key-check/result.json）。这支持“找到与公开样本一致的key”，不证明唯一隐藏key。官方测试确实执行，并因缺失/app/plaintexts.txt失败。没有补写文件、复跑worker或修改reward。这个检查不把零分改成部分分。

## Adapter 与基础设施核对

离线postmortem没有发现足以阻止本轮消融的题面遗漏、model/reasoning偏差或builtin tool schema错配；这不是无bug证明。本轮实际首请求逐条核对了预期启动prompt、相同Pi system、相同11个tools、相同model/MAX配置；首个tool均为read_task，完整原题面均进入第二请求。评分前runtime PID退出、容器CPU/RAM/镜像、初始worker visibility均复核。87项源码/配置/任务源哈希一致；formal v1原始trace与源码未变，Threshold core保持干净。

Rust P1第一轮第二请求持续约300秒后出现`Stream ended without finish_reason`，且没有provider usage。时间与冻结300秒请求上限一致，但没有保留下层abort原因，不能断言是本机网络、provider或模型中的哪一方。保留为usage_unknown invalid，不自动补跑；官方raw reward=0留档但不进入有效分数。账本另保守预留127661总tokens/111889输出tokens，非已知实际消耗。

发现一处继承的**日志分类缺陷**：relay的`record(kind,data)`允许`data.kind`覆盖事件kind，usage结算又将原stream_interrupted分类变成usage_unknown，所以不能仅筛选`kind=stream_failure`来统计中断。原始trace仍保留，预算预留与invalid处理未失效；未在采集中修补。这是后续应修的可观测性问题，当前没有证据表明它造成A0/A1输入或执行语义差异。

另有普通环境限制：容器nproc可显示24而CPU配额实际为1；Rust worker内缺python3、HTML worker内缺pytest。它们影响worker自行验证的选择，但官方grader另有真实测试执行记录。本轮全部24次grader有效；trajectory有效性仍单独排除那条usage_unknown。

## 现在停止在哪里

保留产品默认workflow，不基于本轮把P1推广进core；不把这24条并入formal v1。此次只排查了一组post-orientation启动指令，没有回答task-delivery、tool-schema/retained-context或optional read_task的独立效应。

若继续研究，task-delivery值得作为下一份独立方案讨论，因为离线已确认A0首次请求即有完整题面，而A1第二请求才收到；但这只是尚未解释的差异，不是已确认原因。应先把上面的日志缺陷及其记录方案处理清楚，再单独冻结下一层比较。不要同时移除read_task、工具集合和history，否则又无法定位变化。本轮没有启动任何新增条件或付费补跑。


## 元信息操作（次数，不等于独立成本）

| 条件 | read_task | read_messages | board | checkpoint | status |
|---|---:|---:|---:|---:|---:|
| P0 | 12 | 2 | 1 | 0 | 0 |
| P1 | 12 | 0 | 2 | 1 | 0 |

已知用量：输入2016464，输出387866，合计2404330tokens；191次请求。未知总量预留127661、未知输出预留111889。新账本授权12M总量/4M输出/2400请求；不因全局余额缩减单条上限。

## 逐条轨迹与交付索引

下列交付相关动作是可定位的实现文件创建或执行，不代表最终要求已满足。例如 FEAL 的 attack.c 不等于 plaintexts.txt；必须结合每条 audit.evidence 阅读。临时探针和安装环境不计为交付相关实现。时间与累计tokens取工具发出时，已包括生成该工具调用的整次模型响应。完整参数、返回、每请求usage和尾部响应在observer.json。

| Task | Arm/repeat | ID | Tokens | Stop | 首个交付相关实现trace行 | 首个交付验证trace行 |
|---|---|---|---:|---|---:|---:|
| kv-store-grpc | P0/1 | cc6904664ff63c1e3ac5 | 103775 | input_reservation_stop | 50 | 109 |
| kv-store-grpc | P1/1 | df41e41d9d7565728006 | 98483 | input_reservation_stop | 219 | 未观察到 |
| break-filter-js-from-html | P1/1 | d0fe0afae86e782a85f7 | 94098 | input_reservation_stop | 399 | 399 |
| break-filter-js-from-html | P0/1 | 74a8d68fa008e8ac539c | 93402 | input_reservation_stop | 509 | 未观察到 |
| feal-linear-cryptanalysis | P0/1 | 3c77a054469a1ca1386f | 116785 | input_reservation_stop | 未观察到 | 未观察到 |
| feal-linear-cryptanalysis | P1/1 | 88c7bb268b9cc3e1bd1a | 89926 | input_reservation_stop | 715 | 未观察到 |
| polyglot-rust-c | P1/1 | 0ac137f385de088831b4 | 2512 | usage_unknown | 未观察到 | 未观察到 |
| polyglot-rust-c | P0/1 | 588c2a9fcbe111c160a7 | 105105 | input_reservation_stop | 829 | 840 |
| feal-linear-cryptanalysis | P1/2 | 85f523694a0033ac6a4e | 113139 | input_reservation_stop | 939 | 未观察到 |
| feal-linear-cryptanalysis | P0/2 | 33d7cad41a8badc03e3f | 93003 | input_reservation_stop | 1016 | 1027 |
| polyglot-rust-c | P0/2 | 8368c92db9e491710b9d | 108342 | input_reservation_stop | 1092 | 1103 |
| polyglot-rust-c | P1/2 | b7fc7b1ec4be1b7e3ff3 | 111064 | input_reservation_stop | 1172 | 未观察到 |
| break-filter-js-from-html | P0/2 | 65c8a964eb326fbfa53e | 110842 | input_reservation_stop | 1286 | 1297 |
| break-filter-js-from-html | P1/2 | c5661afcf260a121f6ea | 111212 | input_reservation_stop | 1396 | 1429 |
| kv-store-grpc | P1/2 | 0c064c51b7cffb3920e2 | 109110 | input_reservation_stop | 1531 | 1612 |
| kv-store-grpc | P0/2 | a8ea095e28b4991fb0d3 | 104508 | input_reservation_stop | 1703 | 1762 |
| kv-store-grpc | P0/3 | ab77fa1f2753156c963a | 108025 | input_reservation_stop | 1879 | 1956 |
| kv-store-grpc | P1/3 | 74404761db6983926bd7 | 104092 | input_reservation_stop | 2036 | 2080 |
| polyglot-rust-c | P1/3 | 1bc5385959ef4e17b65f | 95236 | input_reservation_stop | 2201 | 未观察到 |
| polyglot-rust-c | P0/3 | 0b25a2de38bb1679e2d8 | 109281 | input_reservation_stop | 2270 | 2281 |
| break-filter-js-from-html | P1/3 | 9184be5de3063e080045 | 109453 | input_reservation_stop | 2380 | 2391 |
| break-filter-js-from-html | P0/3 | 9752729ba79dbd10dcb6 | 102610 | input_reservation_stop | 2560 | 2597 |
| feal-linear-cryptanalysis | P0/3 | 3dcdeacae190dfd7b212 | 94738 | input_reservation_stop | 2707 | 未观察到 |
| feal-linear-cryptanalysis | P1/3 | 706713ce1987ff8c1980 | 115589 | input_reservation_stop | 2806 | 2817 |

交付时序补充（累计tokens含生成当前动作的整次响应；秒数从首次请求起算，不是纯模型耗时）：

| Task | Arm/repeat | 首次实现 request / tokens / 秒 | 首次验证 request / tokens / 秒 |
|---|---|---|---|
| kv-store-grpc | P0/1 | R4 / 18201 / 23.8 | R9 / 65971 / 35.3 |
| kv-store-grpc | P1/1 | R4 / 22102 / 33.6 | 未观察到 |
| break-filter-js-from-html | P1/1 | R8 / 94098 / 56.2 | R8 / 94098 / 56.2 |
| break-filter-js-from-html | P0/1 | R7 / 93402 / 102.7 | 未观察到 |
| feal-linear-cryptanalysis | P0/1 | 未观察到 | 未观察到 |
| feal-linear-cryptanalysis | P1/1 | R6 / 89926 / 96.2 | 未观察到 |
| polyglot-rust-c | P1/1 | 未观察到 | 未观察到 |
| polyglot-rust-c | P0/1 | R5 / 77094 / 105.2 | R6 / 105105 / 107.6 |
| feal-linear-cryptanalysis | P1/2 | R6 / 113139 / 102.9 | 未观察到 |
| feal-linear-cryptanalysis | P0/2 | R4 / 61598 / 91.2 | R5 / 93003 / 92.0 |
| polyglot-rust-c | P0/2 | R4 / 80327 / 99.7 | R5 / 108342 / 101.1 |
| polyglot-rust-c | P1/2 | R4 / 111064 / 144.9 | 未观察到 |
| break-filter-js-from-html | P0/2 | R7 / 88718 / 73.8 | R8 / 110842 / 76.4 |
| break-filter-js-from-html | P1/2 | R6 / 48091 / 30.7 | R9 / 84354 / 33.9 |
| kv-store-grpc | P1/2 | R5 / 21629 / 19.6 | R12 / 84757 / 33.6 |
| kv-store-grpc | P0/2 | R4 / 17799 / 19.0 | R9 / 56653 / 28.5 |
| kv-store-grpc | P0/3 | R4 / 20554 / 24.8 | R11 / 94141 / 43.2 |
| kv-store-grpc | P1/3 | R4 / 17260 / 18.1 | R8 / 52009 / 30.9 |
| polyglot-rust-c | P1/3 | R4 / 95236 / 127.2 | 未观察到 |
| polyglot-rust-c | P0/3 | R4 / 56917 / 96.2 | R5 / 82860 / 97.2 |
| break-filter-js-from-html | P1/3 | R5 / 33987 / 23.2 | R6 / 44726 / 25.6 |
| break-filter-js-from-html | P0/3 | R7 / 52144 / 29.7 | R10 / 89376 / 33.3 |
| feal-linear-cryptanalysis | P0/3 | R6 / 94738 / 85.3 | 未观察到 |
| feal-linear-cryptanalysis | P1/3 | R6 / 91209 / 75.7 | R7 / 115589 / 76.8 |

元信息调用次数表覆盖全部24条已启动轨迹（包含invalid）；得分与tokens中位数只覆盖有效轨迹。失败的编译、自测也算验证尝试，具体结果见逐条audit；缺少验证不等于官方任务失败。

## 解释边界

- 四题看过v1结果后选定；小样本、单模型、未固定provider采样种子。不能推断总体benchmark收益，更不能宣称接近原生Pi。
- P1只放松一组启动规定；tool descriptions和首读Task仍含指导，不是无policy条件。
- 通过率、metadata调用数与交付时序应一起阅读。少读一次工具不必然更快；多读也不必然导致失败。
- 保守输入估计、重复reasoning输入、网络/缓存/时间顺序与有效预算利用仍是限制。原始错误和grader invalid不抹掉。
- 来源审计仅覆盖记录到的输入与工具返回；不是强安全隔离或对所有文件访问的完整监控。
- 这轮结果不自动授权修改产品默认prompt，也不自动开启下一层消融。

## 证据

Manifest SHA256: `f429f38def8df9da20c77937bd98f75d0c7eb03d4a41efd409f1840e4cb8535b`。

根目录：`E:/Threshold-benchmark-stage0-20260921/integration-diagnostic-v1`。plan.json / policies.json / release-manifest.json是冻结条件；postmortem保存旧数据的只读拆解；collection/trace.jsonl、每条result/grader原始文件、integrity-audit、observer.json、results.json、final-check.json保留独立核对结果。实验源码和执行备忘在capability仓库的integration-diagnostic-v1目录。所有容器停止保留，formal v1 trace与源码哈希复核未变，Threshold core未改。
