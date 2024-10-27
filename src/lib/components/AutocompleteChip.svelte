<script lang="ts">
	import { Autocomplete, InputChip, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { string } from 'zod';

	export let available: string[] = [];
	export let placeholder = 'Enter values...';
	export let selection: string[] = [];

	let inputChip = '';
	let inputChipObject: InputChip;

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom-start',
		closeQuery: ''
	};

	let existing_tags: string[] = [];
	let inputPopup: string = '';
</script>

<div
	class="card max-h-48 w-full max-w-sm overflow-y-auto p-4"
	tabindex="-1"
	data-popup="popupAutocomplete"
>
	<Autocomplete
		bind:input={inputPopup}
		denylist={selection.concat(
			available.filter((v) => !v.toLowerCase().includes(inputChip.toLowerCase()))
		)}
		allowlist={available}
		options={available.map((v) => {
			return {
				label: v,
				value: v
			};
		})}
		on:selection={(event) => {
			inputChipObject.addChip(event.detail.label);
		}}
	/>
</div>
<div use:popup={popupSettings}>
	<InputChip
		bind:input={inputChip}
		bind:value={selection}
		name="chips"
		bind:this={inputChipObject}
		allowUpperCase={true}
		validation={(v) => available.includes(v)}
		on:add={(v) => {}}
		{placeholder}
	/>
</div>
