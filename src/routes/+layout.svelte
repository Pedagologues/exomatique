<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from '../components/Header.svelte';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import type { Snippet } from 'svelte';
	import type { ActionData } from './auth/$types';
	let { children, data, form }: { children: Snippet<[]>; data: PageServerData; form: ActionData } =
		$props();

	let routes = [{ value: '', text: () => m.home() }];

	let open_login = $state(false);

	let selected_route = $state('');
	let logout_form: HTMLFormElement;
</script>

<ParaglideJS {i18n}>
	<ParaglideJS {i18n}>
		<Header
			user={data.user ? { name: data?.user?.username } : undefined}
			pages={routes.map((v) => {
				return { value: v.value, text: v.text() };
			})}
			bind:selected={selected_route}
			onLogin={() => {
				open_login = true;
			}}
			onLogout={() => {
				logout_form.requestSubmit();
			}}
			onRegister={() => {}}
		/>
	</ParaglideJS>

	<form
		class="absolute h-0 w-0"
		method="post"
		action="/en/auth?/logout"
		use:enhance
		bind:this={logout_form}
	></form>

	{#if open_login && !data.user}
		<div class="absolute w-full">
			<div class="bg-surface-800 mx-20 flex flex-col rounded-b-2xl p-2" tabindex="-1">
				<form
					class="flex flex-row items-center gap-5"
					method="POST"
					action={'/en/auth?/login'}
					use:enhance
				>
					<label>
						Username :
						<input class="bg-surface-900 px-2 outline-none" name="username" />
					</label>

					<label>
						Password :
						<input class="bg-surface-900 px-2 outline-none" type="password" name="password" />
					</label>

					<label>
						Remember me :
						<input class="bg-surface-900 px-2 outline-none" type="checkbox" name="remember" />
					</label>
					<button class="btn bg-secondary-900">Login</button>
					<button class="btn bg-secondary-900" formaction="/en/auth?/register">Register</button>
				</form>
				<p style="color: red">{form?.message ?? ''}</p>
				<button class="absolute m-2 self-end" onclick={() => (open_login = false)}>X</button>
			</div>
		</div>
	{/if}
	{@render children()}
</ParaglideJS>
