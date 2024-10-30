import { get } from 'svelte/store';
import { local_documents } from './routes/store';

/** @type {import('@sveltejs/kit').Reroute} */
export function reroute({ url }) {
	const path = url.pathname;

	if (path.startsWith('/exercises/edit/'))
		if (path.substring('/exercises/edit/'.length).includes('/')) return '/exercises/edit/';
		else {
			const id = path.substring('/exercises/edit/'.length);
			if (!get(local_documents).find((x) => x[0] == id)) return '/exercises/edit/';
			else return path + '/block';
			//TODO change to dynamic document type
		}
	if (path.startsWith('/exercises/view/'))
		if (path.substring('/exercises/view/'.length).includes('/')) return '/exercises/view/';
		else {
			const id = path.substring('/exercises/view/'.length);
			if (!get(local_documents).find((x) => x[0] == id)) return '/exercises/view/';
			else return path + '/block';
			//TODO change to dynamic document type
		}
	return url.pathname;
}
