<script lang="ts">
	interface Props {
		size?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';
	}

	const { size = 'small' }: Props = $props();

	const mapper = {
		'extra-small': 'w-16',
		small: 'w-32',
		medium: 'w-64',
		large: 'w-sm',
		'extra-large': 'w-2xl'
	};
</script>

<img class={`${mapper[size]}`} src={'/icon.svg'} alt="Exomatique Icon" />
