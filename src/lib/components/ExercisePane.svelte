<script lang="ts">
	import type { IExercise } from '$trpc/routes/exercise/types';
	import { user } from '../../routes/store';

	export let exercise: IExercise | undefined = undefined;
</script>

{#if exercise}
	<div class="card w-full flex-col">
		<div class="m-2 flex flex-row items-center justify-between">
			<h1>{exercise.title}</h1>
			{#if $user?._id === exercise.author}
				<a
					class="flex cursor-pointer flex-row items-center gap-2 self-center p-1"
					href={'/exercises/edit/' + exercise.directory}
				>
					<i class="fa-solid fa-pen fa-xl"></i>
				</a>
			{/if}
		</div>
		<div class="m-4 flex flex-row-reverse items-center justify-between">
			<a
				class="flex cursor-pointer flex-row items-center gap-2 self-center p-1"
				href={'/exercises/view/' + exercise.directory}
			>
				<i class="fa-solid fa-eye fa-2xl"></i>
			</a>
		</div>
		{exercise.tags}
	</div>
{:else}
	<div>LOADING</div>
{/if}
