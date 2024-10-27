<script>
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { passwordStrength } from 'check-password-strength';
	import PasswordStrength from './PasswordStrength.svelte';
	let q;
	$: q = $page.url.searchParams.get('q');

	let waiting = false;
	let error = false;

	let username = '';
	let password = '';
	let password_verify = '';
	let remember = true;
</script>

<div class="card flex flex-col gap-y-2 p-4">
	<form
		method="POST"
		action="?/register"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			formData.set('password', password);
			formData.set('username', username);
			formData.set('remember', remember.toString());

			return async ({ result, update }) => {
				if (result.type === 'success') {
					let path = '/';
					if (q != null) {
						path = atob(q);
					}
					await goto(path, { replaceState: false });
					await invalidateAll();
				} else if (result.type == 'error') {
					error = true;
				}
			};
		}}
	>
		Username :
		<input
			class="input variant-form-material"
			title="Username"
			type="text"
			id="username"
			placeholder="Username"
			bind:value={username}
			disabled={waiting}
		/>
		Password :
		<input
			class="input variant-form-material"
			title="Password"
			type="password"
			id="password"
			placeholder="Password"
			bind:value={password}
			disabled={waiting}
		/>
		<PasswordStrength {password} />

		Password Verification:
		<div>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					class="input variant-form-material"
					title="Password Verification"
					type="password"
					id="password_verify"
					placeholder="Password"
					bind:value={password_verify}
					disabled={waiting}
				/>

				{#if password == password_verify}
					<a href="/register">
						<svg
							class="m-2 h-6 w-6 text-green-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" /></svg
						>
					</a>
				{:else}
					<a href="/register" title="Passwords are different">
						<svg
							class="m-2 h-6 w-6 text-amber-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" /> <line x1="12" y1="16" x2="12" y2="12" />
							<line x1="12" y1="8" x2="12.01" y2="8" /></svg
						>
					</a>
				{/if}
			</div>
		</div>

		<div class="flex flex-row justify-end gap-x-2">
			<label for="remember-checkbox" class="ms-2 text-sm font-medium">Remember Me</label>
			<input
				id="remember"
				type="checkbox"
				value=""
				class="h-4rounded w-4 focus:ring-2"
				bind:checked={remember}
				disabled={true || waiting}
			/>
		</div>

		<span class="text-error-500" hidden={!error}>Could not Register</span>
		<br />

		<button
			type="submit"
			class="variant-filled btn"
			disabled={!(
				username.replace(' ', '').length > 0 &&
				password.length > 0 &&
				passwordStrength(password).id >= 2 &&
				password == password_verify
			) || waiting}>Register</button
		>
	</form>
</div>
