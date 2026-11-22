import type { Meta, StoryObj } from '@storybook/sveltekit';
import Tokens from './Tokens.svelte';

const meta = { title: 'Foundations/Tokens', component: Tokens } satisfies Meta<typeof Tokens>;
export default meta;

export const All: StoryObj<typeof meta> = {};
