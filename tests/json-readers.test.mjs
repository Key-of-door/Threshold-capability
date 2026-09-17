import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { inspectJsonBytes, inspectJsonFile } from '../extensions/inspect-json.mjs';
import { readJsonApi } from '../extensions/read-json-api.mjs';

test('local JSON: cwd, exact read identity, missing keys are findings, no writes', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'threshold-json-'));
  const bytes = Buffer.from('\uFEFF{"items":[{"name":"样本","value":null}]}');
  try {
    await writeFile(join(cwd, 'sample.json'), bytes);
    const result = await inspectJsonFile({ path: 'sample.json', pointer: '/items/0', requiredKeys: ['name', 'value', 'unit'] }, { cwd });
    assert.equal(result.ok, true);
    assert.equal(result.path, join(cwd, 'sample.json'));
    assert.equal(result.sha256, createHash('sha256').update(bytes).digest('hex'));
    assert.equal(result.rootType, 'object'); assert.equal(result.selectedType, 'object');
    assert.deepEqual(result.missingKeys, ['unit']); assert.equal(result.checksPassed, false);
    assert.equal(JSON.parse(result.excerpt).name, '样本');
    assert.deepEqual(await readFile(join(cwd, 'sample.json')), bytes);
    assert.match((await inspectJsonFile({ path: 'absent.json' }, { cwd })).error, /File not found/);
    assert.match((await inspectJsonFile({ path: '.' }, { cwd })).error, /regular file/);
    assert.match((await inspectJsonFile({ path: 'sample.json' }, { cwd, maxBytes: 10 })).error, /exceeds/);
    assert.match((await inspectJsonFile({ path: 'sample.json' }, { cwd, signal: AbortSignal.abort() })).error, /Cancelled/);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test('JSON Pointer preserves null, escapes, empty keys and own-property boundaries', () => {
  const bytes = Buffer.from('{"a/b":{"~":null},"":false,"list":[0],"__proto__":{"value":1}}');
  assert.equal(inspectJsonBytes(bytes, { pointer: '/a~1b/~0' }).selectedType, 'null');
  assert.equal(inspectJsonBytes(bytes, { pointer: '/' }).excerpt, 'false');
  assert.equal(inspectJsonBytes(bytes, { pointer: '/__proto__/value' }).excerpt, '1');
  for (const pointer of ['/toString', '/list/length', '/list/00', '/list/-', '/list/2'])
    assert.throws(() => inspectJsonBytes(bytes, { pointer }), /does not identify/);
  for (const pointer of ['a', '/a~2b']) assert.throws(() => inspectJsonBytes(bytes, { pointer }), /JSON Pointer/);
  assert.throws(() => inspectJsonBytes(bytes, { pointer: '/list', requiredKeys: ['x'] }), /select an object/);
  assert.throws(() => inspectJsonBytes(bytes, { requiredKeys: 'x' }), /requiredKeys/);
});

test('JSON readers expose limits rather than pretending to validate schema or numeric precision', () => {
  const large = inspectJsonBytes(Buffer.from(JSON.stringify({ body: '字'.repeat(9000) })));
  assert.equal(large.excerptTruncated, true); assert.ok(large.excerpt.length <= 8000);
  const keys = inspectJsonBytes(Buffer.from(JSON.stringify(Object.fromEntries(Array.from({ length: 41 }, (_, i) => ['k' + i, i])))));
  assert.equal(keys.keyCount, 41); assert.equal(keys.keys.length, 40); assert.equal(keys.keysTruncated, true);
  assert.equal(inspectJsonBytes(Buffer.from('{"n":9007199254740993}')).unsafeIntegerCount, 1);
  assert.throws(() => inspectJsonBytes(Buffer.from('{"n":1e400}')), /finite range/);
  assert.equal(inspectJsonBytes(Buffer.from('{"n":1,"n":2}')).excerpt, '{\n  "n": 2\n}');
  for (const bytes of [Buffer.from('{"private":"do not echo this"'), Buffer.from([0xff])]) {
    assert.throws(() => inspectJsonBytes(bytes), error => /Invalid UTF-8 or JSON/.test(error.message) && !error.message.includes('private'));
  }
});

test('JSON API uses one anonymous GET; errors, redirects, limits and cancellation stay technical', async () => {
  const requests = [];
  const server = createServer((req, res) => {
    requests.push({ url: req.url, method: req.method, auth: req.headers.authorization });
    if (req.url === '/redirect') { res.writeHead(302, { location: '/ok' }); return res.end(); }
    if (req.url === '/forbidden') { res.writeHead(403); return res.end('private backend stack'); }
    if (req.url === '/slow') return;
    if (req.url === '/text') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<h1>not JSON</h1>'); }
    res.writeHead(200, { 'content-type': 'application/problem+json; charset=utf-8' });
    res.end(req.url === '/bad' ? '{"private":"do not echo"' : req.url === '/large' ? JSON.stringify('x'.repeat(200)) : '{"data":{"name":"demo"}}');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const result = await readJsonApi({ url: base + '/ok', pointer: '/data', requiredKeys: ['name', 'version'] });
    assert.equal(result.ok, true); assert.equal(result.status, 200);
    assert.deepEqual(result.missingKeys, ['version']); assert.equal(result.checksPassed, false);
    assert.equal(JSON.parse(result.excerpt).name, 'demo');
    const before = requests.length;
    assert.match((await readJsonApi({ url: base + '/redirect' })).error, /redirects are not followed/);
    assert.equal(requests.length, before + 1);
    assert.deepEqual(await readJsonApi({ url: base + '/forbidden' }), { ok: false, error: 'read_json_api: HTTP 403' });
    assert.match((await readJsonApi({ url: base + '/bad' })).error, /Invalid UTF-8 or JSON/);
    assert.match((await readJsonApi({ url: base + '/text' })).error, /JSON content type/);
    assert.match((await readJsonApi({ url: base + '/large' }, { maxBytes: 100 })).error, /exceeds/);
    assert.match((await readJsonApi({ url: base + '/slow' }, { timeoutMs: 40 })).error, /timed out/);
    assert.match((await readJsonApi({ url: base }, { signal: AbortSignal.abort() })).error, /cancelled/);
    assert.match((await readJsonApi({ url: 'file:///example' })).error, /HTTP\(S\)/);
    assert.match((await readJsonApi({ url: `http://user:password@127.0.0.1:${server.address().port}` })).error, /credentials/);
    assert.ok(requests.every(req => req.method === 'GET' && req.auth === undefined));
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  assert.deepEqual(await readJsonApi({ url: base }), { ok: false, error: 'read_json_api: Network request failed' });
});
