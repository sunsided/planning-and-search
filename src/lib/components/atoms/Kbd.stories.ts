import type { Meta, StoryObj } from '@storybook/sveltekit';
import { text } from '../stories/fixtures.ts';
import Kbd from './Kbd.svelte';

const meta = {
	title: 'Atoms/Kbd',
	component: Kbd,
	tags: ['autodocs']
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: text('Ctrl K') } };
export const Single: Story = { args: { children: text('Esc') } };
