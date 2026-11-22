import { KINDS } from '#lib/kinds.js';
import { RELEASED } from '#lib/server/algorithms.js';
import { CRATES } from '#lib/registry.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	groups: Object.entries(KINDS)
		.map(([kind, title]) => ({
			kind,
			title,
			entries: RELEASED.filter((a) => a.kind === kind)
				.map((a) => ({
					slug: a.slug,
					name: a.name,
					crates: CRATES.filter((c) => c.algorithms.includes(a.slug)).map((c) => c.name)
				}))
				.sort((x, y) => x.name.localeCompare(y.name))
		}))
		.filter((g) => g.entries.length)
});
