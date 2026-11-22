import type { Meta, StoryObj } from '@storybook/sveltekit';
import Logo from './Logo.svelte';

const meta = {
	title: 'Atoms/Logo',
	component: Logo,
	tags: ['autodocs']
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: '4rem' } };
