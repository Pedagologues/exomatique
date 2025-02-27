<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag, setLanguageTag } from '$lib/paraglide/runtime';
	import LoginButton from './auth/LoginButton.svelte';
	import LogoutButton from './auth/LogoutButton.svelte';
	import RegisterButton from './auth/RegisterButton.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		user?: { name: string };
		onLogin: () => void;
		onLogout: () => void;
		onRegister: () => void;
		pages: { text: string; value: string }[];
		selected?: string;
		onSelectionChange?: (newSelection: string) => void;
	}

	let {
		user,
		onLogin,
		onLogout,
		onRegister,
		pages,
		selected = $bindable(),
		onSelectionChange = () => {}
	}: Props = $props();

	const onSectionChange = (newSelection: string) => {
		selected = newSelection;
		onSelectionChange(newSelection);
	};

	let lang = $state(languageTag());

	const onLanguageChange = () => {
		if (languageTag() == 'en') setLanguageTag('fr');
		else setLanguageTag('en');

		lang = languageTag();
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, lang);
		goto(localisedPath);
	};
</script>

{#key languageTag()}
	<div class="header bg-surface-900 mb-2 items-center gap-5">
		<a href="/"><Icon size={'extra-small'} /></a>
		<div class="grow justify-evenly">
			{#each pages as page}
				<div
					class={`${page.value !== selected ? 'mb-1 hover:mb-0' : ''}`}
					style={`${page.value === selected ? 'background: linear-gradient(to left, #4433ffff, #ff44ddff);' : 'background: white;'}`}
				>
					<a
						class={`bg-surface-900 px-8 pb-2 ${page.value === selected ? 'mb-1' : '	hover:mb-1'}`}
						href={'/' + page.value}
						onclick={() => onSectionChange(page.value)}
					>
						{page.text}
					</a>
				</div>
			{/each}
		</div>
		<div class="flex gap-5">
			{#if user}
				<span class="welcome">
					{m.welcome()} <b>{user.name}</b>!
				</span>
				<LogoutButton {onLogout} />
			{:else}
				<LoginButton {onLogin} />
				<RegisterButton {onRegister} />
			{/if}
		</div>

		<button class="text-xl" onclick={onLanguageChange}>{lang == 'en' ? '🇬🇧' : '🇫🇷'}</button>
	</div>
{/key}

<style>
	.header {
		display: flex;
		flex-direction: row;
		padding: calc(var(--spacing) * 5);
	}

	.header div {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
