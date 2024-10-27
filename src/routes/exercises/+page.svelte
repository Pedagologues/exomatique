<script lang="ts">
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import AutocompleteChip from '$lib/components/AutocompleteChip.svelte';
	import { onMount } from 'svelte';
	import type { IExercise } from '../../lib/trpc/routes/exercise/types';
	import ExercisePane from '../../lib/components/ExercisePane.svelte';

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

			console.log(v);
		});
</script>

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
