<script module>
	import Header from './Header.svelte';
	import Icon from './Icon.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Header',
		component: Header,
		tags: ['autodocs'],
		argTypes: {}
	});
</script>

<Story
	name="Header Disconnected"
	args={{
		pages: [
			{ text: 'Section 1', value: 'section_1' },
			{ text: 'Section 2', value: 'section_2' },
			{ text: 'Section 3', value: 'section_3' }
		]
	}}
/>

<Story
	name="Header Connected"
	args={{
		pages: [
			{ text: 'Section 1', value: 'section_1' },
			{ text: 'Section 2', value: 'section_2' },
			{ text: 'Section 3', value: 'section_3' }
		],
		user: { name: 'Jane Doe' }
	}}
/>
