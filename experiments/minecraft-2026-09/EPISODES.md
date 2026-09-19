# Episode index / 可定位事件

UTC 是底层证据索引，北京时间 UTC+8。原片时间是文件名时钟估算，尚未逐事件帧对齐；公开片时间需要按 VIDEO-EDITS.json 换算。CLI 是快照回放。JSON 摘录位于 archive-index.zip 的 episodes/，完整 trace 在各组 ZIP；不要将编辑字幕误当模型原话。

## E01 · 没有指定职业，工作方向分开了

**公开游戏副本定位（约）：** S02 无游戏录像。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 18420c25-0bff-4654-ba03-07d39ea673b7 / 37b608c3-f9cb-4cf0-a357-1608072c6332 / a20a0aa6-332a-40e3-b0ad-87a9b537bb73

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| S02 | 2026-09-18T10:11:54Z — 2026-09-18T10:14:47Z | 缺原片 | 00:03–00:48 | 1–15 |

**Observed:** B先取得水桶/种子；C取物失败后转向小屋建设。存档确认小屋与农田，但无灌溉/收获闭环。

**Agent interpretation:** C说“我不重复做农田，改为补庇护空间”。这属于可见的工作调整说明。

**Verification:** Message 2/3/5、实际取物/建造动作、world-diff中的38个木板和10株小麦。 See episodes/E01.json and its sources.

**Supported:** Workers selected different activities without predefined occupations or a leader.

**Not established:** A negotiated division of labour, stable roles, or spontaneous society.

**Context:** 没有找到首轮游戏原片。用本轮CLI/消息/存档证据；若用后代基地画面，只能明确标“后续世界画面”，不可假称首次分工实况。

## E02 · 工具返回 completed，复查仍是洞

**公开游戏副本定位（约）：** S02 无游戏录像。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 18420c25-0bff-4654-ba03-07d39ea673b7

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| S02 | 2026-09-18T10:15:36Z — 2026-09-18T10:16:02Z | 缺原片 | 00:51–01:03 | 17–20 |

**Observed:** A为脱困挖掉耕地及其上小麦，尝试锄回时方法返回completed；复查仍为air。最终存档仍是洞。

**Agent interpretation:** A报告未修复，并解释卡住可能与他人翻土有关；后者没有确证。

**Verification:** actions/observations和Message 6；最终(4,-61,-2)=air。 See episodes/E02.json and its sources.

**Supported:** The worker re-observed and reported failure despite a completed tool call.

**Not established:** A subsequent worker repaired the hole, or every tool success guarantees an effect.

**Context:** 这是早期adapter版本的案例，后续use增加了效果检查。不能剪成最新接口仍一概虚报成功。缺首轮游戏录像，优先CLI+标明来源的验证图卡。

## E03 · 水的拉锯与一次自我归因修正

**公开游戏副本定位（约）：** S03 00:00–07:51。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 4ceaa525-4ccd-42a4-bc3e-b207393e7f96 / 77d8ee7e-f707-47e6-a88c-d359c459d5f8 / 83eacbda-8a86-43cc-8e6d-d7621016ab09

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| S03 | 2026-09-18T11:19:07Z — 2026-09-18T11:26:58Z | 00:48–08:39 | 00:00–01:36 | 0–31 |

**Observed:** 发生放水、舀水和重新种植。B后来将先前指向别人的放水归因改为自己的操作副作用，决定保留水。

**Agent interpretation:** Message 20说“很可能是我自己放水动作的副作用，不是别人反复乱放”。

**Verification:** Message 20实际存在，读消息索引、water level与最终灌溉存档可核对；并非所有水桶根因已被证明。 See episodes/E03.json and its sources.

**Supported:** B revised a previously stated attribution after further inputs and observation.

**Not established:** The whole group reached a correct shared causal model.

**Context:** 前半因果不能只剪最后道歉；保留水反复变化和版本条件。A跳过熔炉消息的游标问题另见本轮报告，不能笼统写“读了也不信”。

## E04 · C以为木头丢了，B的背包里却多了木头

**公开游戏副本定位（约）：** S05 04:36–05:07；S05 08:44–08:46；S05 13:10–13:12。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 4fb34cd0-a859-40f2-b26d-8cb335fdafa6 / 85fc8170-da63-430f-975b-3bddc92588b5

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| S05 | 2026-09-18T14:30:34Z — 2026-09-18T14:31:05Z | 04:37–05:08 | 00:51–01:03 | 17–20 |
| S05 | 2026-09-18T14:34:42Z — 2026-09-18T14:34:44Z | 08:45–08:47 | 01:42–01:48 | 34–35 |
| S05 | 2026-09-18T14:39:08Z — 2026-09-18T14:39:10Z | 13:11–13:13 | 02:33–02:39 | 51–52 |

**Observed:** C挖四根原木，同期B靠近、背包增加到4根并入库。C后来修正“没进包不等于丢了”，最终checkpoint又保留旧丢失叙述。

**Agent interpretation:** Message 30称1.7格距离使4原木丢失；Message 36改说需走过掉落点；末checkpoint仍保留旧说法。

**Verification:** B observation 46/47、位置和入库；C observation 40/41；Message 30/36、checkpoint 9ff5799a-82d8-44c9-afba-8d4a9674c6c9。无逐物品UUID溯源。 See episodes/E04.json and its sources.

**Supported:** The traces strongly support material recovery by another worker while the first reported loss; a correction did not fully survive its final summary.

**Not established:** Exact item-entity identity, theft, deception, or stable correction.

**Context:** 本轮新消息24–47没有被任何worker读回，不能把B回收剪成读到C求助后响应。后续更正和退回旧说法要标时间跳跃。

## E05 · 收割接上了，作者却认错了

**公开游戏副本定位（约）：** RC 12:50–14:15。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 7e77d2f5-d051-46c0-afd4-4505b491969c / 8c9e8d4b-9d3f-4785-9f21-d4062c2dd488

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| RC | 2026-09-18T16:06:23Z — 2026-09-18T16:07:48Z | 13:04–14:29 | 02:30–02:51 | 50–56 |

**Observed:** C收割成熟小麦，B后续拾得麦粒/种子，补种并入库；B最后归因给A。

**Agent interpretation:** B摘要称是A收割；实际收割action来自C。

**Verification:** C action_id call_00_26x4mAGqXgQjodbVpIeZ5321、B库存/补种和最终存档；未逐掉落物UUID追踪。 See episodes/E05.json and its sources.

**Supported:** Work and materials continued despite an incorrect attribution of the contributor.

**Not established:** Correct shared provenance or an error-free handoff.

**Context:** 标明资源配对的对照分支RC。它不是后来G2跨代面包的同一批收成，不要连成一条实物链。

## E06 · 共享熔炉 → 铁镐；当轮无人领取

**公开游戏副本定位（约）：** RI 02:16–03:19。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 527333a6-6e3b-4be5-9078-23d763830b70 / b2fe02f0-e798-4625-ba2b-9510e4a60a91

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| RI | 2026-09-18T16:13:36Z — 2026-09-18T16:14:39Z | 02:42–03:45 | 00:27–00:45 | 9–14 |

**Observed:** A投粗铁1，C投粗铁2，炉中加工后A取铁锭3、造铁镐并存公共箱。该分支当轮无人领取铁镐。

**Agent interpretation:** C不确定消失的是原料还是成品；不能把它剪成全知分工。

**Verification:** intervention/material-chain.json的熔炉槽位、合成和入库；最终箱内铁镐。 See episodes/E06.json and its sources.

**Supported:** Inputs from different workers entered one shared processing chain.

**Not established:** The newly stored pickaxe delivered a benefit during this resource arm.

**Context:** 资源分支新增58矿物方块；与RC从同一点分叉，不是RC之后继续。后续H0确实使用了铁镐，所以“没人用”必须限定本分支当轮。

## E07 · 历史通道关闭：一次新的条件

**公开游戏副本定位（约）：** H0 00:00–00:35；H0 15:30–16:01。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 2b4f9c59-a6ec-4132-9ef8-7eaeeec7e9e6 / 314bd1cc-ce68-49c4-9b74-f59703dbd617 / 6e6d27fd-585c-46fa-bb82-c3a372a3c146

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| H0 | 2026-09-18T18:16:40Z — 2026-09-18T18:17:15Z | 00:25–01:00 | 00:00–00:09 | 0–2 |
| H0 | 2026-09-18T18:32:10Z — 2026-09-18T18:32:41Z | 15:55–16:26 | 03:03–03:12 | 61–63 |

**Observed:** 三位fresh worker只获得read_work/mc_observe/mc_action；没有Message/checkpoint读写工具或旧项目叙述输入。旧记录仍在数据库供观察者看。

**Agent interpretation:** 无；这是经请求审核确认的实验条件。

**Verification:** preflight-result、input-audit、每bot active-tools与provider首请求、fork-manifest。 See episodes/E07.json and its sources.

**Supported:** Explicit project-history channels were unavailable in this arm; some short-term continuation still occurred.

**Not established:** Agents require no communication, have no priors, or have no memory within their current session.

**Context:** CLI Board仍显示旧checkpoint/52条消息，这是观察者视图，不能让观众误以为worker也收到。条件字幕应一直明确。

## E08 · 旧围栏被当成施工信号，新围栏真的接上了

**公开游戏副本定位（约）：** H0 03:49–03:52；H0 08:51–09:49。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 314bd1cc-ce68-49c4-9b74-f59703dbd617 / 6e6d27fd-585c-46fa-bb82-c3a372a3c146

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| H0 | 2026-09-18T18:20:29Z — 2026-09-18T18:20:32Z | 04:14–04:17 | 00:42–00:48 | 14–15 |
| H0 | 2026-09-18T18:25:31Z — 2026-09-18T18:26:29Z | 09:16–10:14 | 01:42–02:00 | 34–39 |

**Observed:** B投9段围栏，公共箱6→15；C随后分批取9段并放置，世界围栏3→12。

**Agent interpretation:** B把开跑前已有的3段围栏理解为别人正在建造。

**Verification:** selected-episodes.fenceChain和初始存档；原库存6，所以取9至少有3依赖新增供给，不能逐根归属。 See episodes/E08.json and its sources.

**Supported:** Material provision and later use occurred without Message/checkpoint input, despite a mistaken temporal attribution.

**Not established:** Accurate understanding of the other worker's intention or identity of every pooled fence item.

**Context:** 保留前后间隔，不把相隔5分钟的动作伪装为即时响应。

## E09 · 保留反例：有历史时，消息确实进入了行动前输入

**公开游戏副本定位（约）：** H1 04:17–05:00。末端超出保留视频的验证事件请查 trace / snapshot。




Run: c6d0aca4-244d-4cc9-afe5-9620fea5aba5 / f38b7a37-4307-415a-b241-9ee122a0061a

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| H1 | 2026-09-18T18:39:44Z — 2026-09-18T18:40:27Z | 04:53–05:36 | 00:48–01:03 | 16–20 |

**Observed:** A先读到含C熔炉消息59的56–60，随后观察/取木炭，并追加原木。

**Agent interpretation:** 消息只是对炉内工作的说明；仍需核对当时槽位。

**Verification:** A read_messages 18:39:44.774，取成品18:40:07.690，selected-episodes输入索引。 See episodes/E09.json and its sources.

**Supported:** The message was in A's input before the continuation, alongside world observation.

**Not established:** The message caused the action, was indispensable, or all continuation was world-only.

**Context:** 不能为了“世界就够了”的主线删掉这项反证边界。H1与H0是同一起点的分支，不是H0的后代。

## E10 · 停止旧Run，保留世界：换代剪辑点

**公开游戏副本定位（约）：** H0 15:55–16:01；G2 00:00–00:14。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 2b4f9c59-a6ec-4132-9ef8-7eaeeec7e9e6 / 314bd1cc-ce68-49c4-9b74-f59703dbd617 / 6e6d27fd-585c-46fa-bb82-c3a372a3c146

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| H0 | 2026-09-18T18:32:35Z — 2026-09-18T18:32:45Z | 16:20–16:30 | 03:09–03:12 | 63–63 |
| G2 | 2026-09-18T19:18:01Z — 2026-09-18T19:18:15Z | 00:09–00:23 | 00:00–00:06 | 0–1 |

**Observed:** H0的三个Run已结束；从其最终世界+数据库独立复制G2，换3个新Run/native session，保留身体状态。G2首请求仅system/user，没有旧assistant消息。

**Agent interpretation:** “kill these agents”是编辑包装，指结束Run，不是Minecraft玩家死亡。

**Verification:** H0 finished/run-identities 与 G2 fork-manifest/initial-check/input-audit/run-identities；3个新身份与旧身份不同。 See episodes/E10.json and its sources.

**Supported:** All three prior sessions ended; fresh workers entered a preserved copy of the resulting world without their conversations.

**Not established:** In-game death, an instantaneous restart captured live, memory-free models, or a branch continued from H1.

**Context:** 停止与重启相隔约45分钟，中间还有H1分支。用明确时间跳切。没有确认存在三条stop命令逐一出现在原CLI视频的镜头；可用ended状态与新ID对照，不能伪造命令录屏。

## E11 · 新人的地图不一致：重建后又发现旧设施

**公开游戏副本定位（约）：** G2 00:05–02:43；G2 10:05–10:08。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 7a22c7c1-8d4e-48f8-9e98-bd5e43f7aaa3 / 39e627fb-ccf4-4b6b-9129-9abaa168b251 / 4b0d2f64-6693-49b9-9a2a-b13af804e7dc

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| G2 | 2026-09-18T19:18:06Z — 2026-09-18T19:20:44Z | 00:14–02:52 | 00:00–00:36 | 0–11 |
| G2 | 2026-09-18T19:28:06Z — 2026-09-18T19:28:09Z | 10:14–10:17 | 02:00–02:06 | 40–41 |

**Observed:** A使用旧主箱。C混合搜索未返回旧设施，建新工作台/箱；B在旁扩箱，后来向旧副箱存木。

**Agent interpretation:** C说“附近24格内没有工作台、箱子或熔炉”；范围外推超过返回证据。

**Verification:** 首批observations：混合查询被附近dirt等占满24项；旧设施初始存档在；新箱/台和B旧箱deposit有记录。 See episodes/E11.json and its sources.

**Supported:** Fresh workers re-established activity, but their local reconstructions differed and included redundant construction.

**Not established:** The facilities were absent, no worker could find them, or the new work area had no value.

**Context:** 观察是客户端有界block列表，不是游戏画面视觉。不要配眼睛视锥图，或声称他们“看见明明就在眼前却不认”。

## E12 · 那把石铲：定向供给尝试，未观察到取用

**公开游戏副本定位（约）：** G2 04:39–05:27；G2 12:11–12:20。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 7a22c7c1-8d4e-48f8-9e98-bd5e43f7aaa3 / 39e627fb-ccf4-4b6b-9129-9abaa168b251 / 4b0d2f64-6693-49b9-9a2a-b13af804e7dc

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| G2 | 2026-09-18T19:22:40Z — 2026-09-18T19:23:28Z | 04:48–05:36 | 00:54–01:09 | 18–22 |
| G2 | 2026-09-18T19:30:12Z — 2026-09-18T19:30:21Z | 12:20–12:29 | 02:24–02:30 | 48–49 |

**Observed:** A输入包含同伴位置、坑洞/掉落物和库存；它从旧主箱取圆石/木棍，19:23:09.732合成石铲，19:23:16.273存入C的新箱。后续B/C没有取出，最终仍在箱中。

**Agent interpretation:** 19:23:27公开总结：“观察到基地当前的主要工程是向东/向下开挖……因此……合成了一把石铲……供挖土使用。”这是动作后的可见解释，不是可访问的隐藏思维，也不证明同伴真实需求。

**Verification:** selected-episodes的首输入/物资转移；MicaA observations约19:22–23；三人完整withdraw记录及最终箱槽石铲1。 See episodes/E12.json and its sources.

**Supported:** A produced and deposited a tool relevant to digging, with a stated inference about peers' work, without Message/checkpoint communication.

**Not established:** Human-like helpful intent, mind-reading, that B/C understood the offer, deliberate rejection, or realized utility during this run.

**Context:** 先展示同伴行为与A当时可见信息，再展示动作后的原话，最后保留无人取用的结尾。不要把事后总结剪成事前口头计划。“The assistance was successfully ignored”暗示故意忽视，建议改“A shovel was offered. No uptake was observed.”

## E13 · 跨代小麦 → 一份面包

**公开游戏副本定位（约）：** G2 05:55–05:57；G2 07:38–07:50。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 7a22c7c1-8d4e-48f8-9e98-bd5e43f7aaa3 / 4b0d2f64-6693-49b9-9a2a-b13af804e7dc

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| G2 | 2026-09-18T19:23:56Z — 2026-09-18T19:23:58Z | 06:04–06:06 | 01:09–01:15 | 23–24 |
| G2 | 2026-09-18T19:25:39Z — 2026-09-18T19:25:51Z | 07:47–07:59 | 01:30–01:39 | 30–32 |

**Observed:** C存1小麦；A取这1份，再从旧主箱取前代2份，合成1面包并存回主箱。

**Agent interpretation:** A称打通农业循环等广义意义超出这份面包本身，字幕只说这一次加工链。

**Verification:** C deposit19:23:56.334；A withdraw19:25:39.829/46.923；craft19:25:48.341；deposit19:25:50.008；箱面包14→15。 See episodes/E13.json and its sources.

**Supported:** A verified product combined material left by a prior generation with material supplied by a current worker.

**Not established:** Long-term food self-sufficiency, shared intent, or that all increased bread was newly produced.

**Context:** 因果链很干净，优先于纯建筑计数。游戏旁观视角不一定显示容器UI，库存合并用标明trace来源的验证图卡。

## E14 · 错误解释伴随真实搭建：face不是成功原因

**公开游戏副本定位（约）：** G2 06:36–07:07；G2 10:59–11:01。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 4b0d2f64-6693-49b9-9a2a-b13af804e7dc

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| G2 | 2026-09-18T19:24:37Z — 2026-09-18T19:25:08Z | 06:45–07:16 | 01:18–01:30 | 26–29 |
| G2 | 2026-09-18T19:29:00Z — 2026-09-18T19:29:02Z | 11:08–11:10 | 02:09–02:15 | 43–44 |

**Observed:** C连续失败后改face并成功放置，声称掌握规则；实际place代码自动选邻接支撑，忽略输入face。

**Agent interpretation:** 19:25:03称“Placement rule figured out”；后来总结箱子上方无法放置。后者只记录局部失败，没证明普遍规则。

**Verification:** 固定版本minecraft.ts place分支+实际请求/结果。成功放置的存在不证明它给出的因果解释。 See episodes/E14.json and its sources.

**Supported:** C articulated a causal rule unsupported by the adapter implementation while continuing to build.

**Not established:** That changing face caused success, or that all failures were purely model error rather than adapter friction.

**Context:** 代码摘录放在verification cut，别伪装成Agent当时读过源码。工具语义确有摩擦，本轮未改hook。

## E15 · “庇护所完成” → 存档层高核对

**公开游戏副本定位（约）：** G2 10:59–12:19。末端超出保留视频的验证事件请查 trace / snapshot。




Run: 4b0d2f64-6693-49b9-9a2a-b13af804e7dc

| Group | UTC | Source game time (approx.) | CLI MP4 | CLI frames (zero-based) |
|---|---|---|---|---|
| G2 | 2026-09-18T19:29:00Z — 2026-09-18T19:30:20Z | 11:08–12:28 | 02:09–02:30 | 43–49 |

**Observed:** 确有棚顶与墙；地面方块y=-61，棚顶y=-59，仅约1格净空。当前玩家站立高度1.8格，不能按自报算普通站立可用庇护所。

**Agent interpretation:** C称四面围合、约3×2、可安全站立的真正可用庇护空间。

**Verification:** selected-episodes.geometry及最终NBT；minecraft-data 1.21.1 player.height=1.8；没有真人/机器人通行验收录像。 See episodes/E15.json and its sources.

**Supported:** A built artifact exists, but its claimed standing usability is contradicted by its clearance.

**Not established:** A completed functional shelter, a recorded human walk-through failure, or an overall inability to continue work.

**Context:** 可画简洁侧剖面并标“根据最终存档重建”；不要伪造玩家走进去撞头的实录。核心镜头是自报与独立核对之间的区别。
