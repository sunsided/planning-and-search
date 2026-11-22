import type { Meta, StoryObj } from '@storybook/sveltekit';
import { text } from '../stories/fixtures.ts';
import Badge from './Badge.svelte';

const meta = {
	title: 'Atoms/Badge',
	component: Badge,
	tags: ['autodocs']
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = { args: { tone: 'outline', children: text('no_std') } };
export const Accent: Story = { args: { tone: 'accent', children: text('optional') } };
