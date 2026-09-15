import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readDoc } from '../extensions/read-doc.mjs';

test('raw document GET: redirect identity, text preservation, byte limit and ordinary technical failures', async () => {
  const server = createServer((req, res) => {
    if (req.url === '/redirect') { res.writeHead(302, { location: '/doc' }); return res.end(); }
    if (req.url === '/missing') { res.writeHead(404); return res.end('remote stack must not enter the tool error'); }
    if (req.url === '/binary') { res.writeHead(200, { 'content-type': 'image/png' }); return res.end('binary'); }
    if (req.url === '/slow') return;
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(req.url === '/large' ? '汉'.repeat(200) : '<h1>Reference</h1>\n<p>keep the raw markup</p>');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    const doc = await readDoc(url + '/redirect');
    assert.equal(doc.ok, true); assert.equal(doc.url, url + '/doc');
    assert.equal(doc.content, '<h1>Reference</h1>\n<p>keep the raw markup</p>'); assert.equal(doc.truncated, false);
    const large = await readDoc(url + '/large', { maxBytes: 100 });
    assert.equal(large.truncated, true); assert.equal(large.content, '汉'.repeat(33));
    assert.deepEqual(await readDoc(url + '/missing'), { ok: false, error: 'read_doc: HTTP 404' });
    assert.equal((await readDoc(url + '/binary')).ok, false);
    assert.match((await readDoc(url + '/slow', { timeoutMs: 30 })).error, /timed out$/);
    assert.match((await readDoc(url, { signal: AbortSignal.abort() })).error, /cancelled$/);
    assert.match((await readDoc('file:///example')).error, /HTTP\(S\) URL$/);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  assert.deepEqual(await readDoc(url), { ok: false, error: 'read_doc: Network request failed' });
});
