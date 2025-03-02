import type { PageServerLoad } from './$types';

export const ssr = false;

export const load: PageServerLoad = async (event) => {
	return await event.parent();
};