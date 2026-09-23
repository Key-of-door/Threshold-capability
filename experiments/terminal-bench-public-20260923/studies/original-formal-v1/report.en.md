# Threshold × Terminal-Bench 2.1: formal collection v1 results

Translation of `formal-results-v1.md`. The Chinese source is preserved unchanged. This is a translation of the historical report, not an updated score. Table values are copied from that report; publication navigation is provided separately.

Generated at 2026-09-21T17:41:23.229Z. Collection has ended. This is a descriptive experiment on a frozen subset, not a leaderboard submission or evidence of performance equivalence.

There were 36 planned trajectories, 30 started trajectories and six setup-invalid slots. Of 29 valid trajectories with no input contamination observed, seven passed. Other cases are reported separately, without rerunning trajectories or substituting tasks.

## Frozen conditions

- A0: native Pi, one worker. A1: Threshold, one worker. B1: Threshold ends the old Run at the first eligible completed response/tool-batch boundary and starts a fresh Run.
- A1/B1 are independent matched trajectories, not shared-prefix paired forks. Each task/condition has one sample.
- deepseek-flash / MAX; context 1048576; configured per-response output ceiling 393216; shared per-trajectory budget 120000 input+output tokens, including cached input; at most 80 requests and the original task deadline. B1 permits at most one replacement.
- The target replacement threshold is 50%; indivisible responses affect the realized fraction. Normal completion takes precedence; the fresh worker receives no additional budget.
- Pi 0.85.1; Threshold `c53006438588b0b43500fa2481278dda85ce3f4c`; 1 CPU, 2 GiB RAM and 4 GiB total memory+swap. The declared 10 GiB storage limit was not hard-enforced.
- Release manifest SHA-256: `bc7605109a8d750eaf00eaae5c90db97486e75f6e7ee9acff85ac3839cb1edc5`. As-run adapter source and hashes are retained.

## All planned slots

| Task | Condition | Collector status | Grader valid | Raw reward | Valid score | Input audit | Actual tokens | Replacement |
|---|---|---|---|---|---|---|---:|---|
| write-compressor | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 96,480 | no |
| write-compressor | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 97,565 | no |
| write-compressor | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 117,669 | 86.3% |
| break-filter-js-from-html | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 103,820 | no |
| break-filter-js-from-html | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 108,017 | 57.2% |
| break-filter-js-from-html | A1 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 106,604 | no |
| extract-moves-from-video | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 107,577 | no |
| extract-moves-from-video | A0 | invalid | false | 0 | — | no_contamination_observed | 112,311 | no |
| extract-moves-from-video | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 113,191 | 55.6% |
| mteb-retrieve | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 112,138 | no |
| mteb-retrieve | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 110,338 | 55.4% |
| mteb-retrieve | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 111,535 | no |
| polyglot-rust-c | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 98,868 | 58.0% |
| polyglot-rust-c | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 92,260 | no |
| polyglot-rust-c | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 89,201 | no |
| polyglot-c-py | B1 | setup-invalid | not run | — | — | not run | — | no |
| polyglot-c-py | A1 | setup-invalid | not run | — | — | not run | — | no |
| polyglot-c-py | A0 | setup-invalid | not run | — | — | not run | — | no |
| chess-best-move | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 114,461 | no |
| chess-best-move | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 101,424 | no |
| chess-best-move | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 112,732 | 51.5% |
| bn-fit-modify | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 116,917 | no |
| bn-fit-modify | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 110,585 | 53.1% |
| bn-fit-modify | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 108,042 | no |
| extract-elf | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 99,641 | no |
| extract-elf | A0 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 112,370 | no |
| extract-elf | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 117,205 | 71.6% |
| feal-differential-cryptanalysis | A1 | setup-invalid | not run | — | — | not run | — | no |
| feal-differential-cryptanalysis | B1 | setup-invalid | not run | — | — | not run | — | no |
| feal-differential-cryptanalysis | A0 | setup-invalid | not run | — | — | not run | — | no |
| feal-linear-cryptanalysis | B1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 97,039 | 57.1% |
| feal-linear-cryptanalysis | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 115,658 | no |
| feal-linear-cryptanalysis | A1 | completed_pending_integrity_audit | true | 0 | 0 | no_contamination_observed | 107,447 | no |
| kv-store-grpc | B1 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 116,562 | 58.2% |
| kv-store-grpc | A1 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 106,792 | no |
| kv-store-grpc | A0 | completed_pending_integrity_audit | true | 1 | 1 | no_contamination_observed | 62,522 | no |

## Condition totals and matched results

| Condition | Planned | Started | Clean valid | Pass | Valid fail |
|---|---:|---:|---:|---:|---:|
| A0 | 12 | 10 | 9 | 4 | 5 |
| A1 | 12 | 10 | 10 | 2 | 8 |
| B1 | 12 | 10 | 10 | 1 | 9 |

There are ten matched tasks with clean-valid results on both A1 and B1: one both-pass, one A1-only pass, zero B1-only passes and eight both-fail.

All matched rows and realized replacement markers are in `analysis.json/pairs`. The triggered subset is a conditional description, not a randomized, unbiased estimate of the replacement effect.

## Usage and budget boundaries

Known cumulative input: 2,589,448; output: 587,523; total: 3,176,971 tokens across 339 requests. Unknown total and output reserves are both zero.

Batch authorization was 15M cumulative tokens / 5M output tokens / 3200 requests, including conservative unknown-usage headroom. The per-trajectory ceiling did not shrink with the remaining global balance. Cached input is included in input; reasoning is already included in output and is not added twice. Usage/cache data come from the provider. No authoritative monetary invoice was obtained; zero-price runtime placeholders are not actual billed cost.

| Condition | Actual budget utilization min / median / max | Input-reservation stops |
|---|---|---:|
| A0 | 52.1% / 93.6% / 97.4% | 8 |
| A1 | 74.3% / 89.0% / 93.4% | 10 |
| B1 | 80.9% / 93.9% / 98.1% | 7 |

Of 30 trajectories, 25 stopped at input reservation, four ended with a length response and a null meter terminal, and only gRPC A0 recorded normal_completion. Termination status is not the same as successful delivery. Estimation errors for A0, A1, B1 old generation and B1 fresh generation are in `budget-summary.json`; per-request estimates, actual prompt usage, output caps, cache and reasoning counts are in `analysis.json/requestRows`. Stopping below B does not mean insufficient funding; conservative input reservation and growing context can reduce usable computation.

## Replacement, continuity and measurement boundaries

Ten trajectories actually replaced the worker.

| Task | Actual fraction | Fresh first-request delay, ms | Fresh initial roles |
|---|---:|---:|---|
| write-compressor | 86.3% | 359 | system, user |
| break-filter-js-from-html | 57.2% | 338 | system, user |
| extract-moves-from-video | 55.6% | 352 | system, user |
| mteb-retrieve | 55.4% | 338 | system, user |
| polyglot-rust-c | 58.0% | 347 | system, user |
| chess-best-move | 51.5% | 383 | system, user |
| bn-fit-modify | 53.1% | 326 | system, user |
| extract-elf | 71.6% | 330 | system, user |
| feal-linear-cryptanalysis | 57.1% | 364 | system, user |
| kv-store-grpc | 58.2% | 361 | system, user |

`analysis.json` retains per-generation usage, first tool, explicit read/write/edit calls, hits from the frozen test-command recognizer, actual read_task/read_messages calls, and runtime exit/replacement times. File access inside shell commands was not fully instrumented; absence of an observation cannot be stated as absence of the event. All post-replacement consumption must not be called reconstruction overhead.

Retired Agent PIDs were checked independently before grading. Application processes remained in the same container. Peak Agent-runtime concurrency was one. A0 has no Threshold Run entity. Provider caching is not an old conversation, and we do not claim to clear the provider's internal state.

## Limitations that must accompany the results

- A valid reward of zero is a task outcome. If official tests did not execute, grading is invalid even if the script wrote reward=0 or exited with code zero.
- Video A0 had background apt activity holding the dpkg lock, preventing grader dependency installation and test execution. Original output and the invalidity criterion are retained; this is not a hidden assertion failure.
- ELF A0 attempted compaction marked overflow after a length response. The summary request was denied before inference by the budget gate; compaction did not complete and no additional paid request occurred. The label does not establish that the 1M context was full.
- Read/image outputs contain image-omission notices. The text-only model configuration required OCR/pixel tools; we do not claim direct visual input.
- Conservative request estimation, cumulative reasoning input, official network downloads and deadlines can affect trajectories. These results do not directly isolate the Threshold effect.
- Some protocol stops appeared in Project recentRuns as a generic model error, observable by the fresh worker. The host meter retains the precise reason.
- The Rust/C++ official image reported g++ 13.3.0 while the task specified 13.2.0. The compiler was not replaced during collection.
- Public tests, task-supplied data and source for ordinary dependencies are allowed inputs. Contamination is classified by provenance, not words such as benchmark or test.
- no_contamination_observed covers recorded inputs and returns, not comprehensive network/filesystem isolation.
- The small, single-model-family study, one sample per matched task/condition and unenforced storage quota limit generalization. It does not establish broad superiority.

## Three concrete observations

- **kv-store-grpc:** all three conditions passed seven official tests. B1's old generation left a running Python service. Without a checkpoint, the fresh worker read files and successfully called the same PID 86 service. A final checkpoint was not executed because output was truncated (trace 4505 / 4599 / 4641 / 4653).
- **feal-linear-cryptanalysis:** A0 wrote an attack program, recovered a key, generated 100 plaintext lines and passed official tests. A1/B1 did not deliver. A single outcome does not establish a stable framework ranking (trace 4248–4285).
- **MTEB / bn-fit / ELF and other B1 trajectories:** environment or files persisted, but the old generation had not produced a checkpoint/final artifact and the fresh worker repeated investigation. Persistence and effective handoff are different conclusions.

## Evidence and verification entry points

Publication evidence root: `../../evidence/original-formal-v1/formal-collection/`. Original machine-local paths are retained in the historical source; see the archive's source-map for portable navigation.

- `registry.json`: all planned slots and original collector states.
- `trace.jsonl`: recorded model-visible content, tools, requests, usage and timestamps; private reasoning text was not retained.
- Per-cell `result.json`, `worker-visibility.json`, `retired-runtime-pids.json`, grader execution/CTRF/reward/validity outputs.
- `integrity-audit/*.json` and `candidate-review.json`: provenance review and trace lines; original rewards are not overwritten.
- `observer-validation.json`: independent recalculation from trace of usage/request counts and tool-call pairing.
- `final-integrity-check.json`: 30-trajectory audit coverage, runtime-PID exits, stopped containers, 20 frozen source hashes and unchanged core.
- Per-cell `post-grading-container-diff.txt`: paths changed after grading, including grader effects; not a pure worker diff. Complete containers were retained stopped in local Docker.
- `analysis.json` / `budget-summary.json`: full tables, matched comparisons, timing, budgets and cache statistics.
- `as-run-adapter/` and the release manifest: frozen source, parameters and task-image information.
- `formal-run-notes-v1.md`: issues and episodes retained during collection.
