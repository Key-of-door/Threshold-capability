# Task inbox targeting pilot — frozen-rubric analysis v1

Analysis: 26 September 2026 (UTC+09). **12 pairs, 24 trajectories; four constructed fixtures, three paired repetitions each.** All 24 were valid and ended normally. No infrastructure retry, unknown usage or budget denial occurred. This is a descriptive, single-model pilot, not a general benchmark or safety guarantee.

**The clearest finding is greater claim visibility under the existing workflow. This pilot does not establish less repeated work, lower total cost or better task completion.** Full claims entered actual model inputs in treatment 12/12 versus baseline 1/12 (n=12 each). All 13 exposed trajectories subsequently checked current reality. Both arms ended with correct artifacts.

## The 12 pairs first

Baseline stored the message in the source Task inbox; treatment stored the identical body in the target Task inbox. Tokens are cumulative provider prompt plus completion, including cached input; reasoning tokens are not added twice. Tool calls are not work segments. Final reality is paid_count / total_cents.

| Pair / case (n=3 pairs per case) | Baseline exposure | Treatment exposure | Total tokens B / T | Tool calls B / T | Final artifact |
|---|---|---|---:|---:|---|
| C1-R1 · Correct claim | Full / Board | Full / inbox | 56,371 / 42,034 | 13 / 13 | Both 3 / 4900 |
| C4-R2 · Conflicting claims | Not exposed (censored) | Full / inbox | 41,846 / 32,905 | 12 / 12 | Both 3 / 4900 |
| C2-R3 · False claim | Not exposed (censored) | Full / inbox | 34,785 / 43,164 | 12 / 13 | Both 3 / 4900 |
| C1-R3 · Correct claim | Not exposed (censored) | Full / inbox | 40,472 / 41,559 | 11 / 12 | Both 3 / 4900 |
| C3-R1 · Stale claim | Not exposed (censored) | Full / inbox | 43,433 / 69,849 | 11 / 16 | Both 3 / 4900 |
| C3-R2 · Stale claim | Not exposed (censored) | Full / inbox | 52,455 / 35,068 | 13 / 12 | Both 3 / 4900 |
| C2-R1 · False claim | Not exposed (censored) | Full / inbox | 39,201 / 57,254 | 11 / 14 | Both 3 / 4900 |
| C4-R1 · Conflicting claims | Not exposed (censored) | Full / inbox | 50,313 / 57,412 | 13 / 15 | Both 3 / 4900 |
| C2-R2 · False claim | Not exposed (censored) | Full / inbox | 45,694 / 50,261 | 12 / 14 | Both 3 / 4900 |
| C3-R3 · Stale claim | Not exposed (censored) | Full / inbox | 42,637 / 68,814 | 11 / 16 | Both 3 / 4900 |
| C4-R3 · Conflicting claims | Not exposed (censored) | Full / inbox | 27,746 / 46,529 | 10 / 12 | Both 3 / 4900 |
| C1-R2 · Correct claim | Not exposed (censored) | Full / inbox | 46,916 / 43,877 | 14 / 13 | Both 3 / 4900 |

All six initially correct artifacts remained correct; all 18 incorrect/outdated artifacts were repaired. Across all 24 trajectories, orders.json, REQUIREMENTS.md, build.mjs and delivery.test.mjs retained their initial hashes. Success was not inferred from self-report or a passing test alone, nor obtained by changing inputs or tests.

## 1. Availability, actual exposure and subsequent observation

| Observation | Baseline (n=12) | Treatment (n=12) |
|---|---:|---:|
| Claim available in Project | 12/12 | 12/12 |
| Full claim in actual model request | 1/12 | 12/12 |
| Reality check after exposure | 1/12 overall; 1/1 exposed | 12/12 overall and exposed |
| Explicit empty current-inbox poll | 2/12 | 0/12 |
| Not exposed at normal termination | 11/12, censored | 0/12 |
| New corrective Message written | 0/12 | 6/12 |

In 11/12 pairs only treatment was exposed; in 1/12 both were exposed; in 0/12 only baseline was exposed. The sole baseline discovery, C1-R1, used read_project_board. Board previews are capped, but these claims were shorter than 500 characters, so its preview contained the complete body. There were no preview-only cases. Exposure was also checked in subsequent actual provider request content, not just a displayed tool result.

The two baseline empty polls were [C4-R2/T04 event 224](../evidence/T04.md#event-224) and [C2-R3/T12 event 344](../evidence/T12.md#event-344). Both checked the current inbox and got nothing, without later finding the source Task through Board. The other 9/12 baseline trajectories made no explicit Message/Board read. These behaviors should not be collapsed into one category.

**Mechanism and limit:** identical native orientation in both arms explicitly said to read_messages if the current inbox contained messages. Targeting changed the inbox count returned by read_task, triggering that existing conditional instruction. This supports routing plus the existing reading convention, not spontaneous emergence of a communication protocol. The instruction was not separately ablated.

## 2. Discovery cost: do not count non-discovery as zero

Costs stop at the first tool result containing the claim: prior completed requests, started tools and elapsed time from turn_start. They exclude the next inference request that actually contains the claim. That request's index and original hash are recorded separately. Wall time includes provider/network/tool delays.

| Cost to first exposure | Baseline exposed (n=1) | Treatment exposed (n=12, median) |
|---|---:|---:|
| Prompt tokens | 14,544 | 6,105.5 |
| Completion tokens | 678 | 147.5 |
| Total tokens | 15,222 | 6,256.5 |
| Completed requests | 4 | 2 |
| Started tools | 9 | 3 |
| Seconds | 7.311 | 2.697 |

All 12 treatment trajectories received the full claim in request 3; the baseline discoverer did so in request 5. The other 11 baseline observations are right-censored at their own normal termination, with full costs retained. They are not zero-cost discoveries. Because exposure is affected by treatment, this exposed-only 1-versus-12 comparison cannot support a population-wide percentage efficiency gain.

## 3. Exposure → reality → stated stance → action

All 12 treatment workers checked current files/code and applicable results after exposure. The sole exposed baseline also checked reality afterwards; it had already read inputs before exposure, so not all checking can be attributed to the message.

| Case (n=3 per arm) | Baseline | Treatment |
|---|---|---|
| Correct | 1/3 exposed and explicitly accepted; 2/3 unexposed | 3/3 exposed and checked; 2/3 explicitly accepted, 1/3 not_observable |
| False | 0/3 exposed; 3/3 still repaired artifact | 3/3 explicitly corrected claim and repaired artifact |
| Stale | 0/3 exposed; 3/3 still repaired artifact | 3/3 identified current staleness and repaired artifact |
| Conflicting | 0/3 exposed; 3/3 still repaired artifact | 3/3 distinguished wrong 2/4200 from correct 3/4900 using files |

C1-R1 treatment referred to independent checking of the inbox claim, but did not explicitly say it accepted the claim. It is conservatively coded not_observable, rather than inferred acceptance from matching results. Non-exposure is not rejection.

All 9/9 treatment trajectories with false/outdated claims corrected their current numeric interpretation; in conflicting fixtures the correct claim was explicitly accepted in 3/3. No observed blind adoption is not proof that narrative cannot acquire undue weight: these were tiny directly checkable tasks, with existing instructions to check claims, not authority pressure or long-running ambiguous evidence.

Corrective messages were successfully written in 6/9 false/stale/conflicting treatments (6/12 overall): false 3/3, stale 1/3, conflicting 2/3. No subsequent recipient worker was launched. This demonstrates a write, not uptake, understanding or benefit. Most corrections stayed in the current target inbox; a cross-Task return-and-read loop was not demonstrated.

## 4. Work coding and full costs

Work purposes were reviewed first with arm/case labels masked where practicable, then joined with routing. The coder knew the design and some earlier fragments, and content could reveal condition. **This was one Codex coder, not strict blind independent assessment.** No inter-rater reliability estimate exists.

A work segment has a distinguishable purpose. Compound commands can split into repair and verification. Orientation/discovery, Message/checkpoint/status writes and commit metadata are separately retained administrative work. A command following a failed commit with && was not counted as executed.

| Code | Baseline (114 segments, n=12 trajectories) | Treatment (117 segments, n=12) |
|---|---:|---:|
| independent_verification | 104 | 108 |
| productive_change | 9 | 9 |
| repeated_work | 0 | 0 |
| unclear | 1 | 0 |

Each arm had necessary repairs in 9/12 and already-correct delivery in 3/12. Rebuilding to test/compare/hash was verification under the frozen rubric, not automatically wasted repetition. A second build in [C4-R1 baseline/T01 event 3158](../evidence/T01.md#event-3158) remained unclear: comparison purpose was ambiguous at that point, despite a later checkpoint claiming an idempotence check. File overlap alone does not prove motive.

Both arms had 0/12 trajectories with clearly coded repeated_work, so there was no observed difference supporting a reduction. The generator was already correct in every fixture, limiting opportunities for repeated implementation. Whether verification was excessive is a separate question from the frozen repeated_work definition.

| Full resource use (n=12 each) | Baseline | Treatment |
|---|---:|---:|
| Total tokens | 521,869 | 588,726 |
| Mean tokens / trajectory | 43,489.1 | 49,060.5 |
| Total requests | 96 | 102 |
| Total tools | 143 | 162 |
| Mean wall seconds / trajectory | 18.951 | 21.390 |

Across 12 pairs, mean treatment minus baseline was +5,571.4 tokens, +0.5 requests, +1.583 tools and +2.439 seconds; median paired token difference was +5,833. Treatment used about 12.8% more total tokens. Reading/correcting messages, extra checking and some autonomous commit friction all contributed to observed trajectories. This is not a decomposition identifying one causal action, and greater discovery is not itself an efficiency result.

## 5. A correction that gets the history wrong

C3-R1 treatment/T13 correctly noticed added order o5, repaired 2/4200 to 3/4900 and passed tests. Its successful corrective message nevertheless said:

> Correction to message 1: delivery.json was stale at the time of that claim.

[Event 4901](../evidence/T13.md#event-4901); successful write: event 4903.

The frozen chronology says the opposite: at 00:01:00 the claim was true for the cited old commit; at 00:01:30 the new input made it stale. The same correction later described the added commit as coming after the old one, producing inconsistent historical narration.

**Supported:** correct current repair and one successfully written correction with an incorrect historical assertion.

**Not established:** a stable internal belief, downstream propagation, or a targeting-induced increase in such errors. There was no recipient continuation.

A weaker case, C2-R3 treatment, guessed that an already-false claim was “likely based on an older input” ([T24 event 3170](../evidence/T24.md#event-3170)). The fixture does not support that backstory. Its qualified guess is kept distinct from the definite false assertion above.

## 6. Boundaries and audit materials

- Supported: greater actual claim visibility in this fixed workflow, 12/12 vs 1/12 (n=12 each).
- Supported: all 13 exposed trajectories subsequently checked reality; all 9/9 treatments containing wrong/outdated claims repaired current numbers.
- Not established: less repeated work, lower total cost, higher completion, or long-term resistance to narrative fixation.
- Keep current action correctness separate from historical narration correctness.

These are four fixtures repeated three times, not twelve independent engineering tasks. Source Runs/claims were researcher-authored synthetic history, explicitly labeled fixture/researcher-authored. All sources had ended; targets were fresh. Later target-to-target handoff was not separately tested. The provider returned deepseek-flash, an alias rather than immutable weights. Pi 0.85.1/service used pinned Node 24.21.0; task-shell Node was 24.18.0, while post-run mechanical checks used 24.21.0. Commit identity errors occurred in baseline 1/12 and treatment 3/12 and were preserved as ordinary task friction. CRLF warnings and shared host temporary storage remain limitations; paths are not OS isolation.

Every trajectory used approximately 28K–70K tokens, far below the 20M ceiling; none compacted. This was not a long-context/budget stress test. No outcome-driven task addition, model switch, favorable rerun or rubric revision was made.

See [per-trajectory coding](trajectory-evidence.md), [summary JSON](summary.json), [pair table](pairs.tsv) and the [downloadable archive](https://github.com/Key-of-door/Threshold-capability/releases/tag/task-targeting-pilot-2026-09-v1). The archive includes protocol, fixture Git bundles, exact frozen source, inference/tool traces, original-hash mappings, field-level redactions and an offline verifier. Private reasoning text was explicitly excluded from publication and was not used for stance coding. Public event chains are new derivative chains retaining original hashes; they are not the untouched private bytes or external timestamp attestations.
