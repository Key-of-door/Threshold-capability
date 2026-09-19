# Minecraft × Threshold：显式项目历史通道消融

工作参考，可依现场修正；本轮启动后不按观察结果改 prompt。

## 问题

同一可检查的世界与共同目标下，移除显式项目历史通道后，新的 worker 是否仍能重建足够的工作状态并接续成果？观察代价出现在哪里，不把短期推进直接称作收敛。

## 起点与两组

复制 resource-pair-01/intervention 的结束世界及停机数据库，保留原时间线。两份世界文件、玩家物品及数据库相同，不加资源、不修地形。两组共同把 Task 替换为简短、无历史的相同目标及动作规则；所有旧 Message/checkpoint 仍在数据库。

随机分配已在 fork-manifest.json 留下记录：运行顺序固定编号 r17、r42；编号不携带条件语义。

- 历史可用：read_work 可返回最新 checkpoint 与 inbox 摘要，read_messages/send_message/save_checkpoint 可用。
- 历史不可用：read_work 只返回允许的 Project/Task/当前 Run 身份与共同目标；关闭 Message/checkpoint 全部读写。
- 双方禁用 board、状态更新、旧 Run 检查、shell/文件工具，防止替代叙述通道。Pi 本来就禁止自动 context 文件、全局技能/extension；无新增角色 Skill。
- 当前 session 内自身对话仍保留。三位 fresh worker 各连续最多12段，不是每段重启。

## 工程边界

保持 Minecraft 动作、窗口串行、模型/epistemic/mechanical trace hooks、存档和 CLI 录制设施。仅双方相同地删掉 mc_action 描述与预算错误中“保存 checkpoint”的指令。新增实验侧 tool selection 和小 HTTP view，完整数据库不暴露给模型。实验 runner 在 workerFactory 边界替换首次自动代码任务提示，后续用共同中性继续提示；原提示与实际替换均留审计记录。Threshold core 不改。

同一个 channel.ts 由实验配置选择工具；条件配置不提供文件读取入口。Tool boundary 不是 OS/恶意代码安全隔离。两组工具名的差异不可盲化；不会声称双盲。实际最终 provider payload 为输入审核依据。

## 预算与操作

沿用 DeepSeek Flash、1M context/384K max output（上限非实际用量）、3 worker × 12段、软500模型回合/25分钟/60M累计token/750k输出，硬600回合/30分钟/80M累计token/1M输出。每段请求最多8次世界动作，接口硬上限16。两组都不强制写摘要或读历史；通道的实际使用量单独报告。

两组各自服务器启动后冻结 tick，等 Human 确认前台录制才放行。先运行第一编号组，停机并保存，再启动第二组等待新录制确认。保留服务器启动自然推进的 ticks，并核对开跑前差异，不能仅用复制时相同代替运行时相同。不因观测到怪行为修 prompt。

## 核对与观察

先用真实 Pi + 本地假 provider 响应做工具调用检查，不花外部模型调用：工具声明、task白名单、checkpoint/message sentinel、不可用 API 的拒绝、无 shell/文件/board/status_update 通道。两组模型实际输入归档。

主要观察：首次有用行动成本；前几段/后几段持续推进；重复制造已经存在且可取得的工具；材料从本轮同伴到另一位的加工接续；破坏/冲突与恢复；具体错误判断在新观察后是否改变。记录明确未知，不把不知历史归因算错误。不构建一个总分。

有用成果候选：可用食物及实际补种、被后续使用的工具/材料、得到实际使用的储物/加工设施、可核查的通路或庇护改进。库存或方块变多本身不自动有用；自然生长另计；不完整逐物品溯源要标注推断。

## 解释限制

单次配对只探索。移除读写一起改变历史 bootstrap、在线通信与写摘要行为，不能分离三者。模型熟悉 Minecraft、共同目标、可观察世界和当前会话记忆仍存在。不比较谁的故事更合理来判实际成果。不保证通信有益，旧历史也可能带来陈旧判断；无差异也不等价于 Message 无用。对照组若未实际使用历史，解释力相应有限。

本轮不新增 core primitive、自动记忆、强制协作、资源、角色或游戏动作，不更新/push/npm 发布。前台由用户录制，后台保存原有 CLI snapshot cast、回放与加速概览。
