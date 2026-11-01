import { supportRoutes } from '../data/support.ts';

export type SupportTarget = typeof supportRoutes[number]['id'];
export type ReportKind = 'bug' | 'question' | 'feature';
export interface ReportInput {
  target: SupportTarget;
  kind: ReportKind;
  summary: string;
  version: string;
  environment: string;
  page: string;
  command: string;
  reproducer: string;
  expected: string;
  actual: string;
}

const labels: Record<ReportKind, string> = { bug: 'Bug', question: 'Question', feature: 'Feature request' };
const clean = (value: string) => value.replace(/\r\n?/g, '\n').trim();
const oneLine = (value: string) => clean(value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ');
const provided = (value: string) => clean(value) || '_Not provided._';

/** Keep pasted code fences inside the example, including nested Markdown snippets. */
function codeBlock(value: string, language = ''): string {
  if (!clean(value)) return '_Not provided._';
  const fence = '`'.repeat(Math.max(3, ...[...value.matchAll(/`+/g)].map(match => match[0].length + 1)));
  return `${fence}${language}\n${clean(value)}\n${fence}`;
}

/** Only the three official repositories are valid destinations. */
export function issueLink(target: SupportTarget, title: string, body: string) {
  const route = supportRoutes.find(route => route.id === target);
  if (!route) throw new TypeError('Choose a supported issue destination.');
  const url = new URL(`${route.repo}/issues/new`);
  url.searchParams.set('title', title);
  url.searchParams.set('body', body);
  // Encoded Unicode and long examples can exceed practical URL limits.
  const needsPaste = url.href.length > 7000;
  return { url: needsPaste ? `${route.repo}/issues/new/choose` : url.href, needsPaste, repository: route.repo };
}

export function buildSupportReport(input: ReportInput) {
  if (!Object.hasOwn(labels, input.kind)) throw new TypeError('Choose a supported report type.');
  const summary = oneLine(input.summary);
  if (summary.length < 3) throw new TypeError('Add a short summary of at least three characters.');
  const title = `[${labels[input.kind]}] ${summary}`.slice(0, 150);
  const body = [
    '## Request type', labels[input.kind],
    '## Version and environment',
    `- Scarp version: ${oneLine(input.version) || 'Not provided'}\n- Operating system, CPU, and browser: ${oneLine(input.environment) || 'Not provided'}\n- Affected page: ${oneLine(input.page) || 'Not applicable / not provided'}`,
    '## Command', codeBlock(input.command, 'text'),
    '## Smallest example or reproduction steps', codeBlock(input.reproducer, 'text'),
    '## Expected behavior or proposed improvement', provided(input.expected),
    '## Actual behavior, diagnostic, or question', provided(input.actual),
  ].join('\n\n') + '\n';
  return { title, body, ...issueLink(input.target, title, body) };
}
