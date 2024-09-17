<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import '../app.css';
	import { user } from './store';
	import { get } from 'svelte/store';
	import { trpc } from '$trpc/client';
	import type { User } from '../lib/trpc/routes/user/types';

	export let data;

	function onLoginClick() {
		if ($page.url.pathname === '/' || $page.url.pathname === '/login')
			goto(`/login`, { replaceState: false });
		else goto(`/login?q=${btoa($page.url.pathname)}`, { replaceState: false });
	}

	async function onLogoutClick() {
		await fetch('/logout', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});

		await invalidateAll();
	}

	$: {
		if (data.token == null) user.set(undefined);
		else {
			trpc($page)
				.user.login.query(data.token)
				.then((v) => {
					user.set(v as User);
				})
				.catch((v) => {
					user.set(undefined);
				});
		}
	}
</script>

<div class="flex h-screen flex-col">
	<AppBar class="">
		<svelte:fragment slot="lead">
			<a href="/">Exomatique</a>
		</svelte:fragment>

		<div class="routes flex grow flex-row justify-evenly gap-2">
			<a href="/" class:selected={$page.url.pathname === '/'} class="content-center">Accueil</a>
			<a
				href="/exercises"
				class:selected={$page.url.pathname === '/exercises'}
				class="content-center">Exercices</a
			>
		</div>

		<div class="flex-column flex grow justify-around gap-x-4"></div>
		<svelte:fragment slot="trail">
			{#if !data.token}
				<button type="button" class="variant-filled btn" on:click={onLoginClick}>Login</button>
			{:else}
				<button type="button" class="variant-filled btn" on:click={onLogoutClick}>Logout</button>
			{/if}
			<LightSwitch />
		</svelte:fragment>
	</AppBar>
	<slot />
</div>

<style>
	.selected {
		backdrop-filter: brightness(70%);
	}
	.routes > a {
		padding: 10px;
		border-radius: 5%;
	}

	.routes > a:not(.selected):hover {
		backdrop-filter: brightness(80%);
		transition: 0.2s;
	}
</style>
