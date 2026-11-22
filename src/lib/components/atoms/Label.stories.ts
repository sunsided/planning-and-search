import type { Meta, StoryObj } from '@storybook/sveltekit';
import { text } from '../stories/fixtures.ts';
import Label from './Label.svelte';

const meta = {
	title: 'Atoms/Label',
	component: Label,
	tags: ['autodocs']
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: text('Minimum Rust') } };
