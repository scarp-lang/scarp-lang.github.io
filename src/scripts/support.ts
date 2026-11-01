import { buildSupportReport, issueLink, type ReportInput, type ReportKind, type SupportTarget } from '../lib/support-report';

const builder = document.querySelector<HTMLElement>('[data-report-builder]');
if (builder) {
  const form = builder.querySelector<HTMLFormElement>('[data-support-form]');
  const output = builder.querySelector<HTMLElement>('[data-report-output]');
  const draft = builder.querySelector<HTMLTextAreaElement>('[data-report-draft]');
  const titleElement = builder.querySelector<HTMLElement>('[data-draft-title]');
  const heading = builder.querySelector<HTMLElement>('[data-draft-heading]');
  const link = builder.querySelector<HTMLAnchorElement>('[data-issue-link]');
  const note = builder.querySelector<HTMLElement>('[data-issue-note]');
  const status = builder.querySelector<HTMLElement>('[data-report-status]');
  const copy = builder.querySelector<HTMLButtonElement>('[data-copy-report]');
  const select = builder.querySelector<HTMLButtonElement>('[data-select-report]');
  if (form && output && draft && titleElement && heading && link && note && status && copy && select) {
    let current: { target: SupportTarget; title: string } | undefined;
    const announce = (text: string) => { status.textContent = text; };
    const updateLink = () => {
      if (!current) return;
      const destination = issueLink(current.target, current.title, draft.value);
      link.href = destination.url;
      note.textContent = destination.needsPaste
        ? 'This draft is long. Copy the report details, choose a GitHub issue form, and paste your draft there.'
        : 'The next link opens a prefilled GitHub draft. Review it there and submit when you are ready.';
    };
    form.hidden = false;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const value = (name: string) => String(data.get(name) ?? '');
      const input: ReportInput = {
        target: value('target') as SupportTarget, kind: value('kind') as ReportKind,
        summary: value('summary'), version: value('version'), environment: value('environment'),
        page: value('page'), command: value('command'), reproducer: value('reproducer'),
        expected: value('expected'), actual: value('actual'),
      };
      try {
        const report = buildSupportReport(input);
        current = { target: input.target, title: report.title };
        titleElement.textContent = report.title;
        draft.value = report.body;
        updateLink();
        output.hidden = false;
        announce('Draft prepared. Review and edit it below.');
        heading.focus();
      } catch (error) { announce(error instanceof Error ? error.message : 'Check the report details and try again.'); }
    });
    const invalidate = () => {
      if (!current) return;
      current = undefined;
      output.hidden = true;
      draft.value = '';
      link.removeAttribute('href');
      announce('Details changed. Prepare a new draft to update the destination and report.');
    };
    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    form.addEventListener('reset', () => { invalidate(); announce('Form cleared.'); });
    draft.addEventListener('input', updateLink);
    select.addEventListener('click', () => { draft.focus(); draft.select(); announce('Draft text selected. Use your device’s copy command.'); });
    if (navigator.clipboard?.writeText) {
      copy.hidden = false;
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(draft.value); announce('Report details copied.'); }
        catch { draft.focus(); draft.select(); announce('Use your device’s copy command to copy the selected draft.'); }
      });
    }
  }
}
