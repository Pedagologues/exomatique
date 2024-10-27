import { globalRouter, publicProcedure } from '$trpc/router';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { isUsernameAvailable, loginFromPassword, loginFromToken, register } from './internal';
import type { User } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authentification = async (opts: { input: any; next: () => any }) => {
	const token = opts.input;
	try {
		await loginFromToken(token);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return opts.next();
};

export const router = globalRouter({
	register: publicProcedure
		.input(
			z.object({
				username: z
					.string()
					.min(4)
					.max(20)
					.refine((s) => isUsernameAvailable(s), 'Username is already being used'),
				password: z.string()
			})
		)
		.mutation(async (req) => {
			const { username, password } = req.input;
			const b = await register(username, password);
			console.log("Someone is trying to register a new user : '%s'", username);
			return b;
		}),
	login: publicProcedure
		.input(
			z.union([
				z.object({
					username: z.string(),
					password: z.string()
				}),
				z.string()
			])
		)
		.query(async (req): Promise<User> => {
			const input = req.input;
			if (typeof input === 'string') {
				return await loginFromToken(input);
			} else {
				return await loginFromPassword(input.username, input.password);
			}
		}),
	availability: publicProcedure.input(z.string()).query((req) => isUsernameAvailable(req.input)),

	edit: publicProcedure
		.input(
			z.object({
				token: z.string(),
				edition: z.object({
					username: z.optional(z.string()),
					password: z.optional(z.string())
				})
			})
		)
		.use(authentification)
		.mutation(() => {})
});
