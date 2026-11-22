import type { Meta, StoryObj } from '@storybook/sveltekit';
import { algorithmItems, aStar } from '../stories/fixtures.ts';
import AlgorithmTemplate from './AlgorithmTemplate.svelte';

const meta = {
	title: 'Templates/AlgorithmTemplate',
	component: AlgorithmTemplate,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AlgorithmTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

const impl = algorithmItems('heuristic-search').find((a) => a.slug === 'a-star')!;

export const AStar: Story = {
	args: {
		algorithm: {
			slug: 'a-star',
			name: 'A*',
			aliases: impl.aliases,
			kind: 'search',
			hue: 205,
			description:
				'A* expands the open state with the lowest `f = g + h`. With an *admissible* `h`, the first goal it expands is reached optimally.',
			refs: [],
			papers: aStar.papers,
			buildsOn: [],
			builtUponBy: [],
			pseudocode: aStar.listing,
			trace: aStar.gridTrace,
			implementations: [
				{ crate: 'heuristic-search', summary: impl.summary, feature: null, items: impl.items }
			]
		},
		back: '#',
		before: [{ name: "Dijkstra's algorithm", href: '#', relation: 'generalizes' }],
		after: [],
		crateHref: () => '#'
	}
};
