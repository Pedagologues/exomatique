import { local_documents } from '../store.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	local_documents.set(await request.json());

	return new Response(String());
}
