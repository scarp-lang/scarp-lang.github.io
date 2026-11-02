import { readFileSync } from 'node:fs';

/** Build/dev-server data only. Browser bundles never import filesystem APIs. */
export function getExamples() {
  return [['hello', 'The basics'], ['functions', 'Functions'], ['numerics', 'Numerics']].map(([id, label]) => ({
    id, label, filename: `${id}.srp`,
    code: readFileSync(new URL(`../examples/${id}.srp`, import.meta.url), 'utf8'),
    output: readFileSync(new URL(`../examples/${id}.stdout`, import.meta.url), 'utf8'),
  }));
}
