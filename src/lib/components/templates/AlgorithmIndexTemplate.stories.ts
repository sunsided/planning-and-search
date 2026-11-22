import type { Meta, StoryObj } from '@storybook/sveltekit';
import AlgorithmIndexTemplate from './AlgorithmIndexTemplate.svelte';

const meta = {
	title: 'Templates/AlgorithmIndexTemplate',
	component: AlgorithmIndexTemplate,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AlgorithmIndexTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		groups: [
			{
				kind: 'search',
				title: 'Search',
				entries: [
					{ name: 'A*', href: '#', crates: ['heuristic-search', 'miniplan'] },
					{ name: "Dijkstra's algorithm", href: '#', crates: ['heuristic-search'] }
				]
			},
			{
				kind: 'sampling',
				title: 'Sampling-based planning',
				entries: [{ name: 'RRT*', href: '#', crates: ['sampling-planning'] }]
			}
		]
	}
};
