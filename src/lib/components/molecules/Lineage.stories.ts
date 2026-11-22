import type { Meta, StoryObj } from '@storybook/sveltekit';
import Lineage from './Lineage.svelte';

const meta = {
	title: 'Molecules/Lineage',
	component: Lineage,
	tags: ['autodocs']
} satisfies Meta<typeof Lineage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		name: 'A*',
		before: [{ name: "Dijkstra's algorithm", href: '#', relation: 'generalizes' }],
		after: [
			{ name: 'Weighted A*', href: '#', relation: 'builds-on' },
			{ name: 'IDA*', href: null, relation: 'builds-on' }
		]
	}
};
