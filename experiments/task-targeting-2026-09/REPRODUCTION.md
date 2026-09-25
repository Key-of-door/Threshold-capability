# Audit and replication / 审计与复现实验

## Offline audit / 离线核验

Download and extract `task-targeting-pilot-public-v1.zip` from the linked GitHub release.
No API key, npm install or network is needed for verification. Node 24+ and Git are
needed for the optional fixture inspection; the verifier itself uses only Node built-ins.

下载附件并解压，进入目录运行。核验不联网、不调用模型、不读取本机凭据。

```sh
node verify-public.mjs
```

This checks public file hashes, regenerated ledger/trace chains, 24 attempts, 231 work
segment tool references, explicit stance quotes, first claim-bearing model inputs,
198 request usage totals, unchanged input/test/generator hashes, final artifacts and
fixture bundle hashes. It recomputes exposure and resource totals from public traces.
It does not independently judge every interpretive work code or establish sample validity
merely from a correct artifact. Read the actual traces and rubric as well.

核验脚本检查字节完整性、公开校验链、暴露位置、usage、编码引用与最终产物。
它不能替代人工审阅编码，也不能把“最后做对了”当作过程有效的充分证据。

Each public `trace.jsonl` retains one original event per line, its index/time, and
`sourceHash`/`sourcePrevious`. Its `hash`/`previous` describe the **public derivative**.
`data.requestHash`, modelInputHash and historical source digests remain original identities;
do not hash a redacted request and claim it has the old request hash. Original freeze,
execution seal and analysis manifests are historical records, not validators for changed
public bytes. Use `public-manifest.json`; SHA-256 hashes are not independent timestamps.

公开 trace 保留原事件编号及原 hash 引用，同时建立新校验链。脱敏请求不再是原始
字节；旧 freeze/执行 seal/分析 manifest 只是原版身份。以 public-manifest 核验公开副本。

## Inspect a fixture / 查看初始现实

Use a fresh destination for each clone. Inspect `case.json` for the fixed commit, claim
body hashes, source/target IDs and synthetic timestamps. Repo bundles retain the initial
Git history, including the true earlier state of the stale case.

```sh
git clone inputs/cases/stale/repo.bundle stale-inspection
git -C stale-inspection log --oneline --all
git -C stale-inspection show 97787b2:orders.json
git -C stale-inspection show 1ad5a6e:orders.json
```

The stale delivery is intentionally wrong at target launch; running its test immediately
may fail, as specified. That is fixture truth, not a broken download.

stale fixture 在目标启动时故意过期，初始测试失败是实验条件，不是下载损坏。

## Behavioral replication / 重新采样

This is an auditable experiment archive, not a one-command benchmark product. The
archived collector is the actual research implementation and contains redacted local
path placeholders. **Do not execute its original collect.mjs directly.** It assumes
the original experiment's freeze, runtime layout, serial ledger and credential loader.
Never point a replay at the published original `results`.

当前附件是实验档案，不是开箱即跑的 benchmark 服务。历史 collector 保留本机路径
占位符及旧 seal 假设，不能直接执行，也不能把重跑结果写回原 results。

For a new, explicitly authorized replication:

1. Copy the archived inputs/scripts/execution code into a **new** experiment directory.
   Keep the original downloaded archive read-only. Give the replica a new identity.
2. Inspect `inputs/conditions.json`, `sequence.json`, each `case.json`, message body,
   rubric and invalid/retry policy. Preserve four cases × three pairs, fixed seed
   20260926/order, both-arm body/fixture equality, 20M budget and 30-minute deadline.
   Do not recreate bundles from scratch and silently change claim commit references.
3. Use Windows Node 24.21.0 for the same service/Pi condition, with Pi 0.85.1 and the
   archived lockfile. The original worker shell used Node 24.18.0: record whether a
   replica preserves or changes that split. Exact frozen Threshold source is included;
   **npm alpha.5 is not the identity of the original sampled source** (the sampled
   package label was alpha.4 with unreleased changes). Do not substitute newer dependencies.
4. Replace `[PILOT]`, `[RUNTIME]`, `[USER_HOME]` and `[THRESHOLD_SOURCE]` paths only in
   the new copy. Replace the historical credential loader with an explicit local/env
   loader for your own key. Keep the key out of prompts, logs and manifests. Install
   pinned runtime dependencies with npm ci. No credential is distributed here.
5. Initialize fresh empty operational ledgers and fresh attempt directories. Retain
   initial Git snapshots/claims from the archive. Rebuild the replica freeze and execution
   inventory/seal after recording every portability change; do not impersonate the original
   freeze hash. Read scripts/common.mjs and execution/inventory.mjs for their exact checks.
6. Run offline preparation, execution preflight, immediate-response Pi fixture and
   connectivity/usage checks before sampling. Confirm full per-trajectory admission,
   no inherited source conversation and actual request/model settings. Authorize your
   own paid calls before starting the collector. A model alias and network timing cannot
   reproduce identical model outputs.
7. Run the recorded paired sequence without adapting it to outcomes. Preserve first
   invalid attempts and the frozen retry quota; do not treat configuration/network failure
   as model failure. Recode under the same rubric before comparing descriptive results.

重新采样需要独立目录、新 freeze、明确的本机路径/凭据适配、相同依赖与运行前检查。
变更必须记录；模型别名和网络状态意味着不能保证逐字重现输出。公开附件支持检查
这次实际发生了什么，并提供重新搭建的源码与条件，而不伪称无需适配的一键复现。

## Public exclusions / 公开排除项

`redactions.jsonl` records source file and JSON/event location, category and count;
never original secret values. Categories separate local path replacement, already-redacted
credentials, and **private-reasoning publication exclusion**. The latter is an explicit
content-scope exclusion, not represented as credential-only redaction. Tool calls/results,
public replies, system/task prompts, usage, event ordering, errors and contrary examples
are retained. Auth files, live databases, runtime tokens/markers and dependency trees are
not distributed. No screenshots or unrelated local project data are included.

逐字段清单区分安全脱敏与 reasoning 文本的公开范围排除，不把后者说成仅删密钥。
公开保留工具、回复、system/task prompt、usage、顺序、错误和反例。下载包未包含
auth.json、实时数据库、运行令牌、依赖目录或无关私人项目。
