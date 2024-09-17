export const load = async ({ parent }) => {
	const { token } = await parent();
	return {
		token: token
	};
};

export const ssr = false;
