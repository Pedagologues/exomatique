<script lang="ts">
	// @ts-nocheck
	import type { OutputData } from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import EditorJsLatex from 'editorjs-latex';
	import type { Writable } from 'svelte/store';
	import { createEditor } from './svelte_editorjs';

	export let data: Writable<OutputData>;
	export let readOnly = false;

	let response = createEditor({
		tools: {
			Math: {
				class: EditorJsLatex,

				config: {
					css: '.katex-html { visibility: hidden; }'
				}
			},
			Header: {
				class: Header
			}
		},
		data: $data,
		readOnly
	});

	const { editor } = response;

	response.data.subscribe((v) => {
		data.set(v);
	});

	let stop_save_task = false;
	let changed = false;
	const save_task = async () => {
		if (changed && $editor && $editor.save) $editor.save();
		changed = false;
		if (!stop_save_task) setTimeout(save_task, 5000);
	};

	save_task();

	function beforeUnload() {
		stop_save_task = true;
		save_task();
	}
</script>

<svelte:window on:beforeunload={beforeUnload} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editor" use:editor on:keydown={() => (changed = true)} />
