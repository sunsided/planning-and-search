import type { Meta, StoryObj } from '@storybook/sveltekit';
import { refs } from '../stories/fixtures.ts';
import CrateRelations from './CrateRelations.svelte';

const meta = {
	title: 'Organisms/CrateRelations',
	component: CrateRelations,
	tags: ['autodocs']
} satisfies Meta<typeof CrateRelations>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		dependencies: refs(['sas-plus', 'search-core']),
		dependents: refs(['decoupled-search'], 'optional')
	}
};
export const Unconnected: Story = { args: { dependencies: [], dependents: [] } };
