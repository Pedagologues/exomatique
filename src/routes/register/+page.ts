// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ parent }: any) => {
	const { user } = await parent();
	return {
		user: user
	};
};
