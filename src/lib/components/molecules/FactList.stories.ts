import type { Meta, StoryObj } from '@storybook/sveltekit';
import { mapf, text } from '../stories/fixtures.ts';
import FactList from './FactList.svelte';

const meta = {
	title: 'Molecules/FactList',
	component: FactList,
	tags: ['autodocs']
} satisfies Meta<typeof FactList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		facts: [
			{ term: 'License', value: text(mapf.license) },
			{ term: 'Minimum Rust', value: text(`Rust ${mapf.msrv}`) }
		]
	}
};
