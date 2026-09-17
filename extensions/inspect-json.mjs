import { open } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const kind = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
const own = (object, key) => Object.hasOwn(object, key);

// Shared only by the two JSON readers; deliberately not a schema validator.
export function inspectJsonBytes(bytes, { pointer = '', requiredKeys = [] } = {}) {
  if (typeof pointer !== 'string' || (pointer !== '' && !pointer.startsWith('/')) || /~(?![01])/u.test(pointer))
    throw new Error('Use a JSON Pointer: empty for root, or /key/0; escape ~ as ~0 and / as ~1');
  if (!Array.isArray(requiredKeys) || requiredKeys.length > 40 || requiredKeys.some(key => typeof key !== 'string' || key.length > 160))
    throw new Error('requiredKeys must contain at most 40 key names of at most 160 characters');
  let root;
  try { root = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new Error('Invalid UTF-8 or JSON; no document content included in this error'); }
  const pending = [root]; let unsafeIntegerCount = 0;
  while (pending.length) {
    const value = pending.pop();
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) throw new Error('Number exceeds JavaScript finite range; use a precision-aware reader');
      if (Number.isInteger(value) && !Number.isSafeInteger(value)) unsafeIntegerCount++;
    } else if (value !== null && typeof value === 'object') {
      for (const child of Object.values(value)) pending.push(child);
    }
  }
  let selected = root;
  for (const token of pointer === '' ? [] : pointer.slice(1).split('/').map(part => part.replace(/~1/g, '/').replace(/~0/g, '~'))) {
    if (selected === null || typeof selected !== 'object'
        || (Array.isArray(selected) && !/^(0|[1-9][0-9]*)$/.test(token)) || !own(selected, token))
      throw new Error('JSON Pointer does not identify a value in this document');
    selected = selected[token];
  }
  if (requiredKeys.length && kind(selected) !== 'object') throw new Error('requiredKeys checks an object; select an object first');
  const keys = kind(selected) === 'object' ? Object.keys(selected) : [];
  const missingKeys = requiredKeys.filter(key => !own(selected, key));
  const serialized = JSON.stringify(selected, null, 2);
  const limit = 8000;
  // Do not split a UTF-16 surrogate pair at the excerpt boundary.
  let end = Math.min(limit, serialized.length);
  if (end < serialized.length && /[\uD800-\uDBFF]/u.test(serialized[end - 1])) end--;
  return { bytes: bytes.byteLength, sha256: createHash('sha256').update(bytes).digest('hex'),
    rootType: kind(root), pointer, selectedType: kind(selected),
    itemCount: Array.isArray(selected) ? selected.length : null,
    keyCount: keys.length, keys: keys.slice(0, 40).map(key => key.slice(0, 160)),
    keysTruncated: keys.length > 40 || keys.slice(0, 40).some(key => key.length > 160),
    requiredKeys, missingKeys, checksPassed: missingKeys.length === 0, unsafeIntegerCount,
    excerpt: serialized.slice(0, end), excerptTruncated: end < serialized.length };
}

export async function inspectJsonFile(input, { cwd = process.cwd(), signal, maxBytes = 1048576 } = {}) {
  const fail = message => ({ ok: false, error: `inspect_json: ${message}` });
  if (!input || typeof input.path !== 'string' || !input.path.trim()) return fail('Provide a local file path');
  let file;
  try {
    if (signal?.aborted) return fail('Cancelled');
    const path = resolve(cwd, input.path);
    file = await open(path, 'r');
    const stat = await file.stat();
    if (!stat.isFile()) return fail('Expected a regular file');
    if (stat.size > maxBytes) return fail('File exceeds 1 MiB; select a smaller input');
    const bytes = Buffer.alloc(maxBytes + 1); let size = 0;
    while (size < bytes.length) {
      if (signal?.aborted) return fail('Cancelled');
      const { bytesRead } = await file.read(bytes, size, bytes.length - size, null);
      if (!bytesRead) break;
      size += bytesRead;
    }
    if (size > maxBytes) return fail('File exceeds 1 MiB; select a smaller input');
    if (signal?.aborted) return fail('Cancelled');
    let inspected;
    try { inspected = inspectJsonBytes(bytes.subarray(0, size), input); }
    catch (error) { return fail(error.message); }
    return { ok: true, path, observedAt: new Date().toISOString(), ...inspected };
  } catch (error) {
    return fail(error.code === 'ENOENT' ? 'File not found' : error.code === 'EACCES' || error.code === 'EPERM'
      ? 'File access denied' : 'Could not read the file');
  } finally { await file?.close().catch(() => {}); }
}
