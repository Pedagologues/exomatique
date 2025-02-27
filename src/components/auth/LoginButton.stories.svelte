<script module>
	import LoginButton from './LoginButton.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';

	const { Story } = defineMeta({
		title: 'Auth/LoginButton',
		component: LoginButton,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			}
		}
	});
</script>

<Story name="Large" args={{ size: 'large', onLogin: fn }} />

<Story name="Medium" args={{ size: 'medium', onLogin: fn }} />

<Story name="Small" args={{ size: 'small', onLogin: fn }} />
