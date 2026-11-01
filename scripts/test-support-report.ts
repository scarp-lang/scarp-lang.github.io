import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSupportReport, issueLink } from '../src/lib/support-report.ts';
import type { ReportInput, ReportKind, SupportTarget } from '../src/lib/support-report.ts';

const input: ReportInput = {
  target: 'compiler', kind: 'bug', summary: 'An example reports a diagnostic',
  version: '0.0.5-alpha.1', environment: 'Windows 11, x64', page: '',
  command: './scarp.exe run hello.srp', reproducer: 'print("नमस्ते & hello");',
  expected: 'The greeting appears.', actual: 'A diagnostic appears.',
};

test('routes each report to its official repository and round-trips Unicode', () => {
  for (const [target, repo] of [['compiler', 'scarp'], ['docs', 'scarp-docs'], ['website', 'scarp-lang.github.io']] as const) {
    const result = buildSupportReport({ ...input, target });
    const url = new URL(result.url);
    assert.equal(url.origin, 'https://github.com');
    assert.equal(url.pathname, `/scarp-lang/${repo}/issues/new`);
    assert.equal(url.searchParams.get('body'), result.body);
    assert.equal(url.searchParams.get('title'), result.title);
    assert(result.body.includes('नमस्ते & hello'));
  }
});

test('keeps user code fences within one intact fenced example', () => {
  const result = buildSupportReport({ ...input, reproducer: '```scarp\r\nprint("x");\r\n```' });
  assert(result.body.includes('````text\n```scarp\nprint("x");\n```\n````'));
  assert(!result.body.includes('\r'));
});

test('offers copy-and-paste routing for long encoded reports', () => {
  const result = buildSupportReport({ ...input, actual: 'समस्या'.repeat(500) });
  assert.equal(result.needsPaste, true);
  assert.equal(result.url, 'https://github.com/scarp-lang/scarp/issues/new/choose');
  assert(result.body.includes('समस्या'.repeat(500)));
});

test('rebuilds an issue URL from the reviewed draft', () => {
  const result = issueLink('website', 'Page & navigation', '# Edited draft\n\nWhat I reviewed.');
  assert.equal(new URL(result.url).searchParams.get('body'), '# Edited draft\n\nWhat I reviewed.');
  assert.equal(new URL(result.url).searchParams.get('title'), 'Page & navigation');
});

test('rejects unknown destinations, types, and missing summaries', () => {
  // Deliberately bypass static types to exercise the runtime input boundary.
  assert.throws(() => buildSupportReport({ ...input, target: 'https://example.com' as SupportTarget }), TypeError);
  assert.throws(() => buildSupportReport({ ...input, kind: '__proto__' as ReportKind }), TypeError);
  assert.throws(() => buildSupportReport({ ...input, summary: '  ' }), TypeError);
});

test('keeps titles on one line and marks missing details honestly', () => {
  const result = buildSupportReport({ ...input, kind: 'question', summary: 'How does\ncheck work?', version: '', actual: '' });
  assert.equal(result.title, '[Question] How does check work?');
  assert(result.body.includes('Scarp version: Not provided'));
  assert(result.body.includes('_Not provided._'));
});
