// A bounded HTTP GET and a UTF-8 excerpt. No cache, parsing or content conversion.
export async function readDoc(input, { signal, timeoutMs = 10000, maxBytes = 24000 } = {}) {
  const error = message => ({ ok: false, error: `read_doc: ${message}` });
  let url;
  try { url = new URL(input); } catch { return error('Expected an HTTP(S) URL'); }
  if (!['http:', 'https:'].includes(url.protocol)) return error('Expected an HTTP(S) URL');
  const deadline = AbortSignal.timeout(timeoutMs);
  let response, reader;
  try {
    response = await fetch(url, { signal: signal ? AbortSignal.any([signal, deadline]) : deadline, redirect: 'follow' });
    if (!response.ok) return error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') ?? '';
    if (!/^(text\/|application\/(json|xml|[^;]+\+json|[^;]+\+xml)(;|$))/i.test(contentType))
      return error('Expected text, JSON or XML content');
    reader = response.body?.getReader();
    const chunks = []; let bytes = 0, truncated = false;
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const take = Math.min(value.length, maxBytes - bytes);
      chunks.push(value.subarray(0, take)); bytes += take;
      if (take < value.length) { truncated = true; break; }
    }
    return { ok: true, url: response.url, status: response.status, contentType, truncated,
      content: new TextDecoder('utf-8').decode(Buffer.concat(chunks), { stream: truncated }) };
  } catch {
    return error(signal?.aborted ? 'Request cancelled' : deadline.aborted ? 'Request timed out' : 'Network request failed');
  } finally {
    if (reader) await reader.cancel().catch(() => {});
    else if (response?.body) await response.body.cancel().catch(() => {});
  }
}
