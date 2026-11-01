import { project } from './project';

export const helpTopics = [
  { id: 'installation', title: 'Install and run Scarp', description: 'Choose the right package, verify its checksum, and run the executable from its extracted folder.', path: 'guide/installation', label: 'Installation guide' },
  { id: 'version', title: 'Check your version', description: 'Older executables can use different syntax. Confirm your version before following an example.', path: 'reference/compatibility', label: 'Compatibility guide' },
  { id: 'diagnostics', title: 'Understand an error', description: 'Look up an error code, read the source location, and follow the diagnostic’s repair guidance.', path: 'reference/diagnostics', label: 'Diagnostic reference' },
  { id: 'modules', title: 'Resolve an import', description: 'Check relative .srp paths, the trusted entry directory, public exports, and import cycles.', path: 'language/modules', label: 'Source module guide' },
  { id: 'numerics', title: 'Explore numerical behavior', description: 'Check finite values, compatible types, vector dimensions, and the operation’s documented limits.', path: 'language/numerics', label: 'Numerical guide' },
  { id: 'budgets', title: 'Investigate a runtime limit', description: 'Inspect loop termination and numerical allocations before changing an execution budget.', path: 'reference/budgets', label: 'Budget reference' },
] as const;

export const supportRoutes = [
  { id: 'compiler', title: 'Language or runtime', description: 'Scarp programs, command-line behavior, feature ideas, and interpreter bugs.', repo: project.repo, label: 'Language issue tracker' },
  { id: 'docs', title: 'Documentation', description: 'Tutorial mistakes, translations, unclear explanations, and broken documentation links.', repo: 'https://github.com/scarp-lang/scarp-docs', label: 'Documentation issue tracker' },
  { id: 'website', title: 'This website', description: 'Project-hub content, navigation, accessibility, and display or interaction problems.', repo: project.websiteRepo, label: 'Website issue tracker' },
] as const;
