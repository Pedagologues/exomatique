<script lang="ts">
	import { lang_store } from './storybook_store';
	import { getContext } from 'svelte';

	import { setLanguageTag } from './../src/lib/paraglide/runtime.js';
	import { get } from 'svelte/store';

	$effect(() => setLanguageTag(($lang_store as any) || 'en'));
</script>

{#key $lang_store}
	<slot />
{/key}
