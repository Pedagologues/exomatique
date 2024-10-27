export const load = async ({ parent }) => {
	const { user } = await parent();
	return {
		user: user
	};
};
