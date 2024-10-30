/** @type {import('@sveltejs/kit').Load} */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function load({ params }: any) {
	return {
		id: params.id
	};
}
