import readmes from '#lib/data/readmes.json' with { type: 'json' };
import { entries } from '#lib/search-index.js';
import { withReadmes } from '#lib/search.js';
import { BASE_PATH } from '#lib/site.js';

// The palette's index, fetched when it first opens. Hrefs are absolute paths under the base,
// since the file is read from every page depth.
export const prerender = true;

export function GET() {
	const index = withReadmes(
		entries({
			crate: (name) => `${BASE_PATH}/crates/${name}/`,
			category: (slug) => `${BASE_PATH}/#${slug}`,
			algorithm: (slug) => `${BASE_PATH}/algorithms/${slug}/`
		}),
		readmes
	);
	return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
}
