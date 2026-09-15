const operations = new Set(['repository', 'issue', 'pull_request', 'pull_files', 'commit_status', 'check_runs']);
const pick = (value, keys) => Object.fromEntries(keys.map(key => [key, value[key] ?? null]));
const excerpt = (text, limit) => ({ text: typeof text === 'string' ? text.slice(0, limit) : null,
  truncated: typeof text === 'string' && text.length > limit });

// Fixed public GitHub REST reads. The injected fetch is only a local test seam.
export async function githubRead(input, { signal, fetchImpl = fetch, token = process.env.GITHUB_TOKEN,
  timeoutMs = 15000, maxBytes = 524288 } = {}) {
  const fail = message => ({ ok: false, error: `github_read: ${message}` });
  if (!input || !operations.has(input.operation)) return fail('unsupported operation');
  if (typeof input.repo !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9_.-]+$/.test(input.repo)
      || ['.', '..'].includes(input.repo.split('/')[1])) return fail('repo must be owner/name');
  const { operation, repo, number, sha } = input;
  const page = input.page ?? 1;
  if (!Number.isSafeInteger(page) || page < 1) return fail('page must be a positive integer');
  if (['issue', 'pull_request', 'pull_files'].includes(operation) && (!Number.isSafeInteger(number) || number < 1))
    return fail('number must be a positive integer');
  if (['commit_status', 'check_runs'].includes(operation) && (typeof sha !== 'string' || !/^[a-fA-F0-9]{40}$/.test(sha)))
    return fail('sha must be an exact 40-character commit SHA');
  const suffix = { repository: '', issue: `/issues/${number}`, pull_request: `/pulls/${number}`,
    pull_files: `/pulls/${number}/files`, commit_status: `/commits/${sha}/status`, check_runs: `/commits/${sha}/check-runs` }[operation];
  const paginated = ['pull_files', 'commit_status', 'check_runs'].includes(operation);
  const url = `https://api.github.com/repos/${repo}${suffix}${paginated ? `?per_page=10&page=${page}` : ''}`;
  const deadline = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline;
  let reader;
  try {
    const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'Threshold-capability-github-read' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetchImpl(url, { method: 'GET', headers, signal: combined, redirect: 'error' });
    if (!response.ok) {
      await response.body?.cancel();
      return fail(`HTTP ${response.status}${response.status === 403 || response.status === 429 ? ' (access denied or rate limited)' : ''}`);
    }
    if (!response.body) return fail('empty response');
    reader = response.body.getReader();
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > maxBytes) return fail('response exceeds 512 KiB; narrow the read');
      chunks.push(value);
    }
    let data;
    try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return fail('invalid JSON response'); }
    const common = { ok: true, operation, repo, url, fetchedAt: new Date().toISOString() };
    const pagination = { page, nextPage: /rel="next"/.test(response.headers.get('link') ?? '') ? page + 1 : null };
    let result;
    if (operation === 'repository') result = pick(data, ['full_name', 'html_url', 'description', 'private', 'archived', 'default_branch', 'language', 'pushed_at']);
    if (operation === 'issue' || operation === 'pull_request') {
      result = { ...pick(data, ['number', 'html_url', 'title', 'state', 'created_at', 'updated_at', 'closed_at']),
        author: data.user?.login ?? null, body: excerpt(data.body, 6000) };
      if (operation === 'issue') result.isPullRequest = Boolean(data.pull_request);
      else Object.assign(result, pick(data, ['draft', 'merged', 'merged_at', 'mergeable', 'mergeable_state', 'changed_files', 'additions', 'deletions']),
        { head: { sha: data.head?.sha ?? null, ref: data.head?.ref ?? null }, base: { sha: data.base?.sha ?? null, ref: data.base?.ref ?? null } });
    }
    if (operation === 'pull_files') result = { ...pagination, files: data.map(file => ({
      ...pick(file, ['filename', 'previous_filename', 'status', 'sha', 'additions', 'deletions', 'changes']),
      patch: excerpt(file.patch, 4000), patchMissing: typeof file.patch !== 'string' })) };
    if (operation === 'commit_status') result = { ...pagination, ...pick(data, ['sha', 'state', 'total_count']),
      statuses: data.statuses.map(item => pick(item, ['context', 'state', 'description', 'target_url', 'updated_at'])) };
    if (operation === 'check_runs') result = { ...pagination, requestedSha: sha, total_count: data.total_count,
      check_runs: data.check_runs.map(item => pick(item, ['id', 'name', 'head_sha', 'status', 'conclusion', 'html_url', 'started_at', 'completed_at'])) };
    return { ...common, result };
  } catch {
    return fail(signal?.aborted ? 'cancelled' : deadline.aborted ? 'request timed out' : 'network or unexpected response error');
  } finally { if (reader) await reader.cancel().catch(() => {}); }
}
