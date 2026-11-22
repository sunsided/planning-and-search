import type { Meta, StoryObj } from '@storybook/sveltekit';
import { ICONS } from './Icon.svelte';
import Icon from './Icon.svelte';

const meta = {
	title: 'Atoms/Icon',
	component: Icon,
	tags: ['autodocs'],
	argTypes: { name: { control: 'select', options: ICONS } }
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: 'github', size: '2rem' } };
export const Labelled: Story = { args: { name: 'moon', size: '2rem', label: 'Dark theme' } };
