> **Web reading edition.** [Complete sealed evidence ZIP](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.zip) · [SHA-256](https://github.com/Key-of-door/Threshold-capability/releases/download/terminal-bench-archive-2026-09-v1/Threshold-TB-public-archive-20260923.sha256). Raw files, frozen source, offline verification scripts and their manifests are inside the ZIP. Historical review-time status labels inside it are preserved; they do not indicate that this public release is pending.

# Publication-safety review and redaction contract

Status: prepared locally for author review; **not pushed or published**. This document concerns public disclosure, separately from benchmark input-contamination judgments.

## Copy policy

Original experiment files are read-only inputs to packaging. Included files are either byte-identical copies or safety-redacted copies. No score, tool action, error, invalidity judgment or failure episode is intentionally removed. Chinese primary reports remain byte-identical to their preserved sources. Source inventory records both original and public SHA-256, bytes and redaction count. Historical manifests still describe original bytes; publication-manifest.json describes the public copy.

Redactions use category-specific opaque placeholders. Matching secret occurrences in tool returns and later request history receive the same placeholder, preserving correspondence. Real values are not included in the ledger, and placeholders are not hashes of individual secrets. Cryptographic keys produced as FEAL task artifacts, task data, score values, file hashes and auth.json/human.key **filenames** are not treated as credentials merely because of their names.

## Machine-readable ledger

`redactions.jsonl` has one row per substitution:

```json
{
  "source_file": "evidence-root/<study>/<relative file>",
  "public_file": "evidence/<study>/<relative file>",
  "line_1based": 1,
  "column_1based": 1,
  "public_column_1based": 1,
  "original_char_length": 64,
  "replacement": "REDACTED_RUNTIME_TOKEN_0001",
  "category": "runtime_token",
  "cell_id": "<observed id, or null>",
  "event_id": null,
  "event_kind": "runtime",
  "event_time": "<observed timestamp, or null>",
  "generation": 0
}
```

Categories used by policy: credential, runtime_token, host_sensitive. A null event_id means the original record had no event ID; none is invented. For JSONL, the physical line is the event index. For ordinary files, location is a physical line and Unicode character column; event/cell fields may be null. A file's relative path plus line is always sufficient to locate the substitution. Original and public column offsets are separate because placeholder length can differ. Newlines and event order are retained.

## Checks

The local checker independently replays ledger substitutions against the private originals and compares every output byte, checks that source files did not change, parses all included JSON/JSONL, checks copied report hashes and scans the assembled public package for concrete credential patterns and user-home paths. Its report contains counts and locations, not secret values.

For public-only verification, scripts/verify.py checks manifest integrity, replacement positions and trace line counts. Readers without original private bytes cannot independently prove that each redacted span was originally a credential. The ledger and hashes make transformations inspectable; they are not a cryptographic proof of semantic fidelity or a guarantee that no sensitive value could evade a scanner.

Original integrity-audit scripts may compare pre-redaction digests. Do not alter historical hashes to make those checks appear to pass on modified bytes. Use source-inventory.json to distinguish original from public digests, and the public verifier for publication-copy checks.

## Final publication gate

- Author reviews README, Discussion draft, tables, translated reports, claims and safety findings.
- Choose actual public archive/index URLs; replace the two explicit Discussion URL placeholders only after that decision.
- Attach the complete evidence archive and its SHA-256; preserve report → trace → grader → manifest navigation.
- Re-run the public verifier on the exact bytes to upload. Do not include private packaging work directories, local credential stores or original sensitive copies.
- No upload or repository push is authorized by completion of this packaging step.
