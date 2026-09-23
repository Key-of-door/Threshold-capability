# Claims and evidence boundaries

All claims refer to these recorded experiments, not Terminal-Bench as a whole. `n` means trajectories unless stated otherwise. Repeated diagnostic trajectories are not independent task IDs.

| Claim | Evidence | Allowed wording | Forbidden stronger wording |
| --- | --- | --- | --- |
| High-budget outcomes | tables/A-main-result.md; tables/B-task-outcomes.md; 36 per-cell results + integrity overlay | Each condition passed 10/12, n=12, in this one collection | Threshold and Pi are statistically equivalent; Threshold wins |
| Failure identities | Full 12×3 table; official raw graders | Same totals, different task-level failures | Identical behavior or identical error modes |
| Replacement timing | tables/replacements.json; raw replace/boundary/usage/runtime events | All 12 B1 workers were replaced at the first eligible completed batch after >=60k; actual triggers 60,624–97,365 | Replacement happened exactly at 60k or at identical prefixes across studies |
| Fresh input | 48 recorded generation-first requests; 12 B1 input pairs; audit machine checks | Fresh first requests contained no old assistant/tool conversation | The successor had no information from the predecessor; provider state was erased |
| Persistent task environment | gRPC B1 trace L11054, L11112–11197; official grader | Application state persisted while old Pi control runtime exited | Arbitrary crash recovery or hostile-process isolation is proven |
| Replacement outcome | B1 10/12; successor usage/deadline/request data | Fresh workers completed ten tasks under these conditions | Replacement is free; all successor usage is reconstruction overhead |
| Lost old-worker observation opportunity | High-budget audit: 13 terminal-batch results, versus four deadline results | Some tool effects persisted without another old-generation inference receiving their results | No record of any kind could describe the effects; the successor could only use files |
| Original budget gate | Original meter and 25 reservation stops; P all 23 valid trajectories reservation-stopped | The gate actively censored these trajectories under the frozen admission policy | Every old failure was caused solely by budget |
| FEAL P1 r3 intermediate result | Trace L2817–2818; posthoc-key-check; missing plaintext grader failure | A key matching 32 public samples existed, while the required plaintext file was absent | It recovered the unique hidden key; the task should count as a pass |
| P0/P1 | P report and four tasks × three repetitions per arm | No stable cross-task P1 improvement was established in this diagnostic | System prompts have no effect; mandatory orientation was removed here |
| Q0/Q1 | Q report, 24 planned / 23 valid / 23 valid passes | Under direct task delivery and ample budget, no delivery-failure difference was observed | Orientation is universally harmless or useless; Q proves budget caused the old gap |
| Integrity | Audit coverage, candidate classifications, grader-file checks | no_contamination_observed within recorded input/tool-return scope | Proven absence of all contamination, adversarial sandboxing or pretraining leakage |
| Historical comparison | Mechanically selected common-valid task intersection; tables/C | Descriptive historical counts with explicit coverage | A randomized causal estimate of the budget effect |
| Image limitation | Nine recorded image reads and fixed omission transformation | The frozen provider configuration was text-only; failures remain in the denominator | Visual tasks are excluded after seeing results |
| Usage | Provider usage reconciled with meters and ledger | Known cumulative input+output; caching included; unknown reserves separate | Unique reasoning length; invoice cost; low measured use justifies reducing frozen allowances |
| Publication integrity | source-inventory.json, redactions.jsonl, manifests, offline checks | Originals retained; published substitutions documented and mechanically replay-checked locally | Hashes alone prove semantic fidelity or a scanner guarantees no sensitive content anywhere |
| Reproduction | REPRODUCTION.md; archived scripts/config/tasks; offline verification | Readers can recompute reported statistics and audit recorded boundaries offline | A one-command portable rerun is verified; the same alias guarantees identical future outcomes |

## Method ownership

The same assistant assembled the archive, translated reports and performed the recorded publication checks. The prior high-budget audit explicitly identifies a single Codex primary reviewer. These are not independent third-party certifications.
