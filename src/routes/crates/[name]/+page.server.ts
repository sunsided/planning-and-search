import { error } from '@sveltejs/kit';
import { algorithmsOf } from '#lib/algorithms.js';
import { CRATES, categoryOf, crate } from '#lib/registry.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => CRATES.map(({ name }) => ({ name }));

export const load: PageServerLoad = ({ params }) => {
	const c = crate(params.name);
	const category = categoryOf(params.name);
	if (!c || !category) error(404, 'No such crate');
	return { crate: c, category, algorithms: algorithmsOf(c.name) };
};
