import type { Meta, StoryObj } from '@storybook/sveltekit';
import { audienceCards } from '../stories/fixtures.ts';
import AudienceGrid from './AudienceGrid.svelte';

const meta = {
	title: 'Organisms/AudienceGrid',
	component: AudienceGrid,
	tags: ['autodocs']
} satisfies Meta<typeof AudienceGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { audiences: audienceCards } };
