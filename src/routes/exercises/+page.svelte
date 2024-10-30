<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AutocompleteChip from '$lib/components/AutocompleteChip.svelte';
	import { trpc } from '$lib/trpc/client';
	import type { IDocument } from '$trpc/routes/document/types';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import ExercisePane from '../../lib/components/ExercisePane.svelte';
	import type { IExercise } from '../../lib/trpc/routes/exercise/types';
	import { local_documents, user } from '../store';

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

	const newExercisePopup: PopupSettings = {
		event: 'click',
		target: 'new_exercise',
		placement: 'bottom-end'
	};

	function newExercise() {
		const token = $user?.auth_token;
		if (token == null) return;
		trpc($page)
			.exercise.create.mutate(token)
			.then(async (exe: IExercise) => {
				const doc_id = exe.directory || '';

				await trpc($page).document.set.mutate({
					document_id: doc_id,
					token,
					metadata: {
						TYPE: 'EXERCISE',
						EXERCISE_ID: exe.id,
						EXERCISE_META: exe,
						EXERCISE_TYPE: 'BLOCK'
					}
				});

				const doc: IDocument = (await trpc($page).document.get.query({
					document_id: doc_id,
					token
				})) as IDocument;

				local_documents.update((v) => {
					v = v.filter((x) => x[0] != doc_id);
					v.push([doc_id, doc, {}]);
					return v;
				});

				goto('/exercises/edit/' + doc_id + '');
			});
	}
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<div class="m-3 flex w-1/2 flex-row items-center justify-around self-center">
	<button
		class="card btn flex cursor-pointer flex-row items-center gap-2 self-center p-5"
		use:popup={newExercisePopup}
	>
		<i class="fa-solid fa-file-circle-plus fa-xl"></i>
		<h3>Write a new exercise</h3>
	</button>
	<a
		href="#"
		class="card flex cursor-pointer flex-row items-center gap-2 self-center p-5 grayscale"
	>
		<i class="fa-solid fa-file-import fa-xl"></i>
		<h3>Import new exercises</h3>
	</a>
</div>

<div class="card max-w-sm p-4" data-popup="new_exercise">
	<div class="grid grid-cols-1 gap-2">
		<button
			class="flex cursor-pointer flex-row items-center gap-2 self-center p-1"
			on:click={newExercise}
		>
			<i class="fa-solid fa-star"></i>
			<h3>Block based</h3>
			<i class="fa-regular fa-square"></i>
		</button>
	</div>
	<div class="bg-surface-100-800-token arrow" />
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
