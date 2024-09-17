<script>
	// @ts-nocheck

	import { createEditor } from './svelte_editorjs';
	import EditorJsLatex from 'editorjs-latex';
	import Header from '@editorjs/header';

	const { editor, data, isReady } = createEditor({
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
		}
	});
</script>

<div class="editor" use:editor />
