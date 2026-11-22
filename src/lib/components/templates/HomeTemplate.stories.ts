import type { Meta, StoryObj } from '@storybook/sveltekit';
import { relatedCrates } from '#lib/registry.js';
import { allCategories, audienceCards, href } from '../stories/fixtures.ts';
import HomeTemplate from './HomeTemplate.svelte';

const meta = {
	title: 'Templates/HomeTemplate',
	component: HomeTemplate,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof HomeTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		categories: allCategories,
		crateHref: href,
		audiences: audienceCards,
		related: relatedCrates()
	}
};
