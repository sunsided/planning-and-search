import type { Meta, StoryObj } from '@storybook/sveltekit';
import { algorithmsOf } from '#lib/registry.js';
import AlgorithmList from './AlgorithmList.svelte';

const meta = {
	title: 'Molecules/AlgorithmList',
	component: AlgorithmList,
	tags: ['autodocs']
} satisfies Meta<typeof AlgorithmList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { algorithms: algorithmsOf('width-search') } };
