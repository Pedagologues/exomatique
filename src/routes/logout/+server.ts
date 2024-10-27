// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST({ cookies }: any) {
	cookies.delete('token', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge: 60 * 60 * 24 * 7
	});

	return new Response();
}
