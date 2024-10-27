import { trpc } from '$trpc/client';

export const actions = {
	register: async (event) => {
		const { request, cookies } = event;

		const form = await request.formData();
		const username = form.get('username') as string;
		const password = form.get('password') as string;
		const remember = form.get('remember') === 'true';

		try {
			const created = await trpc(event).user.register.mutate({ username, password });

			if (created) {
				const v = await trpc(event).user.login.query({ username, password });

				const token = v.auth_token;
				if (token != null) {
					cookies.set('token', token, {
						path: '/',
						httpOnly: true,
						sameSite: 'strict',
						secure: true,
						maxAge: 60 * 60 * 24 * 7
					});
				}
			} else throw Error('Could not create the user');
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			console.log('?');
			throw Error('Could not create the user');
		}
		return;
	}
};
