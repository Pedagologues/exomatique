import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return await event.parent();
};