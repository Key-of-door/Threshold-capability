import test from 'node:test';
import assert from 'node:assert/strict';
import { githubRead } from '../extensions/github-read.mjs';
const sha = 'a'.repeat(40);
const json = (data, headers) => new Response(JSON.stringify(data), { headers });

test('fixed GET endpoint, environment-style token never returned, useful fields only', async () => {
  const result = await githubRead({ operation: 'repository', repo: 'owner/repo' }, { token: 'test-secret', fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.github.com/repos/owner/repo'); assert.equal(options.method, 'GET');
    assert.equal(options.redirect, 'error'); assert.equal(options.headers.Authorization, 'Bearer test-secret');
    return json({ full_name: 'owner/repo', temp_clone_token: 'private-value' });
  } });
  assert.equal(result.result.full_name, 'owner/repo'); assert.doesNotMatch(JSON.stringify(result), /test-secret|private-value/);
});
test('invalid identities cannot become API routes or write operations', async () => {
  for (const input of [{ operation: 'delete', repo: 'a/b' }, { operation: 'repository', repo: 'a/..' },
    { operation: 'repository', repo: 'a/b?x=1' }, { operation: 'issue', repo: 'a/b', number: 0 },
    { operation: 'check_runs', repo: 'a/b', sha: 'main' }, { operation: 'pull_files', repo: 'a/b', number: 1, page: -1 }]) {
    const result = await githubRead(input, { fetchImpl: () => { throw new Error('must not fetch'); } });
    assert.equal(result.ok, false); assert.doesNotMatch(result.error, /network/);
  }
});
test('PR identity, issue distinction, pagination and partial patch are explicit', async () => {
  const pr = await githubRead({ operation: 'pull_request', repo: 'a/b', number: 2 }, { fetchImpl: async () => json({ head: { sha }, body: 'x'.repeat(6001), mergeable: null }) });
  assert.equal(pr.result.head.sha, sha); assert.equal(pr.result.mergeable, null); assert.equal(pr.result.body.truncated, true);
  const issue = await githubRead({ operation: 'issue', repo: 'a/b', number: 2 }, { fetchImpl: async () => json({ pull_request: {} }) });
  assert.equal(issue.result.isPullRequest, true);
  const files = await githubRead({ operation: 'pull_files', repo: 'a/b', number: 2, page: 2 }, { fetchImpl: async url => {
    assert.match(url, /per_page=10&page=2$/);
    return json([{ filename: 'a', patch: 'x'.repeat(4001) }, { filename: 'b' }], { link: '<https://api.github.com/next>; rel="next"' });
  } });
  assert.equal(files.result.nextPage, 3); assert.equal(files.result.files[0].patch.truncated, true); assert.equal(files.result.files[1].patchMissing, true);
});
test('status and checks preserve absent, pending and null results', async () => {
  const status = await githubRead({ operation: 'commit_status', repo: 'a/b', sha }, { fetchImpl: async () => json({ sha, state: 'pending', total_count: 0, statuses: [] }) });
  assert.equal(status.result.state, 'pending'); assert.deepEqual(status.result.statuses, []);
  const checks = await githubRead({ operation: 'check_runs', repo: 'a/b', sha }, { fetchImpl: async () => json({ total_count: 1, check_runs: [{ head_sha: sha, status: 'in_progress', conclusion: null }] }) });
  assert.equal(checks.result.check_runs[0].conclusion, null); assert.equal(checks.result.requestedSha, sha);
});
test('HTTP, malformed/oversized data, network, abort and timeout stay short technical errors', async () => {
  const input = { operation: 'repository', repo: 'a/b' };
  for (const code of [401, 403, 404, 429]) {
    const result = await githubRead(input, { fetchImpl: async () => new Response('private server details', { status: code }) });
    assert.match(result.error, new RegExp(`HTTP ${code}`)); assert.doesNotMatch(result.error, /private/);
  }
  assert.match((await githubRead(input, { fetchImpl: async () => new Response('{') })).error, /invalid JSON/);
  assert.match((await githubRead(input, { maxBytes: 5, fetchImpl: async () => json({ full_name: 'a/b' }) })).error, /exceeds/);
  assert.match((await githubRead(input, { fetchImpl: async () => { throw new Error('secret stack'); } })).error, /network/);
  const controller = new AbortController(); controller.abort();
  const abortFetch = async (_url, { signal }) => { signal.throwIfAborted(); await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 100); signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
  }); };
  assert.match((await githubRead(input, { signal: controller.signal, fetchImpl: abortFetch })).error, /cancelled/);
  assert.match((await githubRead(input, { timeoutMs: 5, fetchImpl: abortFetch })).error, /timed out/);
});
