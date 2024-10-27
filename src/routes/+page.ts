// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ parent }: any) => {
	const { token } = await parent();
	return {
		token: token
	};
};

export const ssr = false;
