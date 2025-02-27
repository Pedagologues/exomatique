<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from '../components/Header.svelte';
	import { goto } from '$app/navigation';
	let { children } = $props();

	let routes = [{ value: '', text: () => m.home() }];

	let selected_route = $state('');
</script>

<ParaglideJS {i18n}>
	<ParaglideJS {i18n}>
		<Header
			pages={routes.map((v) => {
				return { value: v.value, text: v.text() };
			})}
			bind:selected={selected_route}
			onLogin={() => {}}
			onLogout={() => {}}
			onRegister={() => {}}
		/>
	</ParaglideJS>
	{@render children()}
</ParaglideJS>
