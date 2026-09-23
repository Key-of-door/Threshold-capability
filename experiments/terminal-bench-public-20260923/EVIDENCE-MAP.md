> **Web reading edition.** [Complete sealed evidence ZIP](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip) · [SHA-256](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.sha256). Raw files, frozen source, offline verification scripts and their manifests are inside the ZIP. Historical review-time status labels inside it are preserved; they do not indicate that this public release is pending.

# Evidence navigation

Paths below are archive-relative. Original source labels use `evidence-root/` and `capability-experiment/` in source-inventory.json; these are logical roots, not missing public directories.

**[All 120 planned slots: clickable result, grading and audit index](TRAJECTORIES.md).** This includes setup-invalid positions, not just successful trajectories.

| Study | Trace | Main results / audit | Frozen execution |
| --- | --- | --- | --- |
| Original formal v1 | evidence/original-formal-v1/formal-collection/trace.jsonl | same collection: analysis.json, integrity-audit/, registry.json, per-cell grader-* | frozen-source/formal-v1/ and collection/as-run-adapter/ |
| P0/P1 | evidence/post-orientation-diagnostic/collection/trace.jsonl | same collection: results.json, observer.json, integrity-audit/, posthoc-key-check/ | frozen-source/integration-diagnostic-v1/; evidence plan/policies and as-run snapshot |
| Q0/Q1 | evidence/direct-task-orientation-diagnostic/formal/collection/trace.jsonl | same collection: measurement-summary.json, delivery-audit/, artifact-milestones.json, integrity-audit/ | frozen-source/orientation-diagnostic-v1/; formal plan/manifest/as-run snapshot |
| High-budget | evidence/formal-v1-high-budget/formal-collection/trace.jsonl | evidence/formal-v1-high-budget/integrity-audit/summary.json and trajectories/ | frozen-source/formal-v1-high-budget/; prepared-adapter/ and formal-collection/as-run-adapter/ |

Each cell's raw result, official grader output/CTRF/reward/validity, visibility and retired PID files are under its collection/<cell-id>/. Read validity and audit overlays separately from raw reward. Missing setup-invalid cell directories mean no model trajectory was started; use registry and preflight records instead of inventing a trace.

## Selected evidence anchors

| Observation | Exact study/trace location | Additional evidence |
| --- | --- | --- |
| P FEAL intermediate key but missing plaintext | P trace L2817–2818, cell 706713ce1987ff8c1980 | collection/posthoc-key-check/result.json; per-cell grader |
| Q FEAL separate successful-result and delivery step | Q trace L62,68,71–73, cell 75389533132922639bcc | delivery-audit and artifact-milestones |
| Q transport-invalid after candidate results | Q trace L3366,3372,3375, cell eff3202fd6aac7cd867a | raw reward plus transport-invalid overlay, not model fail |
| High-budget failed /tests probes | high trace L1298,1299,1442,1545,1560,1716 | candidate-review.json; public-test provenance |
| High-budget runtime metadata exposure | high trace L3382,5385,9418; token occurrences additionally in redactions.jsonl | filenames retained; actual scoped values replaced |
| High-budget application continuity | high trace L11054,11112–11197 | gRPC B1 official grader and PID records |
| Old-generation unobserved terminal tool results | high integrity-audit/index.json, tool deliveredAt flags and machine-checks.json | 13 generation-0 terminal-batch results; four other deadline results kept distinct |

A line reference always means one physical JSONL line, starting at one. Public redaction retains line counts. `study + cell_id + trace line` is the locator, not a global cell ID alone.

## Historical absolute paths

Raw reports/scripts contain original `E:/Threshold-benchmark-stage0-20260921/<study>/...` paths. Map `<study>` as follows: formal-preflight-v1 → evidence/original-formal-v1; integration-diagnostic-v1 → evidence/post-orientation-diagnostic; orientation-diagnostic-v1 → evidence/direct-task-orientation-diagnostic; formal-v1-high-budget → evidence/formal-v1-high-budget. Capability experiment paths map to frozen-source/.

Those historical links are preserved as evidence, not advertised as working public links. This navigation layer and the new reading documents use portable archive-relative paths. Any earlier Stage 0 paths outside the four study roots are background references, not silently claimed to be included.

## Hashes

Original manifest hashes remain in original files and report translations. source-inventory.json binds each original file hash to its public-copy hash and substitution count. publication-manifest.json seals generated reading material and the public evidence copy. External bundle SHA-256 is in the sibling release-checksums file. No hash proves the scientific interpretation or the absence of all sensitive content.
