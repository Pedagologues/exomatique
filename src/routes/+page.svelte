<script lang="ts">
	import type { ExoData, IExoModuleData } from '@exomatique/editor';
	import {
		DefinitionModule,
		Editor,
		ExoEditor,
		LatexModule,
		MdModule,
		TheoremModule,
		VideoModule
	} from '@exomatique/editor';

	const exo_editor = new ExoEditor({
		modules: [
			new MdModule(),
			new DefinitionModule(),
			new TheoremModule(),
			new LatexModule(),
			new VideoModule()
		],
		default_module: 'md'
	});

	let data: ExoData = $state([]);

	// $inspect(data);
</script>

<div class="relative flex h-full flex-1 justify-center">
	<div class="absolute h-full w-3/4 grow flex-row text-neutral-950 scheme-light">
		<Editor {exo_editor} bind:data />
	</div>
</div>
