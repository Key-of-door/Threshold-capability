# Validity and retry rules v1

One arm = one target trajectory. Every attempt gets its own directory and start/end
records. Never reuse a changed workspace or resume a failed conversation for a retry.
Maximum: one whole-trajectory retry per arm, four extra attempts across the pilot.
Original invalid attempts remain linked to their retries and visible in the report.

Pi's frozen native agent retry: enabled, maxRetries=3, baseDelayMs=2000. Provider/SDK
retry maxRetries=0. Record every recovered transient event and its request/usage;
recovered attempts are valid_with_recovered_infrastructure, not silently pristine.
This native within-trajectory retry does not consume a whole-trajectory retry slot.
All calls still consume that trajectory's time/token budget. No additional operator
retry or hidden provider fallback. Provider-internal behavior is not fully observable.

Infrastructure invalid: unexpected runtime exit, forced teardown unrelated to the
predeclared deadline, unrecovered DNS/connect/TLS/429/5xx error, bad auth/configuration,
missing required trace/usage, or unknown write outcome that prevents a reliable trace.
Do not classify solely by a generic 'request failed' string: retain underlying error
evidence, otherwise use pending_classification and stop the pair. Record whether a
model response/tool effect had already happened. A final correct artifact cannot
erase an invalid trajectory. For configuration errors, pause the experiment until
preflight is repaired; if a frozen parameter changes, make a new protocol revision.

Valid task outcome: failed task assertions, wrong answer, mistaken belief, ordinary
tool misuse/error, refusal, unfinished work or failure to discover messages. A valid
deadline-limited or budget-limited trajectory is censored, not infrastructure invalid
and not eligible for a performance-improving retry. No forced finalization prompt.
If the budget gate binds, expose it explicitly and stop interpreting the pilot as
uncensored capability; do not increase an individual arm's allowance after seeing it.

Retry procedure, same for both arms:
1. End and archive the failed attempt, including raw redacted traces and state diff.
2. Append an invalid entry with category and evidence location to invalid-retry.jsonl.
3. If allowed, append retry_granted (attempt=2), then materialize from frozen bundle
   and database seed. It gets the complete original 30min/20M allowance and fresh Run.
4. Retry immediately before the next scheduled arm. Never rerun a valid partner just
   to obtain a nicer comparison. If retry fails/exhausts quota, record retry_denied,
   leave that pair incomplete and continue only if no systemic blocker is present.
5. If a systemic runtime/config problem recurs, pause remaining sampling. No result-
   dependent replacement of cases, sequence positions or models.

Planned paired denominator: 12 pairs. Primary paired comparison includes only pairs
with two valid arms, with the realized n displayed. Preserve other valid arms as
unpaired descriptive records. Report first-attempt outcomes, every invalid/retry,
and retry-inclusive paired outcomes separately; successful retry is not the first run.

Ledgers are append-only by procedure, with hash links for accidental-edit detection;
they are not cryptographic access control. Store no keys, auth.json or raw auth headers.
Use one serial writer. A partial ledger update is an audit issue: append a reconciliation
record with evidence before continuing, never delete a row to make the history tidy.

attempts.jsonl event: pairId, arm, attempt(1|2), kind(start|end|annotation), attemptId,
Run/session IDs when available, snapshot receipt path, trace paths; end adds validity,
termination reason, observed usage and last completed action.
invalid-retry.jsonl event: pairId, arm, attempt, kind(invalid|retry_granted|retry_denied),
category, evidence path; include original attempt linkage and reason.
coding.jsonl event: pairId, arm, attempt, segment/claim/exposure evidence IDs, rubric
hash, coder, code, rationale. Corrections append references to the earlier row.
