import { SITE_URL } from '#lib/site.js';

// Everything may be crawled. Crawlers read robots.txt only at a host's root, and
// sunsided.github.io has none (a 404 there already means "allowed"), so this file mostly
// points readers and tools at the sitemap and llms.txt.
export const prerender = true;

export function GET() {
	return new Response(
		`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n# For language models: ${SITE_URL}/llms.txt\n`,
		{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
	);
}
