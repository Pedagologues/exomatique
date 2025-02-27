<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		size?: 'small' | 'medium' | 'large';
		onLogout: () => void;
	}

	const { size = 'small', onLogout = () => {} }: Props = $props();

	const mapper = {
		small: 'btn-sm',
		medium: 'btn-base',
		large: 'btn-lg'
	};
</script>

<div class={'w-fit rounded-lg bg-black p-0.5'}>
	<button
		type="button"
		class={`btn rounded-lg ${mapper[size]} bg-white p-3.5 text-black`}
		onclick={onLogout}
	>
		{m.logout()}
	</button>
</div>
