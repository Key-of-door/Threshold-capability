# External capability: first document-reading experiment

2026-09-14. The capability checkout is `E:/Threshold-capability`, independent of `E:/Threshold lite`.
Threshold core base after decoupling: `49e00e0`. Scheduler skill/extension were copied byte-for-byte
from the previous main-repo files; core no longer resolves or checks the official file path.
Existing Project scope, Run attribution, worktree/resource checks and Human Decision separation remain.

## Checks

- Main repo: 18 tests passed after removing its scheduler files. With the external `extensions` and
  `skills` directories temporarily renamed out of the documented paths, 11 relevant main-repo tests
  also passed (native Pi loading, ordinary service/Message, persistence, Risk STOP and Run scheduling).
  Directory names were restored. Renaming the entire checkout was refused by Windows because it was
  in use; this is not a completed whole-directory-removal test. No directory was deleted.
- External repo: one focused local HTTP test covers raw markup preservation, redirect identity,
  UTF-8 truncation, 404, unsupported content type, timeout, cancellation and connection failure.
- Five real Pi 0.85.1 sessions, with no model call, inspected active tools for selections:
  empty → read-doc → scheduler → both → empty. Only selected tools appeared; ordinary Project tools
  remained. These checks explicitly added a test observation extension; it is not a product dependency.
- Adding/using read-doc required no further core change: the seven `src/` files had identical hashes
  before and after the live experiment. No schema, API route, registry, permission DSL or workflow added.

## Three model-driven peer Runs

Project `5ac95505-0e4a-40ea-bf34-57bd9bd3bae6`, Task `5dac8d35-420c-4add-a1fa-c30a1cffa9e3`,
stored in the existing Threshold `.local/self-hosting/state`. All used DeepSeek/deepseek-flash,
distinct Pi sessions and no saved conversation. The task was read-only review of the document reader.

| Run | Extra selection | Actual behavior |
| --- | --- | --- |
| A `ea22b801-3a34-4d58-9d48-0347d7ae9d17` | None | Inspected local code, ran local checks, left a documentation question in Message #8/checkpoint |
| B `d20e35bc-b302-4aa5-90e8-ff5beaec9d73` | `extensions/read-doc.ts` | Read official Node reference through the real tool, observed a 404, qualified the earlier claim, Message #9/checkpoint |
| C `006caafc-168b-44d7-8688-bc41609bacdc` | None | Re-observed local code, read prior Project records, distinguished its observations from B's report, Message #10/checkpoint/Task done |

Session IDs respectively: `01a09e5f-fa60-711f-b4ca-2fbd79215848`,
`01a09e60-5428-7184-93bc-9cf2d07e6442`, `01a09e60-a950-7273-a9ad-f9af3c720765`.
All three exited 0 without runtime error. B read A's checkpoint; C read B's checkpoint, independently
confirmed by the ordinary runtime observation. No extra background was relayed between workers.
Runs took place 13:24:44–13:26:00 Asia/Shanghai. The service had 8 historical Runs, a cumulative limit
of 11 and concurrency 1; these three consumed the remaining starts. It closed normally afterward.

B's [official reference](https://raw.githubusercontent.com/nodejs/node/v24.18.0/doc/api/globals.md)
returned HTTP 200, text/plain UTF-8 and a 24,000-character truncated excerpt. The tool also returned
the exact short text `read_doc: HTTP 404` from a local missing endpoint. No shell fetching replaced
the selected tool. A/C were explicitly asked to remain local; their lack of a network tool was not
interpreted as network isolation. Fetched content was labeled untrusted reference, not Project instruction.

The review separated a local observation (invalid internal `timeoutMs` values can throw before the
helper's catch) from what the fetched documentation actually specified. The registered tool accepts
only URL and uses a fixed valid timeout, so this is not an exposed tool-input defect. We did not add
configuration, clamping or a new validation layer in response to an Agent's broader contract framing.

## A real wrapper defect found in independent final review

The live Runs used the initial entry SHA `ce47b92c8011ce7e3cad86131d58850dd32a44210a00edc9c7bc01764a3edee1`
(implementation later committed as `fb5b9a6`; during the Runs the checkout was at its initial commit
with those files staged). Initial code returned `{isError:true,...}` on failure. Pi 0.85.1 ignores that
returned field when classifying execution: the model saw the correct short error but the runtime
classified it as a normal return. This matters when distinguishing observed facts from interpretation.

The final wrapper (`6044dc3`) now throws `Error(result.error)`; Pi's normal catch uses only `error.message` to
create its error tool result. An additional no-model Pi-native callback check confirmed rejection
with the exact short URL error. No long stack or remote error body is presented. The helper's HTTP
behavior was unchanged; the earlier live observations retain their original entry identity. We did
not spend further model calls or claim that the final wrapper received a new model-driven run.

## Friction and limits

Git direct HTTPS failed twice; cloning succeeded using the machine's already-enabled local proxy,
set per command. The model experiment likewise used Node's standard env-proxy option with loopback
bypassed. No proxy framework or global configuration was added. The new repo needed a local Git
author setting copied from the user's existing Threshold repo. No credential was saved in either repo.

This supports one small result: an externally stored tool can be installed, explicitly composed,
used by a real Agent and absent from its successor without growing Project core. It does not prove
a general plugin ecosystem, network isolation, arbitrary encodings or all MCP integrations.
The reader intentionally has no crawler, cache, Markdown conversion or semantic extraction.

Lightweight local observations remain in `E:/Threshold lite/.local/capability-experiment/`; they are
not an acceptance package. No push or external write operation was performed.
