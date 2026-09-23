# Q0/Q1 direct-task orientation diagnostic v1: results and execution audit

Translation of `orientation-diagnostic-v1-report.md`; the Chinese source is preserved unchanged.

2026-09-22. Exploratory diagnostic, not a public leaderboard result. This report was generated from actual collection, official grading, observable tool trajectories and integrity checks. Four calibration trajectories are reported separately and are not pooled with the formal 24. Report timestamp: 2026-09-22T04:17:11.018Z; first formal request: 2026-09-22T03:04:29.457Z (UTC).

## Conclusion boundaries

All 24 planned trajectories ended. There were 23 valid trajectories, all 23 passing the original official grader, and one invalid trajectory. Normal completions: 23; task deadlines: zero; token/request budget truncations: zero. Raw reward and trajectory validity are retained separately for each cell.

In this sample, no delivery-failure difference attributable to mandatory orientation was observed when the full task was delivered directly and budget was ample. This does not establish equivalence or exclude interaction between mandatory orientation and delayed task delivery in the earlier experiment. There are only four tasks and three repetitions per task/condition, with a success-rate ceiling; the results do not automatically justify changing product defaults.

The measured contrast is the total effect of the orientation requirement under direct task delivery, not pure goal salience. It is not a randomized comparison of old and new budgets: budget, delivery, samples and calendar time differ from the earlier diagnostic. Cross-version improvement must not be attributed entirely to budget, read_task or Threshold.

## Frozen conditions

- Both first user messages contain the same complete original task, generic objective, P1 post-orientation guidance, system prompt and 11 tools. Only one orientation sentence differs: Q0 requires read_task first; Q1 permits reading on demand. Q1 trajectories that voluntarily read are not reassigned.
- B=20,000,000 cumulative input+output tokens per trajectory, including cached input; at most 1000 requests; context 1,048,576 and output ceiling 393,216 per request; deepseek-flash, MAX. No ceiling reduction based on global balance.
- Original task deadlines of 900/1200/1800 seconds, 300-second request timeout, CPU1/RAM2GiB and Docker memorySwap4GiB. The 10GiB storage limit remains unenforced.
- Native compaction enabled with reserve16384/keep20000; session/provider retry disabled, except provably unsent connection failures retry after 2s/4s. Grader transient-network retry follows the frozen rule, with at most two attempts. No automatic invalid-trajectory rerun.
- Independent fresh containers, three repetitions, adjacent interleaved conditions with balanced first-condition order. Not same-provider-seed/shared-prefix pairs. No A0/B1 or replacement condition was added.

## All results

Denominators are valid trajectories; invalid counts remain explicit. The zero after a lost connection is not scored as a model failure, nor is an invalid sample replaced with a success.

| Task | Q0 (pass/valid) | Q1 (pass/valid) |
|---|---|---|
| feal-linear-cryptanalysis | 3/3 ; invalid 0 | 3/3 ; invalid 0 |
| kv-store-grpc | 3/3 ; invalid 0 | 3/3 ; invalid 0 |
| break-filter-js-from-html | 2/2 ; invalid 1 | 3/3 ; invalid 0 |
| polyglot-rust-c | 3/3 ; invalid 0 | 3/3 ; invalid 0 |

- Q0: 12 planned and ended; 11 valid and successful; 11 normal completions, zero deadlines and zero budget truncations.
- Q1: 12 planned and ended; 12 valid and successful; 12 normal completions, zero deadlines and zero budget truncations.

The complete 24-row table and cell IDs are in formal/collection/measurement-summary.md. Raw results retain completed_pending_integrity_audit; separate integrity-audit files record final judgments without rewriting historical results.

## Usage and termination

Known formal input: 9,963,705; output: 657,271; total: 10,620,976 tokens across 372 requests. Unknown-usage safety reserves are separately recorded as 471,336 total and 393,216 output tokens; they are neither a confirmed bill nor zero. Calibration's 1,792,746 known tokens / 59 requests are separate.

The largest known trajectory used 1,826,772 tokens, 9.13% of B. Usage explains trajectories; it is not grounds to shrink the experiment. Every trajectory retained its full frozen allowance.

| Task | Condition | Valid n | Median known cumulative tokens | Range |
|---|---|---:|---:|---:|
| feal-linear-cryptanalysis | Q0 | 3 | 597,945 | 391,170–614,022 |
| feal-linear-cryptanalysis | Q1 | 3 | 642,649 | 295,928–670,512 |
| kv-store-grpc | Q0 | 3 | 149,545 | 131,016–200,352 |
| kv-store-grpc | Q1 | 3 | 117,270 | 95,111–145,935 |
| break-filter-js-from-html | Q0 | 2 | 189,430 | 148,931–229,929 |
| break-filter-js-from-html | Q1 | 3 | 154,861 | 141,160–168,658 |
| polyglot-rust-c | Q0 | 3 | 532,093 | 397,774–881,711 |
| polyglot-rust-c | Q1 | 3 | 1,259,463 | 729,361–1,826,772 |

These usage summaries are descriptive only. The small n, stochastic trajectories and differences in reasoning, self-testing and task-level correction lengths do not establish that one condition is consistently cheaper or stronger. Invalid-trajectory known usage remains in the ledger but not valid-trajectory medians.

Returned model: deepseek-flash; fingerprint: `aeb56401ca74e127821c4f9126dcb669`. Actual compaction events: zero. Request timings and input-estimate/actual ratios are in request-statistics.json. Estimation remains conservative but caused no quota censoring here. Output limits are ceilings, not actual output lengths.

## Observed orientation behavior

- Q0: read_task in 12/12; called in the first model response in all 12; shared the first ordinary-action batch in one.
- Q1: read_task in 9/12; called in the first model response in six; shared the first ordinary-action batch in six.

Q0's “read first” was a prompt requirement, not a new hard enforcement hook. Some workers submitted read_task and task shell actions together; this cannot be described as an extra strictly separate round trip in every trajectory. Measurement retains original assignment without post-hoc compliance filtering. Startup guidance was injected once and retained as history, not appended every turn. Initial input, system/tools, per-request configuration and exact tool-result delivery were mechanically checked.

## Observable delivery chains

L refers to one-based lines in formal/collection/trace.jsonl. Tool success, inclusion in a request and completion of a model response are distinct events. Request admission does not imply completed processing by the model.

| Cell / episode | Observable chain | Interpretation boundary |
| --- | --- | --- |
| FEAL Q0 r1 / 75389533132922639bcc | L62 key recovery → L68 request carries result → L71 completed response → L72/73 writes plaintext separately | A separate delivery step after intermediate success, not one script writing both |
| FEAL Q1 r2 / d1b4e3f4a387779d8bb6 | L1599 key → L1605/1608 request/completed response → L1661/1662 plaintext | An intervening verification error was corrected; no read_task |
| HTML Q1 r3 / cc268b71faea64030132 | L3171 one of seven candidates alerts → L3177/3180 request/completed response → L3181/3182 out.html | Selection and delivery after an observed candidate success |
| Rust Q1 r3 / 7a730d550e0f56136ff9 | L3467 compilation passes → L3511 self-test overflow → L3521 rewrite → L3533 verification passes | The earliest success was not complete correctness; correction is observable |
| HTML Q0 r3 / eff3202fd6aac7cd867a | L3366 two candidates alert → L3372 request carries results → L3375 ECONNRESET without completed response | Cannot be attributed to voluntary non-delivery after observing success |

Other cells' first artifact write/confirmation, intermediate success, next admitted request/completed response, remaining budget, later request counts and last-two-request annotations are in delivery-audit/. Some FEAL solvers produced key and plaintext in one invocation; they must not be forced into two decisions. artifact-milestones.json separately records task-specified paths and the first exact path mentions in public assistant text/tool arguments. Relative-path writes were checked against execution/results; mention is not writing. Source/file existence is not test success. gRPC additionally has official live RPC verification after runtime exit.

## Infrastructure events and validity

HTML Q0 repeat three experienced a response-stream ECONNRESET at 2026-09-22T03:55:32.725Z (11:55:32 Beijing time), with deadlineReached=false and unknown usage. The worker reached candidate testing, but the next response did not complete and the target file was not written. The official grader was valid and returned zero; the trajectory is transport-invalid and excluded from model task failure. No selective rerun occurred.

An earlier operator report of local network recovery is in operator-events.jsonl. Precise outage start/end measurements are unavailable, so the root cause cannot be located confidently in the local network or upstream service. Later cells continued under frozen rules. The full unknown envelope was reserved without reducing any subsequent trajectory's allowance.

Ordinary task friction included missing Python/ps/pgrep/pytest, bugs in model-written checks or numeric types, and linking failures from concurrent compilation to one artifact. Recoverable task-level errors were not arbitrarily promoted to infrastructure invalidity. HTML /app/test_outputs.py was explicitly public in the task, not a hidden-test leak. Official graders were installed after worker execution and original file hashes were unchanged.

## Integrity and limitations

- 102 hash checks passed; new adapter/as-run snapshot, task/grader and preceding frozen materials were unchanged. All runtime control processes exited, experiment containers stopped, and application state persisted until grading completed.
- All 24 trajectories' observable tool input/output provenance was reviewed. No hidden grader, reference solution or cross-condition result contamination was observed. This is not exhaustive filesystem/network isolation or semantic review of private reasoning text.
- Core HEAD `c53006438588b0b43500fa2481278dda85ce3f4c`, clean worktree. No core/default changes, push or publication occurred in the study.
- Small sample, one model/provider, few tasks and no same-seed pairing cannot represent all TB2.1 or other tasks. Invalidity makes valid n unequal. Visible host CPU count via nproc, non-hard storage limits and real network fluctuations remain limitations.
- Ample budget removed the observed budget truncation in this study, not every possible future completion constraint. Long-duration work, other tasks, compaction and more complex delivery remain untested here.

## Evidence and verification

- Frozen execution notes: `../../frozen-source/orientation-diagnostic-v1/README.md`.
- Calibration: `../../evidence/direct-task-orientation-diagnostic/calibration-report.md`.
- Formal measurement table/JSON, request statistics and final checks: `../../evidence/direct-task-orientation-diagnostic/formal/collection/`.
- Raw trace, per-cell results/task artifacts/raw graders, integrity-audit/ and delivery-audit/ are retained in that collection directory.

Formal manifest SHA-256: `80af35f2562505f3a64a7b1f3c603cb592564693ce27e26a6a4d5e31d11fb296`.
Final raw trace SHA-256: `a3cb82ab60a9ad25f79602d488f59983450022cfa4c3e7a22607ce904d9a5c96`.
