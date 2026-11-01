import { project } from '../data/project';
const pages = import.meta.glob('./**/*.{astro,md}');
export const GET = () => {
  const urls = Object.keys(pages).filter(path => !path.includes('404.astro')).map(path => {
    const route = path.replace(/^\.\//, '/').replace(/\.(astro|md)$/, '').replace(/\/index$/, '/').replace(/\/$/, '');
    return `${project.origin}${route}/`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
