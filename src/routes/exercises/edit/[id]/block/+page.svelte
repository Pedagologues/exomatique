<script lang="ts">
	import { page } from '$app/stores';
	import EditorJs from '$lib/components/editor/EditorJs.svelte';
	import { derived_writable } from '$lib/store';
	import type { IDocument } from '$trpc/routes/document/types';
	import type { OutputData } from '@editorjs/editorjs';
	import { type Writable } from 'svelte/store';
	import { local_documents } from '../../../../store';

	let { id } = $page.params;

	let exercise_data = derived_writable(
		local_documents,
		() => $local_documents.find((x) => x[0] == id) as [string, IDocument, unknown],
		(v) => ($local_documents = $local_documents.map((x) => (x[0] != id ? x : v)))
	);

	let block_data: Writable<OutputData> = derived_writable(
		exercise_data,
		() => (($exercise_data[2] as any)?.data || {}) as OutputData,
		(v) => {
			($exercise_data[2] as any).data = v;
			($exercise_data[2] as any).updated = new Date().getTime();
		}
	);
</script>

<EditorJs data={block_data} />
