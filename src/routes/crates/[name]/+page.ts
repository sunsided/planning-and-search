import { error } from '@sveltejs/kit';
import { CRATES, categoryOf, crate } from '#lib/registry.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => CRATES.map(({ name }) => ({ name }));

export const load: PageLoad = ({ params }) => {
	const c = crate(params.name);
	const category = categoryOf(params.name);
	if (!c || !category) error(404, 'No such crate');
	return { crate: c, category };
};
