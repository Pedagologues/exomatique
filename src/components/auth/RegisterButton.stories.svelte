<script module>
	import RegisterButton from './RegisterButton.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';

	const { Story } = defineMeta({
		title: 'Auth/RegisterButton',
		component: RegisterButton,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			}
		}
	});
</script>

<Story name="Large" args={{ size: 'large', onRegister: fn }} />

<Story name="Medium" args={{ size: 'medium', onRegister: fn }} />

<Story name="Small" args={{ size: 'small', onRegister: fn }} />
