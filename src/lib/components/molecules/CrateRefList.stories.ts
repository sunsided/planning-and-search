import type { Meta, StoryObj } from '@storybook/sveltekit';
import { refs } from '../stories/fixtures.ts';
import CrateRefList from './CrateRefList.svelte';

const meta = {
	title: 'Molecules/CrateRefList',
	component: CrateRefList,
	tags: ['autodocs']
} satisfies Meta<typeof CrateRefList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			...refs(['heuristic-search', 'search-core']),
			...refs(['multiobjective-search'], 'optional')
		]
	}
};
export const Empty: Story = { args: { items: [], empty: 'No other crate of this collection.' } };
