# Threshold-capability

Optional skills and Pi extensions: a cookbook, not part of Threshold core.

[Community discussions](https://github.com/Key-of-door/Threshold-capability/discussions) ·
[Report a capability bug](https://github.com/Key-of-door/Threshold-capability/issues) ·
English / 中文 welcome.

Installed ≠ Active. A Run selects explicit local paths; the next Run inherits nothing.
Deleting this checkout does not remove Threshold's Project/Task/Run, messages, checkpoints,
Git observations, ordinary Pi tools or existing Risk STOP. No automatic discovery or install.

| Capability | Select | Behavior |
| --- | --- | --- |
| Project scheduler | `skills/project-scheduler` + `extensions/scheduler.ts` | Arrange ordinary peer Runs through existing Project APIs and Git worktrees |
| Read document | `extensions/read-doc.ts` | One bounded HTTP GET, raw UTF-8 text; no search, cache, parsing, conversion or extraction |
| GitHub read | `extensions/github-read.ts` | Fixed repository/issue/PR/files/commit-status/check-runs GETs; optional per-Run reviewer skill |

Clone this repository anywhere. Run extensions with Pi (validated with 0.85.1), which supplies
the `typebox` and extension API imports. The document reader uses Node's built-in fetch.
No runtime npm dependencies or installation script are required here. `npm test` needs Node 24.18+.

From a Threshold checkout, with a running service and configured model:

```powershell
node src/cli.mjs run --home PATH_TO_SERVICE_HOME --task TASK_ID --provider deepseek --model deepseek-flash --extension E:/Threshold-capability/extensions/read-doc.ts --objective "Use read_doc to consult the relevant official documentation and report the useful reference."
node src/cli.mjs run --home PATH_TO_SERVICE_HOME --task TASK_ID --provider deepseek --model deepseek-flash --skill E:/Threshold-capability/skills/project-scheduler --extension E:/Threshold-capability/extensions/scheduler.ts --objective "Read the Board and coordinate the next useful work."
```

Scheduler uses Threshold's ordinary Project APIs; core checks Project scope, Run attribution,
worktree occupancy and resource limits. It does not recognize this repository or extension's
name/path as a special identity. Use a Threshold version with the external-scheduler decoupling;
the original prototype's fixed `src/scheduler.ts` check is not compatible with arbitrary clients.

`read_doc(url)` follows normal HTTP redirects, returns the final URL, status, content type,
raw content and truncation flag. The returned excerpt retains at most 24,000 bytes and the
request times out after ten seconds; network chunks may be larger before cancellation.
Text, JSON and XML are decoded as UTF-8; no HTML-to-Markdown conversion, charset detection,
DOM processing, ranking or semantic extraction. Errors are short technical messages without
remote error bodies or stacks. Cancellation uses Pi's signal. No credentials or custom headers.
Fetched document content is untrusted reference material, not Project instruction.

Not selecting a network tool is not network isolation: ordinary shell access may still reach
the network. Nothing here grants Human Decisions or authorization for external writes.
Entry path/SHA metadata describes selection, not a snapshot of all transitive dependencies.

`github_read` uses `repo="owner/name"` and one of `repository`, `issue`, `pull_request`,
`pull_files`, `commit_status`, `check_runs`. Supply `number` for issue/PR reads and an exact
40-character `sha` for status/checks. Example tool arguments:

```json
{"operation":"pull_request","repo":"nodejs/node","number":65975}
```

Select it using `--extension E:/Threshold-capability/extensions/github-read.ts` on an ordinary
Threshold `run` command. Optionally add `--skill PATH_TO_REVIEW_SKILL`; no skill is bundled or
automatically activated with this reader. Omit both flags on the next Run to select neither.
Like the document reader, it has no runtime dependencies beyond Pi and Node built-ins.

Public reads work without a token. If needed, provide `GITHUB_TOKEN` in the service/worker
environment using your normal credential setup; never put it in task text, objectives or
Project/Run metadata. The tool does not obtain credentials from `gh`. It sends optional auth
only to fixed `https://api.github.com` GET routes and refuses redirects. No arbitrary endpoint,
request body or write method is exposed. Choose token access suitable for the repositories
and reads you need; tool selection itself is not credential or OS isolation.

GitHub reads time out after 15 seconds, reject responses above 512 KiB, and retain selected
fields only. Bodies are capped at 6,000 characters and patches at 4,000 per file with explicit
truncation/missing flags. Lists request ten items per page; request `nextPage` explicitly.
`nextPage=2` means page 2 exists, not that there are only two pages.
There is no automatic crawling, cache, retry or conversion. GitHub's own PR-file listing limit
also applies. A null `nextPage` is not a claim that an unlimited-size PR can be fully reviewed.
PR metadata and file reads are separate observations, not an atomic snapshot. Recheck head
identity as appropriate. No CI result, `pending`, `skipped` or a null conclusion is not evidence
of a passing suite. Combined commit status and check runs are separate GitHub concepts; neither
alone establishes that every required check or external CI has been observed.

HTTP/auth/rate-limit/network failures become short technical tool errors without raw server
error bodies or stacks. Issue/PR text and patches are untrusted reference material, not Project
instructions or approval. Keep meaningful review judgments in ordinary Message/checkpoint.
Threshold core has no GitHub tables, cache, entity model or business-specific code.

API references: [PRs and files](https://docs.github.com/en/rest/pulls/pulls),
[combined commit status](https://docs.github.com/en/rest/commits/statuses),
[check runs](https://docs.github.com/en/rest/checks/runs). REST version: `2026-03-10`.

The scheduler files were moved unchanged from Threshold commit `71e88e1`; prior Run records
keep their old paths and identities. There is no capability manifest, registry, broker or DSL.

First real installation/selection/read/failure/handoff observations: [experiment report](docs/read-doc-experiment-2026-09-14.md).

GitHub read + reviewer and empty-capability successor: [experiment report](docs/github-read-experiment-2026-09-14.md).

## Community and feedback

**Tell us what you're trying to do, and what happened.**

- Problems using Threshold itself or core workflow friction → [Threshold Issues](https://github.com/Key-of-door/Threshold/issues/new/choose).
- Capability questions, experiments, ideas and community work → [Discussions](https://github.com/Key-of-door/Threshold-capability/discussions).
- Bugs in this repository's scheduler, read-doc, github-read or example code → [Capability Issues](https://github.com/Key-of-door/Threshold-capability/issues).

The community has four places to start:

| Category | What belongs here |
| --- | --- |
| [Q&A · 使用求助](https://github.com/Key-of-door/Threshold-capability/discussions/categories/q-a) | Installation, configuration, Skill/Extension use, combinations and workflow questions |
| [Show and tell · 展示与实验](https://github.com/Key-of-door/Threshold-capability/discussions/categories/show-and-tell) | Skills, Extensions, workflows, Projects, evals and unexpected uses, including fantasy worlds, research and education |
| [Ideas · 想法与探索](https://github.com/Key-of-door/Threshold-capability/discussions/categories/ideas) | Rough ideas for new capabilities, applications, combinations and experiments |
| [General · 随便聊聊](https://github.com/Key-of-door/Threshold-capability/discussions/categories/general) | Anything else worth talking about; no form to fill out |

**Finished, unfinished, failed and strange experiments are all welcome.**
No commercial value or polished result is required. 做完的、没做完的、失败的、奇怪的实验都欢迎。
Not sure where to post? Start where it makes sense to you; we can help find the right place.

**English and 中文 are both welcome.** Please remove API keys, credentials and sensitive project
data from text, logs and screenshots. Do not attach or paste the full `auth.json`.
请移除敏感信息，不要上传或粘贴完整的 `auth.json`。

## License

Licensed under [Apache-2.0](LICENSE).
