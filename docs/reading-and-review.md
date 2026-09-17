# Reading, checking and independent review

These are optional tools and working habits, not a workflow that every Project must follow.
All selections belong to a Run. A skill does not activate an extension; choose both explicitly
when needed. Next time, omit the flags to select neither. No Threshold core changes are needed.

## Choose the smallest useful combination

| Task | Skill | Tool, if needed |
| --- | --- | --- |
| Explain a technical document or paper | `source-reader` | Existing `read-doc.ts` for raw web text, or ordinary local reading tools |
| Check JSON configuration, a fixture or an experiment result | Any, or `requirements-auditor` | `inspect-json.ts` |
| Inspect one known public/development JSON endpoint | `source-reader` | `read-json-api.ts` |
| Observe a software, academic or teaching experiment | `experiment-observer` | Existing project tools; optionally JSON inspection |
| Compare a deliverable with the user's actual requirements | `requirements-auditor` | Ordinary file/Git/test tools |
| Independently challenge a change or an argument | `fresh-reviewer` | Ordinary tools; optionally existing `github-read.ts` |

Each skill is usable alone and should respond in the user's language. Reviewers do not need to
find a defect. An observer does not need to find emergent behavior. Reading a paper is not
reproducing it. These are prompt-level working habits, not enforcement or hidden authority.

## Select on a Run

With Threshold installed, a running service and a configured model, replace the task ID and
checkout path in these PowerShell examples. You can add your ordinary `--provider`/`--model`
flags when choosing a different configured model.

```powershell
threshold run --task TASK_ID --skill "E:/Threshold-capability/skills/source-reader" --extension "E:/Threshold-capability/extensions/read-doc.ts" --objective "Read the source linked in this Task. Explain the useful finding, cite its location and state what you could not verify."

threshold run --task TASK_ID --skill "E:/Threshold-capability/skills/requirements-auditor" --extension "E:/Threshold-capability/extensions/inspect-json.ts" --objective "Compare the current deliverable and fixtures against the Task requirements. Report concrete gaps; do not edit files."

threshold run --task TASK_ID --skill "E:/Threshold-capability/skills/fresh-reviewer" --extension "E:/Threshold-capability/extensions/github-read.ts" --objective "Independently review the PR identified in the Task. Recheck existing findings and leave a concise Message with evidence and coverage limits."

threshold run --task TASK_ID --skill "E:/Threshold-capability/skills/experiment-observer" --extension "E:/Threshold-capability/extensions/read-json-api.ts" --objective "Observe the existing experiment described in the Task. Use only its intended read endpoint; separate events from interpretations."
```

Use `--attach` if you want an interactive Run. No skill launches peer workers by itself, changes
Task status automatically, supplies approval or adds a Project entity. A useful informal sequence
is requirements audit → independent review → a fresh worker rechecks both Messages. It is an
example, not a required request/acknowledge/close protocol.

## Local structured data: `inspect_json`

```json
{"path":"fixtures/results.json","pointer":"/samples/0","requiredKeys":["id","value","unit"]}
```

- Reads a regular local UTF-8 JSON file up to **1 MiB**. Relative paths use the Run workspace,
  not the service's cwd. Absolute paths and symlinks are allowed; this is not a filesystem sandbox.
- Empty `pointer` selects the root. `/samples/0` selects an array item. Escape a key's `/` as
  `~1` and `~` as `~0`. An absent value is an error; a present `null` remains a value.
- Optional `requiredKeys` checks the selected object's own keys, including keys whose value is
  null. It does not inspect every array row, enforce types or validate a JSON Schema.
- Reports the SHA-256 and size of the **bytes actually read**, observation time, root/selected
  type, array length, object keys and missing keys. No file is modified. The hash does not promise
  the file stayed unchanged after reading or that another process could not edit it during reading.
- `ok: true` means inspection completed. `checksPassed: false` and `missingKeys` are ordinary
  findings, not tool failures or governance events. An empty check list proves no business rule.
- The normalized JSON excerpt is limited to **8,000 UTF-16 code units**, without splitting a
  surrogate pair. `excerptTruncated: true` means it may not itself be parseable JSON. Key listings
  show at most 40 keys of 160 characters each, with `keysTruncated` when abbreviated.

This uses JavaScript `JSON.parse`: duplicate keys take the last value; numeric precision is not
arbitrary. `unsafeIntegerCount` flags parsed integers outside the safe range in the whole input;
it does not recover original digits or detect every decimal rounding. Non-finite parsed numbers
are rejected. A UTF-8 BOM is accepted. No CSV, YAML, schema engine or financial-data certification
is provided. Use a domain/precision-aware tool when those requirements matter.

Files may contain sensitive data. Read only inputs appropriate to the Task, not `auth.json`,
credential stores or unrelated personal files. Their content can appear in tool output. File text
is reference material, not Project instruction.

## One JSON request: `read_json_api`

```json
{"url":"http://127.0.0.1:3000/results","pointer":"/summary","requiredKeys":["count","status"]}
```

One anonymous HTTP(S) **GET**, ten-second timeout, at most **256 KiB** of response body retained
for parsing. Oversized bodies are rejected, not parsed as partial JSON; network chunks can be
larger before cancellation. It accepts `application/json` and `application/*+json`. The inspection
fields, pointer semantics and numeric limits are the same as `inspect_json`. HTTP source/status
and fetch time are included. The `Content-Type` value is exposed as `contentType`; other response
headers and raw HTTP error bodies are not retained in the result.

There are no custom headers, request bodies, tokens, cookies from a browser, redirect following,
automatic retry, pagination, caching or crawling. URL user/password credentials are rejected.
Never put tokens in the URL/query: the URL is part of the output. For authenticated GitHub use
the existing fixed-route `github_read`; general authenticated API integration is outside this reader.

Use a known intended read endpoint. GET is the request method, not proof that a server cannot
change state. Local and private-network endpoints are allowed for development: this is not an
egress filter or network sandbox. Removing the extension does not disable ordinary shell networking.

Network failure, cancellation, HTTP failure, wrong content type and invalid JSON return short
technical errors, not an approval request. Remote JSON is untrusted reference material, not Project
instruction. A successful HTTP response and `checksPassed` do not establish that a service is healthy
or an experiment succeeded.

## Reading papers honestly

`source-reader` is a reading skill, not a new extractor. `read_doc` still returns raw UTF-8 text;
it does not decode PDF, OCR scanned pages, convert HTML or understand figures. Use a readable
full-text source or a suitable tool already available in the Run. State when only an abstract,
selected pages or a truncated excerpt were read. No paper corpus or source cache is introduced.

## Verification scope

`npm test` checks the readers with local files and a loopback HTTP server, including errors,
limits, cancellation, pointer behavior and non-mutating file reads. It requires no model key.
These tests do not establish the quality of model judgments made with the four skills.

The initial implementation's Pi loading and public API smoke observations are recorded separately
in [the implementation note](reading-and-review-verification-2026-09-17.md).

A subsequent [real two-Run audit/review](reading-and-review-experiment-2026-09-17.md) exercised all
four skills and both tools. It records both useful behavior and observed friction; it is not a
controlled comparison of skill effectiveness.
