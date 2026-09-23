# Formal v1 high-budget: results note

A new results note assembled 2026-09-23 from completed collection and the separately preserved audit overlay. It does not overwrite a historical report. Faithful counterpart of [the Chinese note](results.zh.md).

One sample per task/condition; 12 tasks, 36 trajectories. A0/A1/B1 each passed 10/12, n=12; every grader was valid. Read failure identities alongside totals:

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


| Condition | Pass / valid (n) | Normal | Deadline | Input | Output | Total tokens | Requests | Replacements |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A0 | 10/12, n=12 | 11 | 1 | 10443662 | 490221 | 10933883 | 262 | 0 |
| A1 | 10/12, n=12 | 10 | 2 | 11879706 | 508859 | 12388565 | 316 | 0 |
| B1 | 10/12, n=12 | 11 | 1 | 9368429 | 691035 | 10059464 | 360 | 12 |


B=20M; R independently fixed at 60k, retaining the >= comparison and first eligible completed tool-batch boundary, with normal completion taking precedence. The 80-request cap, original task deadlines, startup and delivery are retained; A1/B1 are independent trajectories, not shared-prefix forks. All 12 B1 replacements occurred; realized R was 60,624–97,365.

Total usage: 33,381,912 tokens / 938 requests. Thirty-two normal completions, four deadlines; no token/request/authorization gate termination. Equal totals are not equal failures, equivalence or free replacement. Original v1 remains intact; historical differences are not attributed entirely to budget.

Full methods, exceptions, scope and evidence: [original Chinese audit](integrity.zh.md), [English audit](integrity.en.md), [synthesis](../../REPORT.en.md), [per-trajectory data](../../tables/high-budget-trajectories.json).
