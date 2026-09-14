# Threshold-capability

Optional skills and Pi extensions: a cookbook, not part of Threshold core.

Installed ≠ Active. A Run selects explicit local paths; the next Run inherits nothing.
Deleting this checkout does not remove Threshold's Project/Task/Run, messages, checkpoints,
Git observations, ordinary Pi tools or existing Risk STOP. No automatic discovery or install.

| Capability | Select | Behavior |
| --- | --- | --- |
| Project scheduler | `skills/project-scheduler` + `extensions/scheduler.ts` | Arrange ordinary peer Runs through existing Project APIs and Git worktrees |
| Read document | `extensions/read-doc.ts` | One bounded HTTP GET, raw UTF-8 text; no search, cache, parsing, conversion or extraction |

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

The scheduler files were moved unchanged from Threshold commit `71e88e1`; prior Run records
keep their old paths and identities. There is no capability manifest, registry, broker or DSL.

First real installation/selection/read/failure/handoff observations: [experiment report](docs/read-doc-experiment-2026-09-14.md).
