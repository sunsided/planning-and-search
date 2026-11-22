import type { Meta, StoryObj } from '@storybook/sveltekit';
import { aStar } from '../stories/fixtures.ts';
import PaperList from './PaperList.svelte';

const meta = {
	title: 'Molecules/PaperList',
	component: PaperList,
	tags: ['autodocs']
} satisfies Meta<typeof PaperList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		papers: [
			...aStar.papers,
			{
				authors: 'Sertac Karaman, Emilio Frazzoli',
				title: 'Sampling-based algorithms for optimal motion planning',
				year: 2011,
				venue: 'The International Journal of Robotics Research',
				doi: '10.1177/0278364911406761',
				arxiv: '1105.1186',
				url: null,
				role: 'extends'
			}
		]
	}
};
