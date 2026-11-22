import type { Meta, StoryObj } from '@storybook/sveltekit';
import RichText from './RichText.svelte';

const meta = {
	title: 'Atoms/RichText',
	component: RichText,
	tags: ['autodocs']
} satisfies Meta<typeof RichText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		text: 'Uses **CBS** with *disjoint splitting*, `A*` on each agent, and [multiobjective-search](https://github.com/sunsided/multiobjective-search) for MO-CBS; A\\* stays literal.'
	}
};
