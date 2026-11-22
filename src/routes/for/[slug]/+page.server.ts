import { error } from '@sveltejs/kit';
import { ALGORITHMS } from '#lib/algorithms.js';
import { AUDIENCES, audience } from '#lib/audiences.js';
import { categoryOf, crate } from '#lib/registry.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => AUDIENCES.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const a = audience(params.slug);
	if (!a) error(404, 'No such page');
	const info = (name: string) => {
		const c = crate(name)!;
		return { repo: c.repo, description: c.description, hue: categoryOf(name)!.hue };
	};
	return {
		audience: a,
		start: { ...a.start, ...info(a.start.crate) },
		crates: a.crates.map((p) => ({ ...p, ...info(p.crate) })),
		algorithms: a.algorithms.map((slug) => ({
			slug,
			name: ALGORITHMS.find((x) => x.slug === slug)!.name
		}))
	};
};
