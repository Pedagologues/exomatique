import { createContext } from '$lib/trpc/context';
import { router } from '$trpc/origin';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

const auth_handle: Handle = async ({ event, resolve }) => {
	event.locals.token = event.cookies.get('token') || null;

	try {
		return resolve(event);
	} catch (error) {
		console.log(JSON.stringify(error));
	}

	return new Response();
};
const trpc_hendle: Handle = createTRPCHandle({ router, createContext });

export const handle: Handle = sequence(trpc_hendle, auth_handle);
