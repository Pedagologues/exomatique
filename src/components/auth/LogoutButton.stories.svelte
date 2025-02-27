<script module>
	import LogoutButton from './LogoutButton.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';

	const { Story } = defineMeta({
		title: 'Auth/LogoutButton',
		component: LogoutButton,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			}
		}
	});
</script>

<Story name="Large" args={{ size: 'large', onLogout: fn }} />

<Story name="Medium" args={{ size: 'medium', onLogout: fn }} />

<Story name="Small" args={{ size: 'small', onLogout: fn }} />
