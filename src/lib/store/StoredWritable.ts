import { type Writable } from 'svelte/store';

export function stored_writable<T>(
	key: string,
	store: Writable<T>,
	server_update?: (v: T) => void
): Writable<T> {
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && localStorage && localStorage[key]) {
		const v = JSON.parse(localStorage[key]);
		store.set(v);
		if (server_update) server_update(v);
	}

	return {
		set: (v) => {
			if (isBrowser) {
				localStorage[key] = JSON.stringify(v);
				if (server_update) server_update(v);
			}

			store.set(v);
		},
		update: (updater) =>
			store.update((v) => {
				const new_v = updater(v);
				if (isBrowser) {
					localStorage[key] = JSON.stringify(new_v);
					if (server_update) server_update(new_v);
				}
				return new_v;
			}),
		subscribe: store.subscribe
	};
}
