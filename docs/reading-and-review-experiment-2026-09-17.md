# Real reading / audit / independent review, 2026-09-17

Outcome: two fresh DeepSeek/Pi Runs used the new skills and JSON tools on this capability
repository. A found a small documentation ambiguity; B rechecked the observation, differed on
its severity and did not invent another defect. Both ended normally. This is a single real-use
observation, not evidence that the skills caused better judgment.

## Setup and boundary

- Threshold OSS: clean `c53006438588b0b43500fa2481278dda85ce3f4c`, unchanged throughout.
- Capability base: `668dae9de119e8c722cba58a63e21e0902835777`, plus the uncommitted new readers,
  skills, tests and documentation. Agents inspected those actual working files, not only HEAD.
- Windows, Node 24.18.0, Pi 0.85.1, `deepseek/deepseek-flash`; model configuration allowed
  1,048,576 context tokens and 16,384 output tokens. Pi selected low thinking as usual.
- Separate local service/home; sequential workers, two starts in the corrected service, 220-second
  outer bound per Run (ordinary service turn limits also apply). No scheduler or new core entity.
- The user authorized the temporary key for this experiment. It was supplied through hidden stdin
  and process environment, not stored in config, Project text or records. Config contains only the
  environment reference. Both experiment services were closed; history was retained locally.
- Task: read-only audit of the actual documented scope. No required finding, code edit, package
  installation, commit, push or release approval. Task intentionally remained `in_progress`.

The operator explicitly requested A to invoke both JSON tools and the existing document reader.
This establishes real model-driven invocation, not spontaneous tool discovery. B was asked to
recheck findings and observe the handoff, with no answer supplied. The capability repository itself
contains all four skill documents, so both agents could read unselected skills as review material;
per-Run selection is not document access isolation.

## Configuration failure preserved

The first driver mistakenly used `apiKey: "DEEPSEEK_API_KEY"`, a literal under this Pi version,
instead of `apiKey: "$DEEPSEEK_API_KEY"`. Two initial Runs received HTTP 401, with **zero tool
calls**. Their exit codes were abnormal (`3221226505`); this experiment did not independently
diagnose that exit code. Neither Run produced an audit finding. This does not show that the key
was expired, or that a capability failed.

The operator corrected the environment-reference syntax and the driver's sequencing so a Run
error prevents a successor from launching. The two failed rows remain in the first isolated home;
two new Runs used a second home. Thus total launches were **four: two failed setup attempts and
two successful model workflows**, not two error-free launches. No product code was changed to
recover, and the original failure records were not overwritten.

## Actual Project and Runs

Project `505d5578-5d35-4dd0-a8e7-81bfbd371524`; Task `d0e9ce8c-453a-4781-840a-e1794e89922b`.

| Run | Session | Explicit optional selection | Runtime result |
| --- | --- | --- | --- |
| A `aa16144b-136a-4c12-8450-5915725078be` | `01a0af97-0435-7589-a741-ba5da3ede18d` | source-reader + requirements-auditor; inspect-json + read-json-api + read-doc | 56.646 s, 27 tool calls, exit 0, no recorded runtime error |
| B `8f82dac7-2590-4e96-9ac6-55a257c7adf8` | `01a0af97-e9ec-7283-b3d1-a23d9c156176` | fresh-reviewer + experiment-observer; inspect-json + read-json-api | 41.666 s, 20 tool calls, exit 0, no recorded runtime error |

Successful sequence: `2026-09-17T13:38:24.700Z`–`13:40:05.183Z`, roughly 100 seconds including
the gap between Runs. The service stayed running between A and B; this round did **not** repeat
a service-restart experiment. A's Pi process ended before B started. B received ordinary Task,
checkpoint and Messages, not A's conversation, reasoning or operator tool-event log.

B's actual `read_task` result identified A's checkpoint
`d3399845-ec10-4fb7-89f4-3e3673d531c5`. B also called `read_messages`, inspected Git/source and
reran tests. Messages 1 and 2 remain separate with their original Run attribution.

## Observed behavior, separate from conclusions

**A:** read the selected skills, actual code/docs and tests; used `inspect_json` on `package.json`;
read the npm package metadata through `read_json_api`; ran `npm test` (10 passed); fetched
[RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.txt) through `read_doc`. That document result
was truncated. A explicitly disclosed the partial reading in its Message rather than claiming
complete source coverage. Its assessment that implementation and documentation mostly agreed is
an Agent judgment, not independent certification of all paths.

A made two natural API argument mistakes: it selected the scalar `/version` while asking for
object keys, then tried an absent `/dist-tags` path on a version document. Both returned short
technical errors. A subsequently selected the root and successfully checked `name` and `version`.
There was no approval request or operator correction during the Run. These were incorrect tool
arguments, not a provider outage or write retry.

**B:** independently read source and ran the same suite. Its local inspection intentionally
included `version` among requested keys; the capability repository's private `package.json` has
no version field. The tool returned `ok: true`, `missingKeys: ["version"]`, `checksPassed: false`.
B correctly described that as a successful inspection with a missing requested key, without
declaring the package invalid. Its fresh public API read selected `/version` successfully.

**Natural difference in interpretation:** A called the sentence “does not retain response headers”
inaccurate because results expose `contentType`. B verified the same fact but described it as
wording ambiguity rather than a tool defect, since no headers collection is returned. Both original
Messages were preserved. The operator independently checked the code and result and, **after both
Runs ended**, clarified the documentation: Content-Type is exposed, other headers and raw HTTP
error bodies are not. No tool implementation change was needed.

**Remaining friction:** B's closing checkpoint proposed another model/human review to close this
wording issue. That is disproportionate to the ordinary documentation correction and is not an
accepted requirement. This is one example of cautious language growing an unnecessary next step;
it was recorded rather than turned into a workflow rule or used to immediately tune every skill.
Both workers reread some of the same files and tests; that provided independent observation but
also consumed context. The observer role operated inside B, not as a blinded external observer.

## Independent checks and usage

The operator reran the capability suite after the model Runs: **10 passed, 0 failed, 0 skipped**.
Before/after hashes of tracked and untracked non-ignored capability files matched during the
Runs. No fixture, test, source or document was changed by either worker. The later documentation
clarification and this report are operator changes, outside that comparison. Core stayed clean.

Pi reported the following summed usage across each Run's assistant responses:

| Run | Input (excluding separately reported cache reads) | Output | Cache read | Total |
| --- | ---: | ---: | ---: | ---: |
| A | 29,560 | 10,902 | 205,696 | 246,158 |
| B | 21,292 | 7,594 | 124,800 | 153,686 |

These are runtime-reported cumulative counters, including repeated context across requests;
they are **not** unique document lengths, a single context-window size or independently verified
billing. Output counters are not equivalent to the length of the final visible answer.

## What this supports, and what remains open

The existing Project/Message/checkpoint path carried a useful independent review. The tools were
actually invoked by the model, ordinary technical errors were recoverable, and a successor checked
facts while retaining a different interpretation. No core expansion was needed.

There was no no-skill control, no alternative model and only one repository/task. This does not
establish that the skills improve accuracy or generalize to academic/educational work. The source
was a technical standard, not a PDF paper; OCR, figures, research replication and teaching outcomes
were not tested. No claim of security isolation or comprehensive API coverage follows.

Local records: `E:/实验/capability-reading-review-20260917/` (first failed setup) and
`attempt-02/` (successful workflow). Each retains ordinary service history and operator records.
`attempt-02/observations/` includes `starts.json`, Run/session observations, Messages/checkpoints,
filtered tool events, file hashes and `summary.json`. Provider credentials and model reasoning
were not written into these records; a post-run scan found no API-key-shaped strings. The two
service marker files were absent after cleanup. Nothing was pushed or published in this experiment.
