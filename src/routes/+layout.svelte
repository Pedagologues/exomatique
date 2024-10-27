<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$trpc/client';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import '@fortawesome/fontawesome-free/css/all.css';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import '../app.css';
	import type { User } from '../lib/trpc/routes/user/types';
	import { user } from './store';

	export let data;

	function onLoginClick() {
		if (
			$page.url.pathname === '/' ||
			$page.url.pathname === '/login' ||
			$page.url.pathname === '/register'
		)
			goto(`/login`, { replaceState: false });
		else goto(`/login?q=${btoa($page.url.pathname)}`, { replaceState: false });
	}

	function onRegisterClick() {
		if (
			$page.url.pathname === '/' ||
			$page.url.pathname === '/login' ||
			$page.url.pathname === '/register'
		)
			goto(`/register`, { replaceState: false });
		else goto(`/register?q=${btoa($page.url.pathname)}`, { replaceState: false });
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

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
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
				<button type="button" class="variant-filled btn" on:click={onRegisterClick}>Register</button
				>
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
