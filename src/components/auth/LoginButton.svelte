<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		size?: 'small' | 'medium' | 'large';
		onLogin: () => void;
	}

	const { size = 'small', onLogin = () => {} }: Props = $props();

	const mapper = {
		small: 'btn-sm',
		medium: 'btn-base',
		large: 'btn-lg'
	};
</script>

<div
	class={'block w-fit rounded-lg p-0.5'}
	style="background: linear-gradient(to left, #4433ffff, #ff44ddff);"
>
	<button
		type="button"
		class={`btn rounded-lg ${mapper[size]} bg-white p-3.5 text-black`}
		onclick={onLogin}
	>
		{m.login()}
	</button>
</div>
