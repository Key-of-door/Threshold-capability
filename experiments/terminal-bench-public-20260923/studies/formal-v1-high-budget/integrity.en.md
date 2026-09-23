# Formal v1 high-budget: integrity audit and confirmed results

Translation of `formal-v1-high-budget-integrity-report.md`; the Chinese source is preserved unchanged.

Audit date: 2026-09-23. Scope: the 36 completed formal trajectories, not new collection. No model calls, task reruns, score changes or Threshold core changes were made during this audit.

**Within recorded input/tool-return coverage, all 36 trajectories were classified no_contamination_observed; all 36 official graders were valid. A0, A1 and B1 each passed 10/12. No trajectory was excluded by this integrity audit.**

The label means prohibited material was not observed entering the model. It does not establish the absence of every possible leakage channel or audit model pretraining data.

## Conditions and results

This is a budget-relaxed replication: BB increased from 120k to 20M shared input+output per trajectory; RR was independently fixed at the old nominal 60k. The original `used >= 60000` comparison is retained, with replacement at the first eligible completed tool-batch boundary after reaching the threshold, and unchanged precedence for normal completion and other stops. Realized replacement does not occur at exactly token 60,000.

deepseek-flash / max; C=1,048,576; O=393,216. The 80-request cap, original task deadline, retry, compaction, task delivery and workflow guidance follow the frozen implementation. A1/B1 are independent matched trajectories, **not shared-prefix paired forks**. Each task/condition has one sample.

| Condition | Grader valid / no input contamination observed | Pass | Normal | Deadline | Actual cumulative tokens | Requests |
|---|---:|---:|---:|---:|---:|---:|
| A0: native Pi | 12/12 | 10/12 | 11 | 1 | 10,933,883 | 262 |
| A1: Threshold, no replacement | 12/12 | 10/12 | 10 | 2 | 12,388,565 | 316 |
| B1: Threshold, one fresh replacement | 12/12 | 10/12 | 11 | 1 | 10,059,464 | 360 |

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

Equal scores do not imply equal failure modes. A1 passed ELF and hit the deadline on chess; A0/B1 passed chess and had valid failures on ELF. All three video trajectories hit their deadline. This does not establish performance equivalence or cost-free replacement.

## What the audit did

All 1,095 tool-call sequences were reviewed at command/path/return-summary level, with suspicious returns, external sources and surrounding context expanded. All 938 recorded provider requests were mechanically checked. Each of 89 keyword candidates has a classification; keyword hits were not automatically labeled contamination. This audit was conducted by the same Codex primary reviewer, not an independent multi-party panel.

- Frozen manifest, prepared/as-run adapters, task files and runtime-image bindings matched. Raw trace digest was unchanged before and after the audit.
- Initial visibility records for 36 containers did not expose designated hidden paths. Read-only inspection of stopped containers matched images, no host mounts, 1 CPU / 2 GiB RAM / 4 GiB memory+swap.
- Every tool call has a completion record. All 15,024 tool-result delivery instances in later requests bind to actual results from the **same trajectory and generation**. The explicitly accounted transformation is the text-only provider's fixed image-omission notice.
- All 48 generations' first requests contained only system + user. Each of the 12 B1 old/fresh initial inputs was identical, without old assistant/tool conversation. Later requests retained the same prefix without additional user/system injection; this does not mean initial guidance disappeared from request history.
- A0 initial task text and A1/B1 read_task instructions matched frozen task instructions.
- All 12 replacements occurred at the first eligible boundary. Old runtime exit preceded fresh runtime start. Realized trigger usage ranged from 60,624 to 97,365 tokens. No extra replacement occurred.
- All 36 graders executed after runtime exit, retired-PID checks and the last model event. The frozen collector closes runtime before copying official /tests. Each grading was valid on the first attempt.
- CTRF, reward, test inventory, execution timestamps and exit codes were rechecked. Ninety-three official-test files copied read-only from stopped containers matched frozen originals. No grader was rerun.
- All 938 usage events reconciled with per-cell meters and the global ledger. There were no provider/stream/adapter errors, unknown reserves or token/request/authorization guard stops. No compaction occurred.

Machine records contain 18,610 assertions, many checking repeated delivery of the same tool result in history, plus 93 grader-file checks. This measures record coverage, not 18,610 independent experiments.

## Specific audit records that must be retained

L denotes one-based lines in the original formal-collection/trace.jsonl.

### 1. HTML: public tests and /tests probes

The task explicitly allows /app/test_outputs.py and the environment Dockerfile copies that public test to /app. Returns at L1284,1424,1527,1698 match it. A canary string does not make a public file hidden.

The public test hardcodes /tests/filter.py. Three trajectories made six probes for nonexistent /tests paths/files (L1298,1299,1442,1545,1560,1716). No prohibited content was returned; attempted_access markers remain under frozen rules. Workers then copied public /app/filter.py locally to execute the public test (L1335,1576,1742). A0/B1 removed their copy; A1 left it, but official tests were copied by the collector only after worker exit. This is not hidden-test contamination, and probes alone do not establish an intention to cheat.

### 2. MTEB: task-specified “Terminal-Bench” and self-authored solution

terminal-bench is the task's required query and occurs in supplied data. Network accesses involved Hugging Face models and embeddings-benchmark/mteb library documentation/metadata, not Terminal-Bench answer repositories (e.g. L3710,3721,3732,3758,3769).

B1 wrote /app/work/solution.py itself at L3791. “Reference solution” was its own code comment. No external reference solution was observed entering the model.

### 3. Runtime metadata was visible: no strong-isolation claim

L3382,5385,9418 show runtime/config/project directory listings, including auth.json and human.key filenames; those calls did not return file contents. Some workers used env and could see their own runtime configuration and scoped token. This is not hidden-grader/cross-condition contamination, but demonstrates a cooperative execution boundary.

ELF A0 read shell history and searched task-like filenames without receiving relevant material (L8718–8719). A FEAL A0 command contained find *attack*, but earlier git log failed so the search after && never ran (L10195). “Tried to find” and “actually received” are separate observations.

Original evidence remained local at audit time. Publication requires separate redaction, especially scoped runtime tokens. Integrity auditing is not a publication-safety review.

### 4. Images and truncation

Nine image reads occurred in video/chess tasks. The frozen model configuration was text-only and actual provider input contained omission notices. Workers instead used OCR, pixel analysis and font/piece templates. A1's Lichess cburnett SVG download (L6564) was a generic piece asset, not the task answer.

Four of five truncation candidates were merely Project board summariesTruncatedAt fields. The one actual tool-output truncation was A0 chess's long local Stockfish log at L6283; returned extent and provider delivery can be checked. No extra unknown trajectory was introduced.

### 5. Replacement still removes the old worker's next observation opportunity

Seventeen recorded tool results never entered a subsequent provider request: 13 belonged to B1 generation-0 terminal batches and four to final deadlines. The former follow the specified replacement semantics: a completed tool batch permits replacement without another old-worker inference to read it. Effects may nevertheless persist in files/services for the fresh worker.

This is a treatment property independent of token ceiling and remains relevant at high budget. gRPC B1's old application service survived; the fresh worker inspected and dealt with duplicate servers (L11054,11112–11197). The old Pi runtime had ended.

## Budget and supported conclusions

Cumulative input was **31,691,797**, output **1,690,115**, total **33,381,912 tokens**. Cached input is included; reasoning is part of output, not added again. No authoritative monetary bill was obtained, so token counts and placeholder runtime prices do not support a cost claim.

The largest trajectory, A0 ELF, used **5,195,459**, about **26.0%** of 20M. Every request retained the full 393,216 output ceiling. Termination was governed by normal completion or the original task deadline rather than token reservation.

Supported: **in one collection on these 12 tasks with the current model and frozen conditions, increasing total budget while retaining early replacement yielded 10/12 passes in each condition; the observable-input audit found no contamination requiring exclusion.**

Not supported: statistical equivalence of Threshold and Pi, free replacement, budget alone explaining all old differences, or generalization to larger task sets/other models. Original v1 had six setup-invalid slots and one invalid grader. Collections were not contemporaneous randomized repetitions; subtracting aggregate rates with different coverage is not a causal effect estimate. Original v1 is unchanged.

Task-side downloads/application execution consume deadline. Text-only substitutes for visual input and 1 CPU affect performance. The 10 GiB storage limit was not enforced. There was no full syscall/packet monitoring, private reasoning was not retained, and pretraining contamination was not excluded. The no_contamination_observed label must carry these scope limits.

## Evidence and verification

Publication evidence root: `../../evidence/formal-v1-high-budget/`.

```text
formal-collection/                  original collection, safety-redacted publication copy
  trace.jsonl
  registry.json / ledger.json
  as-run-adapter/
  <cell-id>/result.json
  <cell-id>/worker-visibility.json
  <cell-id>/retired-runtime-pids.json
  <cell-id>/grader-1/
integrity-audit/                    separate historical audit overlay
  summary.json                     36 verdicts and aggregates
  trajectories/<cell-id>.json       evidence lines, scope, notes
  candidate-review.json            89 candidate classifications
  machine-checks.json              input binding, budgets, chronology
  container-inspection.json        read-only stopped-container snapshot
  grader-files-check.json          official-test hash checks
  grader-files/<cell-id>/           read-only copied test files
  evidence-manifest.json           sealed original-material/audit hashes
  build-index.mjs / review.mjs      navigation helpers
  check.mjs / verify-grader-files.mjs / record-review.mjs
```

Raw result.json retains the collector's pending_audit state. The separate summary.json overlay gives the final audit without rewriting history. Historical check.mjs requires the retained stopped Docker containers; traces and reports can be inspected offline. An audit script is not an independent reviewer.

- Release manifest SHA-256: `d5cd35164b5b57c7f08d52219f863188ae7808fd8c676096a74112a677b08cfa`
- Raw trace SHA-256: `3410e63bb2fe6016680fc6040ee79b3968137dd1c698ee3a1e43b58b6d247304`
- Original v1 manifest SHA-256: `bc7605109a8d750eaf00eaae5c90db97486e75f6e7ee9acff85ac3839cb1edc5`

**This audit left no blocker to including the main results as descriptive experimental records with these limitations.**
