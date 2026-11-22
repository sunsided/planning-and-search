import type { Meta, StoryObj } from '@storybook/sveltekit';
import Notation from './Notation.svelte';

const meta = {
	title: 'Atoms/Notation',
	component: Notation,
	tags: ['autodocs']
} satisfies Meta<typeof Notation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Superscript: Story = { args: { text: 'Additive h^max' } };
export const Subscript: Story = { args: { text: 'Relevance score h_Ξ' } };
export const Grouped: Story = { args: { text: 'h^{LM-cut}' } };
