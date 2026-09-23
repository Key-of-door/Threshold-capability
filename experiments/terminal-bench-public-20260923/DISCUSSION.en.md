# Threshold × Terminal-Bench: tight budgets, fresh workers, and what survived replication

We tested native Pi (A0), Threshold with a continuing worker (A1), and Threshold with one early fresh-worker replacement (B1). The high-budget collection passed **10/12 in each condition, n=12 per condition**. Each task/condition was sampled once; these are independent trajectories, not shared-prefix forks or evidence of statistical equivalence.

The failures matter as much as the totals:

| Task (12 tasks; one trajectory per cell) | A0 (n=12) | A1 (n=12) | B1 (n=12) |
| --- | --- | --- | --- |
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

1 = official pass; 0 = valid failure. All 36 graders valid. Equal totals do not mean identical failures.


The archive also retains the less flattering original experiment. With a 120k cumulative input+output ceiling and conservative request reservation, valid passes were A0 4/9, A1 2/10 and B1 1/10. Six setup-invalid slots and one invalid grader remain explicit. We investigated integration and startup workflow rather than deleting those results.

A post-orientation prompt diagnostic did not establish stable improvement. It exposed active budget censoring, including a FEAL intermediate result that never got a subsequent inference opportunity for final delivery. A separate direct-task orientation diagnostic then had 23/23 valid passes from 24 planned trajectories, with one transport-invalid case. Different delivery and timing mean this is not a causal budget comparison.

We returned to the original A0/A1/B1 structure, raised the safety ceiling to 20M, and fixed replacement at the old nominal 60k rather than letting it drift to 10M. The original 80-request cap and task deadlines remained. All 12 B1 replacements occurred; actual triggers were 60,624–97,365. No token/request/authorization gate stopped this collection; 32 trajectories completed normally and four hit their deadline.

The final audit reviewed 1,095 tool-call sequences and mechanically checked 938 provider requests. All 36 graders were valid; no prohibited-input contamination was observed within recorded scope. This is a cooperative execution boundary, not proof of secure isolation or absence of pretraining contamination. The text-only image limitation and failed visual tasks remain in the results.

We are publishing the sequence as an inspectable archive, not a victory story: Chinese originals, English translations, frozen/as-run scripts, traces, raw graders, task-level tables, audits and a machine-readable redaction ledger. Offline scripts recompute results without model calls. Fresh-machine model reruns still require environment preparation and cannot promise identical outcomes.

**Read and inspect:** [Bilingual reports and task-level evidence index](https://github.com/Key-of-door/Threshold-capability/tree/terminal-bench-archive-2026-09-v1/experiments/terminal-bench-public-20260923)  
**Complete evidence download + SHA-256:** [Release and checksums](https://github.com/Key-of-door/Threshold-capability/releases/tag/terminal-bench-archive-2026-09-v1) · [ZIP](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip) · [SHA-256](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.sha256)

Questions and criticism are welcome. In particular: are the validity distinctions, replacement boundary and evidence provenance clear enough to check without trusting our interpretation?
