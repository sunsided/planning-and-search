import type { Meta, StoryObj } from '@storybook/sveltekit';
import Node from './Node.svelte';

const meta = {
	title: 'Atoms/Node',
	component: Node,
	tags: ['autodocs']
} satisfies Meta<typeof Node>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = { args: { size: '1.5rem' } };
export const Hollow: Story = { args: { size: '1.5rem', hollow: true } };
