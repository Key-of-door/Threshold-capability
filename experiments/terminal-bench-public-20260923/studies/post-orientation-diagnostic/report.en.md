# Post-orientation workflow diagnostic v1

Translation of `integration-diagnostic-results-v1.md`. The Chinese source is preserved unchanged. Completion: 2026-09-21T19:21:03.233Z. Original formal v1 is unchanged; this diagnostic does not backfill its scores.

## What was tested

Four tasks selected after observing formal v1, with three independent repetitions per P0/P1 condition: 24 trajectories. Conditions were adjacent and interleaved in a predetermined order, P0 first in six blocks and P1 first in six. This was not a shared-prefix fork, had no contemporaneous A0, and its repetitions are not 24 independent tasks.

P0 retained the original startup message. P1 changed only four post-orientation requirements—inbox, Git ordering, checkpoint and status—to on-demand guidance. The initial read_task, full-task delivery method, quality verification, objective, all tool schemas and risk/status semantics remained unchanged. Startup bodies were 1397/1388 bytes; P1 did not save budget by drastically shrinking the prompt. Both are Pi's initial **user turn**; the Pi system prompt was unchanged.

Both conditions used deepseek-flash/MAX, Pi 0.85.1, B=120000 input+output, 80 requests, original task deadlines, and the same compaction/retry/estimator and official grading policies. Each trajectory started from a fresh original prepared-image container, with no cross-condition state inheritance or B1 replacement.

## Results

| Task | P0 original valid results, three repetitions | P1 original valid results, three repetitions |
|---|---|---|
| kv-store-grpc | 1 / 1 / 1 | 1 / 1 / 1 |
| break-filter-js-from-html | 1 / 1 / 1 | 1 / 1 / 1 |
| feal-linear-cryptanalysis | 0 / 0 / 0 | 0 / 0 / 0 |
| polyglot-rust-c | 1 / 0 / 1 | invalid / 1 / 1 |

| Condition | Valid | Pass | Invalid | Valid-trajectory token median | Normal | Input-reservation stops |
|---|---:|---:|---:|---:|---:|---:|
| P0 | 12 | 8 | 0 | 104806.5 | 0 | 12 |
| P1 | 11 | 8 | 1 | 109110 | 0 | 11 |

Block outcomes: seven both-pass, three both-fail, one invalid and one P1-only pass. Adjacent independent samples are not counterfactual versions of the same random trajectory.

## Current interpretation

This diagnostic did not produce stable, cross-task evidence of P1 improvement, nor did it establish equivalence. Of 11 valid adjacent pairs, seven both passed and three both failed; only Rust repeat two passed under P1 and failed under P0. The remaining Rust pair had a P1 usage-unknown invalid trajectory. The unequal denominators 8/11 and 8/12 are not clear evidence of benefit.

More importantly, actual behavioral separation was weak. P0 called neither checkpoint nor status; P1 voluntarily saved one checkpoint. P0 made two additional Message reads and one board read; P1 made two board reads and one checkpoint. Equal tool counts do not mean equal costs, but the observations contradict a story in which the old condition generally spent its time bookkeeping and regained ability when that bookkeeping was removed. P1 also repeatedly observed Git, inspected the environment and verified its work. Tool descriptions and the first Task read remained, so this is not a rejection of every workflow constraint.

All 23 valid trajectories ended at the frozen input-reservation gate; none ended naturally. Admission used a conservative next-input estimate and output reservation. Usage below 120K does not mean insufficient global authorization or exact exhaustion of 120K. Global balance never reduced a trajectory budget. Valid P1 median usage was 109110 versus 104806.5 for P0; this small sample cannot establish general savings or extra cost.

## Delivery observations worth retaining

- **Rust is not a stable old-prompt failure.** Formal v1 A1 did not deliver; the same P0 prompt passed 2/3 here. Repeat-two P0 wrote code but Rust compilation failed (L1103–1104), rather than metadata calls leaving no opportunity to write code. Neither passing P1 trajectory compiled its final file in the worker; official grading later confirmed success. Repeat-three first implementation occurred at 56917 tokens for P0 versus 95236 for P1. P1 was not always earlier.
- **HTML passed 3/3 in both conditions.** P1 wrote its target earlier in repeats two and three, but had no clear token advantage in repeat one. Repeat-three P1 voluntarily checkpointed after verification (L2447); P0 said it would checkpoint but the next request was blocked by budget. That statement is not a call. A public-test path issue led some workers to copy the public filter into /tests. The hidden grader was absent then, and provenance review did not observe acquisition of hidden answers.
- **gRPC passed 3/3 in both conditions.** Extra work commonly involved examining /proc when ps/ss/netstat were missing, restarting a self-written server, resolving protoc output names and adding imports. P1 did this too. Such work is distinct from Project bookkeeping. Official grading verified live service behavior after the Agent runtime exited; all seven tests passed.
- **FEAL failed 0/3 in both conditions, by different paths.** Some trajectories stopped during investigation, some wrote an attack/solver without executing it, and another failed its inverse-function self-test after execution (P0 repeat two, L1027–1028). These cannot all be described as inability to solve the problem or missing task delivery.
- **FEAL P1 repeat three produced an intermediate result but omitted final delivery.** L2817–2818 executed its solver and produced recovered_key.txt. After collection, the key, public pairs and feal.c were copied read-only from the stopped container. An independent JavaScript implementation following the original C semantics matched 32/32 known samples (`collection/posthoc-key-check/result.json`). This supports finding a key consistent with public samples, not the unique hidden key. Official tests executed and failed because /app/plaintexts.txt was absent. No file was supplied afterward, no worker was rerun and no reward was changed. The check does not convert zero into a partial score.

## Adapter and infrastructure checks

The offline postmortem did not find a task omission, model/reasoning mismatch or builtin-tool schema mismatch sufficient to block this ablation; it was not proof of no bugs. Every actual first request matched the expected startup prompt, common Pi system, 11 tools and model/MAX settings. The first tool was read_task and the full original task entered request two. Runtime PID exit before grading, CPU/RAM/image and initial visibility were checked. All 87 source/config/task hashes matched; original formal v1 trace/source and Threshold core remained unchanged.

Rust P1 repeat one's second request ran for approximately 300 seconds, then returned `Stream ended without finish_reason` without provider usage. This aligns in time with the frozen 300-second limit, but the underlying abort cause was not retained. It cannot be attributed confidently to the local network, provider or model. It remains usage_unknown invalid, without an automatic rerun. Official raw reward=0 is retained but excluded from valid scores. Accounting conservatively reserved 127661 total and 111889 output tokens separately; these are not known actual consumption.

An inherited **logging classification defect** was found: relay `record(kind,data)` allowed `data.kind` to replace the event kind; usage settlement subsequently changed stream_interrupted into usage_unknown. Filtering solely for kind=stream_failure therefore misses interruptions. Raw trace remains and budget reservation/invalid handling held. The defect was not patched during collection. It is an observability issue for later work; current evidence does not show that it changed A0/A1 input or execution semantics.

Ordinary environment limitations included nproc showing 24 although CPU quota was one, no Python3 in the Rust worker and no pytest in the HTML worker. These affected worker verification choices; official grading has separate execution evidence. All 24 graders were valid; trajectory validity separately excludes the usage-unknown case.

## Where this diagnostic stopped

The product's default workflow was retained. P1 was not promoted into core and these 24 trajectories were not merged into formal v1. This experiment examined one group of post-orientation startup instructions, not independent task-delivery, tool-schema/retained-context or optional-read_task effects.

Task delivery remained a candidate for a separate study: offline inspection confirmed that A0 received the full task in its first request while A1 received it in request two. This was an unexplained difference, not a confirmed cause. The logging defect and its recording policy should be handled before freezing a separate contrast. Removing read_task, the tool set and history together would again prevent attribution. No additional condition or paid rerun was started in this diagnostic.

## Metadata operations: counts, not independent cost

| Condition | read_task | read_messages | board | checkpoint | status |
|---|---:|---:|---:|---:|---:|
| P0 | 12 | 2 | 1 | 0 | 0 |
| P1 | 12 | 0 | 2 | 1 | 0 |

Known input was 2016464, output 387866, total 2404330 tokens across 191 requests. Unknown reserves were 127661 total and 111889 output tokens. New batch authorization was 12M total / 4M output / 2400 requests; per-trajectory ceilings were not reduced based on global balance.

## Trajectory and delivery index

Delivery-related actions below are identifiable implementation-file creation/execution, not proof of meeting the final requirement. A FEAL attack.c is not plaintexts.txt. Read each audit.evidence entry. Temporary probes and environment installation do not count as implementation. Time and cumulative usage are measured when the tool is issued, including the complete response that generated the call. Full arguments, returns, per-request usage and final responses are in observer.json. All line numbers refer to this study's collection/trace.jsonl.

| Task | Arm/repeat | ID | Tokens | Stop | First delivery-related implementation trace line | First delivery verification trace line |
|---|---|---|---:|---|---:|---:|
| kv-store-grpc | P0/1 | cc6904664ff63c1e3ac5 | 103775 | input_reservation_stop | 50 | 109 |
| kv-store-grpc | P1/1 | df41e41d9d7565728006 | 98483 | input_reservation_stop | 219 | not observed |
| break-filter-js-from-html | P1/1 | d0fe0afae86e782a85f7 | 94098 | input_reservation_stop | 399 | 399 |
| break-filter-js-from-html | P0/1 | 74a8d68fa008e8ac539c | 93402 | input_reservation_stop | 509 | not observed |
| feal-linear-cryptanalysis | P0/1 | 3c77a054469a1ca1386f | 116785 | input_reservation_stop | not observed | not observed |
| feal-linear-cryptanalysis | P1/1 | 88c7bb268b9cc3e1bd1a | 89926 | input_reservation_stop | 715 | not observed |
| polyglot-rust-c | P1/1 | 0ac137f385de088831b4 | 2512 | usage_unknown | not observed | not observed |
| polyglot-rust-c | P0/1 | 588c2a9fcbe111c160a7 | 105105 | input_reservation_stop | 829 | 840 |
| feal-linear-cryptanalysis | P1/2 | 85f523694a0033ac6a4e | 113139 | input_reservation_stop | 939 | not observed |
| feal-linear-cryptanalysis | P0/2 | 33d7cad41a8badc03e3f | 93003 | input_reservation_stop | 1016 | 1027 |
| polyglot-rust-c | P0/2 | 8368c92db9e491710b9d | 108342 | input_reservation_stop | 1092 | 1103 |
| polyglot-rust-c | P1/2 | b7fc7b1ec4be1b7e3ff3 | 111064 | input_reservation_stop | 1172 | not observed |
| break-filter-js-from-html | P0/2 | 65c8a964eb326fbfa53e | 110842 | input_reservation_stop | 1286 | 1297 |
| break-filter-js-from-html | P1/2 | c5661afcf260a121f6ea | 111212 | input_reservation_stop | 1396 | 1429 |
| kv-store-grpc | P1/2 | 0c064c51b7cffb3920e2 | 109110 | input_reservation_stop | 1531 | 1612 |
| kv-store-grpc | P0/2 | a8ea095e28b4991fb0d3 | 104508 | input_reservation_stop | 1703 | 1762 |
| kv-store-grpc | P0/3 | ab77fa1f2753156c963a | 108025 | input_reservation_stop | 1879 | 1956 |
| kv-store-grpc | P1/3 | 74404761db6983926bd7 | 104092 | input_reservation_stop | 2036 | 2080 |
| polyglot-rust-c | P1/3 | 1bc5385959ef4e17b65f | 95236 | input_reservation_stop | 2201 | not observed |
| polyglot-rust-c | P0/3 | 0b25a2de38bb1679e2d8 | 109281 | input_reservation_stop | 2270 | 2281 |
| break-filter-js-from-html | P1/3 | 9184be5de3063e080045 | 109453 | input_reservation_stop | 2380 | 2391 |
| break-filter-js-from-html | P0/3 | 9752729ba79dbd10dcb6 | 102610 | input_reservation_stop | 2560 | 2597 |
| feal-linear-cryptanalysis | P0/3 | 3dcdeacae190dfd7b212 | 94738 | input_reservation_stop | 2707 | not observed |
| feal-linear-cryptanalysis | P1/3 | 706713ce1987ff8c1980 | 115589 | input_reservation_stop | 2806 | 2817 |

Additional delivery timing: cumulative tokens include the whole response generating the action; seconds start at the first request and are not pure model time.

| Task | Arm/repeat | First implementation: request / tokens / seconds | First verification: request / tokens / seconds |
|---|---|---|---|
| kv-store-grpc | P0/1 | R4 / 18201 / 23.8 | R9 / 65971 / 35.3 |
| kv-store-grpc | P1/1 | R4 / 22102 / 33.6 | not observed |
| break-filter-js-from-html | P1/1 | R8 / 94098 / 56.2 | R8 / 94098 / 56.2 |
| break-filter-js-from-html | P0/1 | R7 / 93402 / 102.7 | not observed |
| feal-linear-cryptanalysis | P0/1 | not observed | not observed |
| feal-linear-cryptanalysis | P1/1 | R6 / 89926 / 96.2 | not observed |
| polyglot-rust-c | P1/1 | not observed | not observed |
| polyglot-rust-c | P0/1 | R5 / 77094 / 105.2 | R6 / 105105 / 107.6 |
| feal-linear-cryptanalysis | P1/2 | R6 / 113139 / 102.9 | not observed |
| feal-linear-cryptanalysis | P0/2 | R4 / 61598 / 91.2 | R5 / 93003 / 92.0 |
| polyglot-rust-c | P0/2 | R4 / 80327 / 99.7 | R5 / 108342 / 101.1 |
| polyglot-rust-c | P1/2 | R4 / 111064 / 144.9 | not observed |
| break-filter-js-from-html | P0/2 | R7 / 88718 / 73.8 | R8 / 110842 / 76.4 |
| break-filter-js-from-html | P1/2 | R6 / 48091 / 30.7 | R9 / 84354 / 33.9 |
| kv-store-grpc | P1/2 | R5 / 21629 / 19.6 | R12 / 84757 / 33.6 |
| kv-store-grpc | P0/2 | R4 / 17799 / 19.0 | R9 / 56653 / 28.5 |
| kv-store-grpc | P0/3 | R4 / 20554 / 24.8 | R11 / 94141 / 43.2 |
| kv-store-grpc | P1/3 | R4 / 17260 / 18.1 | R8 / 52009 / 30.9 |
| polyglot-rust-c | P1/3 | R4 / 95236 / 127.2 | not observed |
| polyglot-rust-c | P0/3 | R4 / 56917 / 96.2 | R5 / 82860 / 97.2 |
| break-filter-js-from-html | P1/3 | R5 / 33987 / 23.2 | R6 / 44726 / 25.6 |
| break-filter-js-from-html | P0/3 | R7 / 52144 / 29.7 | R10 / 89376 / 33.3 |
| feal-linear-cryptanalysis | P0/3 | R6 / 94738 / 85.3 | not observed |
| feal-linear-cryptanalysis | P1/3 | R6 / 91209 / 75.7 | R7 / 115589 / 76.8 |

Metadata counts cover all 24 started trajectories, including the invalid one. Scores and token medians cover only valid trajectories. Failed compilation/self-tests count as verification attempts; consult each audit for outcomes. Absence of worker verification does not imply official task failure.

## Interpretation boundaries

- Four tasks were chosen after seeing v1 outcomes. Small sample, one model and no fixed provider sampling seed: no inference about general benchmark benefit or closeness to native Pi.
- P1 relaxes only a group of startup requirements. Tool descriptions and initial Task reading still guide behavior; this is not a no-policy condition.
- Read pass rates, metadata-call counts and delivery timing together. One fewer tool read need not be faster; an extra read need not cause failure.
- Conservative estimates, repeated reasoning input, network/cache/time ordering and effective budget utilization remain limitations. Original errors and grading invalidity are retained.
- Provenance review covers recorded inputs/returns, not strong isolation or comprehensive file-access monitoring.
- These results do not authorize changing the product default prompt or starting the next ablation.

## Evidence

Manifest SHA-256: `f429f38def8df9da20c77937bd98f75d0c7eb03d4a41efd409f1840e4cb8535b`.

Publication root: `../../evidence/post-orientation-diagnostic/`. plan.json, policies.json and release-manifest.json preserve frozen conditions; postmortem contains the read-only breakdown of earlier data. collection/trace.jsonl, per-cell result/raw graders, integrity-audit, observer.json, results.json and final-check.json retain checks. Experiment source and execution notes are in frozen-source/integration-diagnostic-v1. All containers were stopped and retained; formal v1 trace/source hashes were rechecked unchanged and core was not modified.
