import { error } from '@sveltejs/kit';
import { algorithmPage, RELEASED } from '#lib/server/algorithms.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => RELEASED.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const algorithm = algorithmPage(params.slug);
	if (!algorithm) error(404, 'No such algorithm');
	return { algorithm };
};
