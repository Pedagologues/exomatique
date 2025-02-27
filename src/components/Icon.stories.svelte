<script module>
	import Icon from './Icon.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Icon',
		component: Icon,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			}
		}
	});
</script>

<Story name="Extra Large" args={{ size: 'extra-large' }} />

<Story name="Large" args={{ size: 'large' }} />

<Story name="Medium" args={{ size: 'medium' }} />

<Story name="Small" args={{ size: 'small' }} />

<Story name="Extra Small" args={{ size: 'extra-small' }} />
