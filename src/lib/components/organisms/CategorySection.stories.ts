import type { Meta, StoryObj } from '@storybook/sveltekit';
import { allCategories, href } from '../stories/fixtures.ts';
import CategorySection from './CategorySection.svelte';

const meta = {
	title: 'Organisms/CategorySection',
	component: CategorySection,
	tags: ['autodocs']
} satisfies Meta<typeof CategorySection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { ...allCategories[3], crateHref: href } };
