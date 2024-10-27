<script lang="ts">
	import { page } from '$app/stores';
	import AutocompleteChip from '$lib/components/AutocompleteChip.svelte';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import ExercisePane from '../../lib/components/ExercisePane.svelte';
	import type { IExercise } from '../../lib/trpc/routes/exercise/types';

	let existing_tags: string[] = [];

	onMount(() => {
		trpc($page)
			.exercise.list_tags.query()
			.then((v) => (existing_tags = v as any));
	});

	let title = '';
	let selected_tags: string[] = [];

	let exercises: IExercise[] = [];

	$: trpc($page)
		.exercise.get_exercises.query({
			initial: 0,
			filter: {
				title,
				tags: selected_tags
			}
		})
		.then((v) => {
			exercises = v;
		});
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<div class="m-3 flex w-1/2 flex-row items-center justify-around self-center">
	<a href="#" class="card btn flex cursor-pointer flex-row items-center gap-2 self-center p-5">
		<i class="fa-solid fa-file-circle-plus fa-xl"></i>
		<h3>Write a new exercise</h3>
	</a>
	<a
		href="#"
		class="card flex cursor-pointer flex-row items-center gap-2 self-center p-5 grayscale"
	>
		<i class="fa-solid fa-file-import fa-xl"></i>
		<h3>Import new exercises</h3>
	</a>
</div>
<div class="flex flex-row">
	<div class="card m-5 w-3/12 p-4">
		Titre :
		<input class="input p-1 pl-2" type="text" placeholder="Titre" bind:value={title} />

		Tags : <AutocompleteChip
			available={existing_tags}
			placeholder={'Recherche par tags...'}
			bind:selection={selected_tags}
		/>
	</div>

	<div class="flex flex-col">
		{#each exercises as exercise}
			<ExercisePane {exercise} />
		{/each}
	</div>
</div>
