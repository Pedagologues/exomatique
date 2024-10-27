import { z } from 'zod';
import { globalRouter, publicProcedure } from '$trpc/router';
import { create, edit, get, get_exercises, get_tags } from './internal';

export const router = globalRouter({
	create: publicProcedure.input(z.string()).mutation(async (req) => {
		const token = req.input;
		return await create(token);
	}),
	edit: publicProcedure
		.input(
			z.object({
				token: z.string(),
				id: z.string(),
				data: z.object({
					title: z.optional(z.string()),
					visibility: z.optional(z.enum(['PUBLIC', 'PROTECTED', 'PRIVATE'])),
					tags: z.optional(z.array(z.string()))
				})
			})
		)
		.mutation(async (req) => {
			const input = req.input;
			return await edit(input.id, input.token, input.data);
		}),
	get: publicProcedure
		.input(
			z.object({
				token: z.optional(z.string()),
				id: z.string()
			})
		)
		.mutation(async (req) => {
			const input = req.input;
			return await get(input.id, input.token);
		}),
	list_tags: publicProcedure.query(async (req): Promise<String[]> => {
		return await get_tags();
	}),

	get_exercises: publicProcedure
		.input(
			z.object({
				token: z.optional(z.string()),
				initial: z.number().default(0),
				page: z.number().gte(1).lte(50).default(50),

				filter: z.object({
					title: z.string().default(''),
					tags: z.array(z.string()).default([])
				})
			})
		)
		.query(async (req) => {
			const input = req.input;
			return await get_exercises(
				input.initial,
				input.initial + input.page,
				input.filter,
				input.token
			);
		})
});
