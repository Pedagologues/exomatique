import { createContext } from '$lib/trpc/context';
import { router } from '$trpc/origin';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext });
