import type { Meta, StoryObj } from '@storybook/sveltekit';
import { aStar } from '../stories/fixtures.ts';
import TracePlayer from './TracePlayer.svelte';

const meta = {
	title: 'Organisms/TracePlayer',
	component: TracePlayer,
	tags: ['autodocs']
} satisfies Meta<typeof TracePlayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = { args: { trace: aStar.gridTrace, label: 'A* on a small grid' } };
export const Plane: Story = { args: { trace: aStar.planeTrace, label: 'RRT* in the unit square' } };
