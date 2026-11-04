export const project = {
  name: 'Scarp',
  origin: 'https://scarp-lang.github.io',
  repo: 'https://github.com/scarp-lang/scarp',
  websiteRepo: 'https://github.com/scarp-lang/scarp-lang.github.io',
  docs: 'https://scarp-lang.github.io/scarp-docs/',
  version: '0.0.5-alpha.1',
  tag: 'v0.0.5-alpha.1',
  source: 'afe8b5380c9d6c4774162e51c6c9bc8b90901671',
  evidenceSource: '1d3b69a79bb0f656b4da3517560ce59e1e41f3bc',
  reviewed: '2026-11-01',
  release: 'https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.1',
  contact: 'scarplang@gmail.com',
} as const;

export const sourceUrl = (path: string) => `${project.repo}/blob/${project.source}/${path}`;
export const verification = `${project.repo}/blob/${project.evidenceSource}/docs/releases/v0.0.5-alpha.1-validation.md`;

export const navigation = [
  ['Features', '/features/'], ['Ecosystem', '/ecosystem/'], ['Development', '/development/'],
  ['Roadmap', '/roadmap/'], ['Releases', '/releases/'],
  ['News', '/news/'], ['Docs ↗', project.docs], ['Community', '/community/'],
  ['Support', '/support/'],
] as const;

export const capabilities = [
  { number: '01', title: 'Clear foundations', text: 'Immutable bind and mutable var declarations, checked integers, finite floats, booleans, strings, and explicit output.', link: 'docs/variables.md', label: 'Language foundations' },
  { number: '02', title: 'Functions with intent', text: 'Typed funcra functions with named and default arguments, recursion, purity checks, and executable contracts.', link: 'docs/functions.md', label: 'Function reference' },
  { number: '03', title: 'A numerical starting point', text: 'Immutable vectors and two-axis tiles, stable reductions, softmax, matrix products, and explicit loss gradients.', link: 'docs/tiles.md', label: 'Numerical reference' },
  { number: '04', title: 'Programs that grow', text: 'Relative .srp source imports, explicit aliases, public functions and scalar constants, with cycle diagnostics.', link: 'docs/modules.md', label: 'Source modules' },
] as const;

export const downloads = [
  { name: 'Windows', architecture: 'x64 · MSVC', file: 'scarp-0.0.5-alpha.1-x86_64-pc-windows-msvc.zip', hash: '1726b45c5f41c71316708318477c6691ebff83245a09213b7fa29111b9405c1e' },
  { name: 'Linux', architecture: 'x64 · GNU', file: 'scarp-0.0.5-alpha.1-x86_64-unknown-linux-gnu.tar.gz', hash: 'd6c36ddccf69ce5f041c840ce44b05e0568c87046bbddc0f053f5ca125dcdf7e' },
  { name: 'macOS', architecture: 'ARM64 · Apple Silicon', file: 'scarp-0.0.5-alpha.1-aarch64-apple-darwin.tar.gz', hash: 'f4d8f1a1126c6e61682bce8735f9d70d482d864eb7143848e6b57892fd21da75' },
] as const;
export const downloadUrl = (file: string) => `${project.repo}/releases/download/${project.tag}/${file}`;

export const socials = [
  ['GitHub', 'Source, issues & releases', 'https://github.com/scarp-lang'],
  ['X', '@ScarpLang', 'https://x.com/ScarpLang'],
  ['YouTube', '@ScarpLang', 'https://www.youtube.com/@ScarpLang'],
  ['Instagram', '@scarplang', 'https://www.instagram.com/scarplang/'],
  ['Threads', '@scarplang', 'https://www.threads.net/@scarplang'],
  ['Bluesky', '@scarplang.bsky.social', 'https://bsky.app/profile/scarplang.bsky.social'],
  ['DEV Community', 'Scarp Programming Language', 'https://dev.to/scarplang'],
  ['Reddit', 'r/ScarpLang', 'https://www.reddit.com/r/ScarpLang/'],
] as const;

export const news = [
  { date: '2026-11-04', category: 'Language release', title: 'Scarp alpha.5: project inspection and experimental C11 emitter', description: 'Inspect explicit Scarp projects from the CLI and explore restricted scalar C11 code generation through a Rust embedding API.', href: '/news/alpha5-project-inspection/' },
  { date: '2026-11-03', category: 'Language release', title: 'Scarp alpha.4: projects you can create and launch', description: 'Create offline Scarp projects, verify them statically, and launch a manifest entrypoint with the published prerelease.', href: '/news/offline-projects/' },
  { date: '2026-11-01', category: 'Language release', title: 'Source modules arrive in v0.0.5-alpha.1', description: 'Relative imports, explicit exports, and a verified three-platform prerelease.', href: '/news/source-modules/' },
  { date: '2026-11-01', category: 'Project', title: 'A home for the language, and the work ahead', description: 'Introducing the official project hub and its connection to Scarp Docs.', href: '/news/official-website/' },
] as const;
