<script lang="ts">
	import type { IExercise } from '$trpc/routes/exercise/types';

	export let exercise: IExercise | undefined = undefined;
</script>

{#if exercise}
	<!-- content here -->
{:else}
	<div>LOADING</div>
{/if}
