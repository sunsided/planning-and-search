import type { Meta, StoryObj } from '@storybook/sveltekit';
import { AUDIENCES } from '#lib/audiences.js';
import { categoryOf, crate } from '#lib/registry.js';
import AudienceTemplate from './AudienceTemplate.svelte';

const meta = {
	title: 'Templates/AudienceTemplate',
	component: AudienceTemplate,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AudienceTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

const a = AUDIENCES.find((x) => x.slug === 'games')!;
const info = (name: string) => ({
	repo: crate(name)!.repo,
	description: crate(name)!.description,
	hue: categoryOf(name)!.hue,
	href: '#'
});

export const Games: Story = {
	args: {
		view: {
			title: a.title,
			lead: a.lead,
			start: { ...a.start, ...info(a.start.crate) },
			crates: a.crates.map((p) => ({ ...p, ...info(p.crate) })),
			algorithms: a.algorithms.map((s) => ({ name: s, href: '#' }))
		},
		back: '#'
	}
};
