import { createContext } from '$lib/trpc/context';
import { router } from '$trpc/origin';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

const auth_handle: Handle = async ({ event, resolve }) => {
	event.locals.token = event.cookies.get('token') || null;
	return resolve(event);
};
const trpc_hendle: Handle = createTRPCHandle({ router, createContext });

export const handle: Handle = sequence(trpc_hendle, auth_handle);
