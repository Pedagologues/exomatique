<script>
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	let q;
	$: q = $page.url.searchParams.get('q');

	let waiting = false;
	let error = false;

	let username = '';
	let password = '';
	let remember = true;
</script>

<div class="card flex flex-col gap-y-2 p-4">
	<form
		method="POST"
		action="?/login"
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
		<span class="text-error-900" hidden={!error}>Could not login</span>
		<button
			type="submit"
			class="variant-filled btn"
			disabled={!(username.replace(' ', '').length > 0 && password.length > 0) || waiting}
			>Login</button
		>
	</form>
</div>
