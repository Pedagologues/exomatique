export function POST({ cookies }) {
	cookies.delete('token', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge: 60 * 60 * 24 * 7
	});

	return new Response();
}
