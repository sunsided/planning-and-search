import type { Meta, StoryObj } from '@storybook/sveltekit';
import { category, mapf } from '../stories/fixtures.ts';
import CrateCard from './CrateCard.svelte';

const meta = {
	title: 'Molecules/CrateCard',
	component: CrateCard,
	tags: ['autodocs']
} satisfies Meta<typeof CrateCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { name: mapf.name, description: mapf.description, href: '#', hue: category(mapf.name).hue }
};
