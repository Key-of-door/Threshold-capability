# Reading and review capabilities — implementation note

Date: 2026-09-17. This is a small implementation record, not an acceptance package or a claim
that the skills improve model quality.

This note describes the initial **no-model** checks. A later authorized
[two-Run model experiment](reading-and-review-experiment-2026-09-17.md) is recorded separately;
the zero-model-call count below belongs only to this initial stage.

## What changed

Four optional skills: `source-reader`, `experiment-observer`, `requirements-auditor`,
`fresh-reviewer`. Two optional Pi tools: `inspect_json` and `read_json_api`. Existing document
and GitHub readers are reused. No new dependency, installer, registry, default activation or
Threshold entity was added. See [usage and limits](reading-and-review.md).

The distinction between a successful inspection and passing requested checks is explicit:
`ok: true` may accompany `checksPassed: false`. Neither is a claim of scientific validity,
business correctness or permission to act.

## Observed verification

- Windows, Node **24.18.0**, pinned Pi **0.85.1**.
- `npm test`: **10 passed, 0 failed, 0 skipped**, including the existing readers and four new
  focused tests. Local inputs and a loopback server covered pointer/own-property behavior,
  missing keys, unchanged input bytes, malformed content, numeric limits, bounded excerpts,
  response size, HTTP errors, redirect refusal, timeout and cancellation.
- Pi's actual extension loader loaded `read_doc`, `github_read`, `inspect_json` and
  `read_json_api` together without loader errors. The new registered tool definitions were
  invoked with a temporary workspace: local JSON and a loopback JSON response were read
  successfully. These were direct registered-tool calls, not model-generated calls.
- Pi's skill loader accepted all four new skills without diagnostics. A real, isolated RPC
  process with explicit skill/extension paths returned the four skills through `get_commands`.
  A second fresh RPC process with defaults disabled and no selected paths returned no skills.
  A separate empty extension-loader invocation returned no extensions. The RPC observation
  checks skill selection; it is not evidence that every possible global runtime setting is isolated.
- Both RPC processes used temporary agent directories, no inherited provider credentials and
  no model prompts. **Model calls: 0.** Temporary workspaces were removed afterward; no user
  service, Project, Task or credential configuration was changed.
- One real public request through `read_json_api` fetched
  `https://registry.npmjs.org/threshold-lite/latest`, selected `/version`, and returned HTTP
  **200**, **2,104 response bytes**, version **0.2.0-alpha.3**, at
  **2026-09-17T13:28:40.292Z**. This is a point-in-time connectivity observation, not a registry
  availability promise. No token or model credential was used.
- Threshold OSS remained clean at `c53006438588b0b43500fa2481278dda85ce3f4c`.

## Not established by this increment

At this initial stage, the four skills had not yet had a fresh model-driven reading/review experiment.
Their ability to improve judgment, reduce unsupported conclusions or preserve disagreement
is still a practical hypothesis. The tools are not schema validators, arbitrary-precision
readers, PDF/OCR extractors, authenticated API gateways or filesystem/network isolation.

A useful next real-use check would be one small existing deliverable: a fresh requirements
audit, then an independent reviewer who can disagree, then a worker who rechecks the Messages.
No new workflow protocol or change to core is needed to try that.
