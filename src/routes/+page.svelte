<script lang="ts">
	// @ts-nocheck
	import * as pdfjs from 'pdfjs-dist';
	import PdfViewer from '../lib/components/PdfViewer.svelte';
	import EditorJs from '../lib/components/editor/EditorJs.svelte';
	pdfjs.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
</script>
