import { inspectJsonBytes } from './inspect-json.mjs';

// One anonymous GET. No arbitrary headers, credentials, redirects or auto-pagination.
export async function readJsonApi(input, { signal, timeoutMs = 10000, maxBytes = 262144 } = {}) {
  const fail = message => ({ ok: false, error: `read_json_api: ${message}` });
  let url;
  try { url = new URL(input?.url); } catch { return fail('Expected an HTTP(S) URL'); }
  if (!['http:', 'https:'].includes(url.protocol)) return fail('Expected an HTTP(S) URL');
  if (url.username || url.password) return fail('URL credentials are not supported');
  url.hash = '';
  const deadline = AbortSignal.timeout(timeoutMs);
  let response, reader;
  try {
    response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' },
      redirect: 'manual', signal: signal ? AbortSignal.any([signal, deadline]) : deadline });
    if (!response.ok) return fail(`HTTP ${response.status}${response.status >= 300 && response.status < 400 ? '; redirects are not followed' : ''}`);
    const contentType = response.headers.get('content-type') ?? '';
    if (!/^application\/(json|[^;\s]+\+json)(\s*;|$)/iu.test(contentType)) return fail('Expected a JSON content type');
    reader = response.body?.getReader();
    if (!reader) return fail('Empty response');
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > maxBytes) return fail('Response exceeds 256 KiB; narrow the request');
      chunks.push(value);
    }
    let inspected;
    try { inspected = inspectJsonBytes(Buffer.concat(chunks), input); }
    catch (error) { return fail(error.message); }
    return { ok: true, url: url.href, status: response.status, contentType,
      fetchedAt: new Date().toISOString(), ...inspected };
  } catch {
    return fail(signal?.aborted ? 'Request cancelled' : deadline.aborted ? 'Request timed out' : 'Network request failed');
  } finally {
    if (reader) await reader.cancel().catch(() => {});
    else if (response?.body) await response.body.cancel().catch(() => {});
  }
}
