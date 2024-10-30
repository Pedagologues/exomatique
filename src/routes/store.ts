import { stored_writable } from '$lib/store';
import type { IDocument } from '$trpc/routes/document/types';
import { writable, type Writable } from 'svelte/store';
import type { User } from '../lib/trpc/routes/user/types';

export const user: Writable<User | undefined> = writable(undefined as User | undefined);
export const local_documents: Writable<[string, IDocument, unknown][]> = stored_writable(
	'documents',
	writable([]),
	async (new_local_documents) => {
		await fetch('/documents', {
			method: 'POST',
			body: JSON.stringify(new_local_documents.map((x) => [x[0], x[1], {}])),
			headers: {
				'content-type': 'application/json'
			}
		});
	}
);
