# GitHub read + reviewer, 2026-09-14

Outcome: a real Pi Run used six GitHub REST reads from this external checkout, composed
with an existing reviewer skill. A fresh Run after service restart inherited neither.
Threshold core had zero tracked changes; all seven `src/` file hashes matched before/after.
This is a small product observation, not qualification or proof of general integration coverage.

## Implementation

- `extensions/github-read.ts`: one Pi tool, six fixed operations.
- `extensions/github-read.mjs`: native fetch GETs to api.github.com, selected response fields,
  explicit pagination/excerpt limits, optional environment token, short technical errors.
- `tests/github-read.test.mjs`: five focused tests. No dependencies, GitHub core entities,
  cache, automatic discovery, write operation or new Threshold primitive.
- Install: use this checkout and explicitly select the extension path. Pi 0.85.1 loaded it
  from outside the core checkout without npm installation here.

Identity during the experiment:

- Threshold: `49e00e033bc6017dff379afb9fb7f332eaa1e6b4`, branch `codex/pi-integration-spikes`.
- Capability base: `d7400dc6963123521e7f9ff55238501359374b82`, branch
  `codex/external-capabilities`, plus the new uncommitted helper/wrapper/test bytes.
- Entry SHA-256: `42b326c92ac4ea42f82773932fda660cb7cca06e12b04ed18e24b6a4efd94373`.
- Helper SHA-256: `e3324a29eef0da43eab8d80237f0074973c7a674c1e3343011af6085a668fa80`.
- Reviewer: existing `ferologics-8b0816aae32fdecb135b39f75dc19fe65fccabbf/code-review/SKILL.md`,
  SHA-256 `4b3f3b6cf0b2ffc8e987eeb10a64769c31b63242b9ac05e7d648d0245d8a6c70`.
  This external skill is not bundled or a required standard. Entry provenance does not
  automatically snapshot its transitive dependencies; helper hash above is an operator observation.

## Real workflow

Used the existing capability Project `5ac95505-0e4a-40ea-bf34-57bd9bd3bae6`, new Task
`d4add67b-f945-477f-bf67-87d579973d34`. Model: DeepSeek/deepseek-flash through pinned Pi.
Two new managed launches, sequential; cumulative service limit 13 including 11 historical Runs.
The authorized temporary model credential stayed in process environment. GitHub reads were
anonymous (`GITHUB_TOKEN` explicitly empty in workers); no credential was copied to project state.

| Run | Session | Selection | Runtime observation |
| --- | --- | --- | --- |
| `dc9cc99f-e083-4edb-8ed3-c99b3d8f7614` (R) | `01a09e8d-44d5-7277-b518-7d13bd7d96c3` | github-read + code-review | 16 tool calls, six GitHub reads; ended, exit 0, no runtime error |
| `7c55902a-b584-4e2d-8db3-206dba225995` (S) | `01a09e8d-dd76-717f-b5be-e4d736fd0344` | no optional skill/extension | 18 tool calls; read prior checkpoint/messages; ended, exit 0, no runtime error |

Run R fetched repository, PR, files, commit status, check runs and referenced issue from
[nodejs/node PR 65975](https://github.com/nodejs/node/pull/65975). Captured head was
`61f9ca6bfa99421f1b7d650a5e7a675631934b33`. All six tool completions had `isError=false`.
The single patch was present and untruncated. Combined status returned success/34 entries;
check runs returned 38 entries with a mixture of skipped and success in the ten observed items.
Only first pages were fetched. Neither this experiment nor its workers established full CI coverage.
PR metadata and files were separate requests; head identity was not re-read at the end.

R actually read the selected reviewer skill and used github_read instead of its suggested gh
transport. Its judgment: no high-confidence defect, with a coverage trade-off in replacing an
allocation/abort test by a parsed-flag check. This remains an Agent review interpretation.
It used ordinary local Node commands for a related flag-format check, explicitly noting the
local Node lacked the PR's exact flag. No nodejs/node checkout, build or actual PR test was run.

R saved Message 11 and checkpoint `fcc69eef-16f8-49fa-801b-d56ae3dd49a3`.
The service closed and reopened at `2026-09-14T06:14:52.081Z`, then launched S with empty
selection. S's actual read_task result recorded that checkpoint ID. No prior conversation,
prompt/response transcript or raw GitHub dump was supplied to S.

S inspected Git and local implementation, read Message 11, ran local checks, and left Message 12
and checkpoint `54d3f687-7c93-4f77-be65-168cea06896c`. It marked the bounded Task done through
the ordinary task tool. Completion was not inferred from agent_end or process exit.
The experiment ran `06:14:12.990Z–06:15:52.491Z`; service closed afterward.

## Friction and honest limits

- R misread `nextPage=2` as “page 1 of 2.” S independently caught the inconsistency with
  per_page=10 and totals 34/38. Neither claimed exhaustive CI success. Original messages remain
  intact; README now makes nextPage's meaning explicit. No new core mechanism was needed.
- S correctly treated remote facts in R's summary as reported observations, not its own fresh
  GitHub verification. The operator separately retained selected tool outputs in ignored local
  experiment files; these were not in the worker's Project context.
- The operator updated README while the review workflow ran. S spent several Git/file commands
  investigating this change and could not attribute it. Operator attribution is known here;
  S's inference about exactly when the earlier tree claim was accurate is not established by
  file mtime alone. Avoid overlapping operator edits during future handoff observations when practical.
- Review messages were fairly long and the successor repeated some local investigation. The
  path worked without Human re-explaining the PR; concise objectives/messages remain worth refining
  through use. No token instrumentation was added.
- No authenticated/private-repository or GitHub Enterprise experiment; no real rate-limit event.
  HTTP failures were exercised in focused tests, not manufactured in the model review.
- Unselected tools mean absent normal interfaces, not shell/network isolation. No new Human
  Decision was needed or issued. No GitHub writes, push, PR creation or remote review submission.

## Independent checks

- Capability `npm test`: 6/6, including prior document reader and five new GitHub tests.
- Threshold `npm test`: 18/18, zero core edits.
- Three no-model Pi sessions: empty → github-read + reviewer → empty. Actual active tool sets
  and skill catalogs matched. Each includes a test-only observer extension; these probes are
  distinct from the two normal managed Runs above.
- Pi-loaded callback probe: invalid branch-name input where exact SHA is required rejected
  with a short Error. The wrapper throws, allowing Pi to classify technical tool failures.
- Local verification asserted two clean exits, six successful GitHub reads, exact prior-checkpoint
  read, empty successor selection and unchanged seven-file core hashes. Git diff whitespace check passed.

Local operator records: `E:/Threshold lite/.local/github-read-experiment/` (ignored, not a
portable evidence package). Durable Task/messages remain in the existing service database.
The report distinguishes those observations from worker interpretations; neither is new Authority.

The bounded result supports the intended direction: GitHub-specific behavior stayed in the
capability checkout. Existing Project, Message, checkpoint and Run selection were sufficient.
