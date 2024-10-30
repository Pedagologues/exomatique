import { derived, type Writable } from 'svelte/store';

export function derived_writable<S, T>(
	store: Writable<S>,
	read: () => T,
	write: (v: T) => void
): Writable<T> {
	const d = derived(store, read);
	return {
		subscribe: d.subscribe,
		set: write,
		update: (updater: (v: T) => T) => {
			write(updater(read()));
		}
	};
}
