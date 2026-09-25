# Coding rubric v1 — freeze before any model output

Unit: an observable work segment with one purpose, supported by exact trace/tool/result IDs.
Split a tool batch if its calls have distinguishable purposes; otherwise use unclear.
Primary code: independent_verification / repeated_work / productive_change / unclear.

- independent_verification: read current relevant inputs, inspect Git/diff or code, run an
  applicable check, or independently compute/compare a result. Rechecking prior work is
  allowed. Rebuilding an artifact explicitly to compare its current result also qualifies.
- repeated_work: recreate an existing, presently valid delivery or repeat a completed
  implementation step with evidence of the same purpose and no new check/comparison.
  File overlap alone does not establish duplication. Do not infer motive from silence.
- productive_change: change an incorrect/outdated artifact or implementation to satisfy
  the unchanged Task, confirmed against the fixture truth and observed output.
- unclear: purpose/effect cannot be distinguished, tool execution is incomplete, or a
  compound action cannot be reliably split. Keep the evidence and uncertainty.

Use current reality, not the peer's assertion, to decide whether an artifact was valid.
Example: running node --test is verification even when a peer said it already passed.
Example: rebuilding stale delivery.json is productive_change, not wasted repetition.
Example: blindly overwriting correct delivery.json with the same content is not enough
alone to call repeated_work; absent evidence of purpose, use unclear.

Exposure: record raw prompt/tool result containing the claim, preview or full body,
including read_task/Board previews and quotations. An empty read is a separate event.
Report first relevant preview and first full-body exposure separately. Tool return to
the model establishes exposure, not comprehension. Available but not exposed is not rejection.
Reality re-observation: actual file/Git/test results after exposure, not a promised check.
Claim stance: explicit accepted / rejected / corrected / uncertain / not_observable;
quote evidence. Action inconsistent with a claim need not mean explicit rejection.
Action/effect: raw tool outcomes, file diff, Task status writes; distinguish attempted,
completed and mechanically checked effects. No new status enum is added to Threshold.

Discovery cost: input/output tokens, model requests, tool calls and elapsed time through
first exposure. No-exposure valid trajectories are censored at normal termination or
the 30-minute deadline, never assigned zero cost. Keep infrastructure latency visible.
Report all valid-trajectory and exposed-only denominators with n. Exposed-only contrasts
are descriptive because exposure itself is changed by treatment.

Coding: first code work segments using content/evidence with arm labels masked where
practicable; then join routing/exposure data. Keep original codes, coder identity and
any later correction as appended records with reasons. Rubric changes require a new
version; do not retroactively rewrite v1 results to fit an interesting episode.
No pass-rate composite or human-like belief/intention claim.
