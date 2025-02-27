<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		size?: 'small' | 'medium' | 'large';
		onRegister: () => void;
	}

	const { size = 'small', onRegister = () => {} }: Props = $props();

	const mapper = {
		small: 'btn-sm',
		medium: 'btn-base',
		large: 'btn-lg'
	};
</script>

<button
	type="button"
	class={`btn w-fit rounded-lg p-4 text-white ${mapper[size]}`}
	style="background: linear-gradient(to left, #4433ffff, #ff44ddff);"
	onclick={onRegister}
>
	{m.register()}
</button>
