import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const executable = process.env.SCARP_BIN;
assert(executable, 'Set SCARP_BIN to the v0.0.5-alpha.1 Scarp executable');
const executablePath = resolve(executable);
const run = (args: readonly string[]) => spawnSync(executablePath, args, { encoding: 'utf8', timeout: 15000 });
const version = run(['--version']);
assert.equal(version.status, 0, version.stderr);
assert.match(version.stdout, /0\.0\.5-alpha\.1\b/, 'Examples must target the pinned release');
const directory = resolve('src/examples');
const sources = (await readdir(directory)).filter(name => name.endsWith('.srp'));
for (const file of sources) {
  const path = join(directory, file);
  const expected = await readFile(path.replace(/\.srp$/, '.stdout'), 'utf8');
  const result = run(['run', path]);
  assert.equal(result.error, undefined, String(result.error));
  assert.equal(result.status, 0, `${file}: ${result.stderr}`);
  assert.equal(result.stdout, expected, `${file}: stdout mismatch`);
  assert.equal(result.stderr, '', `${file}: unexpected stderr`);
  const check = run(['check', path]);
  assert.equal(check.status, 0, `${file}: check failed: ${check.stderr}`);
  assert.equal(check.stdout, '', `${file}: check should be silent`);
  console.log(`PASS ${file}: run output and check`);
}
console.log(`${sources.length} website examples verified against ${version.stdout.trim()}.`);
