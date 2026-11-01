import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://scarp-lang.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { server: { allowedHosts: ['terminal.local'] } },
});
