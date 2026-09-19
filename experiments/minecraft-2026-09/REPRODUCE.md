# Reproduce / 复现说明

## 1. Download and audit without a model

Download `archive-index.zip` plus the desired group ZIP(s) from the [archive Release](https://github.com/Key-of-door/Threshold-capability/releases/tag/minecraft-archive-2026-09-v1). Extract into one directory, for example `archive-data/`. It should contain `FILE-MANIFEST.json`, `G2/`, `H0/` and so on, not an extra enclosing ZIP-name directory.

```sh
git clone https://github.com/Key-of-door/Threshold-capability.git
cd Threshold-capability/experiments/minecraft-2026-09
node audit.mjs /absolute/path/archive-data G2
```

Node 24.18.0 was used locally. Omit `G2` only if all group ZIPs and index are extracted: the full manifest checks every exported file. It contains original and published SHA-256, byte sizes and JSONL record counts. A changed hash between original and published files is expected where JSON formatting or privacy redaction occurred; validate against `published_sha256`.

For a substantive example, recompute the G2 input tool set, fresh first requests, final chest count and stored shovel directly from traces/NBT:

```sh
npm ci --ignore-scripts
node verify-g2.mjs /absolute/path/archive-data/G2
```

This passed locally against the public export: 518 prepared provider requests, three initial system/user-only inputs, three selected tools, two initial/four final chests and one stone shovel in `(10,-60,-6)`. The offline scanner covers x/z chunks -4 through 3 and y sections -4 through -2. It does not scan the whole infinite world or prove intent.

To inspect other episodes, begin at `EPISODES.md`, then `episodes/E*.json` in the index ZIP and each arm's complete trace files. `snapshots/initial`, `snapshots/during-*`, `snapshots/final` preserve the saved mechanical state. Bot playerdata is retained; private human playerdata/stats/advancements are omitted. Historical source paths in reports/trace `sources` resolve via `MEDIA.md`'s arm mapping.

## 2. Restore and view the saved world

Use **Minecraft Java 1.21.1** and Java 21. Obtain the official server yourself; this repository does not redistribute it. The experiment's server.jar SHA-256 was:

```text
e3bc55693e93cda0188f2e60aea28113fc647c5e85a15fa3d1b347349231b4bb
```

Copy a chosen snapshot to a **new disposable** server directory as `shared-world/`, copy that group's `server/server.properties`, and supply your server.jar. Read and accept Minecraft's EULA yourself. Launch with `java -Xms512M -Xmx2G -jar server.jar nogui`. Bind only to `127.0.0.1`: these study settings use offline mode. Connect the matching Java client to view the world. For observation without alteration, use spectator mode; freeze ticks from the server console if comparing exact snapshots.

Seed `20260918` is not enough: buildings, resource edits, crop growth, inventories and bot bodies came from a continuing world. Use the saved initial state for the specific arm. Viewing a world does not start an Agent.

## 3. Prepare a fresh G2-style model rerun

Historical scripts in `historical-source/` are archived implementations, with the original directory assumptions preserved. Do not run a historical `prepare` script against existing experiment folders. They are not a stable Threshold SDK or a generic launcher.

For the latest generation-replacement condition, `prepare-g2.mjs` creates a new directory, relocates copied harness imports, and reconstructs a logical database from public H0 data. It refuses an existing destination. **It starts no server and makes no model call.** It preserves task/history records for the observer but creates fresh Runs on launch; G2's gate hides that history from workers.

Prerequisites: G2 and H0 data ZIPs + index extracted, Java/server.jar, the recorded Threshold checkout with dependencies, and the study dependencies installed here. The extra recorder dependency is `node-pty@1.1.0` (native build prerequisites may be required on your platform).

```sh
git clone https://github.com/Key-of-door/Threshold.git
git -C Threshold checkout c53006438588b0b43500fa2481278dda85ce3f4c
npm --prefix Threshold ci
# In this experiment directory:
npm ci --ignore-scripts
npm install --no-save --package-lock=false node-pty@1.1.0
node prepare-g2.mjs /absolute/archive-data /absolute/Threshold /absolute/NEW-rerun /absolute/server.jar /absolute/java
```

Quote all paths containing spaces. On Windows the last argument is the full path to `java.exe`. Inspect `NEW-rerun/PREPARED.json` and the generated runner before execution. Local archive preparation and offline checks were exercised on Windows; **a new end-to-end model rerun and cross-platform rerun have not been performed for this publication**.

The prepared runner writes `eula=true` when launched. Launch it only after you have read and accepted the Minecraft EULA. Provide your own `DEEPSEEK_API_KEY` in the process environment; never put it in an issue, archive or Run objective. Check `live/run-06/r17/pi/models.json`: it contains an environment reference, not a key. The historical model alias may change or disappear; record any substitution as a changed condition.

PowerShell launch after completing those prerequisites:

```powershell
$env:MC_ARM = 'r01'
node 'E:\NEW-rerun\live\run-07\run-world.mjs'
```

The runner starts the local Minecraft/Threshold services, freezes world time, and waits for `READY_FOR_RECORDING`. Connect the game client and arrange recording if desired. In another terminal, create the flag to release three workers:

```powershell
New-Item -ItemType File -Path 'E:\NEW-rerun\live\run-07\r01\start.flag'
```

This starts paid model work. Historical bounds are 3 concurrent workers, up to 12 work segments each, 500-call soft/600-call hard stop, 25/30-minute limits, and aggregate token ceilings. A segment is not one provider call. Current provider pricing, limits and availability must be checked by the person running it. End states and errors belong in the new report; do not silently fix prompts to reproduce a preferred story.

The preparation adapter changes paths, reconstructs a database instead of copying private SQLite, removes the private human observer's body, and starts from G2's published initial save. It preserves the bot bodies and mechanical world. These differences must be disclosed; the result is a new trial, not a deterministic replay. The provider's sampling, timing and server ticks will differ.

## 4. Other arms

Resource comparison: `historical-source/live/resource-pair-01/`, `conditions.json`, `fork-manifest.json`, the per-arm initial snapshots and dependency hashes. History comparison: `historical-source/live/run-06/`, shared prompts and channel gate, H0/H1 input audits. Early rounds retain their own adapter copies in each data ZIP; do not apply the latest adapter retrospectively.

These earlier runners still require manual path/environment adaptation and reconstruction of their source forks. No one-command portable reproduction is claimed for all eight groups. Their code, initial/periodic/final saves, conditions and recorded inputs are published so that those adaptations can be reviewed explicitly.
