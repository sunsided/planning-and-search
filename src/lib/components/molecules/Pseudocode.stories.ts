import type { Meta, StoryObj } from '@storybook/sveltekit';
import { aStar } from '../stories/fixtures.ts';
import Pseudocode from './Pseudocode.svelte';

const meta = {
	title: 'Molecules/Pseudocode',
	component: Pseudocode,
	tags: ['autodocs']
} satisfies Meta<typeof Pseudocode>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AStar: Story = { args: { lines: aStar.listing, label: 'Pseudocode of A*' } };
