export const load = async ({ request, locals, cookies }) => {
	return {
		token: locals.token
	};
};
