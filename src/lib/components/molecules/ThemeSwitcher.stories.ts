import type { Meta, StoryObj } from '@storybook/sveltekit';
import ThemeSwitcher from './ThemeSwitcher.svelte';

const meta = {
	title: 'Molecules/ThemeSwitcher',
	component: ThemeSwitcher,
	tags: ['autodocs']
} satisfies Meta<typeof ThemeSwitcher>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
