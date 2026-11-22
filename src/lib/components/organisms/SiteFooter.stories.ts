import type { Meta, StoryObj } from '@storybook/sveltekit';
import SiteFooter from './SiteFooter.svelte';

const meta = {
	title: 'Organisms/SiteFooter',
	component: SiteFooter,
	tags: ['autodocs']
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
