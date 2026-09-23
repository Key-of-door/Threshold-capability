> **Web reading edition.** [Complete sealed evidence ZIP](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip) · [SHA-256](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.sha256). Raw files, frozen source, offline verification scripts and their manifests are inside the ZIP. Historical review-time status labels inside it are preserved; they do not indicate that this public release is pending.

# Recompute evidence first; rerun separately

This is a research archive for four collections and their audits, not a leaderboard submission or an installable benchmark product. The methods and actual execution snapshots are retained. No model calls were made to prepare this archive.

## 1. Offline result verification — no API key or Docker required

Use Python 3.10 or later in the extracted archive directory:

```sh
python scripts/verify.py
python scripts/derive.py
```

With Node.js installed, the additional recorded-input replay needs no third-party packages:

```sh
node scripts/check-delivery.mjs
```

It rechecks 48 initial inputs, 1,095 completed tool calls, all 15,024 same-generation tool-result delivery instances across 938 requests, the fixed image-omission transformation and the 13 old-B1 terminal-batch results without later old-generation delivery. It writes checks/public-delivery.json and does not rerun a model or infer a new contamination verdict.

`verify.py` is read-only. It checks the publication manifest, copied-source digests, ledger locations, trace line preservation metadata and report/translation bindings. `derive.py` rewrites only generated tables/check summaries; it recomputes high-budget usage from all 938 provider request/usage records, reconciles meters and the global ledger, checks 12 replacement boundaries/lifecycle ordering and regenerates the 12×3 table and historical common-valid intersection. It also regenerates diagnostic summaries from their archived measurements. It does not rerun graders or decide provenance classifications anew.

To regenerate the two figures, install matplotlib in your own environment, then:

```sh
python scripts/plot.py
```

Figure sources and definitions are in figures/README.md. PNG rendering may differ slightly across matplotlib/font versions; numerical table regeneration is deterministic. Generated figure bytes are not promised to be identical.

For an individual claim, use the table's `(study, cell_id)`, then open that study's trace and per-cell result/grader. **Cell IDs repeat between original v1 and high-budget**; an ID without a study is ambiguous. Trace references are physical, one-based JSONL line numbers. Every source trace line is retained in the safety-redacted copy. Credential placeholders are not original model input.

## 2. Evidence scopes and state precedence

- Original v1: evidence/original-formal-v1/formal-collection/analysis.json + integrity-audit/.
- P diagnostic: evidence/post-orientation-diagnostic/collection/results.json + integrity-audit/.
- Q diagnostic: evidence/direct-task-orientation-diagnostic/formal/collection/measurement-summary.json + integrity-audit/. Four calibration trajectories remain under calibration/, never pooled into the formal 24.
- High-budget: evidence/formal-v1-high-budget/integrity-audit/summary.json + trajectories/. Historical per-cell pending_audit fields remain unchanged.
- Historical integrity checks are evidence of checks performed then. Some old scripts require stopped local Docker containers or absolute source paths. They are not the portable public verifier.
- Prepared task-source/tests/solutions and grader records are **observer-only evidence**. Never mount the archive, raw traces, official solutions, other-condition outputs or the observer directory into a worker container.

The initial protocol proposed a shared-prefix fork. Stage 0 decisions v2 explicitly adopted independent matched rollouts because process/environment forking was not validated. Read in order: frozen-source/protocol-v1.md → stage0-decisions-v2.md → each study's frozen execution README/policy → release manifest/as-run adapter → final audit overlay. Old protocol proposals and execution-era progress labels are not claims about what eventually ran.

## 3. New model collection — checklist, not an automatic command

This archive does **not** offer an independently verified one-command fresh-machine rerun. As-run launchers contain historical Windows paths and local Docker image IDs; stopped containers/images are not exported. Build/runtime tarballs and generated caches are excluded explicitly in excluded-build-artifacts.json. This limits bit-identical environment restoration, not offline inspection of the recorded results. Do not point an old collector at its archived evidence root or reuse its authorization/ledger.

For a new, separately authorized collection:

1. Obtain Threshold commit `c53006438588b0b43500fa2481278dda85ce3f4c`, Pi `0.85.1`, Linux Node `24.18.0` and Terminal-Bench 2.1 commit `7131e4375048a0e408a8fb404b5f499d726b695b`. The pinned task subset and task-source bytes are included. Task repository provenance is in THIRD-PARTY.md.
2. Establish a new empty evidence root and archive ID. Copy the appropriate **as-run** adapter to a separate working directory; adapt only local path bindings/runtime preparation and record every change with a fresh manifest. Paths in common.mjs, collect.mjs and bootstrap/preparation files are not portable defaults. The original four study source snapshots stay immutable.
3. Inspect that study's release-manifest.json, policy.mjs, task metadata, task-source hashes and prepared-image records. Original runtime images were reused by exact local image ID for high-budget collection, including formerly setup-invalid tasks. Public base-image digests and original runtime-build Dockerfiles are preserved under original-formal-v1/tasks-r2/. A local image ID is not a pullable registry reference. Rebuilding with currently available packages may differ; record this as a new environment, never claim historical byte identity without checking it.
4. Build runtime dependencies using pinned Node/Pi/core and a clean dependency lock. Do not copy any personal Pi auth/config directories into images. The original three archive names were node-linux.tar.gz, threshold-runtime.tar.gz and threshold-source.tar.gz; hashes are retained but their bytes are not in this public package. Exact dependency restoration may require those original archives or a separately verified reconstruction.
5. Validate each selected task's empty/oracle grading under the frozen setup retry policy. Preserve setup-invalid tasks and all grading attempts; do not substitute another task based on observed model performance. Keep reference solutions strictly in separate oracle containers. Use original Git bytes, not CRLF-converted task scripts.
6. Configure credentials privately in the new host environment. No credential from archived traces, placeholder, authorization file or ledger is usable authorization for new calls. Use fresh runtime tokens. Configure deepseek-flash, reasoning_effort=max, thinking enabled, C=1,048,576 and O=393,216, while checking actual outbound/provider-returned settings. The historical fingerprint is recorded, not a guaranteed future backend lock.
7. Choose **one** frozen study, not a mixture. Formal v1: B=120k/R=B/2/80 requests. High-budget: B=20M/R=60k/80 requests; all other original execution semantics retained. P: B=120k, original indirect task delivery, P0/P1 post-orientation wording only. Q: B=20M/1000 requests, direct full task in both arms and Q0 required/Q1 optional first read_task, no replacement.
8. Keep task-specific deadlines shared across generations; 1 CPU, 2GiB RAM, 4GiB memory+swap; original network/retry/compaction/admission policies. Disclose that 10GiB storage was not hard-enforced. Provide enough global authorization for every valid trajectory's full frozen envelope and conservative unknown reserve; never reduce a cell's limits due to remaining global balance.
9. Validate the process boundary with the retained synthetic fixtures before paid collection. Complete a tool batch, retire old runtime/control state, preserve task application state, then create the fresh runtime. Natural completion has priority; replacement is not arbitrary mid-call termination. Preserve observer isolation and fresh input checks.
10. Freeze subset/seed/order/repeats before collection. Use formal-subset-v1.json for the original contrast; P/Q have their own post-hoc diagnostic plans. Independently sampled trajectories are not shared-prefix counterfactuals. Retain failures, unknown usage, errors, retries and invalid slots. Do not feed grader feedback back to a finished worker.
11. Run official graders only after Agent-runtime retirement; verify that tests actually executed. Preserve raw reward separately from grader validity and trajectory validity. Repeat the input-provenance review and publish its scope; keyword matches alone do not establish contamination.
12. Record returned model/fingerprint, time, usage, network conditions, images, dependency changes and actual replacement location. Generate a **new** result set. Stochastic/provider/network differences mean the same outcome is not guaranteed.

## 4. What is and is not included

Included: complete recorded traces for the four collections; raw per-cell results/graders; setup and invalid attempts within those study roots; Q calibration; exact as-run/prepared source; policies/plans/manifests; task source and official-test evidence; delivery and integrity overlays; plotting/derived-data scripts.

Not included: private reasoning text that was never retained; provider internal state or authoritative invoices; original stopped Docker containers/images; repeated build/runtime archives and generated native/cache outputs listed individually in excluded-build-artifacts.json. Stage 0 source/decisions are preserved as methodological background, but this package is not a complete raw archive of every early Stage 0 trial. No missing item is silently substituted.

Official task input video is included as an original benchmark asset, not a recording of the user's desktop or a product demo.
