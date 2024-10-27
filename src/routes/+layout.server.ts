// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = async ({ locals }: any) => {
	return {
		token: locals.token
	};
};
