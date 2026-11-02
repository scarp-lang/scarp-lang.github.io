import { project } from '../data/project';
import { pages } from '../site/pages.ts';
export const GET = () => {
  const urls = pages.filter(page => !page.noindex).map(page => `${project.origin}${page.path}`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
